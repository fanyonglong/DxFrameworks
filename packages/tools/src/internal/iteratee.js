import {isFunction,isObject} from '../lang'
import {baseKeys} from './baseKeys'
import {baseEach} from './baseEach'
 
function matchData(value){
    
}
function baseIteratee(value){
    
     matchData(value);
}

export function getIteratee(iteratee){
   if(isFunction(iteratee)){
       return iteratee;
   }
   
   return baseIteratee(iteratee)
}