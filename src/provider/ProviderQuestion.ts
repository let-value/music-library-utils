import { makeAutoObservable } from "mobx";

export class ProviderQuestion<TValue = string> {
    isActive = false;
    private point?: (value: TValue | PromiseLike<TValue>) => void;
    private problem?: (reason?: unknown) => void;

    constructor(public question?: string) {
        makeAutoObservable(this);
    }
    answer(value: TValue) {
        this.isActive = false;
        this.point?.(value);
        this.resolve(true);
    }
    reject(reason?: unknown) {
        this.isActive = false;
        this.problem?.(reason);
        this.resolve(true);
    }
    resolve(allGood = false) {
        if (!allGood) {
            this.problem?.();
        }
        this.point = undefined;
        this.problem = undefined;
    }
    raise() {
        this.isActive = true;
        return new Promise<TValue>((resolve, reject) => {
            this.point = resolve;
            this.problem = reject;
        });
    }
}
