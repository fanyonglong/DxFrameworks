export default function arrayReduce(array,callback){
    let value,i=-1,len=array.length;
    if(arguments.length>2&&arguments[2]!=undefined){
      value=arguments[2];
    }else{
      value=array[++i]
    }
    while(++i<len){
        value=callback(value,array[i],i,array)
    }
    return value;
}