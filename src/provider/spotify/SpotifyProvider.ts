import SpotifyWebApi from "spotify-web-api-node";
import { Service } from "typedi";
import { DataBase, DataSource } from "../../db";
import { KeyValue } from "../../db/entity";
import { Provider } from "../Provider";
import { client_id, client_secret } from "./spotifyAuth";

@Service({
    transient: true,
})
export class SpotifyProvider extends Provider {
    accessToken?: string;
    refreshToken?: string;
    user?: SpotifyApi.CurrentUsersProfileResponse = undefined;
    spotifyApi = new SpotifyWebApi({
        clientId: client_id,
        clientSecret: client_secret,
    });

    constructor(@DataBase() dataSource: DataSource) {
        super(dataSource);
    }

    async initClient() {
        if (!this.accessToken) {
            const record = await this.dataSource
                .getRepository(KeyValue)
                .findOne({ where: { key: "spotifyAccessToken" } });

            this.accessToken = record?.value;
        }

        if (!this.refreshToken) {
            const record = await this.dataSource
                .getRepository(KeyValue)
                .findOne({ where: { key: "spotifyRefreshToken" } });

            this.refreshToken = record?.value;
        }

        if (!this.accessToken || !this.refreshToken) {
            throw new Error("No Spotify access token found");
        }

        this.spotifyApi.setAccessToken(this.accessToken);
        this.spotifyApi.setRefreshToken(this.refreshToken);
        return (await this.spotifyApi.getMe()).body;
    }

    async resetAccessToken() {
        await this.dataSource.getRepository(KeyValue).delete({ key: "spotifyAccessToken" });
        await this.dataSource.getRepository(KeyValue).delete({ key: "spotifyRefreshToken" });
        this.accessToken = undefined;
    }

    async getAccessToken(authorizationCode: string, redirectUrl: string) {
        this.spotifyApi.setRedirectURI(redirectUrl);

        const data = await this.spotifyApi.authorizationCodeGrant(authorizationCode);

        this.accessToken = data.body["access_token"];
        this.refreshToken = data.body["refresh_token"];

        this.spotifyApi.setAccessToken(this.accessToken);
        this.spotifyApi.setRefreshToken(this.refreshToken);

        await this.dataSource.getRepository(KeyValue).save({ key: "spotifyAccessToken", value: this.accessToken });
        await this.dataSource.getRepository(KeyValue).save({ key: "spotifyRefreshToken", value: this.refreshToken });
    }
}
