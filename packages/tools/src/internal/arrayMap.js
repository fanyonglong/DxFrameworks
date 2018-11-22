import arrayEach from './arrayEach'
export default function arrryMap(array,iteratee){  
    let result=new Array(array.length);
    arrayEach(array,(value,i,array)=>{
        result[i]=iteratee(value,i,array);
    })
    return result;
}