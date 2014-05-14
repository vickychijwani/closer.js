(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var ArgTypeError, ArityError, assertions, firstFailure, mori, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  ArityError = (function(_super) {
    __extends(ArityError, _super);

    function ArityError() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.name = 'ArityError';
      this.message = args.length === 3 ? "Expected " + args[0] + ".." + args[1] + " args, got " + args[2] : args[0];
      this.stack = (new Error()).stack;
    }

    return ArityError;

  })(Error);

  ArgTypeError = (function(_super) {
    __extends(ArgTypeError, _super);

    function ArgTypeError(message) {
      this.name = 'ArgTypeError';
      this.message = message;
      this.stack = (new Error()).stack;
    }

    return ArgTypeError;

  })(Error);

  firstFailure = function(args, testFn) {
    return _.find(args, function(arg) {
      return !testFn(arg);
    });
  };

  assertions = {
    numbers: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(_.flatten(args), function(arg) {
        return typeof arg === 'number';
      });
      if (unexpectedArg !== void 0) {
        throw new ArgTypeError("" + unexpectedArg + " is not a number");
      }
    },
    integers: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(_.flatten(args), function(arg) {
        return typeof arg === 'number' && arg % 1 === 0;
      });
      if (unexpectedArg !== void 0) {
        throw new ArgTypeError("" + unexpectedArg + " is not a integer");
      }
    },
    associativeOrSet: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_associative(arg) || mori.is_set(arg);
      })) {
        throw new ArgTypeError("" + unexpectedArg + " is not a set or an associative collection");
      }
    },
    associative: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_associative(arg);
      })) {
        throw new ArgTypeError("" + unexpectedArg + " is not an associative collection");
      }
    },
    map: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_map(arg);
      })) {
        throw new ArgTypeError("" + unexpectedArg + " is not a map");
      }
    },
    seqable: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_seqable(arg) || _.isString(arg) || _.isArray(arg);
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " is not seqable");
      }
    },
    sequential: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_sequential(arg) || _.isString(arg) || _.isArray(arg);
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " is not sequential");
      }
    },
    stack: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_vector(arg) || mori.is_list(arg);
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " does not support stack operations");
      }
    },
    type_custom: function(checkFn) {
      var msg;
      if (msg = checkFn()) {
        throw new ArgTypeError(msg);
      }
    },
    "function": function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return typeof arg === 'function' || mori.is_vector(arg) || mori.is_map(arg) || mori.is_set(arg) || mori.is_keyword(arg);
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " is not a function");
      }
    },
    arity: function(expected_min, expected_max, args) {
      var _ref;
      if (arguments.length === 2) {
        args = expected_max;
        expected_max = expected_min;
      }
      if (!((expected_min <= (_ref = args.length) && _ref <= expected_max))) {
        throw new ArityError(expected_min, expected_max, args.length);
      }
    },
    arity_custom: function(args, checkFn) {
      var msg;
      if (msg = checkFn(args)) {
        throw new ArityError(msg);
      }
    }
  };

  module.exports = assertions;

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  mori = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.mori : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.mori : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.mori : void 0) != null ? _ref3 : require('mori');

  if (typeof self !== "undefined" && self !== null) {
    self.assertions = assertions;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.assertions = assertions;
  }

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])