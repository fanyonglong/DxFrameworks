// @flow

interface MapLike{
    +size:number;
    get(key: string): T | undefined;
    has(key: string): boolean;
    forEach(action: (value: T, key: string) => void): void;
    keys(): Iterator<string>;
    values(): Iterator<T>;
    entries(): Iterator<[string, T]>;
}

export class Map implements MapLike{
    size:number;
}