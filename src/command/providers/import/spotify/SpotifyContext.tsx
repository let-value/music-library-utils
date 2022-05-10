import { createContext } from "react";
import { SpotifyStore } from "../../../../store";

export const SpotifyContext = createContext<SpotifyStore | undefined>(undefined);
