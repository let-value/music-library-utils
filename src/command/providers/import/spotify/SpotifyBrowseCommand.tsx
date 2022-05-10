import { Command } from "commander";
import { observer } from "mobx-react-lite";
import { ComponentWithCommand } from "react-ink-commander";

const command = new Command("playlists").description("Browse Spotify library");

const SpotifyBrowseCommand = observer((_props) => {
    return null;
}) as ComponentWithCommand;

SpotifyBrowseCommand.command = command;

export { SpotifyBrowseCommand };
