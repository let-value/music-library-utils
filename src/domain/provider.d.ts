interface IProvider {
    import(): Promise<void>;
    export(): Promise<void>;
}
