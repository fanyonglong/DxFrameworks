


import {isArray} from '../lang'

let forEach;
if(Array.prototype.forEach){
    forEach=Function.prototype.call.bind(Array.prototype.forEach);
}else{
    
    /**
     * @param  {array} array=[]
     * @param  {function} iteratee
     * @param  {any} thisArg
     */
    forEach=function forEach(array=[],iteratee,thisArg){
        let len=array.length,i=-1;
        while(++i<len){
            if(iteratee.call(thisArg||array[i],array[i],i,array)===false){
                break;
            }
        }
    }
}
function baseEach(obj={},iteratee,thisArg){
    let keys=Object.keys(value);
    let len=keys.length,i=-1,key;
    while(++i<len){
        key=keys[i]
        if(iteratee.call(thisArg||obj[key],obj[key],key,obj)===false){
            break;
        }
    }
}

export  function each(collection,iteratee,context){
    let eachFunc=isArray(collection)?forEach:baseEach;
    eachFunc(collection,iteratee,context)
}
