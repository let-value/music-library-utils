import { Service } from "typedi";
import { DataBase, DataSource } from "../db";
import { FavoriteTrack, ITrackRelation, Playlist } from "../db/entity";

export enum LibraryFeature {
    playlists,
    favorite_tracks,
    favorite_albums,
    favorite_artists,
    import_playlist,
    edit_playlist,
    remove_playlist,
}

export interface ILibrary {
    features: LibraryFeature[];
    getPlaylists(): Promise<Playlist[]>;
    getFavoriteTracks(): Promise<ITrackRelation[]>;
}

@Service()
export class Library implements ILibrary {
    features = [
        LibraryFeature.favorite_tracks,
        LibraryFeature.playlists,
        LibraryFeature.edit_playlist,
        LibraryFeature.remove_playlist,
    ];
    dataSource: DataSource;
    constructor(@DataBase() dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    getPlaylists() {
        return this.dataSource.getRepository(Playlist).find();
    }

    getFavoriteTracks() {
        return this.dataSource.getRepository(FavoriteTrack).find();
    }
}
