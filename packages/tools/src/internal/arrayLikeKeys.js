
import {isArray} from '../lang'
/**
 * 获取数据可访问
*/
export function  arrayLikeKeys(object,inherited) {
    let result=[];
    let isArr=isArray(object);
    let isSkip=isArr;
    for (const key in object) {
        // 如果是数组，不复制length属性
        if (inherited||object.hasOwnProperty(key)&&!(isSkip&&key=='length')) {
            result.push(key);
        }
    }
    return result;
}