
import {isArray} from '../internal/arrayReduce'
import baseReduce from '../internal/baseReduce'
import arrayReduce from '../internal/arrayReduce'

export default function reduce(collection,callback,value){
    var func=isArrayLike(collection)?arrayReduce:baseReduce;
    return func(collection,callback,value)
}