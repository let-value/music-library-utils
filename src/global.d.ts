declare type Head<T extends unknown[]> = T extends [...infer Head, unknown] ? Head : unknown[];
declare type Last<T extends unknown[]> = T extends [...unknown, infer Last] ? Last : unknown;
