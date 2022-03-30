import React, { FC } from "react";
import { RouteContext } from "./RouteContext";

export const Router: FC = ({ children }) => {
    return <RouteContext.Provider value={{}}>{children}</RouteContext.Provider>;
};
