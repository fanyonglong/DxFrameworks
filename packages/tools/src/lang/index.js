import { property,hasOwn } from "../util";

const _toString=Object.prototype.toString;
const _funcString=Function.prototype.toString;
const objectCtorString=_funcString.call(Object)
export function isFunction(obj){
    return typeof obj=='function';
}
let isArray=Array.isArray;//ie9
if (!Array.isArray) {
    isArray =function isArray(obj){
        return  _toString.call(obj)=='[object Array]';
    }
}
export {isArray}
export function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }
export function isPlainObject(value){
      if (!isObjectLike(value)) {
        return false;
      }
      var proto = Object.getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwn(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      _funcString.call(Ctor) == objectCtorString;
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


var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
export function isArrayLike(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

