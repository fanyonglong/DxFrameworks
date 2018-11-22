import {hasOwn} from '../util'
export function baseKeys(object) {
    var result = [];
    var object=Object(object)
    for (var key in object) {
      if (hasOwn(object, key) && key != 'constructor') {
         result.push(key);
      }
    }
    return result;
}