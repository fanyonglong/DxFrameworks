
const _hasOwnProperty=Object.prototype.hasOwnProperty;
export function hasOwn(target,key){
    return _hasOwnProperty.call(target,key);
}
export function property(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
}
/**
 * 定义属性
 * @param {object} target 
 * @param {string} key 
 * @param {PropertyDescriptor} attributes 
 */
export function defineProperty(target,key,attributes){
  Object.defineProperty(target,key,attributes)
}
/**
 * 定义多个属性
 * @param  {object} target
 * @param  {PropertyDescriptorMap} properties
 */
export function defineProperties(target,properties){
  Object.defineProperties(target,properties)
}

export function defineProto(target,key,value,enumerable=false,configurable=true){
  defineReadonly(target,key,{
    configurable: configurable,
    enumerable: enumerable,
    value: value,
    writable: true
  })
}
export function defineReadonly(target,key,value,enumerable=false,configurable=true){
  defineReadonly(target,key,{
    configurable: configurable,
    enumerable: enumerable,
    value: value,
    writable: false
  })
}


if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }
  
        var to = Object(target);
  
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
  
          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
export function completeAssign(target, ...sources) {
    sources.forEach(source => {
      let descriptors = Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {});
  
      // Object.assign 默认也会拷贝可枚举的Symbols
      Object.getOwnPropertySymbols(source).forEach(sym => {
        let descriptor = Object.getOwnPropertyDescriptor(source, sym);
        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });
      Object.defineProperties(target, descriptors);
    });
    return target;
  }
  