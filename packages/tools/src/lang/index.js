
const _toString=Object.prototype.toString;
export function isFunction(obj){
    return typeof obj=='function';
}

export function isArray(obj){
    return  _toString.call(obj)=='[object Array]';
}

export function isPlainObject(obj){
    return  _toString.call(obj)=='[object Object]';
}

export function isObject(obj){
    return typeof obj=='object';
}
