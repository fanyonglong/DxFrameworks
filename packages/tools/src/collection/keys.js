
import {isArrayLike} from '../lang'
import arrayLikeKeys from '../internal/arrayEach'
import baseKeys from '../internal/baseKeys'
export default function keys(collection){
    return isArrayLike(collection)?arrayLikeKeys(collection):baseKeys(collection)
}