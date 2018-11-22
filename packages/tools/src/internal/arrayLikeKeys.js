
import arrayEach from './arrayEach'
export function  arrayLikeKeys(array) {
    let result=new Array(array.length);
    arrayEach(array,(val,key)=>{
        result[key]=''+key;
    })
    return result;
}