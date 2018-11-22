

import {isArray} from '../lang'
import arrayMap from '../internal/arrayMap'
import baseMap from '../internal/baseMap'


export default function map(collection,iteratee,context){
    let func=isArray(collection)?arrayMap:baseMap;
    return  func(collection,iteratee,context)
}
