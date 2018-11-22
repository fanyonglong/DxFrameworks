import baseKeys from './baseKeys'
import arrayEach from './arrayEach'

export default function baseMap(obj,iteratee){  
    let keys=baseKeys(obj)
    let result=new Array(keys.length);
    arrayEach(keys,(key,i,keys)=>{
        result[i]=iteratee(obj[key],key,obj);
    })
    return result;
}