import { ReReadable } from "rereadable-stream";
import { Readable } from "stream";

export let stdinHasData = false;
export let stdin: ReReadable;

export async function saveStdIn() {
    const stream = new Readable();
    stream._read = () => {
        // noop
    };

    for await (const chunk of process.stdin) {
        if (chunk && !stdinHasData) {
            stdinHasData = true;
        }
        stream.push(chunk);
    }

    stdin = stream.pipe(new ReReadable());
}

export function useStdInIfHasData() {
    if (stdinHasData) {
        return stdin.rewind();
    }
    return null;
}
