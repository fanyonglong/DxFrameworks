
import arrayFindIndex from '../internal/arrayFindIndex'
import {getIteratee} from '../internal/iteratee'
import {isFunction} from '../lang'
export default function findIndex(array,iteratee){
    iteratee=getIteratee(iteratee)
    return arrayFindIndex(array,iteratee)
}