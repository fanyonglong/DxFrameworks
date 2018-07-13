
const _hasOwnProperty=Object.prototype.hasOwnProperty,_toString=Object.prototype.toString,getFuncNative=Function.prototype.toString,ObjectNativeString=getFuncNative.call(Object);
export function isObject(obj:any):boolean
{
    return obj !== null && typeof obj === 'object'
}
export function hasOwn(target:any,key:string):boolean
{
     return _hasOwnProperty.call(target,key);
}
export function isPlainObject(obj:any)
{
    if(_toString.call(obj)!='[object Object]'){
        return false;
    }
    var constructor = obj.constructor;
    if(!constructor)
    {
        return true;
    }
    return getFuncNative.call(constructor) == ObjectNativeString;
}