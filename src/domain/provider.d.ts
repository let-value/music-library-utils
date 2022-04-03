interface IProvider {
    import(abort: AbortSignal): Promise<void>;
    export(abort: AbortSignal): Promise<void>;
}
