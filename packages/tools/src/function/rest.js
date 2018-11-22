import overRest from '../internal/overRest'
import identity from './identity'
/**
 * 包装函数，分配参数
 * @param {function} fn 
 */
export default function rest(fn,start)
{
    return overRest(fn,start,identity)
}