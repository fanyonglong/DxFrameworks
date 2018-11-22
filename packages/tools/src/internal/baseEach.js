export default function baseEach(obj={},iteratee,thisArg){
    let keys=Object.keys(value);
    let len=keys.length,i=-1,key;
    while(++i<len){
        key=keys[i]
        if(iteratee.call(thisArg||obj[key],obj[key],key,obj)===false){
            break;
        }
    }
}