import {hasOwn} from '../util'
import {isPrototype} from '../lang'
export default function baseKeys(object,inherited) {
    var result = [];
    var isProto=isPrototype(object)
    var object=Object(object);
    for (var key in object) {
      if ((inherited||hasOwn(object, key)) &&!(isProto&&key == 'constructor')) {
         result.push(key);
      }
    }
    return result;
}