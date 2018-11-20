import {isPlainObject,isArray,hasOwn} from '../util/util'

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

function defineReactive(obj){
        
}


/*** 
 * 观察对象
*/
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
class Observable{

}
class ObservableObject{
    constructor(){
        
    }
}

class ObservableArray{
 
}
