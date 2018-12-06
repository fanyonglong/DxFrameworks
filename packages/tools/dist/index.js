(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./core", "./function", "./lang", "./collection", "./util"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./core"), require("./function"), require("./lang"), require("./collection"), require("./util"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.core, global._function, global.lang, global.collection, global.util);
    global.index = mod.exports;
  }
})(this, function (_exports, _core, _function, _lang, _collection, utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    util: true
  };
  _exports.util = void 0;
  Object.keys(_core).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _core[key];
      }
    });
  });
  Object.keys(_function).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _function[key];
      }
    });
  });
  Object.keys(_lang).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _lang[key];
      }
    });
  });
  Object.keys(_collection).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _collection[key];
      }
    });
  });
  utils = _interopRequireWildcard(utils);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  var util = utils;
  _exports.util = util;
});