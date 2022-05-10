import { makeAutoObservable, observable } from "mobx";
import open from "open";
import { match } from "ts-pattern";
import { Inject, Service } from "typedi";
import { SpotifyAuthServer, spotifyAuthServer, SpotifyProvider } from "../provider";

@Service({
    transient: true,
})
export class SpotifyStore {
    user?: SpotifyApi.CurrentUsersProfileResponse = undefined;
    authServer?: SpotifyAuthServer = undefined;
    constructor(@Inject() private spotifyProvider: SpotifyProvider) {
        // csvProvider.events.on("trackImport", this.handleCurrentTrack);
        // csvProvider.events.on("trackExport", this.handleCurrentTrack);
        // csvProvider.events.on("end", this.handleEnd);
        makeAutoObservable(this, {
            user: observable.ref,
            authServer: observable.ref,
        });
    }

    async init() {
        try {
            this.user = await this.spotifyProvider.initClient();
        } catch (e) {
            // eslint-disable-next-line no-debugger
            debugger;
            match(e)
                .with({ name: "WebapiRegularError", statusCode: 401 }, async () => {
                    await this.spotifyProvider.resetAccessToken();
                    await this.auth();
                    this.init();
                })
                .with({ message: "No Spotify access token found" }, async () => {
                    await this.auth();
                    this.init();
                })
                .run();
        }
    }

    async auth() {
        this.authServer = await spotifyAuthServer();
        const { server, url, redirectUrl, result } = this.authServer;

        await open(url);
        try {
            const code = await result;
            await this.spotifyProvider.getAccessToken(code, redirectUrl);
        } catch (e) {
            // eslint-disable-next-line no-debugger
            debugger;
        } finally {
            server.close();
            this.authServer = undefined;
        }
    }
}
