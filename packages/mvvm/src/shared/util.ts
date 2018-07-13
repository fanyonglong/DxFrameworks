
const _hasOwnProperty=Object.prototype.hasOwnProperty,_toString=Object.prototype.toString,getFuncNative=Function.prototype.toString,ObjectNativeString=getFuncNative.call(Object);
export function isObject(obj:any):boolean
{
    return obj !== null && typeof obj === 'object'
}
export function hasOwn(target:any,key:string):boolean
{
     return _hasOwnProperty.call(target,key);
}
export function isLikeObject(obj:any)
{
    return _toString.call(obj)!='[object Object]';
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
/**
 * 移动数组匹配项
 * @param array 
 * @param value 
 */
export function remove(array:Array<any>,value:any):Array<any>|void{
    let index=array.indexOf(value);
    if(index!=-1){
        return array.splice(index,1);
    }
}

let SimpleSet=global.Set?global.Set:(function()
{
    function SimpleSet()
    {

    }
    return SimpleSet;
})();