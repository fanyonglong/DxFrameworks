import baseKeys from './baseKeys'

export default function baseReduce(obj,callback){
    let keys=baseKeys(obj),key;
    let value,i=-1,len=keys.length;
    if(arguments.length>2&&arguments[2]!=undefined){
      value=arguments[2];
    }else{
      key=keys[++i];
      value=array[key]
    }
    while(++i<len){
        key=keys[i];
        value=callback(value,obj[key],key,obj)
    }
    return value;
}