import express from "express";
import http from "http";

const port = 25584;
export const client_id = "ece0642a5103498181e8dfcfa8feafa3";
export const client_secret = "a167eb4b2b854ad487e99160b42b410e";
const scope = "user-read-private, user-read-email";

export interface SpotifyAuthServer {
    server: http.Server;
    url: string;
    redirectUrl: string;
    result: Promise<string>;
}

export async function spotifyAuthServer(): Promise<SpotifyAuthServer> {
    const app = express();
    const server = http.createServer(app);

    function dispose() {
        handlers = undefined;
        server.close();
    }

    const state = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substring(0, 5);

    let handlers: { resolve: (value: string) => void; reject: (reason?: string) => void } | undefined = undefined;
    const result = new Promise<string>((resolve, reject) => {
        handlers = { resolve, reject };
    });
    const timeout = new Promise<string>((_, reject) =>
        setTimeout(() => {
            dispose();
            reject("timeout");
        }, 10000)
    );

    app.get("/login", function (_req, res) {
        const redirect_uri = `http://localhost:${port}/callback`;

        res.redirect(
            "https://accounts.spotify.com/authorize?" +
                new URLSearchParams({
                    response_type: "code",
                    client_id,
                    scope,
                    redirect_uri,
                    state,
                }).toString()
        );
    });

    app.get("/callback", function (req, res) {
        const code = (req.query.code as string) ?? undefined;
        const responceState = req.query.state ?? undefined;

        if (responceState !== state) {
            res.status(403).send("Forbidden");
            handlers?.reject("Invalid state");
            return;
        }

        if (!code) {
            handlers?.reject("No code");
            res.status(404).send("Code not Found");
            return;
        }

        res.status(200).send("Code recieved. Please close this window");
        handlers?.resolve(code);
        setTimeout(dispose, 1);
    });

    await new Promise<void>((resolve) => app.listen(port, resolve));

    return {
        server,
        url: `http://localhost:${port}/login`,
        redirectUrl: `http://localhost:${port}/callback`,
        result: Promise.race([result, timeout]),
    };
}
