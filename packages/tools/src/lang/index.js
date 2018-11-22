import { property,hasOwn } from "../util";


const functionProto=Function.prototype;
const _funcString=functionProto.toString;
const objectProto=Object.prototype;
const _toString=objectProto.toString;
const objectCtorString=_funcString.call(Object);

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
const undefined=undefined;
const INFINITY=Infinity;
const MAX_INTEGER=Number.MAX_VALUE;// 安全数2^53
const NAN=Number.NaN;
export function isUndefined(value) {
    return typeof value == 'undefined'
}
export function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
export function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
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
    return  _toString.call(obj)=='[object Object]';
}

const _reg_native=/\[native code\]/;
export function isNative(obj){
    if(!isFunction(obj)){
        return false;
    }
    return _reg_native.test(_funcString.call(obj));
}
export function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
    return value === proto;
 }
export function isBoolean(obj){
    return typeof obj==='boolean';
}
export function isString(obj){
    return typeof obj ==='string';
}

export function isSymbol(value) {
    return typeof value == 'symbol';
}
  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  export function isStrictComparable(value) {
    return value === value && !isObject(value);
  }



//确定传递的值类型及本身是否是有限数。
export function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  //计算传递的值并将其转换为整数 (或无穷大)。
export function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }