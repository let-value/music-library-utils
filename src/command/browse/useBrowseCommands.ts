import { Command } from "commander";
import { useMemo } from "react";

export function useBrowseCommands() {
    const tracks = useMemo(() => new Command("tracks").description("Browse tracks"), []);
    const playlist = useMemo(() => new Command("playlist").description("Browse playlist"), []);
    const playlists = useMemo(() => new Command("playlists").description("Browse playlists"), []);

    return { tracks, playlist, playlists };
}
