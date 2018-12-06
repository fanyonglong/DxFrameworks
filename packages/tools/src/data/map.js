// @flow

interface MapLike<T>{
    +size:number;
    get(key: string): T | undefined;
    has(key: string): boolean;
    forEach(action: (value: T, key: string) => void): void;
    keys(): Iterator<string>;
    values(): Iterator<T>;
    entries(): Iterator<[string, T]>;
}

export class Map<T> implements MapLike<T>{
    size:number;
    constructor(){
        this._maps={}
    }
    get(key:string){

    }
    has(key:string){
        
    }
}