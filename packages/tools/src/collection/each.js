


import {isArray} from '../lang'
import arrayEach from '../internal/arrayEach'
import baseEach from '../internal/baseEach'



export default function each(collection,iteratee,context){
    let eachFunc=isArray(collection)?arrayEach:baseEach;
    eachFunc(collection,iteratee,context)
}
