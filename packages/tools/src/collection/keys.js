
import {isArrayLike} from './lang'
import arrayLikeKeys from '../internal/arrayEach'
import baseKeys from '../internal/baseKeys'
export default function keys(collection){
    let keysFunc=isArrayLike(collection)?arrayLikeKeys:baseKeys;
    return keysFunc(collection)
}