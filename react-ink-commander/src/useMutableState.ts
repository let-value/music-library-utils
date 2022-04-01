import { MutableRefObject, useCallback, useRef, useState } from "react";

export function useMutableState<T>(initialState: T): [MutableRefObject<T>, (newState: T) => void] {
    const state = useRef<T>(initialState);
    const [, forceUpdate] = useState<unknown>();
    const setMutableState = useCallback((newState: T) => {
        state.current = newState;
        forceUpdate({});
    }, []);
    return [state, setMutableState];
}
