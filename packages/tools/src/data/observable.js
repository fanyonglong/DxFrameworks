import {isPlainObject,isArray,hasOwn} from '../util'

//constants
const OB_OBJ_KEY='__ob__';
/** 
 * 观察员
*/
function observe(value){
    if(!isPlainObject(value)&&!isArray(value)){
        return;
    }
    var ob;
    if(!hasOwn(value,OB_OBJ_KEY)){
        ob=new Observable(value);
    }else{
        ob=value[OB_OBJ_KEY];
    }
    return ob;
}
let reactivePropertyDescriptor={
    configurable:true,
    enumerable: true,
    writable: true
}
function defineReactive(target,key,value){
    if(!isPlainObject(target)&&!isArray(target)){
        return;
    }    
    let desc=Object.getOwnPropertyDescriptor(target,key);
    let setter=desc&&desc.set;
    let getter=desc&&desc.get;
    
    reactivePropertyDescriptor.set=function(){

    }
    reactivePropertyDescriptor.get=function(){

    }   
    Object.defineProperty(target,key,reactivePropertyDescriptor)

}


class Observable{
    constructor(value){
        value[OB_OBJ_KEY]=this;
        this.value=value;
        if(isObject(value)){
            this.wrap(value);
        }else{
            this.wrapArray(value);
        }
    }
    wrap(val){
        var keys=Object.keys(val);
    }
    wrapArray(){

    }
}

class ObservableObject{
    constructor(){
        
    }
}

class ObservableArray{
 
}
