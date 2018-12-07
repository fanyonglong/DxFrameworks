/**
 * 复制属性
 * @param {object|array} source 
 * @param {string} props 
 * @param {object|array} object 
 * @param {function} [customizer] 
 */
export default function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
  
    var index = -1,
        length = props.length;
  
    while (++index < length) {
      var key = props[index];
  
      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;
  
      if (newValue === undefined) {
        newValue = source[key];
      }
      object[key]=newValue;
    }
    return object;
  }