
import {isObjectLike,isArray} from '../lang'
import each from './each'
/**
 * 扩展对象
 * @param {object} target 
 * @param  {...object|array|function} sources 
 */
export default function extend(target,...sources){
    let i=-1,len=sources.length,source;
    while(++i<len){
        source=sources[i];
        if(isObjectLike(source)){
            each(source,(value,key)=>{
                target[key]=value;
            })
        }
    }
    return target;  
}