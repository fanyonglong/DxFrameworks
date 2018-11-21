import { type } from "os";

const _toString=Object.prototype.toString;
const _funcString=Function.prototype.toString
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

const _reg_native=/\[native code\]/;
export function isNative(obj){
    if(!isFunction(obj)){
        return false;
    }
    return _reg_native.test(_funcString.call(obj));
}

export function isBoolean(obj){
    return typeof obj==='boolean';
}
export function isString(obj){
    return typeof obj ==='string';
}
