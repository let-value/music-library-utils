import express from "express";
import http from "http";
import httpProxy from "http-proxy";
import { useExpressServer as addControllers } from "routing-controllers";
import * as controllers from "./controllers";

export function createServer() {
    const app = express();
    const proxy = httpProxy.createProxyServer({ target: "http://localhost:3000/dev", ws: true });
    const server = http.createServer(app);

    app.use("/dev", function (req, res) {
        proxy.web(req, res, {});
    });

    app.use("/", express.static(__dirname + "/static"));

    addControllers(app, {
        routePrefix: "/api",
        controllers: Array.from(Object.values(controllers)),
    });

    server.on("upgrade", function (req, socket, head) {
        console.log("proxying upgrade request", req.url);
        proxy.ws(req, socket, head);
    });

    return app.listen(0);
}
