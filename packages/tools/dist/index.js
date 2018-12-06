/* @desc 工具库 
 @author fanyonglong */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.dx = {})));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 支持类扩展、装饰器、混合
   */
  function Class() {}

  Class.extend = function (proto) {
    var superClass = this;

    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
    }

    var subClass = proto.constructor || function () {};

    subClass.fn = subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(subClass, superClass);
    } else {
      Object.assign(subClass, superClass);
    } // 继承静态属性和方法
    // if (superClass){
    //     // ie11 支持:setPrototypeOf 低版本chrome和FireFox支持__proto__
    //     Object.setPrototypeOf
    //       ? Object.setPrototypeOf(subClass, superClass)
    //       : (subClass.__proto__ = superClass);
    // }


    return subClass;
  };
  /**
   * @param  {array<function:(target, name, descriptor)=>void} ...decorators 
   */


  Class.decorator = function () {
    var _this = this;

    for (var _len = arguments.length, decorators = new Array(_len), _key = 0; _key < _len; _key++) {
      decorators[_key] = arguments[_key];
    }

    decorators.forEach(function (decorator) {
      decorator(_this);
    });
  };

  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(target, key) {
    return _hasOwnProperty.call(target, key);
  }
  function property(key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  }
  /**
   * 定义属性
   * @param {object} target 
   * @param {string | number | symbol} key 
   * @param {PropertyDescriptor} attributes 
   */

  function defineProperty(target, key, attributes) {
    Object.defineProperty(target, key, attributes);
  }
  /**
   * 定义多个属性
   * @param  {object} target
   * @param  {PropertyDescriptorMap} properties
   */

  function defineProperties(target, properties) {
    Object.defineProperties(target, properties);
  }
  /**
   * @param  {object} target
   * @param  {string | number | symbol} key
   * @param  {any} value
   * @param  {boolean} enumerable=false
   * @param  {boolean} configurable=true
   */

  function defineProto(target, key, value) {
    var enumerable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var configurable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    defineProperty(target, key, {
      configurable: configurable,
      enumerable: enumerable,
      value: value,
      writable: true
    });
  }
  function defineReadonly(target, key, value) {
    var enumerable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var configurable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    defineProperty(target, key, {
      configurable: configurable,
      enumerable: enumerable,
      value: value,
      writable: false
    });
  }
  /**
   * @param  {object} target
   * @param  {string | number | symbol} key
   * @param  {any} setter
   * @param  {any} getter
   * @param  {boolean} enumerable=false
   * @param  {boolean} configurable=true
   */

  function defineGetSet(target, key, setter, getter) {
    var enumerable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var configurable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    defineProperty(target, key, {
      configurable: configurable,
      enumerable: enumerable,
      get: setter,
      set: getter
    });
  }

  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) {

        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
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

  function completeAssign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (source) {
      var descriptors = Object.keys(source).reduce(function (descriptors, key) {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {}); // Object.assign 默认也会拷贝可枚举的Symbols

      Object.getOwnPropertySymbols(source).forEach(function (sym) {
        var descriptor = Object.getOwnPropertyDescriptor(source, sym);

        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });
      Object.defineProperties(target, descriptors);
    });
    return target;
  }

  var utils = ({
    hasOwn: hasOwn,
    property: property,
    defineProperty: defineProperty,
    defineProperties: defineProperties,
    defineProto: defineProto,
    defineReadonly: defineReadonly,
    defineGetSet: defineGetSet,
    completeAssign: completeAssign
  });

  var functionProto = Function.prototype;
  var _funcString = functionProto.toString;
  var objectProto = Object.prototype;
  var _toString = objectProto.toString;

  var objectCtorString = _funcString.call(Object);
  var INFINITY = Infinity;
  var MAX_INTEGER = Number.MAX_VALUE; // 安全数2^53
  function isUndefined(value) {
    return typeof value == 'undefined';
  }
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike$1(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isFunction(obj) {
    return typeof obj == 'function';
  }
  exports.isArray = Array.isArray; //ie9

  if (!Array.isArray) {
    exports.isArray = function isArray(obj) {
      return _toString.call(obj) == '[object Array]';
    };
  }
  function isObjectLike(value) {
    return value != null && _typeof(value) == 'object';
  }
  function isPlainObject(value) {
    if (!isObjectLike(value)) {
      return false;
    }

    var proto = Object.getPrototypeOf(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwn(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && _funcString.call(Ctor) == objectCtorString;
  }
  function isObject(obj) {
    return _toString.call(obj) == '[object Object]';
  }
  var _reg_native = /\[native code\]/;
  function isNative(obj) {
    if (!isFunction(obj)) {
      return false;
    }

    return _reg_native.test(_funcString.call(obj));
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }
  function isBoolean(obj) {
    return typeof obj === 'boolean';
  }
  function isString(obj) {
    return typeof obj === 'string';
  }
  function isSymbol(value) {
    return _typeof(value) == 'symbol';
  }
  function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || // $flow-disable-line
    _typeof(value) === 'symbol' || typeof value === 'boolean';
  }
  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */

  function isStrictComparable(value) {
    return value === value && !isObject(value);
  } //确定传递的值类型及本身是否是有限数。

  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }

    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }

    return value === value ? value : 0;
  } //计算传递的值并将其转换为整数 (或无穷大)。

  function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }

  /**
   * 添加监听事件
   * @param {object} target 
   * @param {string} type 
   * @param {function} handler 
   */

  function listenerToObj(target, type, handler) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : target;
    var first = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var once = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var eventLists = target.__events__;

    if (!eventLists) {
      eventLists = target.__events__ = Object.create(null);
    }

    var events = eventLists[type];
    var event = {
      context: context,
      handler: handler,
      once: once
    };

    if (!events) {
      eventLists[type] = event;
    } else if (isPlainObject(events)) {
      eventLists[type] = first ? [event, events] : [events, event];
    } else {
      events[first ? 'unshift' : 'push'](event);
    }
  }
  /**
   * 移除监听事件
   * @param {object} target 
   * @param {string} [type] 
   * @param {function} [handler] 
   */


  function removeListenerToObj(target, type, handler) {
    var eventLists = target.__events__;

    if (!eventLists) {
      return false;
    }

    if (!type) {
      target.__events__ = null;
      delete target.__events__;
      return false;
    }

    var events = eventLists[type];

    if (!events) {
      return false;
    }

    if (isPlainObject(events) || !isFunction(handler)) {
      eventLists[type] = null;
    } else {
      var event;

      for (var i = events.length - 1; i >= 0; i--) {
        event = events[i];

        if (event.handler === handler) {
          events.splice(i, 1);
        }
      }
    }
  }
  /**
   * 触发监听事件
   * @param {object} target 
   * @param {string} type 
   * @param {any} [data] 
   */


  function dispatchToObj(target, type) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var eventLists = target.__events__;

    if (eventLists) {
      var events = eventLists[type],
          handler,
          context;

      if (events && isPlainObject(events)) {
        handler = events.handler;
        context = events.context;

        if (events.once) {
          eventLists[type] = null;
        }

        handler.apply(context, data);
      } else if (events) {
        var _events = events.slice(0);

        var event;

        for (var i = 0, len = _events.length; i < len; i++) {
          event = _events[i];
          handler = event.handler;
          context = event.context;

          if (event.once) {
            events.splice(i, 1);
          }

          console.log(type, context);
          handler.apply(context, data);
        }
      }
    }
  }

  var Observable =
  /*#__PURE__*/
  function () {
    function Observable() {
      _classCallCheck(this, Observable);
    }

    _createClass(Observable, [{
      key: "on",

      /**
       * 添加事件
       * @param {string|object} name 
       * @param {function} handler 
       * @param {any} [context] 
       * @param {boolean} first 
       * @param {boolean} once
       * @returns {Observable} 
       */
      value: function on(name, handler, context) {
        var first = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var once = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var that = this,
            isFunc = isFunction(handler);

        if (!isFunc) {
          once = first;
          first = context;
          context = handler;
          handler = undefined;
        }

        if (isPlainObject(name)) {
          var orgHandler = handler;

          for (var key in name) {
            if (hasOwn(name, key)) {
              handler = isFunc ? orgHandler : isString(name[key]) ? that[name] : name[key];
              isFunction(handler) && listenerToObj(that, key, handler, context, first, once);
            }
          }
        } else {
          listenerToObj(that, name, handler, context, first, once);
        }

        return this;
      }
    }, {
      key: "one",
      value: function one(name, handler, context) {
        var first = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return this.on(name, handler, context, first, true);
      }
    }, {
      key: "off",
      value: function off(name, handler) {
        removeListenerToObj(this, name, handler);
        return this;
      }
    }, {
      key: "emit",
      value: function emit(name) {
        for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          data[_key - 1] = arguments[_key];
        }

        dispatchToObj(this, name, data);
        return this;
      }
    }]);

    return Observable;
  }();

  /**
   * @param  {number} count
   * @param  {functon} fn
   */
  function after(n, func) {
    return function () {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  function partial(func) {}

  function noop() {}

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }

    return func.apply(thisArg, args);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */

  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }

      index = -1;
      var otherArgs = Array(start + 1);

      while (++index < start) {
        otherArgs[index] = args[index];
      }

      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * 包装函数，分配参数
   * @param {function} fn 
   */

  function rest(fn, start) {
    return overRest(fn, start, identity);
  }

  var Map$1 = function Map() {
    _classCallCheck(this, Map);
  };

  function arrayEach() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var iteratee = arguments.length > 1 ? arguments[1] : undefined;
    var thisArg = arguments.length > 2 ? arguments[2] : undefined;
    var len = array.length,
        i = -1;

    while (++i < len) {
      if (iteratee.call(thisArg || array[i], array[i], i, array) === false) {
        break;
      }
    }
  }

  function baseKeys(object) {
    var result = [];
    var object = Object(object);

    for (var key in object) {
      if (hasOwn(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }

  function baseEach() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var iteratee = arguments.length > 1 ? arguments[1] : undefined;
    var thisArg = arguments.length > 2 ? arguments[2] : undefined;
    var keys = baseKeys(value);
    var len = keys.length,
        i = -1,
        key;

    while (++i < len) {
      key = keys[i];

      if (iteratee.call(thisArg || obj[key], obj[key], key, obj) === false) {
        break;
      }
    }
  }

  function each(collection, iteratee, context) {
    var eachFunc = exports.isArray(collection) ? arrayEach : baseEach;
    eachFunc(collection, iteratee, context);
  }

  /**
   * 
   * @param {object} target 
   * @param  {...object|array|function} sources 
   */

  function extend(target) {
    var i = -1,
        len = arguments.length <= 1 ? 0 : arguments.length - 1,
        source;

    while (++i < len) {
      source = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

      if (isObjectLike(source)) {
        each(source, function (value, key) {
          target[key] = value;
        });
      }
    }

    return target;
  }

  function arraySome(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }

    return false;
  }

  function baseSome(obj, predicate) {
    var result = false;
    baseEach(obj, function (value, key, obj) {
      result = predicate(value, key, obj);
      return !result;
    });
    return !!result;
  }

  function some(collection, iteratee, context) {
    var func = exports.isArray(collection) ? arraySome : baseSome;
    return func(collection, iteratee, context);
  }

  function keys(collection) {
    var keysFunc = isArrayLike$1(collection) ? arrayEach : baseKeys;
    return keysFunc(collection);
  }

  function arrayReduce(array, callback) {
    var value,
        i = -1,
        len = array.length;

    if (arguments.length > 2 && arguments[2] != undefined) {
      value = arguments[2];
    } else {
      value = array[++i];
    }

    while (++i < len) {
      value = callback(value, array[i], i, array);
    }

    return value;
  }

  function baseReduce(obj, callback) {
    var keys = baseKeys(obj),
        key;
    var value,
        i = -1,
        len = keys.length;

    if (arguments.length > 2 && arguments[2] != undefined) {
      value = arguments[2];
    } else {
      key = keys[++i];
      value = array[key];
    }

    while (++i < len) {
      key = keys[i];
      value = callback(value, obj[key], key, obj);
    }

    return value;
  }

  function reduce(collection, callback, value) {
    var func = isArrayLike(collection) ? arrayReduce : baseReduce;
    return func(collection, callback, value);
  }

  var util = utils;

  exports.util = util;
  exports.Class = Class;
  exports.Observable = Observable;
  exports.after = after;
  exports.identity = identity;
  exports.partial = partial;
  exports.noop = noop;
  exports.rest = rest;
  exports.isUndefined = isUndefined;
  exports.isLength = isLength;
  exports.isArrayLike = isArrayLike$1;
  exports.isFunction = isFunction;
  exports.isObjectLike = isObjectLike;
  exports.isPlainObject = isPlainObject;
  exports.isObject = isObject;
  exports.isNative = isNative;
  exports.isPrototype = isPrototype;
  exports.isBoolean = isBoolean;
  exports.isString = isString;
  exports.isSymbol = isSymbol;
  exports.isPrimitive = isPrimitive;
  exports.isStrictComparable = isStrictComparable;
  exports.toFinite = toFinite;
  exports.toInteger = toInteger;
  exports.Map = Map$1;
  exports.each = each;
  exports.extend = extend;
  exports.some = some;
  exports.keys = keys;
  exports.reduce = reduce;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
