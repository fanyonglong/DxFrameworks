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

    if (superClass) {
      // ie11 支持:setPrototypeOf 低版本chrome和FireFox支持__proto__
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

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

  var _toString = Object.prototype.toString;
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

  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(target, key) {
    return _hasOwnProperty.call(target, key);
  }
  function setPrototypeOf(target, value) {}



  var utils = ({
    isFunction: isFunction,
    isArray: isArray,
    isPlainObject: isPlainObject,
    isObject: isObject,
    hasOwn: hasOwn,
    setPrototypeOf: setPrototypeOf
  });

  var util = utils;

  exports.util = util;
  exports.Class = Class;
  exports.rest = rest;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
