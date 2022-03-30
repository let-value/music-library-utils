import react from "@vitejs/plugin-react";
import { defineConfig, UserConfigExport } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const result: UserConfigExport = {
        plugins: [react()],
    };

    if (command == "serve") {
        result.base = "/dev/";
    }
    return result;
});
