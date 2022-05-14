import { Command } from "commander";
import { useMemo } from "react";

export function useBrowseCommands() {
    const track = useMemo(() => new Command("track").description("Browse track"), []);
    const tracks = useMemo(() => new Command("tracks").description("Favorite tracks"), []);
    const trackList = useMemo(() => new Command("trackList").description("Browse tracks"), []);
    const playlist = useMemo(() => new Command("playlist").description("Browse playlist"), []);
    const playlists = useMemo(() => new Command("playlists").description("Browse playlists"), []);
    const artists = useMemo(() => new Command("artists").description("Favorite artists"), []);
    const artist = useMemo(() => new Command("artist").description("Browse artist"), []);
    const discography = useMemo(() => new Command("discography").description("Browse albums"), []);
    const albums = useMemo(() => new Command("albums").description("Favorite albums"), []);
    const album = useMemo(() => new Command("album").description("Browse album"), []);

    return { track, tracks, trackList, playlist, playlists, artists, artist, albums, album, discography };
}
