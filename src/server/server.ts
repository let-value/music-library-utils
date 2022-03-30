import express from "express";
import http from "http";
import httpProxy from "http-proxy";

export function createServer() {
    const app = express();
    const proxy = httpProxy.createProxyServer({ target: "http://localhost:3000/dev", ws: true });
    const server = http.createServer(app);

    app.use("/dev", function (req, res) {
        proxy.web(req, res, {});
    });

    app.use("/", express.static(__dirname + "/static"));

    server.on("upgrade", function (req, socket, head) {
        console.log("proxying upgrade request", req.url);
        proxy.ws(req, socket, head);
    });

    return app.listen(0);
}
