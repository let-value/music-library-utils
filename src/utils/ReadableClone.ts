import { PassThrough, Readable } from "stream";

export function cloneReadable(readable: Readable) {
    const clone1 = readable.pipe(new PassThrough());
    const clone2 = readable.pipe(new PassThrough());

    return [clone1, clone2];
}
