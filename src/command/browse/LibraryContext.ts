import { createContext } from "react";
import { ILibrary } from "../../provider/Library";

export const LibraryContext = createContext<ILibrary>(undefined as never);
