export default function arrayEach(array=[],iteratee,thisArg){
    let len=array.length,i=-1;
    while(++i<len){
        if(iteratee.call(thisArg||array[i],array[i],i,array)===false){
            break;
        }
    }
}