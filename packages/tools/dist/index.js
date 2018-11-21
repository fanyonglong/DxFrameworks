/* @desc 工具库 
 @author fanyonglong */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('os')) :
  typeof define === 'function' && define.amd ? define(['exports', 'os'], factory) :
  (factory((global.dx = {}),global.os));
}(this, (function (exports,os) { 'use strict';

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
    }); // 继承静态属性和方法
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

  var _toString = Object.prototype.toString;
  var _funcString = Function.prototype.toString;
  function isFunction(obj) {
    return typeof obj == 'function';
  }
  function isArray(obj) {
    return _toString.call(obj) == '[object Array]';
  }
  function isPlainObject(obj) {
    return _toString.call(obj) == '[object Object]';
  }
  function isObject(obj) {
    return _typeof(obj) == 'object';
  }
  var _reg_native = /\[native code\]/;
  function isNative(obj) {
    if (!isFunction(obj)) {
      return false;
    }

    return _reg_native.test(_funcString.call(obj));
  }
  function isBoolean(obj) {
    return typeof obj === 'boolean';
  }
  function isString(obj) {
    return typeof obj === 'string';
  }

  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(target, key) {
    return _hasOwnProperty.call(target, key);
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
    completeAssign: completeAssign
  });

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
    function Observable() {}

    var _proto = Observable.prototype;

    /**
     * 添加事件
     * @param {string|object} name 
     * @param {function} handler 
     * @param {any} [context] 
     * @param {boolean} first 
     * @param {boolean} once
     * @returns {Observable} 
     */
    _proto.on = function on(name, handler, context) {
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
    };

    _proto.one = function one(name, handler, context) {
      var first = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return this.on(name, handler, context, first, true);
    };

    _proto.off = function off(name, handler) {
      removeListenerToObj(this, name, handler);
      return this;
    };

    _proto.emit = function emit(name) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      dispatchToObj(this, name, data);
      return this;
    };

    return Observable;
  }();

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

  /**
   * 包装函数，分配参数
   * @param {function} fn 
   */

  function rest(fn, start) {
    return overRest(fn, start, identity);
  }

  var util = utils;

  exports.util = util;
  exports.Class = Class;
  exports.Observable = Observable;
  exports.rest = rest;
  exports.isFunction = isFunction;
  exports.isArray = isArray;
  exports.isPlainObject = isPlainObject;
  exports.isObject = isObject;
  exports.isNative = isNative;
  exports.isBoolean = isBoolean;
  exports.isString = isString;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
