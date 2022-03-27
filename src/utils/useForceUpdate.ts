import { useCallback, useState } from "react";

export function useForceUpdate() {
    const [, setState] = useState(0);
    const forceUpdate = useCallback(() => setState(state => state + 1), []);
    return forceUpdate;
}
