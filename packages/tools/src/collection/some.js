


import {isArray} from '../lang'
import arraySome from '../internal/arraySome'
import baseSome from '../internal/baseSome'



export default function some(collection,iteratee,context){
    let func=isArray(collection)?arraySome:baseSome;
     return func(collection,iteratee,context)
}
