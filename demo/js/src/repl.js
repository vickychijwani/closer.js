(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var ArgTypeError, ArityError, assertions, firstFailure, mori, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  mori = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.mori : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.mori : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.mori : void 0) != null ? _ref3 : require('mori');

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
    arity: function(expected_min, expected_max, actual) {
      if (arguments.length === 2) {
        actual = expected_max;
        expected_max = expected_min;
      }
      if (!((expected_min <= actual && actual <= expected_max))) {
        throw new ArityError(expected_min, expected_max, actual);
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

  if (typeof self !== "undefined" && self !== null) {
    self.closerAssertions = assertions;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closerAssertions = assertions;
  }

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"mori":26}],2:[function(require,module,exports){
(function (global){
(function() {
  var assertions, bind, core, estraverse, m, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  m = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.mori : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.mori : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.mori : void 0) != null ? _ref3 : require('mori');

  estraverse = require('estraverse');

  assertions = require('./assertions');

  core = {
    '_$PLUS_': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      assertions.numbers(nums);
      return _.reduce(nums, (function(sum, num) {
        return sum + num;
      }), 0);
    },
    '_$_': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(0);
      }
      return _.reduce(nums.slice(1), (function(diff, num) {
        return diff - num;
      }), nums[0]);
    },
    '_$STAR_': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      assertions.numbers(nums);
      return _.reduce(nums, (function(prod, num) {
        return prod * num;
      }), 1);
    },
    '_$SLASH_': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(1);
      }
      return _.reduce(nums.slice(1), (function(quo, num) {
        return quo / num;
      }), nums[0]);
    },
    'inc': function(num) {
      assertions.arity(1, arguments.length);
      assertions.numbers(num);
      return ++num;
    },
    'dec': function(num) {
      assertions.arity(1, arguments.length);
      assertions.numbers(num);
      return --num;
    },
    'max': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions.numbers(nums);
      return _.max(nums);
    },
    'min': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions.numbers(nums);
      return _.min(nums);
    },
    'quot': function(num, div) {
      var sign;
      assertions.arity(2, arguments.length);
      assertions.numbers(arguments);
      sign = num > 0 && div > 0 || num < 0 && div < 0 ? 1 : -1;
      return sign * Math.floor(Math.abs(num / div));
    },
    'rem': function(num, div) {
      assertions.arity(2, arguments.length);
      assertions.numbers(arguments);
      return num % div;
    },
    'mod': function(num, div) {
      var rem;
      assertions.arity(2, arguments.length);
      assertions.numbers(arguments);
      rem = num % div;
      if (rem === 0 || (num > 0 && div > 0 || num < 0 && div < 0)) {
        return rem;
      } else {
        return rem + div;
      }
    },
    'rand': function() {
      var n;
      assertions.arity(0, 1, arguments.length);
      n = 1;
      if (arguments.length === 1) {
        assertions.numbers(arguments[0]);
        n = arguments[0];
      }
      return Math.random() * n;
    },
    'rand_$_int': function(n) {
      var r;
      assertions.arity(1, arguments.length);
      r = core.rand(n);
      if (r >= 0) {
        return Math.floor(r);
      } else {
        return Math.ceil(r);
      }
    },
    '_$EQ_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      args = _.uniq(args);
      if (args.length === 1) {
        return true;
      }
      return m.equals.apply(null, _.map(args, function(arg) {
        return m.js_to_clj(arg);
      }));
    },
    'not_$EQ_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      return core.not(core['_$EQ_'].apply(null, args));
    },
    '_$EQ__$EQ_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (args.length === 1) {
        return true;
      }
      assertions.numbers(args);
      return core['_$EQ_'].apply(null, args);
    },
    '_$LT_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (args.length === 1) {
        return true;
      }
      assertions.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val < args[idx + 1]);
      }), true);
    },
    '_$GT_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (args.length === 1) {
        return true;
      }
      assertions.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val > args[idx + 1]);
      }), true);
    },
    '_$LT__$EQ_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (args.length === 1) {
        return true;
      }
      assertions.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val <= args[idx + 1]);
      }), true);
    },
    '_$GT__$EQ_': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (args.length === 1) {
        return true;
      }
      assertions.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val >= args[idx + 1]);
      }), true);
    },
    'identical_$QMARK_': function(x, y) {
      assertions.arity(2, arguments.length);
      return x === y;
    },
    'true_$QMARK_': function(arg) {
      assertions.arity(1, arguments.length);
      return arg === true;
    },
    'false_$QMARK_': function(arg) {
      assertions.arity(1, arguments.length);
      return arg === false;
    },
    'nil_$QMARK_': function(arg) {
      assertions.arity(1, arguments.length);
      return arg === null;
    },
    'some_$QMARK_': function(arg) {
      assertions.arity(1, arguments.length);
      return arg !== null;
    },
    'number_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return typeof x === 'number';
    },
    'integer_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return typeof x === 'number' && x % 1 === 0;
    },
    'float_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return typeof x === 'number' && x % 1 !== 0;
    },
    'zero_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return core['_$EQ__$EQ_'](x, 0);
    },
    'pos_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return core['_$GT_'](x, 0);
    },
    'neg_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return core['_$LT_'](x, 0);
    },
    'even_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      assertions.integers(x);
      return core['zero_$QMARK_'](core['mod'](x, 2));
    },
    'odd_$QMARK_': function(x) {
      return core['not'](core['even_$QMARK_'](x));
    },
    'contains_$QMARK_': function(coll, key) {
      assertions.arity(2, arguments.length);
      assertions.associativeOrSet(coll);
      return m.has_key(coll, key);
    },
    'empty_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_empty(coll);
    },
    'keyword_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_keyword(x);
    },
    'list_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_list(x);
    },
    'seq_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_seq(x);
    },
    'vector_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_vector(x);
    },
    'map_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_map(x);
    },
    'set_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_set(x);
    },
    'coll_$QMARK_': function(x) {
      assertions.arity(1, arguments.length);
      return m.is_collection(x);
    },
    'sequential_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_sequential(coll);
    },
    'associative_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_associative(coll);
    },
    'counted_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_counted(coll);
    },
    'seqable_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_seqable(coll);
    },
    'reversible_$QMARK_': function(coll) {
      assertions.arity(1, arguments.length);
      return m.is_reversible(coll);
    },
    'boolean': function(arg) {
      assertions.arity(1, arguments.length);
      return arg !== false && arg !== null;
    },
    'not': function(arg) {
      assertions.arity(1, arguments.length);
      return !core.boolean(arg);
    },
    'str': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      return _.reduce(args, (function(str, arg) {
        return str += core['nil_$QMARK_'](arg) ? '' : arg.toString();
      }), '');
    },
    'println': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      return console.log.apply(null, args);
    },
    'keyword': function(name) {
      assertions.arity(1, arguments.length);
      return m.keyword(name);
    },
    'list': function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      return m.list.apply(null, items);
    },
    'vector': function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      return m.vector.apply(null, items);
    },
    'hash_$_map': function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity_custom(arguments, function(args) {
        if (args.length % 2 !== 0) {
          return "Expected even number of args, got " + args.length;
        }
      });
      return m.hash_map.apply(null, items);
    },
    'hash_$_set': function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      return m.set(items);
    },
    'count': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.seqable(coll);
      return m.count(coll);
    },
    'empty': function(coll) {
      var error;
      assertions.arity(1, arguments.length);
      try {
        return m.empty(coll);
      } catch (_error) {
        error = _error;
        return null;
      }
    },
    'not_$_empty': function(coll) {
      assertions.arity(1, arguments.length);
      if (core.count(coll) === 0) {
        return null;
      } else {
        return coll;
      }
    },
    'get': function(coll, key, notFound) {
      if (notFound == null) {
        notFound = null;
      }
      assertions.arity(2, 3, arguments.length);
      return m.get(coll, key, notFound);
    },
    'seq': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.seqable(coll);
      return m.seq(coll);
    },
    'first': function(coll) {
      assertions.arity(1, arguments.length);
      return m.first(coll);
    },
    'rest': function(coll) {
      assertions.arity(1, arguments.length);
      return m.rest(coll);
    },
    'next': function(coll) {
      var rest;
      assertions.arity(1, arguments.length);
      rest = core.rest(coll);
      if (core['empty_$QMARK_'](rest)) {
        return null;
      } else {
        return rest;
      }
    },
    'last': function(coll) {
      assertions.arity(1, arguments.length);
      return m.last(coll);
    },
    'nth': function(coll, index, notFound) {
      var e, error;
      assertions.arity(2, 3, arguments.length);
      assertions.sequential(coll);
      assertions.numbers(index);
      if (coll === null) {
        return (notFound !== void 0 ? notFound : null);
      }
      if (_.isString(coll) && index >= coll.length && notFound === void 0) {
        error = new Error("Index out of bounds");
        error.name = 'IndexOutOfBoundsError';
        throw error;
      }
      try {
        if (notFound !== void 0) {
          return m.nth(coll, index, notFound);
        } else {
          return m.nth(coll, index);
        }
      } catch (_error) {
        e = _error;
        if (/^No item/.test(e.message) || /^Index out of bounds/.test(e.message)) {
          error = new Error("Index out of bounds");
          error.name = 'IndexOutOfBoundsError';
          throw error;
        } else {
          throw e;
        }
      }
    },
    'second': function(coll) {
      assertions.arity(1, arguments.length);
      return core.first(core.next(coll));
    },
    'ffirst': function(coll) {
      assertions.arity(1, arguments.length);
      return core.first(core.first(coll));
    },
    'nfirst': function(coll) {
      assertions.arity(1, arguments.length);
      return core.next(core.first(coll));
    },
    'fnext': function(coll) {
      assertions.arity(1, arguments.length);
      return core.first(core.next(coll));
    },
    'nnext': function(coll) {
      assertions.arity(1, arguments.length);
      return core.next(core.next(coll));
    },
    'nthnext': function(coll, n) {
      assertions.arity(2, arguments.length);
      return core.nth(core.iterate(core.next, coll), n);
    },
    'max_$_key': function() {
      var k, more, x, y;
      k = arguments[0], x = arguments[1], y = arguments[2], more = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](k);
      if (arguments.length === 2) {
        return x;
      }
      if (arguments.length === 3) {
        return (k(x) > k(y) ? x : y);
      }
      return core.reduce((function(x, y) {
        return core.max_$_key(k, x, y);
      }), core.max_$_key(k, x, y), more);
    },
    'min_$_key': function() {
      var k, more, x, y;
      k = arguments[0], x = arguments[1], y = arguments[2], more = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](k);
      if (arguments.length === 2) {
        return x;
      }
      if (arguments.length === 3) {
        return (k(x) < k(y) ? x : y);
      }
      return core.reduce((function(x, y) {
        return core.min_$_key(k, x, y);
      }), core.min_$_key(k, x, y), more);
    },
    'peek': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.stack(coll);
      return m.peek(coll);
    },
    'pop': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.stack(coll);
      return m.pop(coll);
    },
    'cons': function(x, seq) {
      assertions.arity(2, arguments.length);
      return m.cons(x, seq);
    },
    'conj': function() {
      var coll, xs;
      coll = arguments[0], xs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      if (core['map_$QMARK_'](coll) && _.any(xs, function(x) {
        return core['vector_$QMARK_'](x) && core.count(x) !== 2;
      })) {
        throw new TypeError('vector args to conjoin to a map must be pairs');
      }
      return m.conj.apply(null, _.flatten([coll, xs]));
    },
    'disj': function() {
      var ks, set;
      set = arguments[0], ks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions.type_custom(function() {
        if (!core.set_$QMARK_(set)) {
          return "" + set + " is not a set";
        }
      });
      if (ks === void 0) {
        ks = [];
      }
      return core.apply(m.disj, set, ks);
    },
    'into': function(to, from) {
      assertions.arity(2, arguments.length);
      if (to === null && from === null) {
        return null;
      }
      return m.reduce(core.conj, to, from);
    },
    'concat': function() {
      var seqs;
      seqs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      assertions.seqable.apply(null, seqs);
      return m.concat.apply(null, seqs);
    },
    'flatten': function(coll) {
      assertions.arity(1, arguments.length);
      return m.flatten(coll);
    },
    'reverse': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.seqable(coll);
      return m.reverse(coll);
    },
    'assoc': function() {
      var kvs, map;
      map = arguments[0], kvs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity_custom(arguments, function(args) {
        if (args.length < 3 || args.length % 2 === 0) {
          return "Expected odd number of args (at least 3), got " + args.length;
        }
      });
      return m.assoc.apply(null, _.flatten([map, kvs]));
    },
    'dissoc': function() {
      var keys, map;
      map = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(1, Infinity, arguments.length);
      if (keys.length === 0) {
        return map;
      }
      return m.dissoc.apply(null, _.flatten([map, keys]));
    },
    'keys': function(map) {
      assertions.arity(1, arguments.length);
      assertions.map(map);
      return m.keys(map);
    },
    'vals': function(map) {
      assertions.arity(1, arguments.length);
      assertions.map(map);
      return m.vals(map);
    },
    'key': function(e) {
      assertions.arity(1, arguments.length);
      assertions.type_custom(function() {
        if (!(core.vector_$QMARK_(e) && core.count(e) === 2)) {
          return "" + e + " is not a valid map entry";
        }
      });
      return core.first(e);
    },
    'val': function(e) {
      assertions.arity(1, arguments.length);
      assertions.type_custom(function() {
        if (!(core.vector_$QMARK_(e) && core.count(e) === 2)) {
          return "" + e + " is not a valid map entry";
        }
      });
      return core.last(e);
    },
    'find': function(map, key) {
      assertions.arity(2, arguments.length);
      assertions.associative(map);
      return m.find(map, key);
    },
    'range': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, 3, arguments.length);
      assertions.numbers(args);
      return m.range.apply(null, args);
    },
    'to_$_array': function(coll) {
      assertions.arity(1, arguments.length);
      assertions.seqable(coll);
      return core.reduce((function(arr, x) {
        arr.push(x);
        return arr;
      }), [], coll);
    },
    'identity': function(x) {
      assertions.arity(1, arguments.length);
      return x;
    },
    'apply': function() {
      var args, f, i, last, lastSeq, rest, _i, _ref6;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      last = args[args.length - 1];
      rest = args.slice(0, args.length - 1);
      assertions["function"](f);
      assertions.seqable(last);
      lastSeq = core.seq(last);
      for (i = _i = 0, _ref6 = core.count(lastSeq); 0 <= _ref6 ? _i < _ref6 : _i > _ref6; i = 0 <= _ref6 ? ++_i : --_i) {
        rest.push(core.nth(lastSeq, i));
      }
      return f.apply(this, rest);
    },
    'map': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](f);
      bind(this, arguments);
      return m.map.apply(null, arguments);
    },
    'mapcat': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](f);
      bind(this, arguments);
      return m.mapcat.apply(null, arguments);
    },
    'filter': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      bind(this, arguments);
      return m.filter(pred, coll);
    },
    'remove': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      bind(this, arguments);
      return m.remove(pred, coll);
    },
    'reduce': function() {
      assertions.arity(2, 3, arguments.length);
      assertions["function"](arguments[0]);
      bind(this, arguments);
      return m.reduce.apply(null, arguments);
    },
    'reduce_$_kv': function(f, init, coll) {
      assertions.arity(3, arguments.length);
      assertions["function"](f);
      bind(this, arguments);
      return m.reduce_kv(f, init, coll);
    },
    'take': function(n, coll) {
      assertions.arity(2, arguments.length);
      assertions.numbers(n);
      assertions.seqable(coll);
      return m.take(n, coll);
    },
    'drop': function(n, coll) {
      assertions.arity(2, arguments.length);
      assertions.numbers(n);
      assertions.seqable(coll);
      return m.drop(n, coll);
    },
    'some': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      assertions.seqable(coll);
      return m.some(pred, coll);
    },
    'every_$QMARK_': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      assertions.seqable(coll);
      return m.every(pred, coll);
    },
    'sort': function() {
      assertions.arity(1, 2, arguments.length);
      if (arguments.length === 1) {
        assertions.seqable(arguments[0]);
      } else {
        assertions["function"](arguments[0]);
        assertions.seqable(arguments[1]);
        bind(this, arguments);
      }
      return m.sort.apply(null, arguments);
    },
    'sort_$_by': function() {
      assertions.arity(2, 3, arguments.length);
      if (arguments.length === 2) {
        assertions["function"](arguments[0]);
        assertions.seqable(arguments[1]);
      } else {
        assertions["function"](arguments[0], arguments[1]);
        assertions.seqable(arguments[2]);
      }
      bind(this, arguments);
      return m.sort_by.apply(null, arguments);
    },
    'partition': function() {
      var coll, n, pad, step;
      assertions.arity(2, 4, arguments.length);
      switch (arguments.length) {
        case 2:
          n = arguments[0], coll = arguments[1];
          break;
        case 3:
          n = arguments[0], step = arguments[1], coll = arguments[2];
          assertions.numbers(step);
          break;
        case 4:
          n = arguments[0], step = arguments[1], pad = arguments[2], coll = arguments[3];
          assertions.numbers(step);
          assertions.seqable(pad);
      }
      assertions.numbers(n);
      assertions.seqable(coll);
      return m.partition.apply(null, arguments);
    },
    'partition_$_by': function(f, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](f);
      assertions.seqable(coll);
      bind(this, arguments);
      return m.partition_by(f, coll);
    },
    'group_$_by': function(f, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](f);
      assertions.seqable(coll);
      bind(this, arguments);
      return m.group_by(f, coll);
    },
    'zipmap': function(keys, vals) {
      assertions.arity(2, arguments.length);
      assertions.seqable(keys, vals);
      return m.zipmap(keys, vals);
    },
    'iterate': function(f, x) {
      assertions.arity(2, arguments.length);
      assertions["function"](f);
      bind(this, arguments);
      return m.iterate(f, x);
    },
    'constantly': function(x) {
      assertions.arity(1, arguments.length);
      return m.constantly(x);
    },
    'repeat': function() {
      assertions.arity(1, 2, arguments.length);
      if (arguments.length === 2) {
        assertions.numbers(arguments[0]);
      }
      return m.repeat.apply(null, arguments);
    },
    'repeatedly': function() {
      var f, n;
      assertions.arity(1, 2, arguments.length);
      if (arguments.length === 1) {
        f = arguments[0];
      } else {
        n = arguments[0], f = arguments[1];
      }
      if (typeof n !== 'undefined') {
        assertions.numbers(n);
      }
      assertions["function"](f);
      bind(this, arguments);
      return m.repeatedly.apply(null, arguments);
    },
    'comp': function() {
      assertions.arity(0, Infinity, arguments.length);
      assertions["function"].apply(null, arguments);
      bind(this, arguments);
      return m.comp.apply(null, arguments);
    },
    'partial': function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions["function"](f);
      bind(this, arguments);
      return m.partial.apply(null, arguments);
    },
    'clj_$__$GT_js': function(x) {
      assertions.arity(1, arguments.length);
      return m.clj_to_js(x);
    },
    'js_$__$GT_clj': function(x) {
      assertions.arity(1, arguments.length);
      return m.js_to_clj(x);
    }
  };

  bind = function(that, args) {
    var i, _i, _ref6, _results;
    _results = [];
    for (i = _i = 0, _ref6 = args.length; 0 <= _ref6 ? _i < _ref6 : _i > _ref6; i = 0 <= _ref6 ? ++_i : --_i) {
      if (_.isFunction(args[i])) {
        _results.push(args[i] = _.bind(args[i], that));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  core.$wireCallsToCoreFunctions = function(ast, coreIdentifier, assertionsIdentifier) {
    var currentScope, globalScope, scopeChain;
    if (coreIdentifier == null) {
      coreIdentifier = 'closerCore';
    }
    if (assertionsIdentifier == null) {
      assertionsIdentifier = 'closerAssertions';
    }
    globalScope = [];
    currentScope = globalScope;
    scopeChain = [globalScope];
    estraverse.replace(ast, {
      enter: function(node) {
        var fnScope, _ref6;
        if (node.type === 'FunctionExpression') {
          fnScope = _.map(node.params, function(p) {
            return p.name;
          });
          currentScope = fnScope;
          scopeChain.push(fnScope);
        } else if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && (_ref6 = node.id.name, __indexOf.call(currentScope, _ref6) < 0)) {
          currentScope.push(node.id.name);
        }
        return node;
      },
      leave: function(node) {
        var obj, prop;
        if (node.type === 'Identifier' && node.name in core && _.every(scopeChain, function(scope) {
          var _ref6;
          return _ref6 = node.name, __indexOf.call(scope, _ref6) < 0;
        })) {
          obj = {
            type: 'Identifier',
            name: coreIdentifier,
            loc: node.loc
          };
          prop = {
            type: 'Identifier',
            name: node.name,
            loc: node.loc
          };
          node = {
            type: 'MemberExpression',
            object: obj,
            property: prop,
            computed: false,
            loc: node.loc
          };
        } else if (node.type === 'MemberExpression' && node.object.type === 'Identifier' && node.object.name === coreIdentifier && node.property.type === 'MemberExpression' && node.property.object.type === 'Identifier' && node.property.object.name === coreIdentifier) {
          return node.property;
        } else if (node.type === 'MemberExpression' && node.object.type === 'Identifier' && node.object.name === 'assertions' && node.property.type === 'Identifier' && node.property.name in assertions) {
          node.object.name = assertionsIdentifier;
        } else if (node.type === 'FunctionExpression') {
          scopeChain.pop();
          currentScope = scopeChain[scopeChain.length - 1];
        }
        return node;
      }
    });
    return ast;
  };

  module.exports = core;

  if (typeof self !== "undefined" && self !== null) {
    self.closerCore = core;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closerCore = core;
  }

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./assertions":1,"estraverse":25,"mori":26}],3:[function(require,module,exports){
(function() {
  var Closer, Parser, balanceDelimiters, builder, closer, con, nodes, oldParse, parser;

  parser = require('./parser').parser;

  nodes = require('./nodes');

  builder = {};

  nodes.defineNodes(builder);

  for (con in builder) {
    parser.yy[con] = function(a, b, c, d, e, f, g, h) {
      return builder[con](a, b, c, d, e, f, g, h);
    };
  }

  parser.yy.Node = function(type, a, b, c, d, e, f, g, h) {
    var buildName;
    buildName = type[0].toLowerCase() + type.slice(1);
    if (builder && buildName in builder) {
      return builder[buildName](a, b, c, d, e, f, g, h);
    } else {
      throw new ReferenceError("no such node type: " + type);
    }
  };

  parser.yy.locComb = function(start, end) {
    start.last_line = end.last_line;
    start.last_column = end.last_column;
    start.range = [start.range[0], end.range[1]];
    return start;
  };

  parser.yy.loc = function(loc) {
    if (!this.locations) {
      return null;
    }
    if ('length' in loc) {
      loc = this.locComb(loc[0], loc[1]);
    }
    return {
      start: {
        line: this.startLine + loc.first_line - 1,
        column: loc.first_column
      },
      end: {
        line: this.startLine + loc.last_line - 1,
        column: loc.last_column
      },
      range: loc.range
    };
  };

  parser.lexer.options.ranges = true;

  oldParse = parser.parse;

  parser.parse = function(source, options) {
    this.yy.raw = [];
    this.yy.options = options;
    return oldParse.call(this, source);
  };

  Parser = (function() {
    function Parser(options) {
      this.yy.locs = options.loc !== false;
      this.yy.ranges = options.range === true;
      this.yy.locations = this.yy.locs || this.yy.ranges;
      this.yy.source = options.source || null;
      this.yy.startLine = options.line || 1;
      nodes.forceNoLoc = options.forceNoLoc;
    }

    return Parser;

  })();

  Parser.prototype = parser;

  balanceDelimiters = function(source) {
    var c, close, delims, existingClose, last, match, open, _i, _j, _len, _len1;
    match = {
      '(': ')',
      '[': ']',
      '{': '}'
    };
    open = /[(\[{]/g;
    close = /[)\]}]/g;
    existingClose = source.match(/[ \r\n)\]}]+$/);
    if (existingClose) {
      existingClose = existingClose[0];
      source = source.replace(existingClose, '');
      existingClose = existingClose.replace(/[ \r\n]+/g, '');
    } else {
      existingClose = '';
    }
    delims = [];
    for (_i = 0, _len = source.length; _i < _len; _i++) {
      c = source[_i];
      if (c.match(open)) {
        delims.push(c);
      } else if (c.match(close)) {
        last = delims[delims.length - 1];
        if (last) {
          if (c === match[last]) {
            delims.pop();
          } else {
            throw new Error("unmatched existing delimiters, can't balance");
          }
        } else {
          throw new Error("too many closing delimiters, can't balance");
        }
      }
    }
    delims.reverse();
    for (_j = 0, _len1 = delims.length; _j < _len1; _j++) {
      c = delims[_j];
      source += match[c];
    }
    return [source, delims.length - existingClose.length];
  };

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options);
    }

    Closer.prototype.parse = function(source, options) {
      var ast, e, unbalancedCount, _ref;
      if (options.loose === true) {
        try {
          _ref = balanceDelimiters(source), source = _ref[0], unbalancedCount = _ref[1];
          ast = this.parser.parse(source, options);
        } catch (_error) {
          e = _error;
          source = '';
          unbalancedCount = 0;
          ast = this.parser.parse(source, options);
        }
        if (!e && unbalancedCount > 0) {
          e = new Error("Missing " + unbalancedCount + " closing delimiters");
          e.startOffset = e.endOffset = source.length - 1;
          ast.errors = [e];
        }
      } else {
        ast = this.parser.parse(source, options);
      }
      return ast;
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
      if (options == null) {
        options = {};
      }
      return new Closer(options).parse(src, options);
    },
    node: parser.yy.Node
  };

  module.exports = closer;

  if (typeof self !== "undefined" && self !== null) {
    self.closer = closer;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closer = closer;
  }

}).call(this);

},{"./nodes":4,"./parser":5}],4:[function(require,module,exports){
(function() {
  exports.forceNoLoc = false;

  exports.defineNodes = function(builder) {
    var def, defaultIni, funIni;
    defaultIni = function(loc) {
      this.loc = loc;
      return this;
    };
    def = function(name, ini) {
      return builder[name[0].toLowerCase() + name.slice(1)] = function(a, b, c, d, e, f, g, h) {
        var obj;
        obj = {};
        obj.type = name;
        ini.call(obj, a, b, c, d, e, f, g, h);
        if (exports.forceNoLoc === true) {
          delete obj.loc;
        }
        return obj;
      };
    };
    def('Program', function(elements, loc) {
      this.body = elements;
      return this.loc = loc;
    });
    def('ExpressionStatement', function(expression, loc) {
      this.expression = expression;
      return this.loc = loc;
    });
    def('BlockStatement', function(body, loc) {
      this.body = body;
      return this.loc = loc;
    });
    def('EmptyStatement', defaultIni);
    def('Identifier', function(name, loc) {
      this.name = name;
      return this.loc = loc;
    });
    def('Literal', function(value, loc, raw) {
      this.value = value;
      return this.loc = loc;
    });
    def('ThisExpression', defaultIni);
    def('VariableDeclaration', function(kind, declarations, loc) {
      this.declarations = declarations;
      this.kind = kind;
      return this.loc = loc;
    });
    def('VariableDeclarator', function(id, init, loc) {
      this.id = id;
      this.init = init;
      return this.loc = loc;
    });
    def('ArrayExpression', function(elements, loc) {
      this.elements = elements;
      return this.loc = loc;
    });
    def('ObjectExpression', function(properties, loc) {
      this.properties = properties;
      return this.loc = loc;
    });
    funIni = function(ident, params, rest, body, isGen, isExp, loc) {
      this.id = ident;
      this.params = params;
      this.defaults = [];
      this.rest = rest;
      this.body = body;
      this.loc = loc;
      this.generator = isGen;
      return this.expression = isExp;
    };
    def('FunctionDeclaration', funIni);
    def('FunctionExpression', funIni);
    def('ReturnStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('TryStatement', function(block, handlers, finalizer, loc) {
      this.block = block;
      this.handlers = handlers || [];
      this.finalizer = finalizer;
      return this.loc = loc;
    });
    def('CatchClause', function(param, guard, body, loc) {
      this.param = param;
      this.guard = guard;
      this.body = body;
      return this.loc = loc;
    });
    def('ThrowStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('BreakStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('ContinueStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('ConditionalExpression', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    def('SequenceExpression', function(expressions, loc) {
      this.expressions = expressions;
      return this.loc = loc;
    });
    def('BinaryExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('AssignmentExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('LogicalExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('UnaryExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('UpdateExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('CallExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('NewExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('MemberExpression', function(object, property, computed, loc) {
      this.object = object;
      this.property = property;
      this.computed = computed;
      return this.loc = loc;
    });
    def('DebuggerStatement', defaultIni);
    def('Empty', defaultIni);
    def('WhileStatement', function(test, body, loc) {
      this.test = test;
      this.body = body;
      return this.loc = loc;
    });
    def('ForStatement', function(init, test, update, body, loc) {
      this.init = init;
      this.test = test;
      this.update = update;
      this.body = body;
      return this.loc = loc;
    });
    def('IfStatement', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    return def;
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"IdentifierList":5,"Keyword":6,"COLON":7,"AnonArg":8,"ANON_ARG":9,"Atom":10,"INTEGER":11,"FLOAT":12,"STRING":13,"true":14,"false":15,"nil":16,"CollectionLiteral":17,"[":18,"items":19,"]":20,"QUOTE":21,"(":22,")":23,"{":24,"SExprPairs[items]":25,"}":26,"SHARP":27,"Fn":28,"List":29,"AnonFnLiteral":30,"IdOrDestrucForm":31,"DestructuringForm":32,"IdOrDestrucList":33,"FnArgs":34,"&":35,"AsForm":36,"AS":37,"MapDestrucArgs":38,"KEYS":39,"STRS":40,"SExpr":41,"asForm":42,"FnArgsAndBody":43,"BlockStatementWithReturn":44,"FnDefinition":45,"FN":46,"DEFN":47,"ConditionalExpr":48,"IF":49,"SExpr[test]":50,"SExprStmt[consequent]":51,"alternate":52,"WHEN":53,"BlockStatement[consequent]":54,"LogicalExpr":55,"AND":56,"exprs":57,"OR":58,"VarDeclaration":59,"DEF":60,"init":61,"LetBinding":62,"LetBindings":63,"LetForm":64,"LET":65,"DoForm":66,"SetForm":67,"SETVAL":68,"DOT":69,"IDENTIFIER[prop]":70,"SExpr[obj]":71,"SExpr[val]":72,"LoopForm":73,"LOOP":74,"BlockStatement":75,"RecurForm":76,"RECUR":77,"args":78,"DoTimesForm":79,"DOTIMES":80,"DoSeqForm":81,"DOSEQ":82,"WhileForm":83,"WHILE":84,"DotForm":85,"NewForm":86,"NEW":87,"Identifier[konstructor]":88,"DO":89,"SExprStmt":90,"SExprPairs":91,"SExprs":92,"NonEmptyDoForm":93,"Program":94,"END-OF-FILE":95,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",7:"COLON",9:"ANON_ARG",11:"INTEGER",12:"FLOAT",13:"STRING",14:"true",15:"false",16:"nil",18:"[",20:"]",21:"QUOTE",22:"(",23:")",24:"{",25:"SExprPairs[items]",26:"}",27:"SHARP",35:"&",37:"AS",39:"KEYS",40:"STRS",46:"FN",47:"DEFN",49:"IF",50:"SExpr[test]",51:"SExprStmt[consequent]",53:"WHEN",54:"BlockStatement[consequent]",56:"AND",58:"OR",60:"DEF",65:"LET",68:"SETVAL",69:"DOT",70:"IDENTIFIER[prop]",71:"SExpr[obj]",72:"SExpr[val]",74:"LOOP",77:"RECUR",80:"DOTIMES",82:"DOSEQ",84:"WHILE",87:"NEW",88:"Identifier[konstructor]",89:"DO",95:"END-OF-FILE"},
productions_: [0,[3,1],[5,0],[5,2],[6,2],[8,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[17,3],[17,4],[17,3],[17,4],[28,1],[28,1],[28,1],[28,3],[28,1],[28,1],[31,1],[31,1],[33,0],[33,2],[34,1],[34,3],[36,2],[38,0],[38,2],[38,5],[38,5],[38,3],[32,4],[32,3],[43,4],[45,2],[45,3],[30,4],[48,4],[48,3],[55,2],[55,2],[59,3],[62,2],[63,2],[63,0],[64,5],[67,3],[67,7],[73,5],[76,2],[79,6],[81,6],[83,3],[85,4],[86,3],[86,3],[29,0],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,2],[29,2],[41,1],[41,1],[41,3],[41,1],[90,1],[91,0],[91,3],[92,1],[92,2],[93,1],[66,1],[66,0],[75,1],[44,1],[94,2],[94,1],[19,0],[19,1],[42,0],[42,1],[52,0],[52,1],[57,0],[57,1],[61,0],[61,1],[78,0],[78,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
        this.$ = ($$[$0] === 'this')
            ? yy.Node('ThisExpression', yy.loc(_$[$0]))
            : yy.Node('Identifier', parseIdentifierName($$[$0]), yy.loc(_$[$0]));
    
break;
case 2: this.$ = []; 
break;
case 3:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 4: this.$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(this._$)), [yy.Node('Literal', $$[$0], yy.loc(this._$))], yy.loc(this._$)); 
break;
case 5:
        var name = $$[$0].slice(1);
        if (name === '') name = '1';
        if (name === '&') name = 'rest';
        var anonArgNum = (name === 'rest') ? 0 : Number(name);
        name = '__$' + name;
        this.$ = yy.Node('Identifier', name, yy.loc(_$[$0]));
        this.$.anonArg = true;
        this.$.anonArgNum = anonArgNum;
    
break;
case 6: this.$ = parseNumLiteral('Integer', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 7: this.$ = parseNumLiteral('Float', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 8: this.$ = parseLiteral('String', parseString($$[$0]), yy.loc(_$[$0]), yy.raw[yy.raw.length-1], yy); 
break;
case 9: this.$ = parseLiteral('Boolean', true, yy.loc(_$[$0]), yytext, yy); 
break;
case 10: this.$ = parseLiteral('Boolean', false, yy.loc(_$[$0]), yytext, yy); 
break;
case 11: this.$ = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy); 
break;
case 15: this.$ = parseCollectionLiteral('vector', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 16: this.$ = parseCollectionLiteral('list', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 17: this.$ = parseCollectionLiteral('hash-map', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 18: this.$ = parseCollectionLiteral('hash-set', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 22: this.$ = $$[$0-1]; 
break;
case 27: this.$ = []; 
break;
case 28:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 29: this.$ = { fixed: $$[$0], rest: null }; 
break;
case 30:
        if ($$[$0].keys && $$[$0].ids) {
            throw new Error('Rest args cannot be destructured by a hash map');
        }
        this.$ = { fixed: $$[$0-2], rest: $$[$0] };
    
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = { keys: [], ids: [] }; 
break;
case 33:
        $$[$0-1].destrucId = $$[$0];
        this.$ = $$[$0-1];
    
break;
case 34:
        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('CallExpression',
                yy.Node('Identifier', 'keyword', id.loc),
                [yy.Node('Literal', id.name, id.loc)], id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 35:
        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('Literal', id.name, id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 36:
        $$[$0-2].ids.push($$[$0-1]);
        $$[$0-2].keys.push($$[$0]);
        this.$ = $$[$0-2];
    
break;
case 37:
        this.$ = $$[$0-2];
        this.$.destrucId = getValueIfUndefined($$[$0-1], yy.Node('Identifier', null, yy.loc(_$[$0-3])));
    
break;
case 38:
        this.$ = $$[$0-1];
        this.$.destrucId = getValueIfUndefined(this.$.destrucId, yy.Node('Identifier', null, yy.loc(_$[$0-2])));
    
break;
case 39:
        var processed = processSeqDestrucForm($$[$0-2], yy);
        var ids = processed.ids;
        $$[$0].body = processed.stmts.concat($$[$0].body);

        var hasRecurForm = processRecurFormIfAny($$[$0], ids, yy);
        if (hasRecurForm) {
            var blockLoc = $$[$0].loc;
            $$[$0] = yy.Node('BlockStatement', [
                yy.Node('WhileStatement', yy.Node('Literal', true, blockLoc),
                    $$[$0], blockLoc)], blockLoc);
        }

        var arityCheck = createArityCheckStmt(ids.length, $$[$0-2].rest, yy.loc(_$[$0-2]), yy);
        $$[$0].body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, ids, null,
            $$[$0], false, false, yy.loc(_$[$0]));
    
break;
case 40: this.$ = $$[$0]; 
break;
case 41: this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(_$[$0-2]), yy); 
break;
case 42:
        var body = $$[$0-1], bodyLoc = _$[$0-1];
        var maxArgNum = 0;
        var hasRestArg = false;
        estraverse.traverse(body, {
            enter: function (node) {
                if (node.type === 'Identifier' && node.anonArg) {
                    if (node.anonArgNum === 0)   // 0 denotes rest arg
                        hasRestArg = true;
                    else if (node.anonArgNum > maxArgNum)
                        maxArgNum = node.anonArgNum;
                    delete node.anonArg;
                    delete node.anonArgNum;
                }
            }
        });
        var args = [];
        for (var i = 1; i <= maxArgNum; ++i) {
            args.push(yy.Node('Identifier', '__$' + i, yy.loc(_$[$0-1])));
        }
        body = wrapInExpressionStatement(body, yy);
        body = yy.Node('BlockStatement', [body], yy.loc(bodyLoc));
        createReturnStatementIfPossible(body, yy);
        if (hasRestArg) {
            var restId = yy.Node('Identifier', '__$rest', yy.loc(bodyLoc));
            var restDecl = createRestArgsDecl(restId, null, maxArgNum, yy.loc(bodyLoc), yy);
            body.body.unshift(restDecl);
        }

        var arityCheck = createArityCheckStmt(maxArgNum, hasRestArg, yy.loc(_$[$0-3]), yy);
        body.body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, args, null, body,
            false, false, yy.loc(_$[$0-3]));
    
break;
case 43:
        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-3]));
        // for code like ((if true +) 1 2 3)
        if (this.$.consequent.type === 'ExpressionStatement' &&
            (this.$.alternate === null || this.$.alternate.type === 'ExpressionStatement')) {
            this.$.type = 'ConditionalExpression';
            this.$.consequent = this.$.consequent.expression;
            if (this.$.alternate === null)
                this.$.alternate = yy.Node('Literal', null, yy.loc(_$[$0-3]));
            else
                this.$.alternate = this.$.alternate.expression;
        }
    
break;
case 44:
        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null, yy.loc(_$[$0-2]));
    
break;
case 45:
        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', true, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('&&', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 46:
        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', null, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('||', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 47: this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(this._$), yy); 
break;
case 48:
        var processed = processDestrucForm({ fixed: [$$[$0-1]], rest: null }, yy);
        this.$ = {
            decl: yy.Node('VariableDeclarator', processed.ids[0], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-1])),
            stmts: processed.stmts
        };
    
break;
case 49:
        var decl = yy.Node('VariableDeclaration', 'var', [$$[$0].decl], yy.loc(_$[$0]));
        $$[$0-1].push({ decl: decl, stmts: $$[$0].stmts });
        this.$ = $$[$0-1];
    
break;
case 50: this.$ = []; 
break;
case 51:
        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body = body.concat([letBinding.decl]).concat(letBinding.stmts);
        }
        body = body.concat($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);
    
break;
case 52: this.$ = yy.Node('AssignmentExpression', '=', $$[$0-1], $$[$0], yy.loc(_$[$0-2])); 
break;
case 53:
        var lhs = yy.Node('MemberExpression', $$[$0-2],
            yy.Node('Identifier', $$[$0-3], yy.loc(_$[$0-3])),
            false, yy.loc(_$[$0-4]));
        this.$ = yy.Node('AssignmentExpression', '=', lhs, $$[$0], yy.loc(_$[$0-6]));
    
break;
case 54:
        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body.push(letBinding.decl);
            $$[$0].body = letBinding.stmts.concat($$[$0].body);
        }

        body.push($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);

        var blockBody = this.$.callee.object.body.body, whileBlock, whileBlockIdx, stmt;
        for (var i = 0, len = blockBody.length; i < len; ++i) {
            stmt = blockBody[i];
            if (stmt.type === 'BlockStatement') {
                whileBlockIdx = i;
                whileBlock = stmt;
            }
        }

        var actualArgs = [];
        for (var i = 0, len = $$[$0-2].length; i < len; ++i) {
            actualArgs.push($$[$0-2][i].decl.declarations[0].id);
        }

        processRecurFormIfAny(whileBlock, actualArgs, yy);

        var whileBody = whileBlock.body;
        var lastLoc = (whileBody.length > 0) ? (whileBody[whileBody.length-1].loc) : whileBlock.loc;
        whileBody.push(yy.Node('BreakStatement', null, lastLoc));
        blockBody[whileBlockIdx] = yy.Node('WhileStatement', yy.Node('Literal', true, yy.loc(_$[$0])),
            whileBlock, yy.loc(_$[$0]));
    
break;
case 55:
        $$[$0] = getValueIfUndefined($$[$0], []);
        var body = [], id, assignment, arg;
        for (var i = 0; i < $$[$0].length; ++i) {
            arg = $$[$0][i];
            id = yy.Node('Identifier', '__$recur' + i, arg.loc);
            id.recurArg = true;
            id.recurArgIdx = i;
            assignment = yy.Node('AssignmentExpression', '=', id, arg, arg.loc);
            body.push(wrapInExpressionStatement(assignment, yy));
        }
        this.$ = yy.Node('BlockStatement', body, yy.loc(_$[$0-1]));
        this.$.recurBlock = true;
    
break;
case 56:
        var init = parseVarDecl($$[$0-3],
            parseNumLiteral('Integer', '0', yy.loc(_$[$0-3]), yy),
            yy.loc(_$[$0-3]), yy);
        var maxId = yy.Node('Identifier', '__$max' + dotimesIdx++, yy.loc(_$[$0-2]));
        addVarDecl(init, maxId, $$[$0-2], yy.loc(_$[$0-2]), yy);
        var test = yy.Node('BinaryExpression', '<', $$[$0-3], maxId, yy.loc(_$[$0-3]));
        var update = yy.Node('UpdateExpression', '++', $$[$0-3], true, yy.loc(_$[$0-3]));
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 57:
        var idLoc = yy.loc(_$[$0-3]), sexprLoc = yy.loc(_$[$0-2]);
        var seqId = yy.Node('Identifier', '__$doseqSeq' + doseqIdx++, sexprLoc);
        var init = parseVarDecl(seqId, $$[$0-2], sexprLoc, yy);
        addVarDecl(init, $$[$0-3],
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc, yy);
        var test = yy.Node('BinaryExpression', '!==', $$[$0-3],
            yy.Node('Literal', null, idLoc), idLoc);
        var seqUpdate = yy.Node('AssignmentExpression', '=', seqId,
            yy.Node('CallExpression', yy.Node('Identifier', 'rest', sexprLoc),
                [seqId], sexprLoc), sexprLoc);
        var idUpdate = yy.Node('AssignmentExpression', '=', $$[$0-3],
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc);
        var update = yy.Node('SequenceExpression', [seqUpdate, idUpdate], idLoc);
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 58:
        var whileLoop = yy.Node('WhileStatement', $$[$0-1], $$[$0], yy.loc(_$[$0-2]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([whileLoop], yy.loc(_$[$0-2]), yy);
        this.$ = whileLoop;
    
break;
case 59:
        $$[$0] = getValueIfUndefined($$[$0], []);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Literal', $$[$0-2], yy.loc(_$[$0-2])),
            true, yy.loc(_$[$0-3]));
        var fnCall = yy.Node('CallExpression', callee, $$[$0], yy.loc(_$[$0-3]));
        if ($$[$0].length > 0) {
            this.$ = fnCall;
        } else {
            // (.prop obj) can either be a call to a 0-argument fn, or a property access.
            // if both are possible, the function call is chosen. This is as per Clojure.
            // see http://clojure.org/java_interop#Java%20Interop-The%20Dot%20special%20form
            // (typeof obj['prop'] === 'function' && obj['prop'].length === 0) ? obj['prop']() : obj['prop'];
            this.$ = yy.Node('ConditionalExpression',
                yy.Node('LogicalExpression', '&&',
                    yy.Node('BinaryExpression', '===',
                        yy.Node('UnaryExpression', 'typeof', callee, true, yy.loc(_$[$0-3])),
                        yy.Node('Literal', 'function', yy.loc(_$[$0-3])), yy.loc(_$[$0-3])),
                    yy.Node('BinaryExpression', '===',
                        yy.Node('MemberExpression', callee,
                            yy.Node('Identifier', 'length', yy.loc(_$[$0-3])),
                            false, yy.loc(_$[$0-3])),
                        yy.Node('Literal', 0, yy.loc(_$[$0-3])), yy.loc(_$[$0-3])),
                    yy.loc(_$[$0-3])),
                fnCall, callee, yy.loc(_$[$0-3]));
        }
    
break;
case 60:
        this.$ = yy.Node('NewExpression', $$[$0-1], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-2]));
    
break;
case 61:
        this.$ = yy.Node('NewExpression', $$[$0-2], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-2]));
    
break;
case 62: this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 76:
        yy.locComb(this._$, _$[$0]);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Identifier', 'call', yy.loc(_$[$0-1])),
            false, yy.loc(_$[$0-1]));
        $$[$0] = getValueIfUndefined($$[$0], []);
        $$[$0].unshift(yy.Node('ThisExpression', yy.loc(_$[$0-1])));
        this.$ = yy.Node('CallExpression', callee, $$[$0], yy.loc(this._$));
    
break;
case 77: this.$ = wrapInIIFE($$[$0], yy.loc(_$[$0-1]), yy); 
break;
case 78: this.$ = $$[$0]; 
break;
case 79: this.$ = $$[$0]; 
break;
case 80: this.$ = $$[$0-1]; 
break;
case 82: this.$ = wrapInExpressionStatement($$[$0], yy); 
break;
case 83: this.$ = []; 
break;
case 84: this.$ = $$[$0-2]; $$[$0-2].push($$[$0-1], $$[$0]); 
break;
case 85: this.$ = [$$[$0]]; 
break;
case 86:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 87:
        for (var i = 0, len = $$[$0].length; i < len; ++i) {
            $$[$0][i] = wrapInExpressionStatement($$[$0][i], yy);
        }
    
break;
case 89:
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 90:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 91:
        this.$ = createReturnStatementIfPossible($$[$0], yy);
    
break;
case 92:
        var prog = yy.Node('Program', $$[$0-1], yy.loc(_$[$0-1]));
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
case 93:
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
            range: [0, 0]
        });
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
}
},
table: [{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,92:4,93:2,94:1,95:[1,3]},{1:[3]},{95:[1,26]},{1:[2,93]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,87],24:[1,21],27:[1,22],30:9,41:27,95:[2,87]},{4:[2,85],7:[2,85],9:[2,85],11:[2,85],12:[2,85],13:[2,85],14:[2,85],15:[2,85],16:[2,85],18:[2,85],20:[2,85],21:[2,85],22:[2,85],23:[2,85],24:[2,85],26:[2,85],27:[2,85],95:[2,85]},{4:[2,78],7:[2,78],9:[2,78],11:[2,78],12:[2,78],13:[2,78],14:[2,78],15:[2,78],16:[2,78],18:[2,78],20:[2,78],21:[2,78],22:[2,78],23:[2,78],24:[2,78],26:[2,78],27:[2,78],37:[2,78],39:[2,78],40:[2,78],95:[2,78]},{4:[2,79],7:[2,79],9:[2,79],11:[2,79],12:[2,79],13:[2,79],14:[2,79],15:[2,79],16:[2,79],18:[2,79],20:[2,79],21:[2,79],22:[2,79],23:[2,79],24:[2,79],26:[2,79],27:[2,79],37:[2,79],39:[2,79],40:[2,79],95:[2,79]},{3:60,4:[1,24],6:62,7:[1,23],8:65,9:[1,25],17:61,18:[1,19],21:[1,20],22:[1,63],23:[2,62],24:[1,21],27:[1,22],28:42,29:28,30:64,45:29,46:[1,44],47:[1,45],48:30,49:[1,46],53:[1,47],55:31,56:[1,48],58:[1,49],59:32,60:[1,50],64:33,65:[1,51],67:34,68:[1,52],69:[1,58],73:35,74:[1,53],76:36,77:[1,54],79:37,80:[1,55],81:38,82:[1,56],83:39,84:[1,57],85:40,86:41,87:[1,59],89:[1,43]},{4:[2,81],7:[2,81],9:[2,81],11:[2,81],12:[2,81],13:[2,81],14:[2,81],15:[2,81],16:[2,81],18:[2,81],20:[2,81],21:[2,81],22:[2,81],23:[2,81],24:[2,81],26:[2,81],27:[2,81],37:[2,81],39:[2,81],40:[2,81],95:[2,81]},{4:[2,6],7:[2,6],9:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],18:[2,6],20:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],26:[2,6],27:[2,6],37:[2,6],39:[2,6],40:[2,6],95:[2,6]},{4:[2,7],7:[2,7],9:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],18:[2,7],20:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],26:[2,7],27:[2,7],37:[2,7],39:[2,7],40:[2,7],95:[2,7]},{4:[2,8],7:[2,8],9:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],18:[2,8],20:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],26:[2,8],27:[2,8],37:[2,8],39:[2,8],40:[2,8],95:[2,8]},{4:[2,9],7:[2,9],9:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],18:[2,9],20:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],26:[2,9],27:[2,9],37:[2,9],39:[2,9],40:[2,9],95:[2,9]},{4:[2,10],7:[2,10],9:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],18:[2,10],20:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],26:[2,10],27:[2,10],37:[2,10],39:[2,10],40:[2,10],95:[2,10]},{4:[2,11],7:[2,11],9:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11],20:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],26:[2,11],27:[2,11],37:[2,11],39:[2,11],40:[2,11],95:[2,11]},{4:[2,12],7:[2,12],9:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12],20:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],26:[2,12],27:[2,12],37:[2,12],39:[2,12],40:[2,12],95:[2,12]},{4:[2,13],7:[2,13],9:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13],20:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],26:[2,13],27:[2,13],37:[2,13],39:[2,13],40:[2,13],95:[2,13]},{4:[2,14],7:[2,14],9:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14],20:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],26:[2,14],27:[2,14],37:[2,14],39:[2,14],40:[2,14],95:[2,14]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:66,20:[2,94],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,92:67},{22:[1,68]},{4:[2,83],7:[2,83],9:[2,83],11:[2,83],12:[2,83],13:[2,83],14:[2,83],15:[2,83],16:[2,83],18:[2,83],21:[2,83],22:[2,83],24:[2,83],26:[2,83],27:[2,83],91:69},{22:[1,71],24:[1,70]},{4:[1,72]},{4:[2,1],7:[2,1],9:[2,1],11:[2,1],12:[2,1],13:[2,1],14:[2,1],15:[2,1],16:[2,1],18:[2,1],20:[2,1],21:[2,1],22:[2,1],23:[2,1],24:[2,1],26:[2,1],27:[2,1],35:[2,1],37:[2,1],39:[2,1],40:[2,1],69:[2,1],95:[2,1]},{4:[2,5],7:[2,5],9:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],18:[2,5],20:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],26:[2,5],27:[2,5],37:[2,5],39:[2,5],40:[2,5],95:[2,5]},{1:[2,92]},{4:[2,86],7:[2,86],9:[2,86],11:[2,86],12:[2,86],13:[2,86],14:[2,86],15:[2,86],16:[2,86],18:[2,86],20:[2,86],21:[2,86],22:[2,86],23:[2,86],24:[2,86],26:[2,86],27:[2,86],95:[2,86]},{23:[1,73]},{23:[2,63]},{23:[2,64]},{23:[2,65]},{23:[2,66]},{23:[2,67]},{23:[2,68]},{23:[2,69]},{23:[2,70]},{23:[2,71]},{23:[2,72]},{23:[2,73]},{23:[2,74]},{23:[2,75]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,104],24:[1,21],27:[1,22],30:9,41:5,78:74,92:75},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:76,92:4,93:77},{18:[1,79],43:78},{3:80,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:81},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:82},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,100],24:[1,21],27:[1,22],30:9,41:5,57:83,92:84},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,100],24:[1,21],27:[1,22],30:9,41:5,57:85,92:84},{3:86,4:[1,24]},{18:[1,87]},{3:88,4:[1,24],22:[1,89]},{18:[1,90]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,104],24:[1,21],27:[1,22],30:9,41:5,78:91,92:75},{18:[1,92]},{18:[1,93]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:94},{4:[1,95]},{3:96,4:[1,24]},{4:[2,19],7:[2,19],9:[2,19],11:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],18:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],27:[2,19],69:[1,97]},{4:[2,20],7:[2,20],9:[2,20],11:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],18:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],27:[2,20]},{4:[2,21],7:[2,21],9:[2,21],11:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],18:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],27:[2,21]},{3:60,4:[1,24],6:62,7:[1,23],8:65,9:[1,25],17:61,18:[1,19],21:[1,20],22:[1,63],23:[2,62],24:[1,21],27:[1,22],28:42,29:98,30:64,45:29,46:[1,44],47:[1,45],48:30,49:[1,46],53:[1,47],55:31,56:[1,48],58:[1,49],59:32,60:[1,50],64:33,65:[1,51],67:34,68:[1,52],69:[1,58],73:35,74:[1,53],76:36,77:[1,54],79:37,80:[1,55],81:38,82:[1,56],83:39,84:[1,57],85:40,86:41,87:[1,59],89:[1,43]},{4:[2,23],7:[2,23],9:[2,23],11:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],18:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],27:[2,23]},{4:[2,24],7:[2,24],9:[2,24],11:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],18:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],27:[2,24]},{20:[1,99]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],20:[2,95],21:[1,20],22:[1,8],23:[2,95],24:[1,21],26:[2,95],27:[1,22],30:9,41:27},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:100,21:[1,20],22:[1,8],23:[2,94],24:[1,21],27:[1,22],30:9,41:5,92:67},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],26:[1,101],27:[1,22],30:9,41:102},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:103,21:[1,20],22:[1,8],24:[1,21],26:[2,94],27:[1,22],30:9,41:5,92:67},{3:60,4:[1,24],6:62,7:[1,23],8:65,9:[1,25],17:61,18:[1,19],21:[1,20],22:[1,63],23:[2,62],24:[1,21],27:[1,22],28:42,29:104,30:64,45:29,46:[1,44],47:[1,45],48:30,49:[1,46],53:[1,47],55:31,56:[1,48],58:[1,49],59:32,60:[1,50],64:33,65:[1,51],67:34,68:[1,52],69:[1,58],73:35,74:[1,53],76:36,77:[1,54],79:37,80:[1,55],81:38,82:[1,56],83:39,84:[1,57],85:40,86:41,87:[1,59],89:[1,43]},{4:[2,4],7:[2,4],9:[2,4],11:[2,4],12:[2,4],13:[2,4],14:[2,4],15:[2,4],16:[2,4],18:[2,4],20:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],26:[2,4],27:[2,4],37:[2,4],39:[2,4],40:[2,4],95:[2,4]},{4:[2,80],7:[2,80],9:[2,80],11:[2,80],12:[2,80],13:[2,80],14:[2,80],15:[2,80],16:[2,80],18:[2,80],20:[2,80],21:[2,80],22:[2,80],23:[2,80],24:[2,80],26:[2,80],27:[2,80],37:[2,80],39:[2,80],40:[2,80],95:[2,80]},{23:[2,76]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,105],24:[1,21],27:[1,22],30:9,41:27},{23:[2,77]},{23:[2,88]},{23:[2,40]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:106,34:105,35:[2,27]},{18:[1,79],43:107},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:109,90:108},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:111,75:110,92:4,93:77},{23:[2,45]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,101],24:[1,21],27:[1,22],30:9,41:27},{23:[2,46]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,102],24:[1,21],27:[1,22],30:9,41:113,61:112},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:114},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:115},{69:[1,116]},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:117},{23:[2,55]},{3:118,4:[1,24]},{3:119,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:111,75:120,92:4,93:77},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:121},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,104],24:[1,21],27:[1,22],30:9,41:5,78:122,92:75},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,104],24:[1,21],27:[1,22],30:9,41:5,78:123,92:75},{23:[1,124]},{4:[2,15],7:[2,15],9:[2,15],11:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],18:[2,15],20:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],26:[2,15],27:[2,15],37:[2,15],39:[2,15],40:[2,15],95:[2,15]},{23:[1,125]},{4:[2,17],7:[2,17],9:[2,17],11:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],18:[2,17],20:[2,17],21:[2,17],22:[2,17],23:[2,17],24:[2,17],26:[2,17],27:[2,17],37:[2,17],39:[2,17],40:[2,17],95:[2,17]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:126},{26:[1,127]},{23:[1,128]},{20:[1,129]},{3:132,4:[1,24],18:[1,134],20:[2,29],24:[1,135],31:131,32:133,35:[1,130],37:[2,29]},{23:[2,41]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,98],24:[1,21],27:[1,22],30:9,41:109,52:136,90:137},{4:[2,82],7:[2,82],9:[2,82],11:[2,82],12:[2,82],13:[2,82],14:[2,82],15:[2,82],16:[2,82],18:[2,82],21:[2,82],22:[2,82],23:[2,82],24:[2,82],27:[2,82]},{23:[2,44]},{23:[2,90]},{23:[2,47]},{23:[2,103]},{3:132,4:[1,24],18:[1,134],20:[1,138],24:[1,135],31:140,32:133,62:139},{23:[2,52]},{4:[1,141]},{3:132,4:[1,24],18:[1,134],20:[1,142],24:[1,135],31:140,32:133,62:139},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:143},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:144},{23:[2,58]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,104],24:[1,21],27:[1,22],30:9,41:5,78:145,92:75},{23:[2,60]},{23:[2,61]},{4:[2,22],7:[2,22],9:[2,22],11:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],18:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],27:[2,22]},{4:[2,16],7:[2,16],9:[2,16],11:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],18:[2,16],20:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],26:[2,16],27:[2,16],37:[2,16],39:[2,16],40:[2,16],95:[2,16]},{4:[2,84],7:[2,84],9:[2,84],11:[2,84],12:[2,84],13:[2,84],14:[2,84],15:[2,84],16:[2,84],18:[2,84],21:[2,84],22:[2,84],24:[2,84],26:[2,84],27:[2,84]},{4:[2,18],7:[2,18],9:[2,18],11:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],18:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],26:[2,18],27:[2,18],37:[2,18],39:[2,18],40:[2,18],95:[2,18]},{4:[2,42],7:[2,42],9:[2,42],11:[2,42],12:[2,42],13:[2,42],14:[2,42],15:[2,42],16:[2,42],18:[2,42],20:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],26:[2,42],27:[2,42],37:[2,42],39:[2,42],40:[2,42],95:[2,42]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,44:146,66:111,75:147,92:4,93:77},{3:132,4:[1,24],18:[1,134],24:[1,135],31:148,32:133},{4:[2,28],18:[2,28],20:[2,28],24:[2,28],35:[2,28],37:[2,28]},{4:[2,25],7:[2,25],9:[2,25],11:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],18:[2,25],20:[2,25],21:[2,25],22:[2,25],24:[2,25],27:[2,25],35:[2,25],37:[2,25]},{4:[2,26],7:[2,26],9:[2,26],11:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],18:[2,26],20:[2,26],21:[2,26],22:[2,26],24:[2,26],27:[2,26],35:[2,26],37:[2,26]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:106,34:149,35:[2,27],37:[2,27]},{4:[2,32],18:[2,32],24:[2,32],26:[2,32],37:[2,32],38:150,39:[2,32],40:[2,32]},{23:[2,43]},{23:[2,99]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:151,92:4,93:77},{4:[2,49],18:[2,49],20:[2,49],24:[2,49]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:152},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:153},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:111,75:154,92:4,93:77},{20:[1,155]},{20:[1,156]},{23:[2,59]},{23:[2,39]},{23:[2,91]},{20:[2,30],37:[2,30]},{20:[2,96],36:158,37:[1,159],42:157},{3:132,4:[1,24],18:[1,134],24:[1,135],26:[1,160],31:164,32:133,36:161,37:[1,159],39:[1,162],40:[1,163]},{23:[2,51]},{4:[2,48],18:[2,48],20:[2,48],24:[2,48]},{23:[1,165]},{23:[2,54]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:111,75:166,92:4,93:77},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,89],24:[1,21],27:[1,22],30:9,41:5,66:111,75:167,92:4,93:77},{20:[1,168]},{20:[2,97]},{3:169,4:[1,24]},{4:[2,38],7:[2,38],9:[2,38],11:[2,38],12:[2,38],13:[2,38],14:[2,38],15:[2,38],16:[2,38],18:[2,38],20:[2,38],21:[2,38],22:[2,38],24:[2,38],27:[2,38],35:[2,38],37:[2,38]},{4:[2,33],18:[2,33],24:[2,33],26:[2,33],37:[2,33],39:[2,33],40:[2,33]},{18:[1,170]},{18:[1,171]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:172},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:173},{23:[2,56]},{23:[2,57]},{4:[2,37],7:[2,37],9:[2,37],11:[2,37],12:[2,37],13:[2,37],14:[2,37],15:[2,37],16:[2,37],18:[2,37],20:[2,37],21:[2,37],22:[2,37],24:[2,37],27:[2,37],35:[2,37],37:[2,37]},{4:[2,31],18:[2,31],20:[2,31],24:[2,31],26:[2,31],37:[2,31],39:[2,31],40:[2,31]},{4:[2,2],5:174,20:[2,2]},{4:[2,2],5:175,20:[2,2]},{4:[2,36],18:[2,36],24:[2,36],26:[2,36],37:[2,36],39:[2,36],40:[2,36]},{23:[2,53]},{3:177,4:[1,24],20:[1,176]},{3:177,4:[1,24],20:[1,178]},{4:[2,34],18:[2,34],24:[2,34],26:[2,34],37:[2,34],39:[2,34],40:[2,34]},{4:[2,3],20:[2,3]},{4:[2,35],18:[2,35],24:[2,35],26:[2,35],37:[2,35],39:[2,35],40:[2,35]}],
defaultActions: {3:[2,93],26:[2,92],29:[2,63],30:[2,64],31:[2,65],32:[2,66],33:[2,67],34:[2,68],35:[2,69],36:[2,70],37:[2,71],38:[2,72],39:[2,73],40:[2,74],41:[2,75],74:[2,76],76:[2,77],77:[2,88],78:[2,40],83:[2,45],85:[2,46],91:[2,55],107:[2,41],110:[2,44],111:[2,90],112:[2,47],113:[2,103],115:[2,52],120:[2,58],122:[2,60],123:[2,61],136:[2,43],137:[2,99],145:[2,59],146:[2,39],147:[2,91],151:[2,51],154:[2,54],158:[2,97],166:[2,56],167:[2,57],173:[2,53]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


var estraverse = require('estraverse');

var expressionTypes = ['ThisExpression', 'ArrayExpression', 'ObjectExpression',
    'FunctionExpression', 'ArrowExpression', 'SequenceExpression', 'Identifier',
    'UnaryExpression', 'BinaryExpression', 'AssignmentExpression', 'Literal',
    'UpdateExpression', 'LogicalExpression', 'ConditionalExpression',
    'NewExpression', 'CallExpression', 'MemberExpression'];

// indices for generated identifiers
var destrucArgIdx, doseqIdx, dotimesIdx;
function resetGeneratedIds() {
    destrucArgIdx = doseqIdx = dotimesIdx = 0;
}

function processSeqDestrucForm(args, yy) {
    var i, len, arg;
    var fixed = args.fixed, rest = args.rest;
    var ids = [], stmts = [];
    for (i = 0, len = fixed.length; i < len; ++i) {
        arg = fixed[i];
        if (arg.type && arg.type === 'Identifier') {
            ids.push(arg);
        } else if (! arg.type) {
            arg.destrucId.name = arg.destrucId.name || '__$destruc' + destrucArgIdx++;
            ids.push(arg.destrucId);
            stmts = processChildDestrucForm(arg, stmts, yy);
        }
    }

    if (rest) {
        if (rest.type && rest.type === 'Identifier') {
            decl = createRestArgsDecl(rest, args.destrucId, fixed.length, rest.loc, yy);
            stmts.push(decl);
        } else if (! rest.type) {
            rest.destrucId.name = rest.destrucId.name || '__$destruc' + destrucArgIdx++;
            decl = createRestArgsDecl(rest.destrucId, args.destrucId, fixed.length, rest.destrucId.loc, yy);
            stmts.push(decl);
            stmts = processChildDestrucForm(rest, stmts, yy);
        }
    }

    return { ids: ids, pairs: [], stmts: stmts };
}

function processMapDestrucForm(args, yy) {
    var keys = args.keys, valIds = args.ids, key, id;
    var pairs = [], stmts = [];
    var decl, init, yyloc;
    for (var i = 0, len = valIds.length; i < len; ++i) {
        id = valIds[i], key = keys[i];
        if (id.type && id.type === 'Identifier') {
            yyloc = id.loc;
            init = yy.Node('CallExpression',
                yy.Node('Identifier', 'get', yyloc),
                [args.destrucId, key], yyloc);
            decl = parseVarDecl(id, init, yyloc, yy);
            stmts.push(decl);
        } else if (! id.type) {
            id.destrucId.name = id.destrucId.name || '__$destruc' + destrucArgIdx++;
            pairs.push({ id: id.destrucId, key: key });
            stmts = processChildDestrucForm(id, stmts, yy);
        }
    }
    return { ids: [], pairs: pairs, stmts: stmts };
}

function processDestrucForm(args, yy) {
    if (args.fixed !== undefined && args.rest !== undefined) {
        return processSeqDestrucForm(args, yy);
    } else if (args.keys !== undefined && args.ids !== undefined) {
        return processMapDestrucForm(args, yy);
    }
}

function processChildDestrucForm(arg, stmts, yy) {
    var i, len, processed = processDestrucForm(arg, yy);
    var processedId, processedKey, yyloc, init, decl, nilDecl, tryStmt, catchClause, errorId;
    for (i = 0, len = processed.ids.length; i < len; ++i) {
        processedId = processed.ids[i];
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'nth', yyloc),
            [arg.destrucId, yy.Node('Literal', i, yyloc)],
            yyloc);

        decl = parseVarDecl(processedId, init, processedId.loc, yy);
        nilDecl = parseVarDecl(processedId, yy.Node('Literal', null, yyloc), processedId.loc, yy);

        errorId = yy.Node('Identifier', '__$error', yyloc);
        catchClause = yy.Node('CatchClause', errorId, null,
            yy.Node('BlockStatement', [
                yy.Node('IfStatement',
                    yy.Node('BinaryExpression', '!==',
                        yy.Node('MemberExpression', errorId,
                            yy.Node('Identifier', 'name', yyloc), false, yyloc),
                        yy.Node('Literal', 'IndexOutOfBoundsError', yyloc),
                        yyloc),
                    yy.Node('ThrowStatement', errorId, yyloc),
                    null, yyloc),
                wrapInExpressionStatement(
                    yy.Node('AssignmentExpression', '=', processedId,
                        yy.Node('Literal', null, yyloc), yyloc),
                    yy)],
                yyloc),
            yyloc);

        tryStmt = yy.Node('TryStatement',
            yy.Node('BlockStatement', [decl], yyloc),
            [catchClause], null, yyloc);

        stmts.push(tryStmt);
    }
    for (i = 0, len = processed.pairs.length; i < len; ++i) {
        processedId = processed.pairs[i].id, processedKey = processed.pairs[i].key;
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'get', yyloc),
            [arg.destrucId, processedKey], yyloc);
        decl = parseVarDecl(processedId, init, yyloc, yy);
        stmts.push(decl);
    }
    return stmts.concat(processed.stmts);
}

function processRecurFormIfAny(rootNode, actualArgs, yy) {
    var hasRecurForm = false;
    estraverse.traverse(rootNode, {
        enter: function (node) {
            if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
                return estraverse.VisitorOption.Skip;
            } else if (node.type === 'BlockStatement' && node.recurBlock) {
                hasRecurForm = true;
                var body = node.body;

                // get rid of return statement
                var lastStmt = body.length > 0 ? body[body.length-1] : null;
                if (lastStmt && lastStmt.type === 'ReturnStatement') {
                    lastStmt.type = 'ExpressionStatement';
                    lastStmt.expression = lastStmt.argument;
                    delete lastStmt.argument;
                }

                estraverse.traverse(node, {
                    enter: function (innerNode) {
                        if (innerNode.type === 'Identifier' && innerNode.recurArg) {
                            var actualArg = actualArgs[innerNode.recurArgIdx];
                            body.push(wrapInExpressionStatement(yy.Node('AssignmentExpression', '=', actualArg, innerNode, innerNode.loc), yy));
                            delete innerNode.recurArg;
                            delete innerNode.recurArgIdx;
                        }
                    }
                });

                var lastLoc = (body.length > 0) ? (body[body.length-1].loc) : body.loc;
                body.push(yy.Node('ContinueStatement', null, lastLoc));
                delete node.recurBlock;
            }
        }
    });
    return hasRecurForm;
}

// wrap the given array of statements in an IIFE (Immediately-Invoked Function Expression)
function wrapInIIFE(body, yyloc, yy) {
    var thisExp = yy.Node('ThisExpression', yyloc);
    return yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('FunctionExpression',
                null, [], null,
                createReturnStatementIfPossible(yy.Node('BlockStatement', body, yyloc), yy),
                false, false, yyloc),
            yy.Node('Identifier', 'call', yyloc), false, yyloc),
        [yy.Node('ConditionalExpression',
            yy.Node('BinaryExpression', '!==',
                yy.Node('UnaryExpression', 'typeof', thisExp, true, yyloc),
                yy.Node('Literal', 'undefined', yyloc), yyloc),
            thisExp,
            yy.Node('Literal', null, yyloc), yyloc)],
        yyloc);
}

function wrapInExpressionStatement(expr, yy) {
    if (expressionTypes.indexOf(expr.type) !== -1) {
        return yy.Node('ExpressionStatement', expr, expr.loc);
    }
    return expr;
}

function createArityCheckStmt(minArity, hasRestArgs, yyloc, yy) {
    var arityCheckArgs = [yy.Node('Literal', minArity, yyloc)];
    if (hasRestArgs) {
        arityCheckArgs.push(yy.Node('Identifier', 'Infinity', yyloc));
    }
    arityCheckArgs.push(yy.Node('MemberExpression',
        yy.Node('Identifier', 'arguments', yyloc),
        yy.Node('Identifier', 'length', yyloc), false, yyloc));
    var arityCheck = yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('Identifier', 'assertions', yyloc),
            yy.Node('Identifier', 'arity', yyloc),
            false, yyloc),
        arityCheckArgs, yyloc);
    return wrapInExpressionStatement(arityCheck, yy);
}

function createReturnStatementIfPossible(stmt, yy) {
    if (stmt === undefined || stmt === null || ! stmt.type)
        return stmt;
    var lastStmts = [], lastStmt;
    if (stmt.type === 'BlockStatement') {
        lastStmts.push(stmt.body[stmt.body.length - 1]);
    } else if (stmt.type === 'IfStatement') {
        lastStmts.push(stmt.consequent);
        if (stmt.alternate === null) {
            stmt.alternate = wrapInExpressionStatement(yy.Node('Literal', null, stmt.consequent.loc), yy);
        }
        lastStmts.push(stmt.alternate);
    } else {
        return stmt;
    }
    for (var i = 0; i < lastStmts.length; ++i) {
        lastStmt = lastStmts[i];
        if (! lastStmt) continue;
        if (lastStmt.type === 'ExpressionStatement') {
            lastStmt.type = 'ReturnStatement';
            lastStmt.argument = lastStmt.expression;
            delete lastStmt.expression;
        } else {
            createReturnStatementIfPossible(lastStmt, yy);
        }
    }
    return stmt;
}

function createRestArgsDecl(id, argsId, offset, yyloc, yy) {
    var restInit;
    if (! argsId) {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'seq', yyloc),
            [yy.Node('CallExpression',
                yy.Node('MemberExpression',
                    yy.Node('MemberExpression',
                        yy.Node('MemberExpression',
                            yy.Node('Identifier', 'Array', yyloc),
                            yy.Node('Identifier', 'prototype', yyloc), false, yyloc),
                        yy.Node('Identifier', 'slice', yyloc), false, yyloc),
                    yy.Node('Identifier', 'call', yyloc), false, yyloc),
                [yy.Node('Identifier', 'arguments', yyloc),
                 yy.Node('Literal', offset, yyloc)])],
            yyloc);
    } else {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'drop', yyloc),
            [yy.Node('Literal', offset, yyloc), argsId]);
    }
    return parseVarDecl(id, restInit, yyloc, yy);
}

function parseLogicalExpr(op, exprs, yyloc, yy) {
    var logicalExpr = exprs[0];
    for (var i = 1, len = exprs.length; i < len; ++i) {
        logicalExpr = yy.Node('LogicalExpression', op, logicalExpr, exprs[i], yyloc);
    }
    return logicalExpr;
}

function parseVarDecl(id, init, yyloc, yy) {
    var stmt = yy.Node('VariableDeclaration', 'var', [], yyloc);
    return addVarDecl(stmt, id, init, yyloc, yy);
}

function addVarDecl(stmt, id, init, yyloc, yy) {
    var decl = yy.Node('VariableDeclarator', id, getValueIfUndefined(init, null), yyloc);
    stmt.declarations.push(decl);
    return stmt;
}

function parseNumLiteral(type, token, yyloc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), yyloc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yyloc);
    } else {
        node = parseLiteral(type, Number(token), yyloc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, yyloc, raw, yy) {
    return yy.Node('Literal', value, yyloc, raw);
}

function parseCollectionLiteral(type, items, yyloc, yy) {
    return yy.Node('CallExpression', yy.Node('Identifier', parseIdentifierName(type), yyloc), items, yyloc);
}

var charMap = {
    '-': '_$_',
    '+': '_$PLUS_',
    '>': '_$GT_',
    '<': '_$LT_',
    '=': '_$EQ_',
    '!': '_$BANG_',
    '*': '_$STAR_',
    '/': '_$SLASH_',
    '?': '_$QMARK_'
};
function parseIdentifierName(name) {
    var charsToReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g');
    return name.replace(charsToReplace, function (c) { return charMap[c]; });
}

function parseString(str) {
    return str
        .replace(/\\(u[a-fA-F0-9]{4}|x[a-fA-F0-9]{2})/g, function (match, hex) {
            return String.fromCharCode(parseInt(hex.slice(1), 16));
        })
        .replace(/\\([0-3]?[0-7]{1,2})/g, function (match, oct) {
            return String.fromCharCode(parseInt(oct, 8));
        })
        .replace(/\\0[^0-9]?/g,'\u0000')
        .replace(/\\(?:\r\n?|\n)/g,'')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r')
        .replace(/\\t/g,'\t')
        .replace(/\\v/g,'\v')
        .replace(/\\f/g,'\f')
        .replace(/\\b/g,'\b')
        .replace(/\\(.)/g, '$1');
}

function processLocsAndRanges(prog, locs, ranges) {
    // this cannot be done 1 pass over all the nodes
    // because some of the loc / range objects point to the same instance in memory
    // so deleting one deletes the other as well
    estraverse.replace(prog, {
        leave: function (node) {
            if (ranges) node.range = node.loc.range || [0, 0];
            return node;
        }
    });

    estraverse.replace(prog, {
        leave: function (node) {
            if (node.loc && typeof node.loc.range !== 'undefined')
                delete node.loc.range;
            if (! locs && typeof node.loc !== 'undefined')
                delete node.loc;
            return node;
        }
    });
}

function getValueIfUndefined(variable, valueIfUndefined) {
    return (typeof variable === 'undefined') ? valueIfUndefined : variable;
}
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* whitespace */;
break;
case 1:
    return 11;

break;
case 2:
    return 12;

break;
case 3:
    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2);
    return 13;

break;
case 4:
    return 9;

break;
case 5: /* ignore */ 
break;
case 6:return 35;
break;
case 7:return 22;
break;
case 8:return 23;
break;
case 9:return 18;
break;
case 10:return 20;
break;
case 11:return 24;
break;
case 12:return 26;
break;
case 13:return 27;
break;
case 14:return 21;
break;
case 15:return 7;
break;
case 16:return 69;
break;
case 17:return 60;
break;
case 18:return 46;
break;
case 19:return 47;
break;
case 20:return 49;
break;
case 21:return 53;
break;
case 22:return 89;
break;
case 23:return 65;
break;
case 24:return 74;
break;
case 25:return 77;
break;
case 26:return 56;
break;
case 27:return 58;
break;
case 28:return 68;
break;
case 29:return 80;
break;
case 30:return 82;
break;
case 31:return 84;
break;
case 32:return 87;
break;
case 33:return 37;
break;
case 34:return 39;
break;
case 35:return 40;
break;
case 36:return 14;
break;
case 37:return 15;
break;
case 38:return 16;
break;
case 39:
    return 4;

break;
case 40:return 'ILLEGAL-TOKEN';
break;
case 41: return 95; 
break;
case 42:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s,]+))/,/^(?:([-+]?([1-9][0-9]+|[0-9])))/,/^(?:([-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])*"))/,/^(?:(%(&|[1-9]|[0-9]|)?))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:#)/,/^(?:')/,/^(?::)/,/^(?:\.)/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:when)/,/^(?:do)/,/^(?:let)/,/^(?:loop)/,/^(?:recur)/,/^(?:and)/,/^(?:or)/,/^(?:set!)/,/^(?:dotimes)/,/^(?:doseq)/,/^(?:while)/,/^(?:new)/,/^(?::as)/,/^(?::keys)/,/^(?::strs)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*))/,/^(?:.)/,/^(?:$)/,/^(?:.)/],
conditions: {"regex":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require("/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":8,"estraverse":25,"fs":7,"path":9}],6:[function(require,module,exports){
(function (global){
(function() {
  var closer, closerCore, escodegen, estraverse, repl, wireThisAccess, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('./closer');

  closerCore = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.closerCore : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.closerCore : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.closerCore : void 0) != null ? _ref3 : require('./closer-core');

  escodegen = require('escodegen');

  estraverse = require('estraverse');

  wireThisAccess = function(ast) {
    estraverse.replace(ast, {
      leave: function(node) {
        if (node.type === 'ThisExpression') {
          node.type = 'Identifier';
          node.name = '__$this';
        }
        return node;
      }
    });
    return ast;
  };

  repl = {
    parse: function(src, options) {
      return wireThisAccess(closerCore.$wireCallsToCoreFunctions(closer.parse(src, options), 'closerCore', 'closerAssertions'));
    },
    generateJS: function(src, options) {
      return escodegen.generate(repl.parse(src, options));
    }
  };

  module.exports = repl;

  if (typeof self !== "undefined" && self !== null) {
    self.repl = repl;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.repl = repl;
  }

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./closer":3,"./closer-core":2,"escodegen":10,"estraverse":25}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],9:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":8}],10:[function(require,module,exports){
(function (global){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*global exports:true, generateStatement:true, generateExpression:true, require:true, global:true*/
(function () {
    'use strict';

    var Syntax,
        Precedence,
        BinaryPrecedence,
        SourceNode,
        estraverse,
        esutils,
        isArray,
        base,
        indent,
        json,
        renumber,
        hexadecimal,
        quotes,
        escapeless,
        newline,
        space,
        parentheses,
        semicolons,
        safeConcatenation,
        directive,
        extra,
        parse,
        sourceMap,
        FORMAT_MINIFY,
        FORMAT_DEFAULTS;

    estraverse = require('estraverse');
    esutils = require('esutils');

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ComprehensionBlock: 'ComprehensionBlock',
        ComprehensionExpression: 'ComprehensionExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportDeclaration: 'ExportDeclaration',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        ForOfStatement: 'ForOfStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        GeneratorExpression: 'GeneratorExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    Precedence = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseOR: 5,
        BitwiseXOR: 6,
        BitwiseAND: 7,
        Equality: 8,
        Relational: 9,
        BitwiseSHIFT: 10,
        Additive: 11,
        Multiplicative: 12,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        Member: 17,
        Primary: 18
    };

    BinaryPrecedence = {
        '||': Precedence.LogicalOR,
        '&&': Precedence.LogicalAND,
        '|': Precedence.BitwiseOR,
        '^': Precedence.BitwiseXOR,
        '&': Precedence.BitwiseAND,
        '==': Precedence.Equality,
        '!=': Precedence.Equality,
        '===': Precedence.Equality,
        '!==': Precedence.Equality,
        'is': Precedence.Equality,
        'isnt': Precedence.Equality,
        '<': Precedence.Relational,
        '>': Precedence.Relational,
        '<=': Precedence.Relational,
        '>=': Precedence.Relational,
        'in': Precedence.Relational,
        'instanceof': Precedence.Relational,
        '<<': Precedence.BitwiseSHIFT,
        '>>': Precedence.BitwiseSHIFT,
        '>>>': Precedence.BitwiseSHIFT,
        '+': Precedence.Additive,
        '-': Precedence.Additive,
        '*': Precedence.Multiplicative,
        '%': Precedence.Multiplicative,
        '/': Precedence.Multiplicative
    };

    function getDefaultOptions() {
        // default options
        return {
            indent: null,
            base: null,
            parse: null,
            comment: false,
            format: {
                indent: {
                    style: '    ',
                    base: 0,
                    adjustMultilineComment: false
                },
                newline: '\n',
                space: ' ',
                json: false,
                renumber: false,
                hexadecimal: false,
                quotes: 'single',
                escapeless: false,
                compact: false,
                parentheses: true,
                semicolons: true,
                safeConcatenation: false
            },
            moz: {
                comprehensionExpressionStartsWithAssignment: false,
                starlessGenerator: false,
                parenthesizedComprehensionBlock: false
            },
            sourceMap: null,
            sourceMapRoot: null,
            sourceMapWithCode: false,
            directive: false,
            raw: true,
            verbatim: null
        };
    }

    function stringRepeat(str, num) {
        var result = '';

        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }

        return result;
    }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function hasLineTerminator(str) {
        return (/[\r\n]/g).test(str);
    }

    function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
    }

    function updateDeeply(target, override) {
        var key, val;

        function isHashObject(target) {
            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }

        for (key in override) {
            if (override.hasOwnProperty(key)) {
                val = override[key];
                if (isHashObject(val)) {
                    if (isHashObject(target[key])) {
                        updateDeeply(target[key], val);
                    } else {
                        target[key] = updateDeeply({}, val);
                    }
                } else {
                    target[key] = val;
                }
            }
        }
        return target;
    }

    function generateNumber(value) {
        var result, point, temp, exponent, pos;

        if (value !== value) {
            throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || (value === 0 && 1 / value < 0)) {
            throw new Error('Numeric literal whose value is negative');
        }

        if (value === 1 / 0) {
            return json ? 'null' : renumber ? '1e400' : '1e+400';
        }

        result = '' + value;
        if (!renumber || result.length < 3) {
            return result;
        }

        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
            point = 0;
            result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
            exponent = +temp.slice(pos + 1);
            temp = temp.slice(0, pos);
        }
        if (point >= 0) {
            exponent -= temp.length - point - 1;
            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
            --pos;
        }
        if (pos !== 0) {
            exponent -= pos;
            temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
            temp += 'e' + exponent;
        }
        if ((temp.length < result.length ||
                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
                +temp === value) {
            result = temp;
        }

        return result;
    }

    // Generate valid RegExp expression.
    // This function is based on https://github.com/Constellation/iv Engine

    function escapeRegExpCharacter(ch, previousIsBackslash) {
        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
        if ((ch & ~1) === 0x2028) {
            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {  // \n, \r
            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
    }

    function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

        result = reg.toString();

        if (reg.source) {
            // extract flag from toString result
            match = result.match(/\/([^/]*)$/);
            if (!match) {
                return result;
            }

            flags = match[1];
            result = '';

            characterInBrack = false;
            previousIsBackslash = false;
            for (i = 0, iz = reg.source.length; i < iz; ++i) {
                ch = reg.source.charCodeAt(i);

                if (!previousIsBackslash) {
                    if (characterInBrack) {
                        if (ch === 93) {  // ]
                            characterInBrack = false;
                        }
                    } else {
                        if (ch === 47) {  // /
                            result += '\\';
                        } else if (ch === 91) {  // [
                            characterInBrack = true;
                        }
                    }
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    previousIsBackslash = ch === 92;  // \
                } else {
                    // if new RegExp("\\\n') is provided, create /\n/
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    // prevent like /\\[/]/
                    previousIsBackslash = false;
                }
            }

            return '/' + result + '/' + flags;
        }

        return result;
    }

    function escapeAllowedCharacter(code, next) {
        var hex, result = '\\';

        switch (code) {
        case 0x08  /* \b */:
            result += 'b';
            break;
        case 0x0C  /* \f */:
            result += 'f';
            break;
        case 0x09  /* \t */:
            result += 't';
            break;
        default:
            hex = code.toString(16).toUpperCase();
            if (json || code > 0xFF) {
                result += 'u' + '0000'.slice(hex.length) + hex;
            } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
                result += '0';
            } else if (code === 0x000B  /* \v */) { // '\v'
                result += 'x0B';
            } else {
                result += 'x' + '00'.slice(hex.length) + hex;
            }
            break;
        }

        return result;
    }

    function escapeDisallowedCharacter(code) {
        var result = '\\';
        switch (code) {
        case 0x5C  /* \ */:
            result += '\\';
            break;
        case 0x0A  /* \n */:
            result += 'n';
            break;
        case 0x0D  /* \r */:
            result += 'r';
            break;
        case 0x2028:
            result += 'u2028';
            break;
        case 0x2029:
            result += 'u2029';
            break;
        default:
            throw new Error('Incorrectly classified character');
        }

        return result;
    }

    function escapeDirective(str) {
        var i, iz, code, quote;

        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                quote = '"';
                break;
            } else if (code === 0x22  /* " */) {
                quote = '\'';
                break;
            } else if (code === 0x5C  /* \ */) {
                ++i;
            }
        }

        return quote + str + quote;
    }

    function escapeString(str) {
        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                ++singleQuotes;
            } else if (code === 0x22  /* " */) {
                ++doubleQuotes;
            } else if (code === 0x2F  /* / */ && json) {
                result += '\\';
            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
                result += escapeDisallowedCharacter(code);
                continue;
            } else if ((json && code < 0x20  /* SP */) || !(json || escapeless || (code >= 0x20  /* SP */ && code <= 0x7E  /* ~ */))) {
                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
                continue;
            }
            result += String.fromCharCode(code);
        }

        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
        quote = single ? '\'' : '"';

        if (!(single ? singleQuotes : doubleQuotes)) {
            return quote + result + quote;
        }

        str = result;
        result = quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
                result += '\\';
            }
            result += String.fromCharCode(code);
        }

        return result + quote;
    }

    /**
     * flatten an array to a string, where the array can contain
     * either strings or nested arrays
     */
    function flattenToString(arr) {
        var i, iz, elem, result = '';
        for (i = 0, iz = arr.length; i < iz; ++i) {
            elem = arr[i];
            result += isArray(elem) ? flattenToString(elem) : elem;
        }
        return result;
    }

    /**
     * convert generated to a SourceNode when source maps are enabled.
     */
    function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap) {
            // with no source maps, generated is either an
            // array or a string.  if an array, flatten it.
            // if a string, just return it
            if (isArray(generated)) {
                return flattenToString(generated);
            } else {
                return generated;
            }
        }
        if (node == null) {
            if (generated instanceof SourceNode) {
                return generated;
            } else {
                node = {};
            }
        }
        if (node.loc == null) {
            return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
    }

    function noEmptySpace() {
        return (space) ? space : ' ';
    }

    function join(left, right) {
        var leftSource = toSourceNodeWhenNeeded(left).toString(),
            rightSource = toSourceNodeWhenNeeded(right).toString(),
            leftCharCode = leftSource.charCodeAt(leftSource.length - 1),
            rightCharCode = rightSource.charCodeAt(0);

        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
        esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) ||
        leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
            return [left, noEmptySpace(), right];
        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
            return [left, right];
        }
        return [left, space, right];
    }

    function addIndent(stmt) {
        return [base, stmt];
    }

    function withIndent(fn) {
        var previousBase, result;
        previousBase = base;
        base += indent;
        result = fn.call(this, base);
        base = previousBase;
        return result;
    }

    function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
                break;
            }
        }
        return (str.length - 1) - i;
    }

    function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase, sn;

        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;

        // first line doesn't have indentation
        for (i = 1, len = array.length; i < len; ++i) {
            line = array[i];
            j = 0;
            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
                ++j;
            }
            if (spaces > j) {
                spaces = j;
            }
        }

        if (typeof specialBase !== 'undefined') {
            // pattern like
            // {
            //   var t = 20;  /*
            //                 * this is comment
            //                 */
            // }
            previousBase = base;
            if (array[1][spaces] === '*') {
                specialBase += ' ';
            }
            base = specialBase;
        } else {
            if (spaces & 1) {
                // /*
                //  *
                //  */
                // If spaces are odd number, above pattern is considered.
                // We waste 1 space.
                --spaces;
            }
            previousBase = base;
        }

        for (i = 1, len = array.length; i < len; ++i) {
            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
            array[i] = sourceMap ? sn.join('') : sn;
        }

        base = previousBase;

        return array.join('\n');
    }

    function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
            if (endsWithLineTerminator(comment.value)) {
                return '//' + comment.value;
            } else {
                // Always use LineTerminator
                return '//' + comment.value + '\n';
            }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
    }

    function addComments(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment;

        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
            save = result;

            comment = stmt.leadingComments[0];
            result = [];
            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
                result.push('\n');
            }
            result.push(generateComment(comment));
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push('\n');
            }

            for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
                comment = stmt.leadingComments[i];
                fragment = [generateComment(comment)];
                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                    fragment.push('\n');
                }
                result.push(addIndent(fragment));
            }

            result.push(addIndent(save));
        }

        if (stmt.trailingComments) {
            tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
            specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
            for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
                comment = stmt.trailingComments[i];
                if (tailingToStatement) {
                    // We assume target like following script
                    //
                    // var t = 20;  /**
                    //               * This is comment of t
                    //               */
                    if (i === 0) {
                        // first case
                        result = [result, indent];
                    } else {
                        result = [result, specialBase];
                    }
                    result.push(generateComment(comment, specialBase));
                } else {
                    result = [result, addIndent(generateComment(comment))];
                }
                if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                    result = [result, '\n'];
                }
            }
        }

        return result;
    }

    function parenthesize(text, current, should) {
        if (current < should) {
            return ['(', text, ')'];
        }
        return text;
    }

    function maybeBlock(stmt, semicolonOptional, functionBody) {
        var result, noLeadingComment;

        noLeadingComment = !extra.comment || !stmt.leadingComments;

        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
            return [space, generateStatement(stmt, { functionBody: functionBody })];
        }

        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
            return ';';
        }

        withIndent(function () {
            result = [newline, addIndent(generateStatement(stmt, { semicolonOptional: semicolonOptional, functionBody: functionBody }))];
        });

        return result;
    }

    function maybeBlockSuffix(stmt, result) {
        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
            return [result, space];
        }
        if (ends) {
            return [result, base];
        }
        return [result, newline, base];
    }

    function generateVerbatimString(string) {
        var i, iz, result;
        result = string.split(/\r\n|\n/);
        for (i = 1, iz = result.length; i < iz; i++) {
            result[i] = newline + base + result[i];
        }
        return result;
    }

    function generateVerbatim(expr, option) {
        var verbatim, result, prec;
        verbatim = expr[extra.verbatim];

        if (typeof verbatim === 'string') {
            result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, option.precedence);
        } else {
            // verbatim is object
            result = generateVerbatimString(verbatim.content);
            prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
            result = parenthesize(result, prec, option.precedence);
        }

        return toSourceNodeWhenNeeded(result, expr);
    }

    function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
    }

    function generatePattern(node, options) {
        var result;

        if (node.type === Syntax.Identifier) {
            result = generateIdentifier(node);
        } else {
            result = generateExpression(node, {
                precedence: options.precedence,
                allowIn: options.allowIn,
                allowCall: true
            });
        }

        return result;
    }

    function generateFunctionBody(node) {
        var result, i, len, expr, arrow;

        arrow = node.type === Syntax.ArrowFunctionExpression;

        if (arrow && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
            // arg => { } case
            result = [generateIdentifier(node.params[0])];
        } else {
            result = ['('];
            for (i = 0, len = node.params.length; i < len; ++i) {
                result.push(generatePattern(node.params[i], {
                    precedence: Precedence.Assignment,
                    allowIn: true
                }));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result.push(')');
        }

        if (arrow) {
            result.push(space);
            result.push('=>');
        }

        if (node.expression) {
            result.push(space);
            expr = generateExpression(node.body, {
                precedence: Precedence.Assignment,
                allowIn: true,
                allowCall: true
            });
            if (expr.toString().charAt(0) === '{') {
                expr = ['(', expr, ')'];
            }
            result.push(expr);
        } else {
            result.push(maybeBlock(node.body, false, true));
        }
        return result;
    }

    function generateIterationForStatement(operator, stmt, semicolonIsNotNeeded) {
        var result = ['for' + space + '('];
        withIndent(function () {
            if (stmt.left.type === Syntax.VariableDeclaration) {
                withIndent(function () {
                    result.push(stmt.left.kind + noEmptySpace());
                    result.push(generateStatement(stmt.left.declarations[0], {
                        allowIn: false
                    }));
                });
            } else {
                result.push(generateExpression(stmt.left, {
                    precedence: Precedence.Call,
                    allowIn: true,
                    allowCall: true
                }));
            }

            result = join(result, operator);
            result = [join(
                result,
                generateExpression(stmt.right, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                })
            ), ')'];
        });
        result.push(maybeBlock(stmt.body, semicolonIsNotNeeded));
        return result;
    }

    function generateExpression(expr, option) {
        var result,
            precedence,
            type,
            currentPrecedence,
            i,
            len,
            raw,
            fragment,
            multiline,
            leftCharCode,
            leftSource,
            rightCharCode,
            allowIn,
            allowCall,
            allowUnparenthesizedNew,
            property,
            isGenerator;

        precedence = option.precedence;
        allowIn = option.allowIn;
        allowCall = option.allowCall;
        type = expr.type || option.type;

        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
            return generateVerbatim(expr, option);
        }

        switch (type) {
        case Syntax.SequenceExpression:
            result = [];
            allowIn |= (Precedence.Sequence < precedence);
            for (i = 0, len = expr.expressions.length; i < len; ++i) {
                result.push(generateExpression(expr.expressions[i], {
                    precedence: Precedence.Assignment,
                    allowIn: allowIn,
                    allowCall: true
                }));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result = parenthesize(result, Precedence.Sequence, precedence);
            break;

        case Syntax.AssignmentExpression:
            allowIn |= (Precedence.Assignment < precedence);
            result = parenthesize(
                [
                    generateExpression(expr.left, {
                        precedence: Precedence.Call,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + expr.operator + space,
                    generateExpression(expr.right, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ],
                Precedence.Assignment,
                precedence
            );
            break;

        case Syntax.ArrowFunctionExpression:
            allowIn |= (Precedence.ArrowFunction < precedence);
            result = parenthesize(generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
            break;

        case Syntax.ConditionalExpression:
            allowIn |= (Precedence.Conditional < precedence);
            result = parenthesize(
                [
                    generateExpression(expr.test, {
                        precedence: Precedence.LogicalOR,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + '?' + space,
                    generateExpression(expr.consequent, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + ':' + space,
                    generateExpression(expr.alternate, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ],
                Precedence.Conditional,
                precedence
            );
            break;

        case Syntax.LogicalExpression:
        case Syntax.BinaryExpression:
            currentPrecedence = BinaryPrecedence[expr.operator];

            allowIn |= (currentPrecedence < precedence);

            fragment = generateExpression(expr.left, {
                precedence: currentPrecedence,
                allowIn: allowIn,
                allowCall: true
            });

            leftSource = fragment.toString();

            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
                result = [fragment, noEmptySpace(), expr.operator];
            } else {
                result = join(fragment, expr.operator);
            }

            fragment = generateExpression(expr.right, {
                precedence: currentPrecedence + 1,
                allowIn: allowIn,
                allowCall: true
            });

            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
                result.push(noEmptySpace());
                result.push(fragment);
            } else {
                result = join(result, fragment);
            }

            if (expr.operator === 'in' && !allowIn) {
                result = ['(', result, ')'];
            } else {
                result = parenthesize(result, currentPrecedence, precedence);
            }

            break;

        case Syntax.CallExpression:
            result = [generateExpression(expr.callee, {
                precedence: Precedence.Call,
                allowIn: true,
                allowCall: true,
                allowUnparenthesizedNew: false
            })];

            result.push('(');
            for (i = 0, len = expr['arguments'].length; i < len; ++i) {
                result.push(generateExpression(expr['arguments'][i], {
                    precedence: Precedence.Assignment,
                    allowIn: true,
                    allowCall: true
                }));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result.push(')');

            if (!allowCall) {
                result = ['(', result, ')'];
            } else {
                result = parenthesize(result, Precedence.Call, precedence);
            }
            break;

        case Syntax.NewExpression:
            len = expr['arguments'].length;
            allowUnparenthesizedNew = option.allowUnparenthesizedNew === undefined || option.allowUnparenthesizedNew;

            result = join(
                'new',
                generateExpression(expr.callee, {
                    precedence: Precedence.New,
                    allowIn: true,
                    allowCall: false,
                    allowUnparenthesizedNew: allowUnparenthesizedNew && !parentheses && len === 0
                })
            );

            if (!allowUnparenthesizedNew || parentheses || len > 0) {
                result.push('(');
                for (i = 0; i < len; ++i) {
                    result.push(generateExpression(expr['arguments'][i], {
                        precedence: Precedence.Assignment,
                        allowIn: true,
                        allowCall: true
                    }));
                    if (i + 1 < len) {
                        result.push(',' + space);
                    }
                }
                result.push(')');
            }

            result = parenthesize(result, Precedence.New, precedence);
            break;

        case Syntax.MemberExpression:
            result = [generateExpression(expr.object, {
                precedence: Precedence.Call,
                allowIn: true,
                allowCall: allowCall,
                allowUnparenthesizedNew: false
            })];

            if (expr.computed) {
                result.push('[');
                result.push(generateExpression(expr.property, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: allowCall
                }));
                result.push(']');
            } else {
                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
                    fragment = toSourceNodeWhenNeeded(result).toString();
                    // When the following conditions are all true,
                    //   1. No floating point
                    //   2. Don't have exponents
                    //   3. The last character is a decimal digit
                    //   4. Not hexadecimal OR octal number literal
                    // we should add a floating point.
                    if (
                            fragment.indexOf('.') < 0 &&
                            !/[eExX]/.test(fragment) &&
                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
                            ) {
                        result.push('.');
                    }
                }
                result.push('.');
                result.push(generateIdentifier(expr.property));
            }

            result = parenthesize(result, Precedence.Member, precedence);
            break;

        case Syntax.UnaryExpression:
            fragment = generateExpression(expr.argument, {
                precedence: Precedence.Unary,
                allowIn: true,
                allowCall: true
            });

            if (space === '') {
                result = join(expr.operator, fragment);
            } else {
                result = [expr.operator];
                if (expr.operator.length > 2) {
                    // delete, void, typeof
                    // get `typeof []`, not `typeof[]`
                    result = join(result, fragment);
                } else {
                    // Prevent inserting spaces between operator and argument if it is unnecessary
                    // like, `!cond`
                    leftSource = toSourceNodeWhenNeeded(result).toString();
                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
                    rightCharCode = fragment.toString().charCodeAt(0);

                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
                            (esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode))) {
                        result.push(noEmptySpace());
                        result.push(fragment);
                    } else {
                        result.push(fragment);
                    }
                }
            }
            result = parenthesize(result, Precedence.Unary, precedence);
            break;

        case Syntax.YieldExpression:
            if (expr.delegate) {
                result = 'yield*';
            } else {
                result = 'yield';
            }
            if (expr.argument) {
                result = join(
                    result,
                    generateExpression(expr.argument, {
                        precedence: Precedence.Yield,
                        allowIn: true,
                        allowCall: true
                    })
                );
            }
            result = parenthesize(result, Precedence.Yield, precedence);
            break;

        case Syntax.UpdateExpression:
            if (expr.prefix) {
                result = parenthesize(
                    [
                        expr.operator,
                        generateExpression(expr.argument, {
                            precedence: Precedence.Unary,
                            allowIn: true,
                            allowCall: true
                        })
                    ],
                    Precedence.Unary,
                    precedence
                );
            } else {
                result = parenthesize(
                    [
                        generateExpression(expr.argument, {
                            precedence: Precedence.Postfix,
                            allowIn: true,
                            allowCall: true
                        }),
                        expr.operator
                    ],
                    Precedence.Postfix,
                    precedence
                );
            }
            break;

        case Syntax.FunctionExpression:
            isGenerator = expr.generator && !extra.moz.starlessGenerator;
            result = isGenerator ? 'function*' : 'function';

            if (expr.id) {
                result = [result, (isGenerator) ? space : noEmptySpace(),
                          generateIdentifier(expr.id),
                          generateFunctionBody(expr)];
            } else {
                result = [result + space, generateFunctionBody(expr)];
            }

            break;

        case Syntax.ArrayPattern:
        case Syntax.ArrayExpression:
            if (!expr.elements.length) {
                result = '[]';
                break;
            }
            multiline = expr.elements.length > 1;
            result = ['[', multiline ? newline : ''];
            withIndent(function (indent) {
                for (i = 0, len = expr.elements.length; i < len; ++i) {
                    if (!expr.elements[i]) {
                        if (multiline) {
                            result.push(indent);
                        }
                        if (i + 1 === len) {
                            result.push(',');
                        }
                    } else {
                        result.push(multiline ? indent : '');
                        result.push(generateExpression(expr.elements[i], {
                            precedence: Precedence.Assignment,
                            allowIn: true,
                            allowCall: true
                        }));
                    }
                    if (i + 1 < len) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });
            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '');
            result.push(']');
            break;

        case Syntax.Property:
            if (expr.kind === 'get' || expr.kind === 'set') {
                result = [
                    expr.kind, noEmptySpace(),
                    generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    generateFunctionBody(expr.value)
                ];
            } else {
                if (expr.shorthand) {
                    result = generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    });
                } else if (expr.method) {
                    result = [];
                    if (expr.value.generator) {
                        result.push('*');
                    }
                    result.push(generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }));
                    result.push(generateFunctionBody(expr.value));
                } else {
                    result = [
                        generateExpression(expr.key, {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true
                        }),
                        ':' + space,
                        generateExpression(expr.value, {
                            precedence: Precedence.Assignment,
                            allowIn: true,
                            allowCall: true
                        })
                    ];
                }
            }
            break;

        case Syntax.ObjectExpression:
            if (!expr.properties.length) {
                result = '{}';
                break;
            }
            multiline = expr.properties.length > 1;

            withIndent(function () {
                fragment = generateExpression(expr.properties[0], {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true,
                    type: Syntax.Property
                });
            });

            if (!multiline) {
                // issues 4
                // Do not transform from
                //   dejavu.Class.declare({
                //       method2: function () {}
                //   });
                // to
                //   dejavu.Class.declare({method2: function () {
                //       }});
                if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                    result = [ '{', space, fragment, space, '}' ];
                    break;
                }
            }

            withIndent(function (indent) {
                result = [ '{', newline, indent, fragment ];

                if (multiline) {
                    result.push(',' + newline);
                    for (i = 1, len = expr.properties.length; i < len; ++i) {
                        result.push(indent);
                        result.push(generateExpression(expr.properties[i], {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true,
                            type: Syntax.Property
                        }));
                        if (i + 1 < len) {
                            result.push(',' + newline);
                        }
                    }
                }
            });

            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(base);
            result.push('}');
            break;

        case Syntax.ObjectPattern:
            if (!expr.properties.length) {
                result = '{}';
                break;
            }

            multiline = false;
            if (expr.properties.length === 1) {
                property = expr.properties[0];
                if (property.value.type !== Syntax.Identifier) {
                    multiline = true;
                }
            } else {
                for (i = 0, len = expr.properties.length; i < len; ++i) {
                    property = expr.properties[i];
                    if (!property.shorthand) {
                        multiline = true;
                        break;
                    }
                }
            }
            result = ['{', multiline ? newline : '' ];

            withIndent(function (indent) {
                for (i = 0, len = expr.properties.length; i < len; ++i) {
                    result.push(multiline ? indent : '');
                    result.push(generateExpression(expr.properties[i], {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }));
                    if (i + 1 < len) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });

            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '');
            result.push('}');
            break;

        case Syntax.ThisExpression:
            result = 'this';
            break;

        case Syntax.Identifier:
            result = generateIdentifier(expr);
            break;

        case Syntax.Literal:
            if (expr.hasOwnProperty('raw') && parse && extra.raw) {
                try {
                    raw = parse(expr.raw).body[0].expression;
                    if (raw.type === Syntax.Literal) {
                        if (raw.value === expr.value) {
                            result = expr.raw;
                            break;
                        }
                    }
                } catch (e) {
                    // not use raw property
                }
            }

            if (expr.value === null) {
                result = 'null';
                break;
            }

            if (typeof expr.value === 'string') {
                result = escapeString(expr.value);
                break;
            }

            if (typeof expr.value === 'number') {
                result = generateNumber(expr.value);
                break;
            }

            if (typeof expr.value === 'boolean') {
                result = expr.value ? 'true' : 'false';
                break;
            }

            result = generateRegExp(expr.value);
            break;

        case Syntax.GeneratorExpression:
        case Syntax.ComprehensionExpression:
            // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
            // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6
            result = (type === Syntax.GeneratorExpression) ? ['('] : ['['];

            if (extra.moz.comprehensionExpressionStartsWithAssignment) {
                fragment = generateExpression(expr.body, {
                    precedence: Precedence.Assignment,
                    allowIn: true,
                    allowCall: true
                });

                result.push(fragment);
            }

            if (expr.blocks) {
                withIndent(function () {
                    for (i = 0, len = expr.blocks.length; i < len; ++i) {
                        fragment = generateExpression(expr.blocks[i], {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true
                        });

                        if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                            result = join(result, fragment);
                        } else {
                            result.push(fragment);
                        }
                    }
                });
            }

            if (expr.filter) {
                result = join(result, 'if' + space);
                fragment = generateExpression(expr.filter, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                });
                if (extra.moz.parenthesizedComprehensionBlock) {
                    result = join(result, [ '(', fragment, ')' ]);
                } else {
                    result = join(result, fragment);
                }
            }

            if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
                fragment = generateExpression(expr.body, {
                    precedence: Precedence.Assignment,
                    allowIn: true,
                    allowCall: true
                });

                result = join(result, fragment);
            }

            result.push((type === Syntax.GeneratorExpression) ? ')' : ']');
            break;

        case Syntax.ComprehensionBlock:
            if (expr.left.type === Syntax.VariableDeclaration) {
                fragment = [
                    expr.left.kind, noEmptySpace(),
                    generateStatement(expr.left.declarations[0], {
                        allowIn: false
                    })
                ];
            } else {
                fragment = generateExpression(expr.left, {
                    precedence: Precedence.Call,
                    allowIn: true,
                    allowCall: true
                });
            }

            fragment = join(fragment, expr.of ? 'of' : 'in');
            fragment = join(fragment, generateExpression(expr.right, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            }));

            if (extra.moz.parenthesizedComprehensionBlock) {
                result = [ 'for' + space + '(', fragment, ')' ];
            } else {
                result = join('for' + space, fragment);
            }
            break;

        default:
            throw new Error('Unknown expression type: ' + expr.type);
        }

        if (extra.comment) {
            result = addComments(expr,result);
        }
        return toSourceNodeWhenNeeded(result, expr);
    }

    function generateStatement(stmt, option) {
        var i,
            len,
            result,
            node,
            allowIn,
            functionBody,
            directiveContext,
            fragment,
            semicolon,
            isGenerator;

        allowIn = true;
        semicolon = ';';
        functionBody = false;
        directiveContext = false;
        if (option) {
            allowIn = option.allowIn === undefined || option.allowIn;
            if (!semicolons && option.semicolonOptional === true) {
                semicolon = '';
            }
            functionBody = option.functionBody;
            directiveContext = option.directiveContext;
        }

        switch (stmt.type) {
        case Syntax.BlockStatement:
            result = ['{', newline];

            withIndent(function () {
                for (i = 0, len = stmt.body.length; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.body[i], {
                        semicolonOptional: i === len - 1,
                        directiveContext: functionBody
                    }));
                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        result.push(newline);
                    }
                }
            });

            result.push(addIndent('}'));
            break;

        case Syntax.BreakStatement:
            if (stmt.label) {
                result = 'break ' + stmt.label.name + semicolon;
            } else {
                result = 'break' + semicolon;
            }
            break;

        case Syntax.ContinueStatement:
            if (stmt.label) {
                result = 'continue ' + stmt.label.name + semicolon;
            } else {
                result = 'continue' + semicolon;
            }
            break;

        case Syntax.DirectiveStatement:
            if (extra.raw && stmt.raw) {
                result = stmt.raw + semicolon;
            } else {
                result = escapeDirective(stmt.directive) + semicolon;
            }
            break;

        case Syntax.DoWhileStatement:
            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
            result = join('do', maybeBlock(stmt.body));
            result = maybeBlockSuffix(stmt.body, result);
            result = join(result, [
                'while' + space + '(',
                generateExpression(stmt.test, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                }),
                ')' + semicolon
            ]);
            break;

        case Syntax.CatchClause:
            withIndent(function () {
                var guard;

                result = [
                    'catch' + space + '(',
                    generateExpression(stmt.param, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];

                if (stmt.guard) {
                    guard = generateExpression(stmt.guard, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    });

                    result.splice(2, 0, ' if ', guard);
                }
            });
            result.push(maybeBlock(stmt.body));
            break;

        case Syntax.DebuggerStatement:
            result = 'debugger' + semicolon;
            break;

        case Syntax.EmptyStatement:
            result = ';';
            break;

        case Syntax.ExportDeclaration:
            result = 'export ';
            if (stmt.declaration) {
                // FunctionDeclaration or VariableDeclaration
                result = [result, generateStatement(stmt.declaration, { semicolonOptional: semicolon === '' })];
                break;
            }
            break;

        case Syntax.ExpressionStatement:
            result = [generateExpression(stmt.expression, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            })];
            // 12.4 '{', 'function' is not allowed in this position.
            // wrap expression with parentheses
            fragment = toSourceNodeWhenNeeded(result).toString();
            if (fragment.charAt(0) === '{' ||  // ObjectExpression
                    (fragment.slice(0, 8) === 'function' && '* ('.indexOf(fragment.charAt(8)) >= 0) ||  // function or generator
                    (directive && directiveContext && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
                result = ['(', result, ')' + semicolon];
            } else {
                result.push(semicolon);
            }
            break;

        case Syntax.VariableDeclarator:
            if (stmt.init) {
                result = [
                    generateExpression(stmt.id, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space,
                    '=',
                    space,
                    generateExpression(stmt.init, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ];
            } else {
                result = generatePattern(stmt.id, {
                    precedence: Precedence.Assignment,
                    allowIn: allowIn
                });
            }
            break;

        case Syntax.VariableDeclaration:
            result = [stmt.kind];
            // special path for
            // var x = function () {
            // };
            if (stmt.declarations.length === 1 && stmt.declarations[0].init &&
                    stmt.declarations[0].init.type === Syntax.FunctionExpression) {
                result.push(noEmptySpace());
                result.push(generateStatement(stmt.declarations[0], {
                    allowIn: allowIn
                }));
            } else {
                // VariableDeclarator is typed as Statement,
                // but joined with comma (not LineTerminator).
                // So if comment is attached to target node, we should specialize.
                withIndent(function () {
                    node = stmt.declarations[0];
                    if (extra.comment && node.leadingComments) {
                        result.push('\n');
                        result.push(addIndent(generateStatement(node, {
                            allowIn: allowIn
                        })));
                    } else {
                        result.push(noEmptySpace());
                        result.push(generateStatement(node, {
                            allowIn: allowIn
                        }));
                    }

                    for (i = 1, len = stmt.declarations.length; i < len; ++i) {
                        node = stmt.declarations[i];
                        if (extra.comment && node.leadingComments) {
                            result.push(',' + newline);
                            result.push(addIndent(generateStatement(node, {
                                allowIn: allowIn
                            })));
                        } else {
                            result.push(',' + space);
                            result.push(generateStatement(node, {
                                allowIn: allowIn
                            }));
                        }
                    }
                });
            }
            result.push(semicolon);
            break;

        case Syntax.ThrowStatement:
            result = [join(
                'throw',
                generateExpression(stmt.argument, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                })
            ), semicolon];
            break;

        case Syntax.TryStatement:
            result = ['try', maybeBlock(stmt.block)];
            result = maybeBlockSuffix(stmt.block, result);

            if (stmt.handlers) {
                // old interface
                for (i = 0, len = stmt.handlers.length; i < len; ++i) {
                    result = join(result, generateStatement(stmt.handlers[i]));
                    if (stmt.finalizer || i + 1 !== len) {
                        result = maybeBlockSuffix(stmt.handlers[i].body, result);
                    }
                }
            } else {
                stmt.guardedHandlers = stmt.guardedHandlers || [];

                for (i = 0, len = stmt.guardedHandlers.length; i < len; ++i) {
                    result = join(result, generateStatement(stmt.guardedHandlers[i]));
                    if (stmt.finalizer || i + 1 !== len) {
                        result = maybeBlockSuffix(stmt.guardedHandlers[i].body, result);
                    }
                }

                // new interface
                if (stmt.handler) {
                    if (isArray(stmt.handler)) {
                        for (i = 0, len = stmt.handler.length; i < len; ++i) {
                            result = join(result, generateStatement(stmt.handler[i]));
                            if (stmt.finalizer || i + 1 !== len) {
                                result = maybeBlockSuffix(stmt.handler[i].body, result);
                            }
                        }
                    } else {
                        result = join(result, generateStatement(stmt.handler));
                        if (stmt.finalizer) {
                            result = maybeBlockSuffix(stmt.handler.body, result);
                        }
                    }
                }
            }
            if (stmt.finalizer) {
                result = join(result, ['finally', maybeBlock(stmt.finalizer)]);
            }
            break;

        case Syntax.SwitchStatement:
            withIndent(function () {
                result = [
                    'switch' + space + '(',
                    generateExpression(stmt.discriminant, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')' + space + '{' + newline
                ];
            });
            if (stmt.cases) {
                for (i = 0, len = stmt.cases.length; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.cases[i], {semicolonOptional: i === len - 1}));
                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        result.push(newline);
                    }
                }
            }
            result.push(addIndent('}'));
            break;

        case Syntax.SwitchCase:
            withIndent(function () {
                if (stmt.test) {
                    result = [
                        join('case', generateExpression(stmt.test, {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true
                        })),
                        ':'
                    ];
                } else {
                    result = ['default:'];
                }

                i = 0;
                len = stmt.consequent.length;
                if (len && stmt.consequent[0].type === Syntax.BlockStatement) {
                    fragment = maybeBlock(stmt.consequent[0]);
                    result.push(fragment);
                    i = 1;
                }

                if (i !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                    result.push(newline);
                }

                for (; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.consequent[i], {semicolonOptional: i === len - 1 && semicolon === ''}));
                    result.push(fragment);
                    if (i + 1 !== len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        result.push(newline);
                    }
                }
            });
            break;

        case Syntax.IfStatement:
            withIndent(function () {
                result = [
                    'if' + space + '(',
                    generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            if (stmt.alternate) {
                result.push(maybeBlock(stmt.consequent));
                result = maybeBlockSuffix(stmt.consequent, result);
                if (stmt.alternate.type === Syntax.IfStatement) {
                    result = join(result, ['else ', generateStatement(stmt.alternate, {semicolonOptional: semicolon === ''})]);
                } else {
                    result = join(result, join('else', maybeBlock(stmt.alternate, semicolon === '')));
                }
            } else {
                result.push(maybeBlock(stmt.consequent, semicolon === ''));
            }
            break;

        case Syntax.ForStatement:
            withIndent(function () {
                result = ['for' + space + '('];
                if (stmt.init) {
                    if (stmt.init.type === Syntax.VariableDeclaration) {
                        result.push(generateStatement(stmt.init, {allowIn: false}));
                    } else {
                        result.push(generateExpression(stmt.init, {
                            precedence: Precedence.Sequence,
                            allowIn: false,
                            allowCall: true
                        }));
                        result.push(';');
                    }
                } else {
                    result.push(';');
                }

                if (stmt.test) {
                    result.push(space);
                    result.push(generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }));
                    result.push(';');
                } else {
                    result.push(';');
                }

                if (stmt.update) {
                    result.push(space);
                    result.push(generateExpression(stmt.update, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }));
                    result.push(')');
                } else {
                    result.push(')');
                }
            });

            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        case Syntax.ForInStatement:
            result = generateIterationForStatement('in', stmt, semicolon === '');
            break;

        case Syntax.ForOfStatement:
            result = generateIterationForStatement('of', stmt, semicolon === '');
            break;

        case Syntax.LabeledStatement:
            result = [stmt.label.name + ':', maybeBlock(stmt.body, semicolon === '')];
            break;

        case Syntax.Program:
            len = stmt.body.length;
            result = [safeConcatenation && len > 0 ? '\n' : ''];
            for (i = 0; i < len; ++i) {
                fragment = addIndent(
                    generateStatement(stmt.body[i], {
                        semicolonOptional: !safeConcatenation && i === len - 1,
                        directiveContext: true
                    })
                );
                result.push(fragment);
                if (i + 1 < len && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                    result.push(newline);
                }
            }
            break;

        case Syntax.FunctionDeclaration:
            isGenerator = stmt.generator && !extra.moz.starlessGenerator;
            result = [
                (isGenerator ? 'function*' : 'function'),
                (isGenerator ? space : noEmptySpace()),
                generateIdentifier(stmt.id),
                generateFunctionBody(stmt)
            ];
            break;

        case Syntax.ReturnStatement:
            if (stmt.argument) {
                result = [join(
                    'return',
                    generateExpression(stmt.argument, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    })
                ), semicolon];
            } else {
                result = ['return' + semicolon];
            }
            break;

        case Syntax.WhileStatement:
            withIndent(function () {
                result = [
                    'while' + space + '(',
                    generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        case Syntax.WithStatement:
            withIndent(function () {
                result = [
                    'with' + space + '(',
                    generateExpression(stmt.object, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        default:
            throw new Error('Unknown statement type: ' + stmt.type);
        }

        // Attach comments

        if (extra.comment) {
            result = addComments(stmt, result);
        }

        fragment = toSourceNodeWhenNeeded(result).toString();
        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
            result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
        }

        return toSourceNodeWhenNeeded(result, stmt);
    }

    function generate(node, options) {
        var defaultOptions = getDefaultOptions(), result, pair;

        if (options != null) {
            // Obsolete options
            //
            //   `options.indent`
            //   `options.base`
            //
            // Instead of them, we can use `option.format.indent`.
            if (typeof options.indent === 'string') {
                defaultOptions.format.indent.style = options.indent;
            }
            if (typeof options.base === 'number') {
                defaultOptions.format.indent.base = options.base;
            }
            options = updateDeeply(defaultOptions, options);
            indent = options.format.indent.style;
            if (typeof options.base === 'string') {
                base = options.base;
            } else {
                base = stringRepeat(indent, options.format.indent.base);
            }
        } else {
            options = defaultOptions;
            indent = options.format.indent.style;
            base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
            newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        extra = options;

        if (sourceMap) {
            if (!exports.browser) {
                // We assume environment is node.js
                // And prevent from including source-map by browserify
                SourceNode = require('source-map').SourceNode;
            } else {
                SourceNode = global.sourceMap.SourceNode;
            }
        }

        switch (node.type) {
        case Syntax.BlockStatement:
        case Syntax.BreakStatement:
        case Syntax.CatchClause:
        case Syntax.ContinueStatement:
        case Syntax.DirectiveStatement:
        case Syntax.DoWhileStatement:
        case Syntax.DebuggerStatement:
        case Syntax.EmptyStatement:
        case Syntax.ExpressionStatement:
        case Syntax.ForStatement:
        case Syntax.ForInStatement:
        case Syntax.ForOfStatement:
        case Syntax.FunctionDeclaration:
        case Syntax.IfStatement:
        case Syntax.LabeledStatement:
        case Syntax.Program:
        case Syntax.ReturnStatement:
        case Syntax.SwitchStatement:
        case Syntax.SwitchCase:
        case Syntax.ThrowStatement:
        case Syntax.TryStatement:
        case Syntax.VariableDeclaration:
        case Syntax.VariableDeclarator:
        case Syntax.WhileStatement:
        case Syntax.WithStatement:
            result = generateStatement(node);
            break;

        case Syntax.AssignmentExpression:
        case Syntax.ArrayExpression:
        case Syntax.ArrayPattern:
        case Syntax.BinaryExpression:
        case Syntax.CallExpression:
        case Syntax.ConditionalExpression:
        case Syntax.FunctionExpression:
        case Syntax.Identifier:
        case Syntax.Literal:
        case Syntax.LogicalExpression:
        case Syntax.MemberExpression:
        case Syntax.NewExpression:
        case Syntax.ObjectExpression:
        case Syntax.ObjectPattern:
        case Syntax.Property:
        case Syntax.SequenceExpression:
        case Syntax.ThisExpression:
        case Syntax.UnaryExpression:
        case Syntax.UpdateExpression:
        case Syntax.YieldExpression:

            result = generateExpression(node, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            });
            break;

        default:
            throw new Error('Unknown node type: ' + node.type);
        }

        if (!sourceMap) {
            return result.toString();
        }


        pair = result.toStringWithSourceMap({
            file: options.file,
            sourceRoot: options.sourceMapRoot
        });

        if (options.sourceContent) {
            pair.map.setSourceContent(options.sourceMap,
                                      options.sourceContent);
        }

        if (options.sourceMapWithCode) {
            return pair;
        }

        return pair.map.toString();
    }

    FORMAT_MINIFY = {
        indent: {
            style: '',
            base: 0
        },
        renumber: true,
        hexadecimal: true,
        quotes: 'auto',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
    };

    FORMAT_DEFAULTS = getDefaultOptions().format;

    exports.version = require('./package.json').version;
    exports.generate = generate;
    exports.attachComments = estraverse.attachComments;
    exports.Precedence = updateDeeply({}, Precedence);
    exports.browser = false;
    exports.FORMAT_MINIFY = FORMAT_MINIFY;
    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
}());
/* vim: set sw=4 ts=4 et tw=80 : */

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./package.json":24,"estraverse":25,"esutils":13,"source-map":14}],11:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var Regex;

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
    };

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }

    function isHexDigit(ch) {
        return isDecimalDigit(ch) || (97 <= ch && ch <= 102) || (65 <= ch && ch <= 70);
    }

    function isOctalDigit(ch) {
        return (ch >= 48 && ch <= 55);   // 0..7
    }

    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch === 92) ||                    // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch >= 48 && ch <= 57) ||         // 0..9
            (ch === 92) ||                    // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStart: isIdentifierStart,
        isIdentifierPart: isIdentifierPart
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],12:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var code = require('./code');

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierName(id) {
        var i, iz, ch;

        if (id.length === 0) {
            return false;
        }

        ch = id.charCodeAt(0);
        if (!code.isIdentifierStart(ch) || ch === 92) {  // \ (backslash)
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code.isIdentifierPart(ch) || ch === 92) {  // \ (backslash)
                return false;
            }
        }
        return true;
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierName: isIdentifierName
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":11}],13:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {
    'use strict';

    exports.code = require('./code');
    exports.keyword = require('./keyword');
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":11,"./keyword":12}],14:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":19,"./source-map/source-map-generator":20,"./source-map/source-node":21}],15:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});

},{"./util":22,"amdefine":23}],16:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string.
   */
  exports.decode = function base64VLQ_decode(aStr) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    return {
      value: fromVLQSigned(result),
      rest: aStr.slice(i)
    };
  };

});

},{"./base64":17,"amdefine":23}],17:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var charToIntMap = {};
  var intToCharMap = {};

  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .forEach(function (ch, index) {
      charToIntMap[ch] = index;
      intToCharMap[index] = ch;
    });

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 digit to an integer.
   */
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
    }
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  };

});

},{"amdefine":23}],18:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return aHaystack[mid];
    }
    else if (cmp > 0) {
      // aHaystack[mid] is greater than our needle.
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
      }
      // We did not find an exact match, return the next closest one
      // (termination case 2).
      return aHaystack[mid];
    }
    else {
      // aHaystack[mid] is less than our needle.
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
      }
      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (2) or (3) and return the appropriate thing.
      return aLow < 0
        ? null
        : aHaystack[aLow];
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0
      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
      : null;
  };

});

},{"amdefine":23}],19:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');

  /**
   * A SourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  /**
   * Create a SourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns SourceMapConsumer
   */
  SourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(SourceMapConsumer.prototype);

      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      smc.__generatedMappings = aSourceMap._mappings.slice()
        .sort(util.compareByGeneratedPositions);
      smc.__originalMappings = aSourceMap._mappings.slice()
        .sort(util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var mappingSeparator = /^[,;]/;
      var str = aStr;
      var mapping;
      var temp;

      while (str.length > 0) {
        if (str.charAt(0) === ';') {
          generatedLine++;
          str = str.slice(1);
          previousGeneratedColumn = 0;
        }
        else if (str.charAt(0) === ',') {
          str = str.slice(1);
        }
        else {
          mapping = {};
          mapping.generatedLine = generatedLine;

          // Generated column.
          temp = base64VLQ.decode(str);
          mapping.generatedColumn = previousGeneratedColumn + temp.value;
          previousGeneratedColumn = mapping.generatedColumn;
          str = temp.rest;

          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
            // Original source.
            temp = base64VLQ.decode(str);
            mapping.source = this._sources.at(previousSource + temp.value);
            previousSource += temp.value;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source, but no line and column');
            }

            // Original line.
            temp = base64VLQ.decode(str);
            mapping.originalLine = previousOriginalLine + temp.value;
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source and line, but no column');
            }

            // Original column.
            temp = base64VLQ.decode(str);
            mapping.originalColumn = previousOriginalColumn + temp.value;
            previousOriginalColumn = mapping.originalColumn;
            str = temp.rest;

            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
              // Original name.
              temp = base64VLQ.decode(str);
              mapping.name = this._names.at(previousName + temp.value);
              previousName += temp.value;
              str = temp.rest;
            }
          }

          this.__generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            this.__originalMappings.push(mapping);
          }
        }
      }

      this.__generatedMappings.sort(util.compareByGeneratedPositions);
      this.__originalMappings.sort(util.compareByOriginalPositions);
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  SourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator);
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  SourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var mapping = this._findMapping(needle,
                                      this._generatedMappings,
                                      "generatedLine",
                                      "generatedColumn",
                                      util.compareByGeneratedPositions);

      if (mapping && mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source && this.sourceRoot) {
          source = util.join(this.sourceRoot, source);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: util.getArg(mapping, 'name', null)
        };
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  SourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      throw new Error('"' + aSource + '" is not in the SourceMap.');
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      if (this.sourceRoot) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }

      var mapping = this._findMapping(needle,
                                      this._originalMappings,
                                      "originalLine",
                                      "originalColumn",
                                      util.compareByOriginalPositions);

      if (mapping) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null)
        };
      }

      return {
        line: null,
        column: null
      };
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source;
        if (source && sourceRoot) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name
        };
      }).forEach(aCallback, context);
    };

  exports.SourceMapConsumer = SourceMapConsumer;

});

},{"./array-set":15,"./base64-vlq":16,"./binary-search":18,"./util":22,"amdefine":23}],20:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source) {
          newMapping.source = mapping.source;
          if (sourceRoot) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      this._validateMapping(generated, original, source, name);

      if (source && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.push({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent !== null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (!aSourceFile) {
        if (!aSourceMapConsumer.file) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        aSourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "aSourceFile" relative if an absolute Url is passed.
      if (sourceRoot) {
        aSourceFile = util.relative(sourceRoot, aSourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "aSourceFile"
      this._mappings.forEach(function (mapping) {
        if (mapping.source === aSourceFile && mapping.originalLine) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source !== null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath) {
              mapping.source = util.join(aSourceMapPath, mapping.source)
            }
            if (sourceRoot) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name !== null && mapping.name !== null) {
              // Only use the identifier name if it's an identifier
              // in both SourceMaps
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          if (sourceRoot) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      // The mappings must be guaranteed to be in sorted order before we start
      // serializing them or else the generated line numbers (which are defined
      // via the ';' separators) will be all messed up. Note: it might be more
      // performant to maintain the sorting as we insert them, rather than as we
      // serialize them, but the big O is the same either way.
      this._mappings.sort(util.compareByGeneratedPositions);

      for (var i = 0, len = this._mappings.length; i < len; i++) {
        mapping = this._mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        file: this._file,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._sourceRoot) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this);
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});

},{"./array-set":15,"./base64-vlq":16,"./util":22,"amdefine":23}],21:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
  var util = require('./util');

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine === undefined ? null : aLine;
    this.column = aColumn === undefined ? null : aColumn;
    this.source = aSource === undefined ? null : aSource;
    this.name = aName === undefined ? null : aName;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // The generated code
      // Processed fragments are removed from this array.
      var remainingLines = aGeneratedCode.split('\n');

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, remainingLines.shift() + "\n");
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(remainingLines.shift() + "\n");
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[0];
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLines.length > 0) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          var lastLine = remainingLines.shift();
          if (remainingLines.length > 0) lastLine += "\n";
          addMappingWithCode(lastMapping, lastLine);
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.join("\n"));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  mapping.source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i] instanceof SourceNode) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      chunk.split('').forEach(function (ch, idx, array) {
        if (ch === '\n') {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === array.length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      });
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});

},{"./source-map-generator":20,"./util":22,"amdefine":23}],22:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consequtive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = (path.charAt(0) === '/');

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  function relative(aRoot, aPath) {
    aRoot = aRoot.replace(/\/$/, '');

    var url = urlParse(aRoot);
    if (aPath.charAt(0) == "/" && url && url.path == "/") {
      return aPath.slice(1);
    }

    return aPath.indexOf(aRoot + '/') === 0
      ? aPath.substr(aRoot.length + 1)
      : aPath;
  }
  exports.relative = relative;

  function strcmp(aStr1, aStr2) {
    var s1 = aStr1 || "";
    var s2 = aStr2 || "";
    return (s1 > s2) - (s1 < s2);
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp;

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp || onlyCompareOriginal) {
      return cmp;
    }

    cmp = strcmp(mappingA.name, mappingB.name);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    return mappingA.generatedColumn - mappingB.generatedColumn;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings where the generated positions are
   * compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
    var cmp;

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp || onlyCompareGenerated) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositions = compareByGeneratedPositions;

});

},{"amdefine":23}],23:[function(require,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = require('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,require("/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"/../../node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":8,"path":9}],24:[function(require,module,exports){
module.exports={
  "name": "escodegen",
  "description": "ECMAScript code generator",
  "homepage": "http://github.com/Constellation/escodegen",
  "main": "escodegen.js",
  "bin": {
    "esgenerate": "./bin/esgenerate.js",
    "escodegen": "./bin/escodegen.js"
  },
  "version": "1.3.2",
  "engines": {
    "node": ">=0.4.0"
  },
  "maintainers": [
    {
      "name": "Yusuke Suzuki",
      "email": "utatane.tea@gmail.com",
      "url": "http://github.com/Constellation"
    }
  ],
  "repository": {
    "type": "git",
    "url": "http://github.com/Constellation/escodegen.git"
  },
  "dependencies": {
    "esutils": "~1.0.0",
    "estraverse": "~1.5.0",
    "esprima": "~1.1.1",
    "source-map": "~0.1.33"
  },
  "optionalDependencies": {
    "source-map": "~0.1.33"
  },
  "devDependencies": {
    "esprima-moz": "*",
    "semver": "*",
    "chai": "~1.7.2",
    "gulp": "~3.5.0",
    "gulp-mocha": "~0.4.1",
    "gulp-eslint": "~0.1.2",
    "jshint-stylish": "~0.1.5",
    "gulp-jshint": "~1.4.0",
    "commonjs-everywhere": "~0.9.6",
    "bluebird": "~1.2.0",
    "bower-registry-client": "~0.2.0"
  },
  "licenses": [
    {
      "type": "BSD",
      "url": "http://github.com/Constellation/escodegen/raw/master/LICENSE.BSD"
    }
  ],
  "scripts": {
    "test": "gulp travis",
    "unit-test": "gulp test",
    "lint": "gulp lint",
    "release": "node tools/release.js",
    "build-min": "cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
    "build": "cjsify -a path: tools/entry-point.js > escodegen.browser.js"
  },
  "readme": "### Escodegen [![Build Status](https://secure.travis-ci.org/Constellation/escodegen.svg)](http://travis-ci.org/Constellation/escodegen) [![Build Status](https://drone.io/github.com/Constellation/escodegen/status.png)](https://drone.io/github.com/Constellation/escodegen/latest)\n\nEscodegen ([escodegen](http://github.com/Constellation/escodegen)) is\n[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)\n(also popularly known as [JavaScript](http://en.wikipedia.org/wiki/JavaScript>JavaScript))\ncode generator from [Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) AST.\nSee [online generator demo](http://constellation.github.com/escodegen/demo/index.html).\n\n\n### Install\n\nEscodegen can be used in a web browser:\n\n    <script src=\"escodegen.browser.js\"></script>\n\nescodegen.browser.js is found in tagged-revision. See Tags on GitHub.\n\nOr in a Node.js application via the package manager:\n\n    npm install escodegen\n\n### Usage\n\nA simple example: the program\n\n    escodegen.generate({\n        type: 'BinaryExpression',\n        operator: '+',\n        left: { type: 'Literal', value: 40 },\n        right: { type: 'Literal', value: 2 }\n    });\n\nproduces the string `'40 + 2'`\n\nSee the [API page](https://github.com/Constellation/escodegen/wiki/API) for\noptions. To run the tests, execute `npm test` in the root directory.\n\n### Building browser bundle / minified browser bundle\n\nAt first, executing `npm install` to install the all dev dependencies.\nAfter that,\n\n    npm run-script build\n\nwill generate `escodegen.browser.js`, it is used on the browser environment.\n\nAnd,\n\n    npm run-script build-min\n\nwill generate minified `escodegen.browser.min.js`.\n\n### License\n\n#### Escodegen\n\nCopyright (C) 2012 [Yusuke Suzuki](http://github.com/Constellation)\n (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n  * Redistributions of source code must retain the above copyright\n    notice, this list of conditions and the following disclaimer.\n\n  * Redistributions in binary form must reproduce the above copyright\n    notice, this list of conditions and the following disclaimer in the\n    documentation and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\nARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY\nDIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\nLOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\nON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\nTHIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\n#### source-map\n\nSourceNodeMocks has a limited interface of mozilla/source-map SourceNode implementations.\n\nCopyright (c) 2009-2011, Mozilla Foundation and contributors\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n* Redistributions of source code must retain the above copyright notice, this\n  list of conditions and the following disclaimer.\n\n* Redistributions in binary form must reproduce the above copyright notice,\n  this list of conditions and the following disclaimer in the documentation\n  and/or other materials provided with the distribution.\n\n* Neither the names of the Mozilla Foundation nor the names of project\n  contributors may be used to endorse or promote products derived from this\n  software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\nANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\nWARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n",
  "readmeFilename": "README.md",
  "bugs": {
    "url": "https://github.com/Constellation/escodegen/issues"
  },
  "_id": "escodegen@1.3.2",
  "dist": {
    "shasum": "bb0f434dbd594f2060639a79b4b06259dd5372de"
  },
  "_from": "escodegen@^1.3.1",
  "_resolved": "https://registry.npmjs.org/escodegen/-/escodegen-1.3.2.tgz"
}

},{}],25:[function(require,module,exports){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint vars:false, bitwise:true*/
/*jshint indent:4*/
/*global exports:true, define:true*/
(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // and plain browser loading,
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.estraverse = {}));
    }
}(this, function (exports) {
    'use strict';

    var Syntax,
        isArray,
        VisitorOption,
        VisitorKeys,
        BREAK,
        SKIP;

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    function ignoreJSHintError() { }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    ignoreJSHintError(shallowCopy);

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    function lowerBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            } else {
                len = diff;
            }
        }
        return i;
    }
    ignoreJSHintError(lowerBound);

    VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'body', 'superClass'],
        ClassExpression: ['id', 'body', 'superClass'],
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MethodDefinition: ['key', 'value'],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: ['key', 'value'],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id
    BREAK = {};
    SKIP = {};

    VisitorOption = {
        Break: BREAK,
        Skip: SKIP
    };

    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }

    Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
    };

    function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }

    function Controller() { }

    // API:
    // return property path array from root to current node
    Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;

        function addToPath(result, path) {
            if (isArray(path)) {
                for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                }
            } else {
                result.push(path);
            }
        }

        // root node
        if (!this.__current.path) {
            return null;
        }

        // first node is sentinel, second node is root element
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
            element = this.__leavelist[i];
            addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
    };

    // API:
    // return array of parent elements
    Controller.prototype.parents = function parents() {
        var i, iz, result;

        // first node is sentinel
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    };

    // API:
    // return current node
    Controller.prototype.current = function current() {
        return this.__current.node;
    };

    Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;

        result = undefined;

        previous  = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;

        return result;
    };

    // API:
    // notify control skip / break
    Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
    };

    // API:
    // skip child nodes of current node
    Controller.prototype.skip = function () {
        this.notify(SKIP);
    };

    // API:
    // break traversals
    Controller.prototype['break'] = function () {
        this.notify(BREAK);
    };

    Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
    };

    Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist,
            leavelist,
            element,
            node,
            nodeType,
            ret,
            key,
            current,
            current2,
            candidates,
            candidate,
            sentinel;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                ret = this.__execute(visitor.leave, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {

                ret = this.__execute(visitor.enter, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                node = element.node;
                nodeType = element.wrap || node.type;
                candidates = VisitorKeys[nodeType];

                current = candidates.length;
                while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (!isArray(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                        continue;
                    }

                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                            continue;
                        }
                        if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                            element = new Element(candidate[current2], [key, current2], 'Property', null);
                        } else {
                            element = new Element(candidate[current2], [key, current2], null, null);
                        }
                        worklist.push(element);
                    }
                }
            }
        }
    };

    Controller.prototype.replace = function replace(root, visitor) {
        var worklist,
            leavelist,
            node,
            nodeType,
            target,
            element,
            current,
            current2,
            candidates,
            candidate,
            sentinel,
            outer,
            key;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        outer = {
            root: root
        };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                target = this.__execute(visitor.leave, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP) {
                    // replace
                    element.ref.replace(target);
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }
                continue;
            }

            target = this.__execute(visitor.enter, element);

            // node may be replaced with null,
            // so distinguish between undefined and null in this place
            if (target !== undefined && target !== BREAK && target !== SKIP) {
                // replace
                element.ref.replace(target);
                element.node = target;
            }

            if (this.__state === BREAK || target === BREAK) {
                return outer.root;
            }

            // node may be null
            node = element.node;
            if (!node) {
                continue;
            }

            worklist.push(sentinel);
            leavelist.push(element);

            if (this.__state === SKIP || target === SKIP) {
                continue;
            }

            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];

            current = candidates.length;
            while ((current -= 1) >= 0) {
                key = candidates[current];
                candidate = node[key];
                if (!candidate) {
                    continue;
                }

                if (!isArray(candidate)) {
                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                    continue;
                }

                current2 = candidate.length;
                while ((current2 -= 1) >= 0) {
                    if (!candidate[current2]) {
                        continue;
                    }
                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                    } else {
                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                    }
                    worklist.push(element);
                }
            }
        }

        return outer.root;
    };

    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        var target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }

        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        var comments = [], comment, len, i, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.version = '1.3.3-dev';
    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],26:[function(require,module,exports){
(function(definition){if(typeof exports==="object"){module.exports=definition();}else if(typeof define==="function"&&define.amd){define(definition);}else{mori=definition();}})(function(){return function(){
var f,aa=this;
function m(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function n(a,b){var c=a.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b};function da(a,b){a.sort(b||ea)}function fa(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||ea;da(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function ea(a,b){return a>b?1:a<b?-1:0};function ga(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ha(a,b){null!=a&&this.append.apply(this,arguments)}ha.prototype.Ja="";ha.prototype.append=function(a,b,c){this.Ja+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ja+=arguments[d];return this};ha.prototype.toString=function(){return this.Ja};var ia,ja=null;function ka(){return new ma(null,5,[oa,!0,pa,!0,qa,!1,ra,!1,sa,null],null)}function p(a){return null!=a&&!1!==a}function ta(a){return p(a)?!1:!0}function s(a,b){return a[m(null==b?null:b)]?!0:a._?!0:t?!1:null}function ua(a){return null==a?null:a.constructor}function v(a,b){var c=ua(b),c=p(p(c)?c.bb:c)?c.ab:m(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function va(a){var b=a.ab;return p(b)?b:""+w(a)}
function wa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function xa(a){return Array.prototype.slice.call(arguments)}
var za=function(){function a(a,b){return x.c?x.c(function(a,b){a.push(b);return a},[],b):x.call(null,function(a,b){a.push(b);return a},[],b)}function b(a){return c.a(null,a)}var c=null,c=function(d,c){switch(arguments.length){case 1:return b.call(this,d);case 2:return a.call(this,0,c)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Aa={},Ba={};
function Ca(a){if(a?a.J:a)return a.J(a);var b;b=Ca[m(null==a?null:a)];if(!b&&(b=Ca._,!b))throw v("ICounted.-count",a);return b.call(null,a)}function Da(a){if(a?a.G:a)return a.G(a);var b;b=Da[m(null==a?null:a)];if(!b&&(b=Da._,!b))throw v("IEmptyableCollection.-empty",a);return b.call(null,a)}var Ea={};function Fa(a,b){if(a?a.D:a)return a.D(a,b);var c;c=Fa[m(null==a?null:a)];if(!c&&(c=Fa._,!c))throw v("ICollection.-conj",a);return c.call(null,a,b)}
var Ga={},y=function(){function a(a,b,c){if(a?a.$:a)return a.$(a,b,c);var h;h=y[m(null==a?null:a)];if(!h&&(h=y._,!h))throw v("IIndexed.-nth",a);return h.call(null,a,b,c)}function b(a,b){if(a?a.P:a)return a.P(a,b);var c;c=y[m(null==a?null:a)];if(!c&&(c=y._,!c))throw v("IIndexed.-nth",a);return c.call(null,a,b)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),
Ha={};function Ia(a){if(a?a.O:a)return a.O(a);var b;b=Ia[m(null==a?null:a)];if(!b&&(b=Ia._,!b))throw v("ISeq.-first",a);return b.call(null,a)}function Ja(a){if(a?a.T:a)return a.T(a);var b;b=Ja[m(null==a?null:a)];if(!b&&(b=Ja._,!b))throw v("ISeq.-rest",a);return b.call(null,a)}
var Ka={},La={},Ma=function(){function a(a,b,c){if(a?a.u:a)return a.u(a,b,c);var h;h=Ma[m(null==a?null:a)];if(!h&&(h=Ma._,!h))throw v("ILookup.-lookup",a);return h.call(null,a,b,c)}function b(a,b){if(a?a.t:a)return a.t(a,b);var c;c=Ma[m(null==a?null:a)];if(!c&&(c=Ma._,!c))throw v("ILookup.-lookup",a);return c.call(null,a,b)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=
a;return c}(),Oa={};function Pa(a,b){if(a?a.Wa:a)return a.Wa(a,b);var c;c=Pa[m(null==a?null:a)];if(!c&&(c=Pa._,!c))throw v("IAssociative.-contains-key?",a);return c.call(null,a,b)}function Qa(a,b,c){if(a?a.pa:a)return a.pa(a,b,c);var d;d=Qa[m(null==a?null:a)];if(!d&&(d=Qa._,!d))throw v("IAssociative.-assoc",a);return d.call(null,a,b,c)}var Ra={};function Sa(a,b){if(a?a.Za:a)return a.Za(a,b);var c;c=Sa[m(null==a?null:a)];if(!c&&(c=Sa._,!c))throw v("IMap.-dissoc",a);return c.call(null,a,b)}var Ta={};
function Ua(a){if(a?a.La:a)return a.La(a);var b;b=Ua[m(null==a?null:a)];if(!b&&(b=Ua._,!b))throw v("IMapEntry.-key",a);return b.call(null,a)}function Va(a){if(a?a.Ma:a)return a.Ma(a);var b;b=Va[m(null==a?null:a)];if(!b&&(b=Va._,!b))throw v("IMapEntry.-val",a);return b.call(null,a)}var Wa={};function Xa(a,b){if(a?a.vb:a)return a.vb(a,b);var c;c=Xa[m(null==a?null:a)];if(!c&&(c=Xa._,!c))throw v("ISet.-disjoin",a);return c.call(null,a,b)}
function Ya(a){if(a?a.wa:a)return a.wa(a);var b;b=Ya[m(null==a?null:a)];if(!b&&(b=Ya._,!b))throw v("IStack.-peek",a);return b.call(null,a)}function Za(a){if(a?a.xa:a)return a.xa(a);var b;b=Za[m(null==a?null:a)];if(!b&&(b=Za._,!b))throw v("IStack.-pop",a);return b.call(null,a)}var $a={};function ab(a,b,c){if(a?a.za:a)return a.za(a,b,c);var d;d=ab[m(null==a?null:a)];if(!d&&(d=ab._,!d))throw v("IVector.-assoc-n",a);return d.call(null,a,b,c)}
function bb(a){if(a?a.hb:a)return a.hb(a);var b;b=bb[m(null==a?null:a)];if(!b&&(b=bb._,!b))throw v("IDeref.-deref",a);return b.call(null,a)}var cb={};function db(a){if(a?a.B:a)return a.B(a);var b;b=db[m(null==a?null:a)];if(!b&&(b=db._,!b))throw v("IMeta.-meta",a);return b.call(null,a)}var eb={};function fb(a,b){if(a?a.C:a)return a.C(a,b);var c;c=fb[m(null==a?null:a)];if(!c&&(c=fb._,!c))throw v("IWithMeta.-with-meta",a);return c.call(null,a,b)}
var gb={},hb=function(){function a(a,b,c){if(a?a.K:a)return a.K(a,b,c);var h;h=hb[m(null==a?null:a)];if(!h&&(h=hb._,!h))throw v("IReduce.-reduce",a);return h.call(null,a,b,c)}function b(a,b){if(a?a.N:a)return a.N(a,b);var c;c=hb[m(null==a?null:a)];if(!c&&(c=hb._,!c))throw v("IReduce.-reduce",a);return c.call(null,a,b)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();
function jb(a,b,c){if(a?a.Ka:a)return a.Ka(a,b,c);var d;d=jb[m(null==a?null:a)];if(!d&&(d=jb._,!d))throw v("IKVReduce.-kv-reduce",a);return d.call(null,a,b,c)}function kb(a,b){if(a?a.v:a)return a.v(a,b);var c;c=kb[m(null==a?null:a)];if(!c&&(c=kb._,!c))throw v("IEquiv.-equiv",a);return c.call(null,a,b)}function lb(a){if(a?a.A:a)return a.A(a);var b;b=lb[m(null==a?null:a)];if(!b&&(b=lb._,!b))throw v("IHash.-hash",a);return b.call(null,a)}var mb={};
function nb(a){if(a?a.F:a)return a.F(a);var b;b=nb[m(null==a?null:a)];if(!b&&(b=nb._,!b))throw v("ISeqable.-seq",a);return b.call(null,a)}var ob={},pb={},qb={};function rb(a){if(a?a.Ga:a)return a.Ga(a);var b;b=rb[m(null==a?null:a)];if(!b&&(b=rb._,!b))throw v("IReversible.-rseq",a);return b.call(null,a)}function sb(a,b){if(a?a.yb:a)return a.yb(a,b);var c;c=sb[m(null==a?null:a)];if(!c&&(c=sb._,!c))throw v("ISorted.-sorted-seq",a);return c.call(null,a,b)}
function tb(a,b,c){if(a?a.zb:a)return a.zb(a,b,c);var d;d=tb[m(null==a?null:a)];if(!d&&(d=tb._,!d))throw v("ISorted.-sorted-seq-from",a);return d.call(null,a,b,c)}function ub(a,b){if(a?a.xb:a)return a.xb(a,b);var c;c=ub[m(null==a?null:a)];if(!c&&(c=ub._,!c))throw v("ISorted.-entry-key",a);return c.call(null,a,b)}function vb(a){if(a?a.wb:a)return a.wb(a);var b;b=vb[m(null==a?null:a)];if(!b&&(b=vb._,!b))throw v("ISorted.-comparator",a);return b.call(null,a)}
function z(a,b){if(a?a.Qb:a)return a.Qb(0,b);var c;c=z[m(null==a?null:a)];if(!c&&(c=z._,!c))throw v("IWriter.-write",a);return c.call(null,a,b)}var xb={};function yb(a,b,c){if(a?a.w:a)return a.w(a,b,c);var d;d=yb[m(null==a?null:a)];if(!d&&(d=yb._,!d))throw v("IPrintWithWriter.-pr-writer",a);return d.call(null,a,b,c)}function zb(a,b,c){if(a?a.Pb:a)return a.Pb(0,b,c);var d;d=zb[m(null==a?null:a)];if(!d&&(d=zb._,!d))throw v("IWatchable.-notify-watches",a);return d.call(null,a,b,c)}
function Ab(a){if(a?a.Ea:a)return a.Ea(a);var b;b=Ab[m(null==a?null:a)];if(!b&&(b=Ab._,!b))throw v("IEditableCollection.-as-transient",a);return b.call(null,a)}function Bb(a,b){if(a?a.qa:a)return a.qa(a,b);var c;c=Bb[m(null==a?null:a)];if(!c&&(c=Bb._,!c))throw v("ITransientCollection.-conj!",a);return c.call(null,a,b)}function Cb(a){if(a?a.ya:a)return a.ya(a);var b;b=Cb[m(null==a?null:a)];if(!b&&(b=Cb._,!b))throw v("ITransientCollection.-persistent!",a);return b.call(null,a)}
function Db(a,b,c){if(a?a.Oa:a)return a.Oa(a,b,c);var d;d=Db[m(null==a?null:a)];if(!d&&(d=Db._,!d))throw v("ITransientAssociative.-assoc!",a);return d.call(null,a,b,c)}function Eb(a,b){if(a?a.Ab:a)return a.Ab(a,b);var c;c=Eb[m(null==a?null:a)];if(!c&&(c=Eb._,!c))throw v("ITransientMap.-dissoc!",a);return c.call(null,a,b)}function Fb(a,b,c){if(a?a.Nb:a)return a.Nb(0,b,c);var d;d=Fb[m(null==a?null:a)];if(!d&&(d=Fb._,!d))throw v("ITransientVector.-assoc-n!",a);return d.call(null,a,b,c)}
function Gb(a){if(a?a.Ob:a)return a.Ob();var b;b=Gb[m(null==a?null:a)];if(!b&&(b=Gb._,!b))throw v("ITransientVector.-pop!",a);return b.call(null,a)}function Hb(a,b){if(a?a.Mb:a)return a.Mb(0,b);var c;c=Hb[m(null==a?null:a)];if(!c&&(c=Hb._,!c))throw v("ITransientSet.-disjoin!",a);return c.call(null,a,b)}function Ib(a){if(a?a.Ib:a)return a.Ib();var b;b=Ib[m(null==a?null:a)];if(!b&&(b=Ib._,!b))throw v("IChunk.-drop-first",a);return b.call(null,a)}
function Jb(a){if(a?a.fb:a)return a.fb(a);var b;b=Jb[m(null==a?null:a)];if(!b&&(b=Jb._,!b))throw v("IChunkedSeq.-chunked-first",a);return b.call(null,a)}function Kb(a){if(a?a.gb:a)return a.gb(a);var b;b=Kb[m(null==a?null:a)];if(!b&&(b=Kb._,!b))throw v("IChunkedSeq.-chunked-rest",a);return b.call(null,a)}function Lb(a){if(a?a.eb:a)return a.eb(a);var b;b=Lb[m(null==a?null:a)];if(!b&&(b=Lb._,!b))throw v("IChunkedNext.-chunked-next",a);return b.call(null,a)}
function Mb(a){this.kc=a;this.p=0;this.h=1073741824}Mb.prototype.Qb=function(a,b){return this.kc.append(b)};function Nb(a){var b=new ha;a.w(null,new Mb(b),ka());return""+w(b)}function Ob(a,b){if(p(Pb.a?Pb.a(a,b):Pb.call(null,a,b)))return 0;var c=ta(a.X);if(p(c?b.X:c))return-1;if(p(a.X)){if(ta(b.X))return 1;c=Qb.a?Qb.a(a.X,b.X):Qb.call(null,a.X,b.X);return 0===c?Qb.a?Qb.a(a.name,b.name):Qb.call(null,a.name,b.name):c}return Rb?Qb.a?Qb.a(a.name,b.name):Qb.call(null,a.name,b.name):null}
function Sb(a,b,c,d,e){this.X=a;this.name=b;this.ua=c;this.va=d;this.V=e;this.h=2154168321;this.p=4096}f=Sb.prototype;f.w=function(a,b){return z(b,this.ua)};f.A=function(){var a=this.va;return null!=a?a:this.va=a=Tb.a?Tb.a(A.b?A.b(this.X):A.call(null,this.X),A.b?A.b(this.name):A.call(null,this.name)):Tb.call(null,A.b?A.b(this.X):A.call(null,this.X),A.b?A.b(this.name):A.call(null,this.name))};f.C=function(a,b){return new Sb(this.X,this.name,this.ua,this.va,b)};f.B=function(){return this.V};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return Ma.c(c,this,null);case 3:return Ma.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return Ma.c(a,this,null)};f.a=function(a,b){return Ma.c(a,this,b)};f.v=function(a,b){return b instanceof Sb?this.ua===b.ua:!1};f.toString=function(){return this.ua};
function C(a){if(null==a)return null;if(a&&(a.h&8388608||a.ac))return a.F(null);if(a instanceof Array||"string"===typeof a)return 0===a.length?null:new Ub(a,0);if(s(mb,a))return nb(a);if(t)throw Error([w(a),w("is not ISeqable")].join(""));return null}function D(a){if(null==a)return null;if(a&&(a.h&64||a.Na))return a.O(null);a=C(a);return null==a?null:Ia(a)}function E(a){return null!=a?a&&(a.h&64||a.Na)?a.T(null):(a=C(a))?Ja(a):F:F}
function G(a){return null==a?null:a&&(a.h&128||a.$a)?a.S(null):C(E(a))}
var Pb=function(){function a(a,b){return null==a?null==b:a===b||kb(a,b)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){for(;;)if(b.a(a,d))if(G(e))a=d,d=D(e),e=G(e);else return b.a(d,D(e));else return!1}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 1:return!0;case 2:return a.call(this,b,
e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.b=function(){return!0};b.a=a;b.e=c.e;return b}();Ba["null"]=!0;Ca["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.toString()===b.toString()};kb.number=function(a,b){return a===b};cb["function"]=!0;db["function"]=function(){return null};Aa["function"]=!0;lb._=function(a){return a[ba]||(a[ba]=++ca)};function Vb(a){this.k=a;this.p=0;this.h=32768}
Vb.prototype.hb=function(){return this.k};function Wb(a){return a instanceof Vb}
var Xb=function(){function a(a,b,c,d){for(var l=Ca(a);;)if(d<l){c=b.a?b.a(c,y.a(a,d)):b.call(null,c,y.a(a,d));if(Wb(c))return I.b?I.b(c):I.call(null,c);d+=1}else return c}function b(a,b,c){for(var d=Ca(a),l=0;;)if(l<d){c=b.a?b.a(c,y.a(a,l)):b.call(null,c,y.a(a,l));if(Wb(c))return I.b?I.b(c):I.call(null,c);l+=1}else return c}function c(a,b){var c=Ca(a);if(0===c)return b.m?b.m():b.call(null);for(var d=y.a(a,0),l=1;;)if(l<c){d=b.a?b.a(d,y.a(a,l)):b.call(null,d,y.a(a,l));if(Wb(d))return I.b?I.b(d):I.call(null,
d);l+=1}else return d}var d=null,d=function(d,g,h,k){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.c=b;d.n=a;return d}(),Yb=function(){function a(a,b,c,d){for(var l=a.length;;)if(d<l){c=b.a?b.a(c,a[d]):b.call(null,c,a[d]);if(Wb(c))return I.b?I.b(c):I.call(null,c);d+=1}else return c}function b(a,b,c){for(var d=a.length,l=0;;)if(l<d){c=b.a?b.a(c,a[l]):b.call(null,c,
a[l]);if(Wb(c))return I.b?I.b(c):I.call(null,c);l+=1}else return c}function c(a,b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],l=1;;)if(l<c){d=b.a?b.a(d,a[l]):b.call(null,d,a[l]);if(Wb(d))return I.b?I.b(d):I.call(null,d);l+=1}else return d}var d=null,d=function(d,g,h,k){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.c=b;d.n=a;return d}();
function Zb(a){return a?a.h&2||a.Tb?!0:a.h?!1:s(Ba,a):s(Ba,a)}function $b(a){return a?a.h&16||a.Jb?!0:a.h?!1:s(Ga,a):s(Ga,a)}function Ub(a,b){this.d=a;this.o=b;this.h=166199550;this.p=8192}f=Ub.prototype;f.A=function(){return ac.b?ac.b(this):ac.call(null,this)};f.S=function(){return this.o+1<this.d.length?new Ub(this.d,this.o+1):null};f.D=function(a,b){return J.a?J.a(b,this):J.call(null,b,this)};f.Ga=function(){var a=Ca(this);return 0<a?new bc(this,a-1,null):null};f.toString=function(){return Nb(this)};
f.N=function(a,b){return Yb.n(this.d,b,this.d[this.o],this.o+1)};f.K=function(a,b,c){return Yb.n(this.d,b,c,this.o)};f.F=function(){return this};f.J=function(){return this.d.length-this.o};f.O=function(){return this.d[this.o]};f.T=function(){return this.o+1<this.d.length?new Ub(this.d,this.o+1):F};f.v=function(a,b){return cc.a?cc.a(this,b):cc.call(null,this,b)};f.P=function(a,b){var c=b+this.o;return c<this.d.length?this.d[c]:null};f.$=function(a,b,c){a=b+this.o;return a<this.d.length?this.d[a]:c};
f.G=function(){return F};
var dc=function(){function a(a,b){return b<a.length?new Ub(a,b):null}function b(a){return c.a(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),H=function(){function a(a,b){return dc.a(a,b)}function b(a){return dc.a(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);
};c.b=b;c.a=a;return c}();function bc(a,b,c){this.Va=a;this.o=b;this.j=c;this.h=32374990;this.p=8192}f=bc.prototype;f.A=function(){return ac.b?ac.b(this):ac.call(null,this)};f.S=function(){return 0<this.o?new bc(this.Va,this.o-1,null):null};f.D=function(a,b){return J.a?J.a(b,this):J.call(null,b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a?K.a(b,this):K.call(null,b,this)};f.K=function(a,b,c){return K.c?K.c(b,c,this):K.call(null,b,c,this)};f.F=function(){return this};
f.J=function(){return this.o+1};f.O=function(){return y.a(this.Va,this.o)};f.T=function(){return 0<this.o?new bc(this.Va,this.o-1,null):F};f.v=function(a,b){return cc.a?cc.a(this,b):cc.call(null,this,b)};f.C=function(a,b){return new bc(this.Va,this.o,b)};f.B=function(){return this.j};f.G=function(){return M.a?M.a(F,this.j):M.call(null,F,this.j)};function ec(a){for(;;){var b=G(a);if(null!=b)a=b;else return D(a)}}kb._=function(a,b){return a===b};
var fc=function(){function a(a,b){return null!=a?Fa(a,b):Fa(F,b)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){for(;;)if(p(e))a=b.a(a,d),d=D(e),e=G(e);else return b.a(a,d)}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+
arguments.length);};b.i=2;b.f=c.f;b.a=a;b.e=c.e;return b}();function gc(a){return null==a?null:Da(a)}function N(a){if(null!=a)if(a&&(a.h&2||a.Tb))a=a.J(null);else if(a instanceof Array)a=a.length;else if("string"===typeof a)a=a.length;else if(s(Ba,a))a=Ca(a);else if(t)a:{a=C(a);for(var b=0;;){if(Zb(a)){a=b+Ca(a);break a}a=G(a);b+=1}a=void 0}else a=null;else a=0;return a}
var hc=function(){function a(a,b,c){for(;;){if(null==a)return c;if(0===b)return C(a)?D(a):c;if($b(a))return y.c(a,b,c);if(C(a))a=G(a),b-=1;else return t?c:null}}function b(a,b){for(;;){if(null==a)throw Error("Index out of bounds");if(0===b){if(C(a))return D(a);throw Error("Index out of bounds");}if($b(a))return y.a(a,b);if(C(a)){var c=G(a),h=b-1;a=c;b=h}else{if(t)throw Error("Index out of bounds");return null}}}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,
c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),O=function(){function a(a,b,c){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return c;if(a&&(a.h&16||a.Jb))return a.$(null,b,c);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:c;if(s(Ga,a))return y.a(a,b);if(a?a.h&64||a.Na||(a.h?0:s(Ha,a)):s(Ha,a))return hc.c(a,b,c);if(t)throw Error([w("nth not supported on this type "),w(va(ua(a)))].join(""));return null}function b(a,
b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(a&&(a.h&16||a.Jb))return a.P(null,b);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:null;if(s(Ga,a))return y.a(a,b);if(a?a.h&64||a.Na||(a.h?0:s(Ha,a)):s(Ha,a))return hc.a(a,b);if(t)throw Error([w("nth not supported on this type "),w(va(ua(a)))].join(""));return null}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,
e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),P=function(){function a(a,b,c){return null!=a?a&&(a.h&256||a.Kb)?a.u(null,b,c):a instanceof Array?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:s(La,a)?Ma.c(a,b,c):t?c:null:c}function b(a,b){return null==a?null:a&&(a.h&256||a.Kb)?a.t(null,b):a instanceof Array?b<a.length?a[b]:null:"string"===typeof a?b<a.length?a[b]:null:s(La,a)?Ma.a(a,b):null}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,
c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),Q=function(){function a(a,b,c){return null!=a?Qa(a,b,c):ic.a?ic.a([b],[c]):ic.call(null,[b],[c])}var b=null,c=function(){function a(b,d,k,l){var q=null;3<arguments.length&&(q=H(Array.prototype.slice.call(arguments,3),0));return c.call(this,b,d,k,q)}function c(a,d,e,l){for(;;)if(a=b.c(a,d,e),p(l))d=D(l),e=D(G(l)),l=G(G(l));else return a}a.i=3;a.f=function(a){var b=D(a);a=G(a);var d=D(a);
a=G(a);var l=D(a);a=E(a);return c(b,d,l,a)};a.e=c;return a}(),b=function(b,e,g,h){switch(arguments.length){case 3:return a.call(this,b,e,g);default:return c.e(b,e,g,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};b.i=3;b.f=c.f;b.c=a;b.e=c.e;return b}(),jc=function(){function a(a,b){return null==a?null:Sa(a,b)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){for(;;){if(null==
a)return null;a=b.a(a,d);if(p(e))d=D(e),e=G(e);else return a}}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.b=function(a){return a};b.a=a;b.e=c.e;return b}();function kc(a){var b="function"==m(a);return b?b:a?p(p(null)?null:a.Sb)?!0:a.Cb?!1:s(Aa,a):s(Aa,a)}
var M=function lc(b,c){return kc(b)&&!(b?b.h&262144||b.Ac||(b.h?0:s(eb,b)):s(eb,b))?lc(function(){"undefined"===typeof ia&&(ia=function(b,c,g,h){this.j=b;this.Sa=c;this.mc=g;this.gc=h;this.p=0;this.h=393217},ia.bb=!0,ia.ab="cljs.core/t5164",ia.Bb=function(b,c){return z(c,"cljs.core/t5164")},ia.prototype.call=function(){function b(d,h){d=this;var k=null;1<arguments.length&&(k=H(Array.prototype.slice.call(arguments,1),0));return c.call(this,d,k)}function c(b,d){return R.a?R.a(b.Sa,d):R.call(null,b.Sa,
d)}b.i=1;b.f=function(b){var d=D(b);b=E(b);return c(d,b)};b.e=c;return b}(),ia.prototype.apply=function(b,c){return this.call.apply(this,[this].concat(wa(c)))},ia.prototype.a=function(){function b(d){var h=null;0<arguments.length&&(h=H(Array.prototype.slice.call(arguments,0),0));return c.call(this,h)}function c(b){return R.a?R.a(self__.Sa,b):R.call(null,self__.Sa,b)}b.i=0;b.f=function(b){b=C(b);return c(b)};b.e=c;return b}(),ia.prototype.Sb=!0,ia.prototype.B=function(){return this.gc},ia.prototype.C=
function(b,c){return new ia(this.j,this.Sa,this.mc,c)});return new ia(c,b,lc,null)}(),c):null==b?null:fb(b,c)};function mc(a){var b=null!=a;return(b?a?a.h&131072||a.Yb||(a.h?0:s(cb,a)):s(cb,a):b)?db(a):null}function nc(a){return null==a?null:Ya(a)}function oc(a){return null==a?null:Za(a)}
var pc=function(){function a(a,b){return null==a?null:Xa(a,b)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){for(;;){if(null==a)return null;a=b.a(a,d);if(p(e))d=D(e),e=G(e);else return a}}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:return c.e(b,
e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.b=function(a){return a};b.a=a;b.e=c.e;return b}(),qc={},rc=0;function A(a){if(a&&(a.h&4194304||a.tc))a=a.A(null);else if("number"===typeof a)a=Math.floor(a)%2147483647;else if(!0===a)a=1;else if(!1===a)a=0;else if("string"===typeof a){255<rc&&(qc={},rc=0);var b=qc[a];if("number"!==typeof b){for(var c=b=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;qc[a]=b;rc+=1}a=b}else a=null==a?0:t?lb(a):null;return a}
function sc(a){return null==a||ta(C(a))}function tc(a){return null==a?!1:a?a.h&8||a.qc?!0:a.h?!1:s(Ea,a):s(Ea,a)}function uc(a){return null==a?!1:a?a.h&4096||a.yc?!0:a.h?!1:s(Wa,a):s(Wa,a)}function vc(a){return a?a.h&512||a.oc?!0:a.h?!1:s(Oa,a):s(Oa,a)}function wc(a){return a?a.h&16777216||a.xc?!0:a.h?!1:s(ob,a):s(ob,a)}function xc(a){return null==a?!1:a?a.h&1024||a.vc?!0:a.h?!1:s(Ra,a):s(Ra,a)}function yc(a){return a?a.h&16384||a.zc?!0:a.h?!1:s($a,a):s($a,a)}
function zc(a){return a?a.p&512||a.pc?!0:!1:!1}function Ac(a){var b=[];ga(a,function(a){return function(b,e){return a.push(e)}}(b));return b}function Bc(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,e-=1,b+=1}var Cc={};function Dc(a){return null==a?!1:a?a.h&64||a.Na?!0:a.h?!1:s(Ha,a):s(Ha,a)}function Ec(a){return p(a)?!0:!1}function Fc(a,b){return P.c(a,b,Cc)===Cc?!1:!0}
function Qb(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if(ua(a)===ua(b))return a&&(a.p&2048||a.Xa)?a.Ya(null,b):ea(a,b);if(t)throw Error("compare on non-nil objects of different types");return null}
var Gc=function(){function a(a,b,c,h){for(;;){var k=Qb(O.a(a,h),O.a(b,h));if(0===k&&h+1<c)h+=1;else return k}}function b(a,b){var g=N(a),h=N(b);return g<h?-1:g>h?1:t?c.n(a,b,g,0):null}var c=null,c=function(c,e,g,h){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,g,h)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.n=a;return c}();
function Hc(a){return Pb.a(a,Qb)?Qb:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:p(d)?-1:p(a.a?a.a(c,b):a.call(null,c,b))?1:0}}
var Jc=function(){function a(a,b){if(C(b)){var c=Ic.b?Ic.b(b):Ic.call(null,b);fa(c,Hc(a));return C(c)}return F}function b(a){return c.a(Qb,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Kc=function(){function a(a,b,c){return Jc.a(function(c,g){return Hc(b).call(null,a.b?a.b(c):a.call(null,c),a.b?a.b(g):a.call(null,g))},c)}function b(a,b){return c.c(a,Qb,b)}
var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),K=function(){function a(a,b,c){for(c=C(c);;)if(c){b=a.a?a.a(b,D(c)):a.call(null,b,D(c));if(Wb(b))return I.b?I.b(b):I.call(null,b);c=G(c)}else return b}function b(a,b){var c=C(b);return c?x.c?x.c(a,D(c),G(c)):x.call(null,a,D(c),G(c)):a.m?a.m():a.call(null)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,
c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),x=function(){function a(a,b,c){return c&&(c.h&524288||c.Lb)?c.K(null,a,b):c instanceof Array?Yb.c(c,a,b):"string"===typeof c?Yb.c(c,a,b):s(gb,c)?hb.c(c,a,b):t?K.c(a,b,c):null}function b(a,b){return b&&(b.h&524288||b.Lb)?b.N(null,a):b instanceof Array?Yb.a(b,a):"string"===typeof b?Yb.a(b,a):s(gb,b)?hb.a(b,a):t?K.a(a,b):null}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,
c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),Lc=function(){var a=null,b=function(){function a(c,g,h){var k=null;2<arguments.length&&(k=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,g,k)}function b(a,c,d){for(;;)if(a>c)if(G(d))a=c,c=D(d),d=G(d);else return c>D(d);else return!1}a.i=2;a.f=function(a){var c=D(a);a=G(a);var h=D(a);a=E(a);return b(c,h,a)};a.e=b;return a}(),a=function(a,d,e){switch(arguments.length){case 1:return!0;
case 2:return a>d;default:return b.e(a,d,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};a.i=2;a.f=b.f;a.b=function(){return!0};a.a=function(a,b){return a>b};a.e=b.e;return a}(),Mc=function(){var a=null,b=function(){function a(c,g,h){var k=null;2<arguments.length&&(k=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,g,k)}function b(a,c,d){for(;;)if(a>=c)if(G(d))a=c,c=D(d),d=G(d);else return c>=D(d);else return!1}a.i=2;a.f=function(a){var c=D(a);a=G(a);var h=D(a);
a=E(a);return b(c,h,a)};a.e=b;return a}(),a=function(a,d,e){switch(arguments.length){case 1:return!0;case 2:return a>=d;default:return b.e(a,d,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};a.i=2;a.f=b.f;a.b=function(){return!0};a.a=function(a,b){return a>=b};a.e=b.e;return a}();function Nc(a){return a-1}function Oc(a){return 0<=(a-a%2)/2?Math.floor.b?Math.floor.b((a-a%2)/2):Math.floor.call(null,(a-a%2)/2):Math.ceil.b?Math.ceil.b((a-a%2)/2):Math.ceil.call(null,(a-a%2)/2)}
function Pc(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Qc(a){var b=1;for(a=C(a);;)if(a&&0<b)b-=1,a=G(a);else return a}
var w=function(){function a(a){return null==a?"":a.toString()}var b=null,c=function(){function a(b,d){var k=null;1<arguments.length&&(k=H(Array.prototype.slice.call(arguments,1),0));return c.call(this,b,k)}function c(a,d){for(var e=new ha(b.b(a)),l=d;;)if(p(l))e=e.append(b.b(D(l))),l=G(l);else return e.toString()}a.i=1;a.f=function(a){var b=D(a);a=E(a);return c(b,a)};a.e=c;return a}(),b=function(b,e){switch(arguments.length){case 0:return"";case 1:return a.call(this,b);default:return c.e(b,H(arguments,
1))}throw Error("Invalid arity: "+arguments.length);};b.i=1;b.f=c.f;b.m=function(){return""};b.b=a;b.e=c.e;return b}();function cc(a,b){return Ec(wc(b)?function(){for(var c=C(a),d=C(b);;){if(null==c)return null==d;if(null==d)return!1;if(Pb.a(D(c),D(d)))c=G(c),d=G(d);else return t?!1:null}}():null)}function Tb(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function ac(a){if(C(a)){var b=A(D(a));for(a=G(a);;){if(null==a)return b;b=Tb(b,A(D(a)));a=G(a)}}else return 0}
function Rc(a){var b=0;for(a=C(a);;)if(a){var c=D(a),b=(b+(A(Sc.b?Sc.b(c):Sc.call(null,c))^A(Tc.b?Tc.b(c):Tc.call(null,c))))%4503599627370496;a=G(a)}else return b}function Uc(a){var b=0;for(a=C(a);;)if(a){var c=D(a),b=(b+A(c))%4503599627370496;a=G(a)}else return b}function Vc(a,b,c,d,e){this.j=a;this.Ha=b;this.oa=c;this.count=d;this.l=e;this.h=65937646;this.p=8192}f=Vc.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.S=function(){return 1===this.count?null:this.oa};
f.D=function(a,b){return new Vc(this.j,b,this,this.count+1,null)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.J=function(){return this.count};f.wa=function(){return this.Ha};f.xa=function(){return Ja(this)};f.O=function(){return this.Ha};f.T=function(){return 1===this.count?F:this.oa};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Vc(b,this.Ha,this.oa,this.count,this.l)};
f.B=function(){return this.j};f.G=function(){return F};function Wc(a){this.j=a;this.h=65937614;this.p=8192}f=Wc.prototype;f.A=function(){return 0};f.S=function(){return null};f.D=function(a,b){return new Vc(this.j,b,null,1,null)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return null};f.J=function(){return 0};f.wa=function(){return null};f.xa=function(){throw Error("Can't pop empty list");};f.O=function(){return null};
f.T=function(){return F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Wc(b)};f.B=function(){return this.j};f.G=function(){return this};var F=new Wc(null);function Xc(a){return a?a.h&134217728||a.wc?!0:a.h?!1:s(qb,a):s(qb,a)}function Yc(a){return Xc(a)?rb(a):x.c(fc,F,a)}
var Zc=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){var b;if(a instanceof Ub&&0===a.o)b=a.d;else a:{for(b=[];;)if(null!=a)b.push(a.O(null)),a=a.S(null);else break a;b=void 0}a=b.length;for(var e=F;;)if(0<a){var g=a-1,e=e.D(null,b[a-1]);a=g}else return e}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}();function $c(a,b,c,d){this.j=a;this.Ha=b;this.oa=c;this.l=d;this.h=65929452;this.p=8192}f=$c.prototype;
f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.S=function(){return null==this.oa?null:C(this.oa)};f.D=function(a,b){return new $c(null,b,this,this.l)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.O=function(){return this.Ha};f.T=function(){return null==this.oa?F:this.oa};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new $c(b,this.Ha,this.oa,this.l)};f.B=function(){return this.j};
f.G=function(){return M(F,this.j)};function J(a,b){var c=null==b;return(c?c:b&&(b.h&64||b.Na))?new $c(null,a,b,null):new $c(null,a,C(b),null)}function U(a,b,c,d){this.X=a;this.name=b;this.sa=c;this.va=d;this.h=2153775105;this.p=4096}f=U.prototype;f.w=function(a,b){return z(b,[w(":"),w(this.sa)].join(""))};f.A=function(){null==this.va&&(this.va=Tb(A(this.X),A(this.name))+2654435769);return this.va};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return P.a(c,this);case 3:return P.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return P.a(a,this)};f.a=function(a,b){return P.c(a,this,b)};f.v=function(a,b){return b instanceof U?this.sa===b.sa:!1};f.toString=function(){return[w(":"),w(this.sa)].join("")};
function ad(a,b){return a===b?!0:a instanceof U&&b instanceof U?a.sa===b.sa:!1}
var cd=function(){function a(a,b){return new U(a,b,[w(p(a)?[w(a),w("/")].join(""):null),w(b)].join(""),null)}function b(a){if(a instanceof U)return a;if(a instanceof Sb){var b;if(a&&(a.p&4096||a.Zb))b=a.X;else throw Error([w("Doesn't support namespace: "),w(a)].join(""));return new U(b,bd.b?bd.b(a):bd.call(null,a),a.ua,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new U(b[0],b[1],a,null):new U(null,b[0],a,null)):null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}();function V(a,b,c,d){this.j=a;this.Ia=b;this.I=c;this.l=d;this.p=0;this.h=32374988}f=V.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.S=function(){nb(this);return null==this.I?null:G(this.I)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};function dd(a){null!=a.Ia&&(a.I=a.Ia.m?a.Ia.m():a.Ia.call(null),a.Ia=null);return a.I}
f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){dd(this);if(null==this.I)return null;for(var a=this.I;;)if(a instanceof V)a=dd(a);else return this.I=a,C(this.I)};f.O=function(){nb(this);return null==this.I?null:D(this.I)};f.T=function(){nb(this);return null!=this.I?E(this.I):F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new V(b,this.Ia,this.I,this.l)};f.B=function(){return this.j};f.G=function(){return M(F,this.j)};
function ed(a,b){this.cb=a;this.end=b;this.p=0;this.h=2}ed.prototype.J=function(){return this.end};ed.prototype.add=function(a){this.cb[this.end]=a;return this.end+=1};ed.prototype.ba=function(){var a=new fd(this.cb,0,this.end);this.cb=null;return a};function fd(a,b,c){this.d=a;this.L=b;this.end=c;this.p=0;this.h=524306}f=fd.prototype;f.N=function(a,b){return Yb.n(this.d,b,this.d[this.L],this.L+1)};f.K=function(a,b,c){return Yb.n(this.d,b,c,this.L)};
f.Ib=function(){if(this.L===this.end)throw Error("-drop-first of empty chunk");return new fd(this.d,this.L+1,this.end)};f.P=function(a,b){return this.d[this.L+b]};f.$=function(a,b,c){return 0<=b&&b<this.end-this.L?this.d[this.L+b]:c};f.J=function(){return this.end-this.L};
var gd=function(){function a(a,b,c){return new fd(a,b,c)}function b(a,b){return new fd(a,b,a.length)}function c(a){return new fd(a,0,a.length)}var d=null,d=function(d,g,h){switch(arguments.length){case 1:return c.call(this,d);case 2:return b.call(this,d,g);case 3:return a.call(this,d,g,h)}throw Error("Invalid arity: "+arguments.length);};d.b=c;d.a=b;d.c=a;return d}();function hd(a,b,c,d){this.ba=a;this.la=b;this.j=c;this.l=d;this.h=31850732;this.p=1536}f=hd.prototype;
f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.S=function(){if(1<Ca(this.ba))return new hd(Ib(this.ba),this.la,this.j,null);var a=nb(this.la);return null==a?null:a};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.F=function(){return this};f.O=function(){return y.a(this.ba,0)};f.T=function(){return 1<Ca(this.ba)?new hd(Ib(this.ba),this.la,this.j,null):null==this.la?F:this.la};f.eb=function(){return null==this.la?null:this.la};
f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new hd(this.ba,this.la,b,this.l)};f.B=function(){return this.j};f.G=function(){return M(F,this.j)};f.fb=function(){return this.ba};f.gb=function(){return null==this.la?F:this.la};function id(a,b){return 0===Ca(a)?b:new hd(a,b,null,null)}function Ic(a){for(var b=[];;)if(C(a))b.push(D(a)),a=G(a);else return b}function jd(a,b){if(Zb(a))return N(a);for(var c=a,d=b,e=0;;)if(0<d&&C(c))c=G(c),d-=1,e+=1;else return e}
var ld=function kd(b){return null==b?null:null==G(b)?C(D(b)):t?J(D(b),kd(G(b))):null},md=function(){function a(a,b){return new V(null,function(){var c=C(a);return c?zc(c)?id(Jb(c),d.a(Kb(c),b)):J(D(c),d.a(E(c),b)):b},null,null)}function b(a){return new V(null,function(){return a},null,null)}function c(){return new V(null,function(){return null},null,null)}var d=null,e=function(){function a(c,d,e){var g=null;2<arguments.length&&(g=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,
d,g)}function b(a,c,e){return function u(a,b){return new V(null,function(){var c=C(a);return c?zc(c)?id(Jb(c),u(Kb(c),b)):J(D(c),u(E(c),b)):p(b)?u(D(b),G(b)):null},null,null)}(d.a(a,c),e)}a.i=2;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=E(a);return b(c,d,a)};a.e=b;return a}(),d=function(d,h,k){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,d);case 2:return a.call(this,d,h);default:return e.e(d,h,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};d.i=
2;d.f=e.f;d.m=c;d.b=b;d.a=a;d.e=e.e;return d}(),nd=function(){function a(a,b,c,d){return J(a,J(b,J(c,d)))}function b(a,b,c){return J(a,J(b,c))}var c=null,d=function(){function a(c,d,e,q,r){var u=null;4<arguments.length&&(u=H(Array.prototype.slice.call(arguments,4),0));return b.call(this,c,d,e,q,u)}function b(a,c,d,e,g){return J(a,J(c,J(d,J(e,ld(g)))))}a.i=4;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var r=D(a);a=E(a);return b(c,d,e,r,a)};a.e=b;return a}(),c=function(c,g,
h,k,l){switch(arguments.length){case 1:return C(c);case 2:return J(c,g);case 3:return b.call(this,c,g,h);case 4:return a.call(this,c,g,h,k);default:return d.e(c,g,h,k,H(arguments,4))}throw Error("Invalid arity: "+arguments.length);};c.i=4;c.f=d.f;c.b=function(a){return C(a)};c.a=function(a,b){return J(a,b)};c.c=b;c.n=a;c.e=d.e;return c}();function od(a){return Cb(a)}
var pd=function(){var a=null,b=function(){function a(c,g,h){var k=null;2<arguments.length&&(k=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,g,k)}function b(a,c,d){for(;;)if(a=Bb(a,c),p(d))c=D(d),d=G(d);else return a}a.i=2;a.f=function(a){var c=D(a);a=G(a);var h=D(a);a=E(a);return b(c,h,a)};a.e=b;return a}(),a=function(a,d,e){switch(arguments.length){case 2:return Bb(a,d);default:return b.e(a,d,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};a.i=2;a.f=b.f;a.a=
function(a,b){return Bb(a,b)};a.e=b.e;return a}(),qd=function(){var a=null,b=function(){function a(c,g,h,k){var l=null;3<arguments.length&&(l=H(Array.prototype.slice.call(arguments,3),0));return b.call(this,c,g,h,l)}function b(a,c,d,k){for(;;)if(a=Db(a,c,d),p(k))c=D(k),d=D(G(k)),k=G(G(k));else return a}a.i=3;a.f=function(a){var c=D(a);a=G(a);var h=D(a);a=G(a);var k=D(a);a=E(a);return b(c,h,k,a)};a.e=b;return a}(),a=function(a,d,e,g){switch(arguments.length){case 3:return Db(a,d,e);default:return b.e(a,
d,e,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};a.i=3;a.f=b.f;a.c=function(a,b,e){return Db(a,b,e)};a.e=b.e;return a}(),rd=function(){var a=null,b=function(){function a(c,g,h){var k=null;2<arguments.length&&(k=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,g,k)}function b(a,c,d){for(;;)if(a=Eb(a,c),p(d))c=D(d),d=G(d);else return a}a.i=2;a.f=function(a){var c=D(a);a=G(a);var h=D(a);a=E(a);return b(c,h,a)};a.e=b;return a}(),a=function(a,d,e){switch(arguments.length){case 2:return Eb(a,
d);default:return b.e(a,d,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};a.i=2;a.f=b.f;a.a=function(a,b){return Eb(a,b)};a.e=b.e;return a}(),sd=function(){var a=null,b=function(){function a(c,g,h){var k=null;2<arguments.length&&(k=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,g,k)}function b(a,c,d){for(;;)if(a=Hb(a,c),p(d))c=D(d),d=G(d);else return a}a.i=2;a.f=function(a){var c=D(a);a=G(a);var h=D(a);a=E(a);return b(c,h,a)};a.e=b;return a}(),a=function(a,d,
e){switch(arguments.length){case 2:return Hb(a,d);default:return b.e(a,d,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};a.i=2;a.f=b.f;a.a=function(a,b){return Hb(a,b)};a.e=b.e;return a}();
function td(a,b,c){var d=C(c);if(0===b)return a.m?a.m():a.call(null);c=Ia(d);var e=Ja(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=Ia(e),g=Ja(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=Ia(g),h=Ja(g);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var g=Ia(h),k=Ja(h);if(4===b)return a.n?a.n(c,d,e,g):a.n?a.n(c,d,e,g):a.call(null,c,d,e,g);var h=Ia(k),l=Ja(k);if(5===b)return a.r?a.r(c,d,e,g,h):a.r?a.r(c,d,e,g,h):a.call(null,c,d,e,g,h);var k=Ia(l),
q=Ja(l);if(6===b)return a.da?a.da(c,d,e,g,h,k):a.da?a.da(c,d,e,g,h,k):a.call(null,c,d,e,g,h,k);var l=Ia(q),r=Ja(q);if(7===b)return a.Fa?a.Fa(c,d,e,g,h,k,l):a.Fa?a.Fa(c,d,e,g,h,k,l):a.call(null,c,d,e,g,h,k,l);var q=Ia(r),u=Ja(r);if(8===b)return a.tb?a.tb(c,d,e,g,h,k,l,q):a.tb?a.tb(c,d,e,g,h,k,l,q):a.call(null,c,d,e,g,h,k,l,q);var r=Ia(u),B=Ja(u);if(9===b)return a.ub?a.ub(c,d,e,g,h,k,l,q,r):a.ub?a.ub(c,d,e,g,h,k,l,q,r):a.call(null,c,d,e,g,h,k,l,q,r);var u=Ia(B),S=Ja(B);if(10===b)return a.ib?a.ib(c,
d,e,g,h,k,l,q,r,u):a.ib?a.ib(c,d,e,g,h,k,l,q,r,u):a.call(null,c,d,e,g,h,k,l,q,r,u);var B=Ia(S),L=Ja(S);if(11===b)return a.jb?a.jb(c,d,e,g,h,k,l,q,r,u,B):a.jb?a.jb(c,d,e,g,h,k,l,q,r,u,B):a.call(null,c,d,e,g,h,k,l,q,r,u,B);var S=Ia(L),T=Ja(L);if(12===b)return a.kb?a.kb(c,d,e,g,h,k,l,q,r,u,B,S):a.kb?a.kb(c,d,e,g,h,k,l,q,r,u,B,S):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S);var L=Ia(T),la=Ja(T);if(13===b)return a.lb?a.lb(c,d,e,g,h,k,l,q,r,u,B,S,L):a.lb?a.lb(c,d,e,g,h,k,l,q,r,u,B,S,L):a.call(null,c,d,e,g,h,k,
l,q,r,u,B,S,L);var T=Ia(la),na=Ja(la);if(14===b)return a.mb?a.mb(c,d,e,g,h,k,l,q,r,u,B,S,L,T):a.mb?a.mb(c,d,e,g,h,k,l,q,r,u,B,S,L,T):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T);var la=Ia(na),ya=Ja(na);if(15===b)return a.nb?a.nb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la):a.nb?a.nb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T,la);var na=Ia(ya),Na=Ja(ya);if(16===b)return a.ob?a.ob(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na):a.ob?a.ob(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na):a.call(null,c,d,e,g,h,k,l,q,
r,u,B,S,L,T,la,na);var ya=Ia(Na),ib=Ja(Na);if(17===b)return a.pb?a.pb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya):a.pb?a.pb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya);var Na=Ia(ib),wb=Ja(ib);if(18===b)return a.qb?a.qb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na):a.qb?a.qb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na);ib=Ia(wb);wb=Ja(wb);if(19===b)return a.rb?a.rb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib):a.rb?a.rb(c,
d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib);var Wd=Ia(wb);Ja(wb);if(20===b)return a.sb?a.sb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib,Wd):a.sb?a.sb(c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib,Wd):a.call(null,c,d,e,g,h,k,l,q,r,u,B,S,L,T,la,na,ya,Na,ib,Wd);throw Error("Only up to 20 arguments supported on functions");}
var R=function(){function a(a,b,c,d,e){b=nd.n(b,c,d,e);c=a.i;return a.f?(d=jd(b,c+1),d<=c?td(a,d,b):a.f(b)):a.apply(a,Ic(b))}function b(a,b,c,d){b=nd.c(b,c,d);c=a.i;return a.f?(d=jd(b,c+1),d<=c?td(a,d,b):a.f(b)):a.apply(a,Ic(b))}function c(a,b,c){b=nd.a(b,c);c=a.i;if(a.f){var d=jd(b,c+1);return d<=c?td(a,d,b):a.f(b)}return a.apply(a,Ic(b))}function d(a,b){var c=a.i;if(a.f){var d=jd(b,c+1);return d<=c?td(a,d,b):a.f(b)}return a.apply(a,Ic(b))}var e=null,g=function(){function a(c,d,e,g,h,S){var L=null;
5<arguments.length&&(L=H(Array.prototype.slice.call(arguments,5),0));return b.call(this,c,d,e,g,h,L)}function b(a,c,d,e,g,h){c=J(c,J(d,J(e,J(g,ld(h)))));d=a.i;return a.f?(e=jd(c,d+1),e<=d?td(a,e,c):a.f(c)):a.apply(a,Ic(c))}a.i=5;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var g=D(a);a=G(a);var h=D(a);a=E(a);return b(c,d,e,g,h,a)};a.e=b;return a}(),e=function(e,k,l,q,r,u){switch(arguments.length){case 2:return d.call(this,e,k);case 3:return c.call(this,e,k,l);case 4:return b.call(this,
e,k,l,q);case 5:return a.call(this,e,k,l,q,r);default:return g.e(e,k,l,q,r,H(arguments,5))}throw Error("Invalid arity: "+arguments.length);};e.i=5;e.f=g.f;e.a=d;e.c=c;e.n=b;e.r=a;e.e=g.e;return e}();function ud(a,b){for(;;){if(null==C(b))return!0;if(p(a.b?a.b(D(b)):a.call(null,D(b)))){var c=a,d=G(b);a=c;b=d}else return t?!1:null}}function vd(a,b){for(;;)if(C(b)){var c=a.b?a.b(D(b)):a.call(null,D(b));if(p(c))return c;var c=a,d=G(b);a=c;b=d}else return null}function wd(a){return a}
function xd(a){return function(){var b=null,c=function(){function b(a,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,a,d,l)}function c(b,d,e){return ta(R.n(a,b,d,e))}b.i=2;b.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};b.e=c;return b}(),b=function(b,e,g){switch(arguments.length){case 0:return ta(a.m?a.m():a.call(null));case 1:return ta(a.b?a.b(b):a.call(null,b));case 2:return ta(a.a?a.a(b,e):a.call(null,b,e));default:return c.e(b,
e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;return b}()}
var yd=function(){function a(a,b,c){return function(){var d=null,l=function(){function d(a,b,c,e){var g=null;3<arguments.length&&(g=H(Array.prototype.slice.call(arguments,3),0));return k.call(this,a,b,c,g)}function k(d,l,q,r){return a.b?a.b(b.b?b.b(R.r(c,d,l,q,r)):b.call(null,R.r(c,d,l,q,r))):a.call(null,b.b?b.b(R.r(c,d,l,q,r)):b.call(null,R.r(c,d,l,q,r)))}d.i=3;d.f=function(a){var b=D(a);a=G(a);var c=D(a);a=G(a);var d=D(a);a=E(a);return k(b,c,d,a)};d.e=k;return d}(),d=function(d,k,u,B){switch(arguments.length){case 0:return a.b?
a.b(b.b?b.b(c.m?c.m():c.call(null)):b.call(null,c.m?c.m():c.call(null))):a.call(null,b.b?b.b(c.m?c.m():c.call(null)):b.call(null,c.m?c.m():c.call(null)));case 1:return a.b?a.b(b.b?b.b(c.b?c.b(d):c.call(null,d)):b.call(null,c.b?c.b(d):c.call(null,d))):a.call(null,b.b?b.b(c.b?c.b(d):c.call(null,d)):b.call(null,c.b?c.b(d):c.call(null,d)));case 2:return a.b?a.b(b.b?b.b(c.a?c.a(d,k):c.call(null,d,k)):b.call(null,c.a?c.a(d,k):c.call(null,d,k))):a.call(null,b.b?b.b(c.a?c.a(d,k):c.call(null,d,k)):b.call(null,
c.a?c.a(d,k):c.call(null,d,k)));case 3:return a.b?a.b(b.b?b.b(c.c?c.c(d,k,u):c.call(null,d,k,u)):b.call(null,c.c?c.c(d,k,u):c.call(null,d,k,u))):a.call(null,b.b?b.b(c.c?c.c(d,k,u):c.call(null,d,k,u)):b.call(null,c.c?c.c(d,k,u):c.call(null,d,k,u)));default:return l.e(d,k,u,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};d.i=3;d.f=l.f;return d}()}function b(a,b){return function(){var c=null,d=function(){function c(a,b,e,g){var h=null;3<arguments.length&&(h=H(Array.prototype.slice.call(arguments,
3),0));return d.call(this,a,b,e,h)}function d(c,h,k,l){return a.b?a.b(R.r(b,c,h,k,l)):a.call(null,R.r(b,c,h,k,l))}c.i=3;c.f=function(a){var b=D(a);a=G(a);var c=D(a);a=G(a);var e=D(a);a=E(a);return d(b,c,e,a)};c.e=d;return c}(),c=function(c,h,r,u){switch(arguments.length){case 0:return a.b?a.b(b.m?b.m():b.call(null)):a.call(null,b.m?b.m():b.call(null));case 1:return a.b?a.b(b.b?b.b(c):b.call(null,c)):a.call(null,b.b?b.b(c):b.call(null,c));case 2:return a.b?a.b(b.a?b.a(c,h):b.call(null,c,h)):a.call(null,
b.a?b.a(c,h):b.call(null,c,h));case 3:return a.b?a.b(b.c?b.c(c,h,r):b.call(null,c,h,r)):a.call(null,b.c?b.c(c,h,r):b.call(null,c,h,r));default:return d.e(c,h,r,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};c.i=3;c.f=d.f;return c}()}var c=null,d=function(){function a(c,d,e,q){var r=null;3<arguments.length&&(r=H(Array.prototype.slice.call(arguments,3),0));return b.call(this,c,d,e,r)}function b(a,c,d,e){return function(a){return function(){function b(a){var d=null;0<arguments.length&&
(d=H(Array.prototype.slice.call(arguments,0),0));return c.call(this,d)}function c(b){b=R.a(D(a),b);for(var d=G(a);;)if(d)b=D(d).call(null,b),d=G(d);else return b}b.i=0;b.f=function(a){a=C(a);return c(a)};b.e=c;return b}()}(Yc(nd.n(a,c,d,e)))}a.i=3;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=E(a);return b(c,d,e,a)};a.e=b;return a}(),c=function(c,g,h,k){switch(arguments.length){case 0:return wd;case 1:return c;case 2:return b.call(this,c,g);case 3:return a.call(this,c,g,h);default:return d.e(c,
g,h,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};c.i=3;c.f=d.f;c.m=function(){return wd};c.b=function(a){return a};c.a=b;c.c=a;c.e=d.e;return c}(),zd=function(){function a(a,b,c,d){return function(){function e(a){var b=null;0<arguments.length&&(b=H(Array.prototype.slice.call(arguments,0),0));return r.call(this,b)}function r(e){return R.r(a,b,c,d,e)}e.i=0;e.f=function(a){a=C(a);return r(a)};e.e=r;return e}()}function b(a,b,c){return function(){function d(a){var b=null;0<arguments.length&&
(b=H(Array.prototype.slice.call(arguments,0),0));return e.call(this,b)}function e(d){return R.n(a,b,c,d)}d.i=0;d.f=function(a){a=C(a);return e(a)};d.e=e;return d}()}function c(a,b){return function(){function c(a){var b=null;0<arguments.length&&(b=H(Array.prototype.slice.call(arguments,0),0));return d.call(this,b)}function d(c){return R.c(a,b,c)}c.i=0;c.f=function(a){a=C(a);return d(a)};c.e=d;return c}()}var d=null,e=function(){function a(c,d,e,g,u){var B=null;4<arguments.length&&(B=H(Array.prototype.slice.call(arguments,
4),0));return b.call(this,c,d,e,g,B)}function b(a,c,d,e,g){return function(){function b(a){var c=null;0<arguments.length&&(c=H(Array.prototype.slice.call(arguments,0),0));return h.call(this,c)}function h(b){return R.r(a,c,d,e,md.a(g,b))}b.i=0;b.f=function(a){a=C(a);return h(a)};b.e=h;return b}()}a.i=4;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var g=D(a);a=E(a);return b(c,d,e,g,a)};a.e=b;return a}(),d=function(d,h,k,l,q){switch(arguments.length){case 1:return d;case 2:return c.call(this,
d,h);case 3:return b.call(this,d,h,k);case 4:return a.call(this,d,h,k,l);default:return e.e(d,h,k,l,H(arguments,4))}throw Error("Invalid arity: "+arguments.length);};d.i=4;d.f=e.f;d.b=function(a){return a};d.a=c;d.c=b;d.n=a;d.e=e.e;return d}(),Ad=function(){function a(a,b,c,d){return function(){var l=null,q=function(){function l(a,b,c,d){var e=null;3<arguments.length&&(e=H(Array.prototype.slice.call(arguments,3),0));return q.call(this,a,b,c,e)}function q(l,r,u,T){return R.r(a,null==l?b:l,null==r?
c:r,null==u?d:u,T)}l.i=3;l.f=function(a){var b=D(a);a=G(a);var c=D(a);a=G(a);var d=D(a);a=E(a);return q(b,c,d,a)};l.e=q;return l}(),l=function(l,u,B,S){switch(arguments.length){case 2:return a.a?a.a(null==l?b:l,null==u?c:u):a.call(null,null==l?b:l,null==u?c:u);case 3:return a.c?a.c(null==l?b:l,null==u?c:u,null==B?d:B):a.call(null,null==l?b:l,null==u?c:u,null==B?d:B);default:return q.e(l,u,B,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};l.i=3;l.f=q.f;return l}()}function b(a,b,
c){return function(){var d=null,l=function(){function d(a,b,c,e){var g=null;3<arguments.length&&(g=H(Array.prototype.slice.call(arguments,3),0));return k.call(this,a,b,c,g)}function k(d,l,q,r){return R.r(a,null==d?b:d,null==l?c:l,q,r)}d.i=3;d.f=function(a){var b=D(a);a=G(a);var c=D(a);a=G(a);var d=D(a);a=E(a);return k(b,c,d,a)};d.e=k;return d}(),d=function(d,k,u,B){switch(arguments.length){case 2:return a.a?a.a(null==d?b:d,null==k?c:k):a.call(null,null==d?b:d,null==k?c:k);case 3:return a.c?a.c(null==
d?b:d,null==k?c:k,u):a.call(null,null==d?b:d,null==k?c:k,u);default:return l.e(d,k,u,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};d.i=3;d.f=l.f;return d}()}function c(a,b){return function(){var c=null,d=function(){function c(a,b,e,g){var h=null;3<arguments.length&&(h=H(Array.prototype.slice.call(arguments,3),0));return d.call(this,a,b,e,h)}function d(c,h,k,l){return R.r(a,null==c?b:c,h,k,l)}c.i=3;c.f=function(a){var b=D(a);a=G(a);var c=D(a);a=G(a);var e=D(a);a=E(a);return d(b,
c,e,a)};c.e=d;return c}(),c=function(c,h,r,u){switch(arguments.length){case 1:return a.b?a.b(null==c?b:c):a.call(null,null==c?b:c);case 2:return a.a?a.a(null==c?b:c,h):a.call(null,null==c?b:c,h);case 3:return a.c?a.c(null==c?b:c,h,r):a.call(null,null==c?b:c,h,r);default:return d.e(c,h,r,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};c.i=3;c.f=d.f;return c}()}var d=null,d=function(d,g,h,k){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,
d,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.c=b;d.n=a;return d}(),W=function(){function a(a,b,c,e){return new V(null,function(){var q=C(b),r=C(c),u=C(e);return q&&r&&u?J(a.c?a.c(D(q),D(r),D(u)):a.call(null,D(q),D(r),D(u)),d.n(a,E(q),E(r),E(u))):null},null,null)}function b(a,b,c){return new V(null,function(){var e=C(b),q=C(c);return e&&q?J(a.a?a.a(D(e),D(q)):a.call(null,D(e),D(q)),d.c(a,E(e),E(q))):null},null,null)}function c(a,b){return new V(null,function(){var c=C(b);if(c){if(zc(c)){for(var e=
Jb(c),q=N(e),r=new ed(Array(q),0),u=0;;)if(u<q){var B=a.b?a.b(y.a(e,u)):a.call(null,y.a(e,u));r.add(B);u+=1}else break;return id(r.ba(),d.a(a,Kb(c)))}return J(a.b?a.b(D(c)):a.call(null,D(c)),d.a(a,E(c)))}return null},null,null)}var d=null,e=function(){function a(c,d,e,g,u){var B=null;4<arguments.length&&(B=H(Array.prototype.slice.call(arguments,4),0));return b.call(this,c,d,e,g,B)}function b(a,c,e,g,h){var B=function L(a){return new V(null,function(){var b=d.a(C,a);return ud(wd,b)?J(d.a(D,b),L(d.a(E,
b))):null},null,null)};return d.a(function(){return function(b){return R.a(a,b)}}(B),B(fc.e(h,g,H([e,c],0))))}a.i=4;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var g=D(a);a=E(a);return b(c,d,e,g,a)};a.e=b;return a}(),d=function(d,h,k,l,q){switch(arguments.length){case 2:return c.call(this,d,h);case 3:return b.call(this,d,h,k);case 4:return a.call(this,d,h,k,l);default:return e.e(d,h,k,l,H(arguments,4))}throw Error("Invalid arity: "+arguments.length);};d.i=4;d.f=e.f;d.a=c;
d.c=b;d.n=a;d.e=e.e;return d}(),Cd=function Bd(b,c){return new V(null,function(){if(0<b){var d=C(c);return d?J(D(d),Bd(b-1,E(d))):null}return null},null,null)};function Dd(a,b){return new V(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=C(b);if(0<a&&e){var g=a-1,e=E(e);a=g;b=e}else return e}}),null,null)}
var Ed=function(){function a(a,b){return Cd(a,c.b(b))}function b(a){return new V(null,function(){return J(a,c.b(a))},null,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Fd=function(){function a(a,b){return Cd(a,c.b(b))}function b(a){return new V(null,function(){return J(a.m?a.m():a.call(null),c.b(a))},null,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Gd=function(){function a(a,c){return new V(null,function(){var g=C(a),h=C(c);return g&&h?J(D(g),J(D(h),b.a(E(g),E(h)))):null},null,null)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){return new V(null,function(){var c=W.a(C,fc.e(e,d,H([a],0)));return ud(wd,c)?md.a(W.a(D,c),
R.a(b,W.a(E,c))):null},null,null)}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.a=a;b.e=c.e;return b}();function Hd(a){return function c(a,e){return new V(null,function(){var g=C(a);return g?J(D(g),c(E(g),e)):C(e)?c(D(e),E(e)):null},null,null)}(null,a)}
var Id=function(){function a(a,b){return Hd(W.a(a,b))}var b=null,c=function(){function a(c,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,d,l)}function b(a,c,d){return Hd(R.n(W,a,c,d))}a.i=2;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=E(a);return b(c,d,a)};a.e=b;return a}(),b=function(b,e,g){switch(arguments.length){case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=
2;b.f=c.f;b.a=a;b.e=c.e;return b}(),Kd=function Jd(b,c){return new V(null,function(){var d=C(c);if(d){if(zc(d)){for(var e=Jb(d),g=N(e),h=new ed(Array(g),0),k=0;;)if(k<g){if(p(b.b?b.b(y.a(e,k)):b.call(null,y.a(e,k)))){var l=y.a(e,k);h.add(l)}k+=1}else break;return id(h.ba(),Jd(b,Kb(d)))}e=D(d);d=E(d);return p(b.b?b.b(e):b.call(null,e))?J(e,Jd(b,d)):Jd(b,d)}return null},null,null)};function Ld(a,b){return Kd(xd(a),b)}
function Md(a){var b=Nd;return function d(a){return new V(null,function(){return J(a,p(b.b?b.b(a):b.call(null,a))?Id.a(d,C.b?C.b(a):C.call(null,a)):null)},null,null)}(a)}function Od(a,b){return null!=a?a&&(a.p&4||a.rc)?od(x.c(Bb,Ab(a),b)):x.c(Fa,a,b):x.c(fc,F,b)}
var Pd=function(){function a(a,b,c,k){return new V(null,function(){var l=C(k);if(l){var q=Cd(a,l);return a===N(q)?J(q,d.n(a,b,c,Dd(b,l))):Fa(F,Cd(a,md.a(q,c)))}return null},null,null)}function b(a,b,c){return new V(null,function(){var k=C(c);if(k){var l=Cd(a,k);return a===N(l)?J(l,d.c(a,b,Dd(b,k))):null}return null},null,null)}function c(a,b){return d.c(a,a,b)}var d=null,d=function(d,g,h,k){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,
d,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.c=b;d.n=a;return d}(),Qd=function(){function a(a,b,c){var h=Cc;for(b=C(b);;)if(b){var k=a;if(k?k.h&256||k.Kb||(k.h?0:s(La,k)):s(La,k)){a=P.c(a,D(b),h);if(h===a)return c;b=G(b)}else return c}else return a}function b(a,b){return c.c(a,b,null)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}(),Rd=
function(){function a(a,b,c,d,g,u){var B=O.c(b,0,null);return(b=Qc(b))?Q.c(a,B,e.da(P.a(a,B),b,c,d,g,u)):Q.c(a,B,c.n?c.n(P.a(a,B),d,g,u):c.call(null,P.a(a,B),d,g,u))}function b(a,b,c,d,g){var u=O.c(b,0,null);return(b=Qc(b))?Q.c(a,u,e.r(P.a(a,u),b,c,d,g)):Q.c(a,u,c.c?c.c(P.a(a,u),d,g):c.call(null,P.a(a,u),d,g))}function c(a,b,c,d){var g=O.c(b,0,null);return(b=Qc(b))?Q.c(a,g,e.n(P.a(a,g),b,c,d)):Q.c(a,g,c.a?c.a(P.a(a,g),d):c.call(null,P.a(a,g),d))}function d(a,b,c){var d=O.c(b,0,null);return(b=Qc(b))?
Q.c(a,d,e.c(P.a(a,d),b,c)):Q.c(a,d,c.b?c.b(P.a(a,d)):c.call(null,P.a(a,d)))}var e=null,g=function(){function a(c,d,e,g,h,S,L){var T=null;6<arguments.length&&(T=H(Array.prototype.slice.call(arguments,6),0));return b.call(this,c,d,e,g,h,S,T)}function b(a,c,d,g,h,k,L){var T=O.c(c,0,null);return(c=Qc(c))?Q.c(a,T,R.e(e,P.a(a,T),c,d,g,H([h,k,L],0))):Q.c(a,T,R.e(d,P.a(a,T),g,h,k,H([L],0)))}a.i=6;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var g=D(a);a=G(a);var h=D(a);a=G(a);var L=
D(a);a=E(a);return b(c,d,e,g,h,L,a)};a.e=b;return a}(),e=function(e,k,l,q,r,u,B){switch(arguments.length){case 3:return d.call(this,e,k,l);case 4:return c.call(this,e,k,l,q);case 5:return b.call(this,e,k,l,q,r);case 6:return a.call(this,e,k,l,q,r,u);default:return g.e(e,k,l,q,r,u,H(arguments,6))}throw Error("Invalid arity: "+arguments.length);};e.i=6;e.f=g.f;e.c=d;e.n=c;e.r=b;e.da=a;e.e=g.e;return e}();function Sd(a,b){this.q=a;this.d=b}
function Td(a){return new Sd(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ud(a){return new Sd(a.q,wa(a.d))}function Vd(a){a=a.g;return 32>a?0:a-1>>>5<<5}function Xd(a,b,c){for(;;){if(0===b)return c;var d=Td(a);d.d[0]=c;c=d;b-=5}}var Zd=function Yd(b,c,d,e){var g=Ud(d),h=b.g-1>>>c&31;5===c?g.d[h]=e:(d=d.d[h],b=null!=d?Yd(b,c-5,d,e):Xd(null,c-5,e),g.d[h]=b);return g};
function $d(a,b){throw Error([w("No item "),w(a),w(" in vector of length "),w(b)].join(""));}function ae(a){var b=a.root;for(a=a.shift;;)if(0<a)a-=5,b=b.d[0];else return b.d}function be(a,b){if(b>=Vd(a))return a.Q;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.d[b>>>d&31],d=e;else return c.d}function ce(a,b){return 0<=b&&b<a.g?be(a,b):$d(b,a.g)}
var ee=function de(b,c,d,e,g){var h=Ud(d);if(0===c)h.d[e&31]=g;else{var k=e>>>c&31;b=de(b,c-5,d.d[k],e,g);h.d[k]=b}return h},ge=function fe(b,c,d){var e=b.g-2>>>c&31;if(5<c){b=fe(b,c-5,d.d[e]);if(null==b&&0===e)return null;d=Ud(d);d.d[e]=b;return d}return 0===e?null:t?(d=Ud(d),d.d[e]=null,d):null};function X(a,b,c,d,e,g){this.j=a;this.g=b;this.shift=c;this.root=d;this.Q=e;this.l=g;this.p=8196;this.h=167668511}f=X.prototype;
f.Ea=function(){return new he(this.g,this.shift,ie.b?ie.b(this.root):ie.call(null,this.root),je.b?je.b(this.Q):je.call(null,this.Q))};f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return"number"===typeof b?y.c(this,b,c):c};f.pa=function(a,b,c){if("number"===typeof b)return ab(this,b,c);throw Error("Vector's key for assoc must be a number.");};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.$(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.P(null,a)};f.a=function(a,b){return this.$(null,a,b)};
f.Ka=function(a,b,c){a=[0,c];for(c=0;;)if(c<this.g){var d=be(this,c),e=d.length;a:{for(var g=0,h=a[1];;)if(g<e){h=b.c?b.c(h,g+c,d[g]):b.call(null,h,g+c,d[g]);if(Wb(h)){d=h;break a}g+=1}else{a[0]=e;d=a[1]=h;break a}d=void 0}if(Wb(d))return I.b?I.b(d):I.call(null,d);c+=a[0]}else return a[1]};
f.D=function(a,b){if(32>this.g-Vd(this)){for(var c=this.Q.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.Q[e],e+=1;else break;d[c]=b;return new X(this.j,this.g+1,this.shift,this.root,d,null)}c=(d=this.g>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Td(null),d.d[0]=this.root,e=Xd(null,this.shift,new Sd(null,this.Q)),d.d[1]=e):d=Zd(this,this.shift,this.root,new Sd(null,this.Q));return new X(this.j,this.g+1,c,d,[b],null)};f.Ga=function(){return 0<this.g?new bc(this,this.g-1,null):null};
f.La=function(){return y.a(this,0)};f.Ma=function(){return y.a(this,1)};f.toString=function(){return Nb(this)};f.N=function(a,b){return Xb.a(this,b)};f.K=function(a,b,c){return Xb.c(this,b,c)};f.F=function(){return 0===this.g?null:32>=this.g?new Ub(this.Q,0):t?ke.n?ke.n(this,ae(this),0,0):ke.call(null,this,ae(this),0,0):null};f.J=function(){return this.g};f.wa=function(){return 0<this.g?y.a(this,this.g-1):null};
f.xa=function(){if(0===this.g)throw Error("Can't pop empty vector");if(1===this.g)return fb(le,this.j);if(1<this.g-Vd(this))return new X(this.j,this.g-1,this.shift,this.root,this.Q.slice(0,-1),null);if(t){var a=be(this,this.g-2),b=ge(this,this.shift,this.root),b=null==b?Y:b,c=this.g-1;return 5<this.shift&&null==b.d[1]?new X(this.j,c,this.shift-5,b.d[0],a,null):new X(this.j,c,this.shift,b,a,null)}return null};
f.za=function(a,b,c){if(0<=b&&b<this.g)return Vd(this)<=b?(a=wa(this.Q),a[b&31]=c,new X(this.j,this.g,this.shift,this.root,a,null)):new X(this.j,this.g,this.shift,ee(this,this.shift,this.root,b,c),this.Q,null);if(b===this.g)return Fa(this,c);if(t)throw Error([w("Index "),w(b),w(" out of bounds  [0,"),w(this.g),w("]")].join(""));return null};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new X(b,this.g,this.shift,this.root,this.Q,this.l)};f.B=function(){return this.j};
f.P=function(a,b){return ce(this,b)[b&31]};f.$=function(a,b,c){return 0<=b&&b<this.g?be(this,b)[b&31]:c};f.G=function(){return M(le,this.j)};var Y=new Sd(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),le=new X(null,0,5,Y,[],0);
function me(a,b){var c=a.length,d=b?a:wa(a);if(32>c)return new X(null,c,5,Y,d,null);for(var e=d.slice(0,32),g=32,h=(new X(null,32,5,Y,e,null)).Ea(null);;)if(g<c)e=g+1,h=pd.a(h,d[g]),g=e;else return Cb(h)}function ne(a){return Cb(x.c(Bb,Ab(le),a))}
var oe=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return a instanceof Ub&&0===a.o?me.a?me.a(a.d,!0):me.call(null,a.d,!0):ne(a)}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}();function pe(a,b,c,d,e,g){this.M=a;this.ca=b;this.o=c;this.L=d;this.j=e;this.l=g;this.h=32243948;this.p=1536}f=pe.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};
f.S=function(){if(this.L+1<this.ca.length){var a=ke.n?ke.n(this.M,this.ca,this.o,this.L+1):ke.call(null,this.M,this.ca,this.o,this.L+1);return null==a?null:a}return Lb(this)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return Xb.a(qe.c?qe.c(this.M,this.o+this.L,N(this.M)):qe.call(null,this.M,this.o+this.L,N(this.M)),b)};f.K=function(a,b,c){return Xb.c(qe.c?qe.c(this.M,this.o+this.L,N(this.M)):qe.call(null,this.M,this.o+this.L,N(this.M)),b,c)};f.F=function(){return this};
f.O=function(){return this.ca[this.L]};f.T=function(){if(this.L+1<this.ca.length){var a=ke.n?ke.n(this.M,this.ca,this.o,this.L+1):ke.call(null,this.M,this.ca,this.o,this.L+1);return null==a?F:a}return Kb(this)};f.eb=function(){var a=this.o+this.ca.length;return a<Ca(this.M)?ke.n?ke.n(this.M,be(this.M,a),a,0):ke.call(null,this.M,be(this.M,a),a,0):null};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return ke.r?ke.r(this.M,this.ca,this.o,this.L,b):ke.call(null,this.M,this.ca,this.o,this.L,b)};
f.G=function(){return M(le,this.j)};f.fb=function(){return gd.a(this.ca,this.L)};f.gb=function(){var a=this.o+this.ca.length;return a<Ca(this.M)?ke.n?ke.n(this.M,be(this.M,a),a,0):ke.call(null,this.M,be(this.M,a),a,0):F};
var ke=function(){function a(a,b,c,d,l){return new pe(a,b,c,d,l,null)}function b(a,b,c,d){return new pe(a,b,c,d,null,null)}function c(a,b,c){return new pe(a,ce(a,b),b,c,null,null)}var d=null,d=function(d,g,h,k,l){switch(arguments.length){case 3:return c.call(this,d,g,h);case 4:return b.call(this,d,g,h,k);case 5:return a.call(this,d,g,h,k,l)}throw Error("Invalid arity: "+arguments.length);};d.c=c;d.n=b;d.r=a;return d}();
function re(a,b,c,d,e){this.j=a;this.aa=b;this.start=c;this.end=d;this.l=e;this.h=166617887;this.p=8192}f=re.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return"number"===typeof b?y.c(this,b,c):c};f.pa=function(a,b,c){if("number"===typeof b)return ab(this,b,c);throw Error("Subvec's key for assoc must be a number.");};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.P(null,c);case 3:return this.$(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.P(null,a)};f.a=function(a,b){return this.$(null,a,b)};
f.D=function(a,b){return se.r?se.r(this.j,ab(this.aa,this.end,b),this.start,this.end+1,null):se.call(null,this.j,ab(this.aa,this.end,b),this.start,this.end+1,null)};f.Ga=function(){return this.start!==this.end?new bc(this,this.end-this.start-1,null):null};f.toString=function(){return Nb(this)};f.N=function(a,b){return Xb.a(this,b)};f.K=function(a,b,c){return Xb.c(this,b,c)};
f.F=function(){var a=this;return function(b){return function d(e){return e===a.end?null:J(y.a(a.aa,e),new V(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};f.J=function(){return this.end-this.start};f.wa=function(){return y.a(this.aa,this.end-1)};f.xa=function(){if(this.start===this.end)throw Error("Can't pop empty vector");return se.r?se.r(this.j,this.aa,this.start,this.end-1,null):se.call(null,this.j,this.aa,this.start,this.end-1,null)};
f.za=function(a,b,c){var d=this,e=d.start+b;return se.r?se.r(d.j,Q.c(d.aa,e,c),d.start,function(){var a=d.end,b=e+1;return a>b?a:b}(),null):se.call(null,d.j,Q.c(d.aa,e,c),d.start,function(){var a=d.end,b=e+1;return a>b?a:b}(),null)};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return se.r?se.r(b,this.aa,this.start,this.end,this.l):se.call(null,b,this.aa,this.start,this.end,this.l)};f.B=function(){return this.j};
f.P=function(a,b){return 0>b||this.end<=this.start+b?$d(b,this.end-this.start):y.a(this.aa,this.start+b)};f.$=function(a,b,c){return 0>b||this.end<=this.start+b?c:y.c(this.aa,this.start+b,c)};f.G=function(){return M(le,this.j)};function se(a,b,c,d,e){for(;;)if(b instanceof re)c=b.start+c,d=b.start+d,b=b.aa;else{var g=N(b);if(0>c||0>d||c>g||d>g)throw Error("Index out of bounds");return new re(a,b,c,d,e)}}
var qe=function(){function a(a,b,c){return se(null,a,b,c,null)}function b(a,b){return c.c(a,b,N(a))}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();function te(a,b){return a===b.q?b:new Sd(a,wa(b.d))}function ie(a){return new Sd({},wa(a.d))}
function je(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Bc(a,0,b,0,a.length);return b}
var ve=function ue(b,c,d,e){d=te(b.root.q,d);var g=b.g-1>>>c&31;if(5===c)b=e;else{var h=d.d[g];b=null!=h?ue(b,c-5,h,e):Xd(b.root.q,c-5,e)}d.d[g]=b;return d},xe=function we(b,c,d){d=te(b.root.q,d);var e=b.g-2>>>c&31;if(5<c){b=we(b,c-5,d.d[e]);if(null==b&&0===e)return null;d.d[e]=b;return d}return 0===e?null:t?(d.d[e]=null,d):null};function he(a,b,c,d){this.g=a;this.shift=b;this.root=c;this.Q=d;this.h=275;this.p=88}f=he.prototype;
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return"number"===typeof b?y.c(this,b,c):c};
f.P=function(a,b){if(this.root.q)return ce(this,b)[b&31];throw Error("nth after persistent!");};f.$=function(a,b,c){return 0<=b&&b<this.g?y.a(this,b):c};f.J=function(){if(this.root.q)return this.g;throw Error("count after persistent!");};
f.Nb=function(a,b,c){var d=this;if(d.root.q){if(0<=b&&b<d.g)return Vd(this)<=b?d.Q[b&31]=c:(a=function(){return function g(a,k){var l=te(d.root.q,k);if(0===a)l.d[b&31]=c;else{var q=b>>>a&31,r=g(a-5,l.d[q]);l.d[q]=r}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.g)return Bb(this,c);if(t)throw Error([w("Index "),w(b),w(" out of bounds for TransientVector of length"),w(d.g)].join(""));return null}throw Error("assoc! after persistent!");};
f.Ob=function(){if(this.root.q){if(0===this.g)throw Error("Can't pop empty vector");if(1===this.g)return this.g=0,this;if(0<(this.g-1&31))return this.g-=1,this;if(t){var a;a:if(a=this.g-2,a>=Vd(this))a=this.Q;else{for(var b=this.root,c=b,d=this.shift;;)if(0<d)c=te(b.q,c.d[a>>>d&31]),d-=5;else{a=c.d;break a}a=void 0}b=xe(this,this.shift,this.root);b=null!=b?b:new Sd(this.root.q,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
null,null,null,null,null,null,null,null]);5<this.shift&&null==b.d[1]?(this.root=te(this.root.q,b.d[0]),this.shift-=5):this.root=b;this.g-=1;this.Q=a;return this}return null}throw Error("pop! after persistent!");};f.Oa=function(a,b,c){if("number"===typeof b)return Fb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
f.qa=function(a,b){if(this.root.q){if(32>this.g-Vd(this))this.Q[this.g&31]=b;else{var c=new Sd(this.root.q,this.Q),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.Q=d;if(this.g>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Xd(this.root.q,this.shift,c);this.root=new Sd(this.root.q,d);this.shift=e}else this.root=ve(this,this.shift,this.root,c)}this.g+=1;return this}throw Error("conj! after persistent!");};f.ya=function(){if(this.root.q){this.root.q=null;var a=this.g-Vd(this),b=Array(a);Bc(this.Q,0,b,0,a);return new X(null,this.g,this.shift,this.root,b,null)}throw Error("persistent! called twice");};function ye(){this.p=0;this.h=2097152}ye.prototype.v=function(){return!1};var ze=new ye;
function Ae(a,b){return Ec(xc(b)?N(a)===N(b)?ud(wd,W.a(function(a){return Pb.a(P.c(b,D(a),ze),D(G(a)))},a)):null:null)}
function Be(a,b){var c=a.d;if(b instanceof U)a:{for(var d=c.length,e=b.sa,g=0;;){if(d<=g){c=-1;break a}var h=c[g];if(h instanceof U&&e===h.sa){c=g;break a}if(t)g+=2;else{c=null;break a}}c=void 0}else if("string"==typeof b||"number"===typeof b)a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(b===c[e]){c=e;break a}if(t)e+=2;else{c=null;break a}}c=void 0}else if(b instanceof Sb)a:{d=c.length;e=b.ua;for(g=0;;){if(d<=g){c=-1;break a}h=c[g];if(h instanceof Sb&&e===h.ua){c=g;break a}if(t)g+=2;else{c=null;
break a}}c=void 0}else if(null==b)a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(null==c[e]){c=e;break a}if(t)e+=2;else{c=null;break a}}c=void 0}else if(t)a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(Pb.a(b,c[e])){c=e;break a}if(t)e+=2;else{c=null;break a}}c=void 0}else c=null;return c}function Ce(a,b,c){this.d=a;this.o=b;this.V=c;this.p=0;this.h=32374990}f=Ce.prototype;f.A=function(){return ac(this)};f.S=function(){return this.o<this.d.length-2?new Ce(this.d,this.o+2,this.V):null};
f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.J=function(){return(this.d.length-this.o)/2};f.O=function(){return new X(null,2,5,Y,[this.d[this.o],this.d[this.o+1]],null)};f.T=function(){return this.o<this.d.length-2?new Ce(this.d,this.o+2,this.V):F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Ce(this.d,this.o,b)};f.B=function(){return this.V};
f.G=function(){return M(F,this.V)};function ma(a,b,c,d){this.j=a;this.g=b;this.d=c;this.l=d;this.p=8196;this.h=16123663}f=ma.prototype;f.Ea=function(){return new De({},this.d.length,wa(this.d))};f.A=function(){var a=this.l;return null!=a?a:this.l=a=Rc(this)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){a=Be(this,b);return-1===a?c:this.d[a+1]};
f.pa=function(a,b,c){a=Be(this,b);if(-1===a){if(this.g<Ee){a=this.d;for(var d=a.length,e=Array(d+2),g=0;;)if(g<d)e[g]=a[g],g+=1;else break;e[d]=b;e[d+1]=c;return new ma(this.j,this.g+1,e,null)}return fb(Qa(Od(Fe,this),b,c),this.j)}return c===this.d[a+1]?this:t?(b=wa(this.d),b[a+1]=c,new ma(this.j,this.g,b,null)):null};f.Wa=function(a,b){return-1!==Be(this,b)};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};
f.Ka=function(a,b,c){a=this.d.length;for(var d=0;;)if(d<a){c=b.c?b.c(c,this.d[d],this.d[d+1]):b.call(null,c,this.d[d],this.d[d+1]);if(Wb(c))return I.b?I.b(c):I.call(null,c);d+=2}else return c};f.D=function(a,b){return yc(b)?Qa(this,y.a(b,0),y.a(b,1)):x.c(Fa,this,b)};f.toString=function(){return Nb(this)};f.F=function(){return 0<=this.d.length-2?new Ce(this.d,0,null):null};f.J=function(){return this.g};f.v=function(a,b){return Ae(this,b)};f.C=function(a,b){return new ma(b,this.g,this.d,this.l)};
f.B=function(){return this.j};f.G=function(){return fb(Ge,this.j)};f.Za=function(a,b){if(0<=Be(this,b)){var c=this.d.length,d=c-2;if(0===d)return Da(this);for(var d=Array(d),e=0,g=0;;){if(e>=c)return new ma(this.j,this.g-1,d,null);if(Pb.a(b,this.d[e]))e+=2;else if(t)d[g]=this.d[e],d[g+1]=this.d[e+1],g+=2,e+=2;else return null}}else return this};var Ge=new ma(null,0,[],null),Ee=8;function De(a,b,c){this.Ba=a;this.ga=b;this.d=c;this.p=56;this.h=258}f=De.prototype;
f.Ab=function(a,b){if(p(this.Ba)){var c=Be(this,b);0<=c&&(this.d[c]=this.d[this.ga-2],this.d[c+1]=this.d[this.ga-1],c=this.d,c.pop(),c.pop(),this.ga-=2);return this}throw Error("dissoc! after persistent!");};f.Oa=function(a,b,c){if(p(this.Ba)){a=Be(this,b);if(-1===a)return this.ga+2<=2*Ee?(this.ga+=2,this.d.push(b),this.d.push(c),this):qd.c(He.a?He.a(this.ga,this.d):He.call(null,this.ga,this.d),b,c);c!==this.d[a+1]&&(this.d[a+1]=c);return this}throw Error("assoc! after persistent!");};
f.qa=function(a,b){if(p(this.Ba)){if(b?b.h&2048||b.Xb||(b.h?0:s(Ta,b)):s(Ta,b))return Db(this,Sc.b?Sc.b(b):Sc.call(null,b),Tc.b?Tc.b(b):Tc.call(null,b));for(var c=C(b),d=this;;){var e=D(c);if(p(e))c=G(c),d=Db(d,Sc.b?Sc.b(e):Sc.call(null,e),Tc.b?Tc.b(e):Tc.call(null,e));else return d}}else throw Error("conj! after persistent!");};f.ya=function(){if(p(this.Ba))return this.Ba=!1,new ma(null,Oc(this.ga),this.d,null);throw Error("persistent! called twice");};f.t=function(a,b){return Ma.c(this,b,null)};
f.u=function(a,b,c){if(p(this.Ba))return a=Be(this,b),-1===a?c:this.d[a+1];throw Error("lookup after persistent!");};f.J=function(){if(p(this.Ba))return Oc(this.ga);throw Error("count after persistent!");};function He(a,b){for(var c=Ab(Fe),d=0;;)if(d<a)c=qd.c(c,b[d],b[d+1]),d+=2;else return c}function Ie(){this.k=!1}function Je(a,b){return a===b?!0:ad(a,b)?!0:t?Pb.a(a,b):null}
var Ke=function(){function a(a,b,c,h,k){a=wa(a);a[b]=c;a[h]=k;return a}function b(a,b,c){a=wa(a);a[b]=c;return a}var c=null,c=function(c,e,g,h,k){switch(arguments.length){case 3:return b.call(this,c,e,g);case 5:return a.call(this,c,e,g,h,k)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.r=a;return c}();function Le(a,b){var c=Array(a.length-2);Bc(a,0,c,0,2*b);Bc(a,2*(b+1),c,2*b,c.length-2*b);return c}
var Me=function(){function a(a,b,c,h,k,l){a=a.ra(b);a.d[c]=h;a.d[k]=l;return a}function b(a,b,c,h){a=a.ra(b);a.d[c]=h;return a}var c=null,c=function(c,e,g,h,k,l){switch(arguments.length){case 4:return b.call(this,c,e,g,h);case 6:return a.call(this,c,e,g,h,k,l)}throw Error("Invalid arity: "+arguments.length);};c.n=b;c.da=a;return c}();
function Ne(a,b,c){for(var d=a.length,e=0;;)if(e<d){var g=a[e];null!=g?c=b.c?b.c(c,g,a[e+1]):b.call(null,c,g,a[e+1]):(g=a[e+1],c=null!=g?g.Da(b,c):c);if(Wb(c))return I.b?I.b(c):I.call(null,c);e+=2}else return c}function Oe(a,b,c){this.q=a;this.s=b;this.d=c}function Pe(a,b,c,d){if(a.s===c)return null;a=a.ra(b);b=a.d;var e=b.length;a.s^=c;Bc(b,2*(d+1),b,2*d,e-2*(d+1));b[e-2]=null;b[e-1]=null;return a}f=Oe.prototype;
f.fa=function(a,b,c,d,e,g){var h=1<<(c>>>b&31),k=Pc(this.s&h-1);if(0===(this.s&h)){var l=Pc(this.s);if(2*l<this.d.length){a=this.ra(a);b=a.d;g.k=!0;a:for(c=2*(l-k),g=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[g];l-=1;c-=1;g-=1}b[2*k]=d;b[2*k+1]=e;a.s|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Qe.fa(a,b+5,c,d,e,g);for(e=d=0;;)if(32>d)0!==
(this.s>>>d&1)&&(k[d]=null!=this.d[e]?Qe.fa(a,b+5,A(this.d[e]),this.d[e],this.d[e+1],g):this.d[e+1],e+=2),d+=1;else break;return new Re(a,l+1,k)}return t?(b=Array(2*(l+4)),Bc(this.d,0,b,0,2*k),b[2*k]=d,b[2*k+1]=e,Bc(this.d,2*k,b,2*(k+1),2*(l-k)),g.k=!0,a=this.ra(a),a.d=b,a.s|=h,a):null}l=this.d[2*k];h=this.d[2*k+1];return null==l?(l=h.fa(a,b+5,c,d,e,g),l===h?this:Me.n(this,a,2*k+1,l)):Je(d,l)?e===h?this:Me.n(this,a,2*k+1,e):t?(g.k=!0,Me.da(this,a,2*k,null,2*k+1,Se.Fa?Se.Fa(a,b+5,l,h,c,d,e):Se.call(null,
a,b+5,l,h,c,d,e))):null};f.Pa=function(){return Te.b?Te.b(this.d):Te.call(null,this.d)};f.Ra=function(a,b,c,d,e){var g=1<<(c>>>b&31);if(0===(this.s&g))return this;var h=Pc(this.s&g-1),k=this.d[2*h],l=this.d[2*h+1];return null==k?(b=l.Ra(a,b+5,c,d,e),b===l?this:null!=b?Me.n(this,a,2*h+1,b):this.s===g?null:t?Pe(this,a,g,h):null):Je(d,k)?(e[0]=!0,Pe(this,a,g,h)):t?this:null};
f.ra=function(a){if(a===this.q)return this;var b=Pc(this.s),c=Array(0>b?4:2*(b+1));Bc(this.d,0,c,0,2*b);return new Oe(a,this.s,c)};f.Da=function(a,b){return Ne(this.d,a,b)};f.Qa=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.s&d))return this;var e=Pc(this.s&d-1),g=this.d[2*e],h=this.d[2*e+1];return null==g?(a=h.Qa(a+5,b,c),a===h?this:null!=a?new Oe(null,this.s,Ke.c(this.d,2*e+1,a)):this.s===d?null:t?new Oe(null,this.s^d,Le(this.d,e)):null):Je(c,g)?new Oe(null,this.s^d,Le(this.d,e)):t?this:null};
f.ea=function(a,b,c,d,e){var g=1<<(b>>>a&31),h=Pc(this.s&g-1);if(0===(this.s&g)){var k=Pc(this.s);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Qe.ea(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.s>>>c&1)&&(h[c]=null!=this.d[d]?Qe.ea(a+5,A(this.d[d]),this.d[d],this.d[d+1],e):this.d[d+1],d+=2),c+=1;else break;return new Re(null,k+1,h)}a=Array(2*(k+1));Bc(this.d,0,
a,0,2*h);a[2*h]=c;a[2*h+1]=d;Bc(this.d,2*h,a,2*(h+1),2*(k-h));e.k=!0;return new Oe(null,this.s|g,a)}k=this.d[2*h];g=this.d[2*h+1];return null==k?(k=g.ea(a+5,b,c,d,e),k===g?this:new Oe(null,this.s,Ke.c(this.d,2*h+1,k))):Je(c,k)?d===g?this:new Oe(null,this.s,Ke.c(this.d,2*h+1,d)):t?(e.k=!0,new Oe(null,this.s,Ke.r(this.d,2*h,null,2*h+1,Se.da?Se.da(a+5,k,g,b,c,d):Se.call(null,a+5,k,g,b,c,d)))):null};
f.ta=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.s&e))return d;var g=Pc(this.s&e-1),e=this.d[2*g],g=this.d[2*g+1];return null==e?g.ta(a+5,b,c,d):Je(c,e)?g:t?d:null};var Qe=new Oe(null,0,[]);function Ue(a,b,c){var d=a.d;a=2*(a.g-1);for(var e=Array(a),g=0,h=1,k=0;;)if(g<a)g!==c&&null!=d[g]&&(e[h]=d[g],h+=2,k|=1<<g),g+=1;else return new Oe(b,k,e)}function Re(a,b,c){this.q=a;this.g=b;this.d=c}f=Re.prototype;
f.fa=function(a,b,c,d,e,g){var h=c>>>b&31,k=this.d[h];if(null==k)return a=Me.n(this,a,h,Qe.fa(a,b+5,c,d,e,g)),a.g+=1,a;b=k.fa(a,b+5,c,d,e,g);return b===k?this:Me.n(this,a,h,b)};f.Pa=function(){return Ve.b?Ve.b(this.d):Ve.call(null,this.d)};f.Ra=function(a,b,c,d,e){var g=c>>>b&31,h=this.d[g];if(null==h)return this;b=h.Ra(a,b+5,c,d,e);if(b===h)return this;if(null==b){if(8>=this.g)return Ue(this,a,g);a=Me.n(this,a,g,b);a.g-=1;return a}return t?Me.n(this,a,g,b):null};
f.ra=function(a){return a===this.q?this:new Re(a,this.g,wa(this.d))};f.Da=function(a,b){for(var c=this.d.length,d=0,e=b;;)if(d<c){var g=this.d[d];if(null!=g&&(e=g.Da(a,e),Wb(e)))return I.b?I.b(e):I.call(null,e);d+=1}else return e};f.Qa=function(a,b,c){var d=b>>>a&31,e=this.d[d];return null!=e?(a=e.Qa(a+5,b,c),a===e?this:null==a?8>=this.g?Ue(this,null,d):new Re(null,this.g-1,Ke.c(this.d,d,a)):t?new Re(null,this.g,Ke.c(this.d,d,a)):null):this};
f.ea=function(a,b,c,d,e){var g=b>>>a&31,h=this.d[g];if(null==h)return new Re(null,this.g+1,Ke.c(this.d,g,Qe.ea(a+5,b,c,d,e)));a=h.ea(a+5,b,c,d,e);return a===h?this:new Re(null,this.g,Ke.c(this.d,g,a))};f.ta=function(a,b,c,d){var e=this.d[b>>>a&31];return null!=e?e.ta(a+5,b,c,d):d};function We(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Je(c,a[d]))return d;d+=2}else return-1}function Xe(a,b,c,d){this.q=a;this.na=b;this.g=c;this.d=d}f=Xe.prototype;
f.fa=function(a,b,c,d,e,g){if(c===this.na){b=We(this.d,this.g,d);if(-1===b){if(this.d.length>2*this.g)return a=Me.da(this,a,2*this.g,d,2*this.g+1,e),g.k=!0,a.g+=1,a;c=this.d.length;b=Array(c+2);Bc(this.d,0,b,0,c);b[c]=d;b[c+1]=e;g.k=!0;g=this.g+1;a===this.q?(this.d=b,this.g=g,a=this):a=new Xe(this.q,this.na,g,b);return a}return this.d[b+1]===e?this:Me.n(this,a,b+1,e)}return(new Oe(a,1<<(this.na>>>b&31),[null,this,null,null])).fa(a,b,c,d,e,g)};
f.Pa=function(){return Te.b?Te.b(this.d):Te.call(null,this.d)};f.Ra=function(a,b,c,d,e){b=We(this.d,this.g,d);if(-1===b)return this;e[0]=!0;if(1===this.g)return null;a=this.ra(a);e=a.d;e[b]=e[2*this.g-2];e[b+1]=e[2*this.g-1];e[2*this.g-1]=null;e[2*this.g-2]=null;a.g-=1;return a};f.ra=function(a){if(a===this.q)return this;var b=Array(2*(this.g+1));Bc(this.d,0,b,0,2*this.g);return new Xe(a,this.na,this.g,b)};f.Da=function(a,b){return Ne(this.d,a,b)};
f.Qa=function(a,b,c){a=We(this.d,this.g,c);return-1===a?this:1===this.g?null:t?new Xe(null,this.na,this.g-1,Le(this.d,Oc(a))):null};f.ea=function(a,b,c,d,e){return b===this.na?(a=We(this.d,this.g,c),-1===a?(a=2*this.g,b=Array(a+2),Bc(this.d,0,b,0,a),b[a]=c,b[a+1]=d,e.k=!0,new Xe(null,this.na,this.g+1,b)):Pb.a(this.d[a],d)?this:new Xe(null,this.na,this.g,Ke.c(this.d,a+1,d))):(new Oe(null,1<<(this.na>>>a&31),[null,this])).ea(a,b,c,d,e)};
f.ta=function(a,b,c,d){a=We(this.d,this.g,c);return 0>a?d:Je(c,this.d[a])?this.d[a+1]:t?d:null};
var Se=function(){function a(a,b,c,h,k,l,q){var r=A(c);if(r===k)return new Xe(null,r,2,[c,h,l,q]);var u=new Ie;return Qe.fa(a,b,r,c,h,u).fa(a,b,k,l,q,u)}function b(a,b,c,h,k,l){var q=A(b);if(q===h)return new Xe(null,q,2,[b,c,k,l]);var r=new Ie;return Qe.ea(a,q,b,c,r).ea(a,h,k,l,r)}var c=null,c=function(c,e,g,h,k,l,q){switch(arguments.length){case 6:return b.call(this,c,e,g,h,k,l);case 7:return a.call(this,c,e,g,h,k,l,q)}throw Error("Invalid arity: "+arguments.length);};c.da=b;c.Fa=a;return c}();
function Ye(a,b,c,d,e){this.j=a;this.ha=b;this.o=c;this.I=d;this.l=e;this.p=0;this.h=32374860}f=Ye.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.O=function(){return null==this.I?new X(null,2,5,Y,[this.ha[this.o],this.ha[this.o+1]],null):D(this.I)};
f.T=function(){return null==this.I?Te.c?Te.c(this.ha,this.o+2,null):Te.call(null,this.ha,this.o+2,null):Te.c?Te.c(this.ha,this.o,G(this.I)):Te.call(null,this.ha,this.o,G(this.I))};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Ye(b,this.ha,this.o,this.I,this.l)};f.B=function(){return this.j};f.G=function(){return M(F,this.j)};
var Te=function(){function a(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Ye(null,a,b,null,null);var h=a[b+1];if(p(h)&&(h=h.Pa(),p(h)))return new Ye(null,a,b+2,h,null);b+=2}else return null;else return new Ye(null,a,b,c,null)}function b(a){return c.c(a,0,null)}var c=null,c=function(c,e,g){switch(arguments.length){case 1:return b.call(this,c);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();
function Ze(a,b,c,d,e){this.j=a;this.ha=b;this.o=c;this.I=d;this.l=e;this.p=0;this.h=32374860}f=Ze.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.O=function(){return D(this.I)};f.T=function(){return Ve.n?Ve.n(null,this.ha,this.o,G(this.I)):Ve.call(null,null,this.ha,this.o,G(this.I))};
f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Ze(b,this.ha,this.o,this.I,this.l)};f.B=function(){return this.j};f.G=function(){return M(F,this.j)};
var Ve=function(){function a(a,b,c,h){if(null==h)for(h=b.length;;)if(c<h){var k=b[c];if(p(k)&&(k=k.Pa(),p(k)))return new Ze(a,b,c+1,k,null);c+=1}else return null;else return new Ze(a,b,c,h,null)}function b(a){return c.n(null,a,0,null)}var c=null,c=function(c,e,g,h){switch(arguments.length){case 1:return b.call(this,c);case 4:return a.call(this,c,e,g,h)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.n=a;return c}();
function $e(a,b,c,d,e,g){this.j=a;this.g=b;this.root=c;this.R=d;this.W=e;this.l=g;this.p=8196;this.h=16123663}f=$e.prototype;f.Ea=function(){return new af({},this.root,this.g,this.R,this.W)};f.A=function(){var a=this.l;return null!=a?a:this.l=a=Rc(this)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return null==b?this.R?this.W:c:null==this.root?c:t?this.root.ta(0,A(b),b,c):null};
f.pa=function(a,b,c){if(null==b)return this.R&&c===this.W?this:new $e(this.j,this.R?this.g:this.g+1,this.root,!0,c,null);a=new Ie;b=(null==this.root?Qe:this.root).ea(0,A(b),b,c,a);return b===this.root?this:new $e(this.j,a.k?this.g+1:this.g,b,this.R,this.W,null)};f.Wa=function(a,b){return null==b?this.R:null==this.root?!1:t?this.root.ta(0,A(b),b,Cc)!==Cc:null};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};
f.Ka=function(a,b,c){a=this.R?b.c?b.c(c,null,this.W):b.call(null,c,null,this.W):c;return Wb(a)?I.b?I.b(a):I.call(null,a):null!=this.root?this.root.Da(b,a):t?a:null};f.D=function(a,b){return yc(b)?Qa(this,y.a(b,0),y.a(b,1)):x.c(Fa,this,b)};f.toString=function(){return Nb(this)};f.F=function(){if(0<this.g){var a=null!=this.root?this.root.Pa():null;return this.R?J(new X(null,2,5,Y,[null,this.W],null),a):a}return null};f.J=function(){return this.g};f.v=function(a,b){return Ae(this,b)};
f.C=function(a,b){return new $e(b,this.g,this.root,this.R,this.W,this.l)};f.B=function(){return this.j};f.G=function(){return fb(Fe,this.j)};f.Za=function(a,b){if(null==b)return this.R?new $e(this.j,this.g-1,this.root,!1,null,null):this;if(null==this.root)return this;if(t){var c=this.root.Qa(0,A(b),b);return c===this.root?this:new $e(this.j,this.g-1,c,this.R,this.W,null)}return null};var Fe=new $e(null,0,null,!1,null,0);
function ic(a,b){for(var c=a.length,d=0,e=Ab(Fe);;)if(d<c)var g=d+1,e=e.Oa(null,a[d],b[d]),d=g;else return Cb(e)}function af(a,b,c,d,e){this.q=a;this.root=b;this.count=c;this.R=d;this.W=e;this.p=56;this.h=258}f=af.prototype;f.Ab=function(a,b){if(this.q)if(null==b)this.R&&(this.R=!1,this.W=null,this.count-=1);else{if(null!=this.root){var c=new Ie,d=this.root.Ra(this.q,0,A(b),b,c);d!==this.root&&(this.root=d);p(c[0])&&(this.count-=1)}}else throw Error("dissoc! after persistent!");return this};
f.Oa=function(a,b,c){return bf(this,b,c)};f.qa=function(a,b){var c;a:{if(this.q){if(b?b.h&2048||b.Xb||(b.h?0:s(Ta,b)):s(Ta,b)){c=bf(this,Sc.b?Sc.b(b):Sc.call(null,b),Tc.b?Tc.b(b):Tc.call(null,b));break a}c=C(b);for(var d=this;;){var e=D(c);if(p(e))c=G(c),d=bf(d,Sc.b?Sc.b(e):Sc.call(null,e),Tc.b?Tc.b(e):Tc.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");c=void 0}return c};
f.ya=function(){var a;if(this.q)this.q=null,a=new $e(null,this.count,this.root,this.R,this.W,null);else throw Error("persistent! called twice");return a};f.t=function(a,b){return null==b?this.R?this.W:null:null==this.root?null:this.root.ta(0,A(b),b)};f.u=function(a,b,c){return null==b?this.R?this.W:c:null==this.root?c:this.root.ta(0,A(b),b,c)};f.J=function(){if(this.q)return this.count;throw Error("count after persistent!");};
function bf(a,b,c){if(a.q){if(null==b)a.W!==c&&(a.W=c),a.R||(a.count+=1,a.R=!0);else{var d=new Ie;b=(null==a.root?Qe:a.root).fa(a.q,0,A(b),b,c,d);b!==a.root&&(a.root=b);d.k&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}function cf(a,b,c){for(var d=b;;)if(null!=a)b=c?a.left:a.right,d=fc.a(d,a),a=b;else return d}function df(a,b,c,d,e){this.j=a;this.stack=b;this.Ua=c;this.g=d;this.l=e;this.p=0;this.h=32374862}f=df.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};
f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.J=function(){return 0>this.g?N(G(this))+1:this.g};f.O=function(){return nc(this.stack)};f.T=function(){var a=D(this.stack),a=cf(this.Ua?a.right:a.left,G(this.stack),this.Ua);return null!=a?new df(null,a,this.Ua,this.g-1,null):F};f.v=function(a,b){return cc(this,b)};
f.C=function(a,b){return new df(b,this.stack,this.Ua,this.g,this.l)};f.B=function(){return this.j};f.G=function(){return M(F,this.j)};function ef(a,b,c,d){return c instanceof Z?c.left instanceof Z?new Z(c.key,c.k,c.left.ma(),new $(a,b,c.right,d,null),null):c.right instanceof Z?new Z(c.right.key,c.right.k,new $(c.key,c.k,c.left,c.right.left,null),new $(a,b,c.right.right,d,null),null):t?new $(a,b,c,d,null):null:new $(a,b,c,d,null)}
function ff(a,b,c,d){return d instanceof Z?d.right instanceof Z?new Z(d.key,d.k,new $(a,b,c,d.left,null),d.right.ma(),null):d.left instanceof Z?new Z(d.left.key,d.left.k,new $(a,b,c,d.left.left,null),new $(d.key,d.k,d.left.right,d.right,null),null):t?new $(a,b,c,d,null):null:new $(a,b,c,d,null)}
function gf(a,b,c,d){if(c instanceof Z)return new Z(a,b,c.ma(),d,null);if(d instanceof $)return ff(a,b,c,d.Ta());if(d instanceof Z&&d.left instanceof $)return new Z(d.left.key,d.left.k,new $(a,b,c,d.left.left,null),ff(d.key,d.k,d.left.right,d.right.Ta()),null);if(t)throw Error("red-black tree invariant violation");return null}
var jf=function hf(b,c,d){d=null!=b.left?hf(b.left,c,d):d;if(Wb(d))return I.b?I.b(d):I.call(null,d);d=c.c?c.c(d,b.key,b.k):c.call(null,d,b.key,b.k);if(Wb(d))return I.b?I.b(d):I.call(null,d);b=null!=b.right?hf(b.right,c,d):d;return Wb(b)?I.b?I.b(b):I.call(null,b):b};function $(a,b,c,d,e){this.key=a;this.k=b;this.left=c;this.right=d;this.l=e;this.p=0;this.h=32402207}f=$.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.t=function(a,b){return y.c(this,b,null)};
f.u=function(a,b,c){return y.c(this,b,c)};f.pa=function(a,b,c){return Q.c(new X(null,2,5,Y,[this.key,this.k],null),b,c)};f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};
f.D=function(a,b){return new X(null,3,5,Y,[this.key,this.k,b],null)};f.La=function(){return this.key};f.Ma=function(){return this.k};f.Fb=function(a){return a.Hb(this)};f.Ta=function(){return new Z(this.key,this.k,this.left,this.right,null)};f.replace=function(a,b,c,d){return new $(a,b,c,d,null)};f.Da=function(a,b){return jf(this,a,b)};f.Eb=function(a){return a.Gb(this)};f.Gb=function(a){return new $(a.key,a.k,this,a.right,null)};f.Hb=function(a){return new $(a.key,a.k,a.left,this,null)};f.ma=function(){return this};
f.N=function(a,b){return Xb.a(this,b)};f.K=function(a,b,c){return Xb.c(this,b,c)};f.F=function(){return Fa(Fa(F,this.k),this.key)};f.J=function(){return 2};f.wa=function(){return this.k};f.xa=function(){return new X(null,1,5,Y,[this.key],null)};f.za=function(a,b,c){return(new X(null,2,5,Y,[this.key,this.k],null)).za(null,b,c)};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return M(new X(null,2,5,Y,[this.key,this.k],null),b)};f.B=function(){return null};
f.P=function(a,b){return 0===b?this.key:1===b?this.k:null};f.$=function(a,b,c){return 0===b?this.key:1===b?this.k:t?c:null};f.G=function(){return le};function Z(a,b,c,d,e){this.key=a;this.k=b;this.left=c;this.right=d;this.l=e;this.p=0;this.h=32402207}f=Z.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};f.t=function(a,b){return y.c(this,b,null)};f.u=function(a,b,c){return y.c(this,b,c)};f.pa=function(a,b,c){return Q.c(new X(null,2,5,Y,[this.key,this.k],null),b,c)};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};f.D=function(a,b){return new X(null,3,5,Y,[this.key,this.k,b],null)};f.La=function(){return this.key};f.Ma=function(){return this.k};
f.Fb=function(a){return new Z(this.key,this.k,this.left,a,null)};f.Ta=function(){throw Error("red-black tree invariant violation");};f.replace=function(a,b,c,d){return new Z(a,b,c,d,null)};f.Da=function(a,b){return jf(this,a,b)};f.Eb=function(a){return new Z(this.key,this.k,a,this.right,null)};
f.Gb=function(a){return this.left instanceof Z?new Z(this.key,this.k,this.left.ma(),new $(a.key,a.k,this.right,a.right,null),null):this.right instanceof Z?new Z(this.right.key,this.right.k,new $(this.key,this.k,this.left,this.right.left,null),new $(a.key,a.k,this.right.right,a.right,null),null):t?new $(a.key,a.k,this,a.right,null):null};
f.Hb=function(a){return this.right instanceof Z?new Z(this.key,this.k,new $(a.key,a.k,a.left,this.left,null),this.right.ma(),null):this.left instanceof Z?new Z(this.left.key,this.left.k,new $(a.key,a.k,a.left,this.left.left,null),new $(this.key,this.k,this.left.right,this.right,null),null):t?new $(a.key,a.k,a.left,this,null):null};f.ma=function(){return new $(this.key,this.k,this.left,this.right,null)};f.N=function(a,b){return Xb.a(this,b)};f.K=function(a,b,c){return Xb.c(this,b,c)};
f.F=function(){return Fa(Fa(F,this.k),this.key)};f.J=function(){return 2};f.wa=function(){return this.k};f.xa=function(){return new X(null,1,5,Y,[this.key],null)};f.za=function(a,b,c){return(new X(null,2,5,Y,[this.key,this.k],null)).za(null,b,c)};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return M(new X(null,2,5,Y,[this.key,this.k],null),b)};f.B=function(){return null};f.P=function(a,b){return 0===b?this.key:1===b?this.k:null};
f.$=function(a,b,c){return 0===b?this.key:1===b?this.k:t?c:null};f.G=function(){return le};
var lf=function kf(b,c,d,e,g){if(null==c)return new Z(d,e,null,null,null);var h=b.a?b.a(d,c.key):b.call(null,d,c.key);return 0===h?(g[0]=c,null):0>h?(b=kf(b,c.left,d,e,g),null!=b?c.Eb(b):null):t?(b=kf(b,c.right,d,e,g),null!=b?c.Fb(b):null):null},nf=function mf(b,c){if(null==b)return c;if(null==c)return b;if(b instanceof Z){if(c instanceof Z){var d=mf(b.right,c.left);return d instanceof Z?new Z(d.key,d.k,new Z(b.key,b.k,b.left,d.left,null),new Z(c.key,c.k,d.right,c.right,null),null):new Z(b.key,b.k,
b.left,new Z(c.key,c.k,d,c.right,null),null)}return new Z(b.key,b.k,b.left,mf(b.right,c),null)}return c instanceof Z?new Z(c.key,c.k,mf(b,c.left),c.right,null):t?(d=mf(b.right,c.left),d instanceof Z?new Z(d.key,d.k,new $(b.key,b.k,b.left,d.left,null),new $(c.key,c.k,d.right,c.right,null),null):gf(b.key,b.k,b.left,new $(c.key,c.k,d,c.right,null))):null},pf=function of(b,c,d,e){if(null!=c){var g=b.a?b.a(d,c.key):b.call(null,d,c.key);if(0===g)return e[0]=c,nf(c.left,c.right);if(0>g)return b=of(b,c.left,
d,e),null!=b||null!=e[0]?c.left instanceof $?gf(c.key,c.k,b,c.right):new Z(c.key,c.k,b,c.right,null):null;if(t){b=of(b,c.right,d,e);if(null!=b||null!=e[0])if(c.right instanceof $)if(e=c.key,d=c.k,c=c.left,b instanceof Z)c=new Z(e,d,c,b.ma(),null);else if(c instanceof $)c=ef(e,d,c.Ta(),b);else if(c instanceof Z&&c.right instanceof $)c=new Z(c.right.key,c.right.k,ef(c.key,c.k,c.left.Ta(),c.right.left),new $(e,d,c.right.right,b,null),null);else{if(t)throw Error("red-black tree invariant violation");
c=null}else c=new Z(c.key,c.k,c.left,b,null);else c=null;return c}}return null},rf=function qf(b,c,d,e){var g=c.key,h=b.a?b.a(d,g):b.call(null,d,g);return 0===h?c.replace(g,e,c.left,c.right):0>h?c.replace(g,c.k,qf(b,c.left,d,e),c.right):t?c.replace(g,c.k,c.left,qf(b,c.right,d,e)):null};function sf(a,b,c,d,e){this.Y=a;this.ja=b;this.g=c;this.j=d;this.l=e;this.h=418776847;this.p=8192}f=sf.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=Rc(this)};
f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){a=tf(this,b);return null!=a?a.k:c};f.pa=function(a,b,c){a=[null];var d=lf(this.Y,this.ja,b,c,a);return null==d?(a=O.a(a,0),Pb.a(c,a.k)?this:new sf(this.Y,rf(this.Y,this.ja,b,c),this.g,this.j,null)):new sf(this.Y,d.ma(),this.g+1,this.j,null)};f.Wa=function(a,b){return null!=tf(this,b)};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};f.Ka=function(a,b,c){return null!=this.ja?jf(this.ja,b,c):c};f.D=function(a,b){return yc(b)?Qa(this,y.a(b,0),y.a(b,1)):x.c(Fa,this,b)};
f.Ga=function(){return 0<this.g?new df(null,cf(this.ja,null,!1),!1,this.g,null):null};f.toString=function(){return Nb(this)};function tf(a,b){for(var c=a.ja;;)if(null!=c){var d=a.Y.a?a.Y.a(b,c.key):a.Y.call(null,b,c.key);if(0===d)return c;if(0>d)c=c.left;else if(t)c=c.right;else return null}else return null}f.yb=function(a,b){return 0<this.g?new df(null,cf(this.ja,null,b),b,this.g,null):null};
f.zb=function(a,b,c){if(0<this.g){a=null;for(var d=this.ja;;)if(null!=d){var e=this.Y.a?this.Y.a(b,d.key):this.Y.call(null,b,d.key);if(0===e)return new df(null,fc.a(a,d),c,-1,null);if(p(c))0>e?(a=fc.a(a,d),d=d.left):d=d.right;else if(t)0<e?(a=fc.a(a,d),d=d.right):d=d.left;else return null}else return null==a?null:new df(null,a,c,-1,null)}else return null};f.xb=function(a,b){return Sc.b?Sc.b(b):Sc.call(null,b)};f.wb=function(){return this.Y};
f.F=function(){return 0<this.g?new df(null,cf(this.ja,null,!0),!0,this.g,null):null};f.J=function(){return this.g};f.v=function(a,b){return Ae(this,b)};f.C=function(a,b){return new sf(this.Y,this.ja,this.g,b,this.l)};f.B=function(){return this.j};f.G=function(){return M(uf,this.j)};f.Za=function(a,b){var c=[null],d=pf(this.Y,this.ja,b,c);return null==d?null==O.a(c,0)?this:new sf(this.Y,null,0,this.j,null):new sf(this.Y,d.ma(),this.g-1,this.j,null)};
var uf=new sf(Qb,null,0,null,0),vf=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){a=C(a);for(var b=Ab(Fe);;)if(a){var e=G(G(a)),b=qd.c(b,D(a),D(G(a)));a=e}else return Cb(b)}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}(),wf=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return new ma(null,Oc(N(a)),R.a(xa,
a),null)}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}(),xf=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){a=C(a);for(var b=uf;;)if(a){var e=G(G(a)),b=Q.c(b,D(a),D(G(a)));a=e}else return b}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}(),yf=function(){function a(a,d){var e=null;1<arguments.length&&(e=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,a,e)}function b(a,
b){for(var e=C(b),g=new sf(Hc(a),null,0,null,0);;)if(e)var h=G(G(e)),g=Q.c(g,D(e),D(G(e))),e=h;else return g}a.i=1;a.f=function(a){var d=D(a);a=E(a);return b(d,a)};a.e=b;return a}();function zf(a,b){this.U=a;this.V=b;this.p=0;this.h=32374988}f=zf.prototype;f.A=function(){return ac(this)};f.S=function(){var a=this.U,a=(a?a.h&128||a.$a||(a.h?0:s(Ka,a)):s(Ka,a))?this.U.S(null):G(this.U);return null==a?null:new zf(a,this.V)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};
f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.O=function(){return this.U.O(null).La(null)};f.T=function(){var a=this.U,a=(a?a.h&128||a.$a||(a.h?0:s(Ka,a)):s(Ka,a))?this.U.S(null):G(this.U);return null!=a?new zf(a,this.V):F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new zf(this.U,b)};f.B=function(){return this.V};f.G=function(){return M(F,this.V)};function Af(a){return(a=C(a))?new zf(a,null):null}
function Sc(a){return Ua(a)}function Bf(a,b){this.U=a;this.V=b;this.p=0;this.h=32374988}f=Bf.prototype;f.A=function(){return ac(this)};f.S=function(){var a=this.U,a=(a?a.h&128||a.$a||(a.h?0:s(Ka,a)):s(Ka,a))?this.U.S(null):G(this.U);return null==a?null:new Bf(a,this.V)};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return K.a(b,this)};f.K=function(a,b,c){return K.c(b,c,this)};f.F=function(){return this};f.O=function(){return this.U.O(null).Ma(null)};
f.T=function(){var a=this.U,a=(a?a.h&128||a.$a||(a.h?0:s(Ka,a)):s(Ka,a))?this.U.S(null):G(this.U);return null!=a?new Bf(a,this.V):F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Bf(this.U,b)};f.B=function(){return this.V};f.G=function(){return M(F,this.V)};function Tc(a){return Va(a)}
var Cf=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return p(vd(wd,a))?x.a(function(a,b){return fc.a(p(a)?a:Ge,b)},a):null}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}();function Df(a,b,c){this.j=a;this.Ca=b;this.l=c;this.p=8196;this.h=15077647}f=Df.prototype;f.Ea=function(){return new Ef(Ab(this.Ca))};f.A=function(){var a=this.l;return null!=a?a:this.l=a=Uc(this)};
f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return Pa(this.Ca,b)?b:c};f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};f.D=function(a,b){return new Df(this.j,Q.c(this.Ca,b,null),null)};
f.toString=function(){return Nb(this)};f.F=function(){return Af(this.Ca)};f.vb=function(a,b){return new Df(this.j,Sa(this.Ca,b),null)};f.J=function(){return Ca(this.Ca)};f.v=function(a,b){return uc(b)&&N(this)===N(b)&&ud(function(a){return function(b){return Fc(a,b)}}(this),b)};f.C=function(a,b){return new Df(b,this.Ca,this.l)};f.B=function(){return this.j};f.G=function(){return M(Ff,this.j)};var Ff=new Df(null,Ge,0);function Ef(a){this.ia=a;this.h=259;this.p=136}f=Ef.prototype;
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return Ma.c(this.ia,c,Cc)===Cc?null:c;case 3:return Ma.c(this.ia,c,Cc)===Cc?d:c}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return Ma.c(this.ia,a,Cc)===Cc?null:a};f.a=function(a,b){return Ma.c(this.ia,a,Cc)===Cc?b:a};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){return Ma.c(this.ia,b,Cc)===Cc?c:b};
f.J=function(){return N(this.ia)};f.Mb=function(a,b){this.ia=rd.a(this.ia,b);return this};f.qa=function(a,b){this.ia=qd.c(this.ia,b,null);return this};f.ya=function(){return new Df(null,Cb(this.ia),null)};function Gf(a,b,c){this.j=a;this.ka=b;this.l=c;this.h=417730831;this.p=8192}f=Gf.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=Uc(this)};f.t=function(a,b){return Ma.c(this,b,null)};f.u=function(a,b,c){a=tf(this.ka,b);return null!=a?a.key:c};
f.call=function(){var a=null;return a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.u(null,c,d)}throw Error("Invalid arity: "+arguments.length);}}();f.apply=function(a,b){return this.call.apply(this,[this].concat(wa(b)))};f.b=function(a){return this.t(null,a)};f.a=function(a,b){return this.u(null,a,b)};f.D=function(a,b){return new Gf(this.j,Q.c(this.ka,b,null),null)};f.Ga=function(){return 0<N(this.ka)?W.a(Sc,rb(this.ka)):null};f.toString=function(){return Nb(this)};
f.yb=function(a,b){return W.a(Sc,sb(this.ka,b))};f.zb=function(a,b,c){return W.a(Sc,tb(this.ka,b,c))};f.xb=function(a,b){return b};f.wb=function(){return vb(this.ka)};f.F=function(){return Af(this.ka)};f.vb=function(a,b){return new Gf(this.j,jc.a(this.ka,b),null)};f.J=function(){return N(this.ka)};f.v=function(a,b){return uc(b)&&N(this)===N(b)&&ud(function(a){return function(b){return Fc(a,b)}}(this),b)};f.C=function(a,b){return new Gf(b,this.ka,this.l)};f.B=function(){return this.j};
f.G=function(){return M(Hf,this.j)};
var Hf=new Gf(null,uf,0),If=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return x.c(Fa,Hf,a)}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}(),Jf=function(){function a(a,d){var e=null;1<arguments.length&&(e=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,a,e)}function b(a,b){return x.c(Fa,new Gf(null,yf(a),0),b)}a.i=1;a.f=function(a){var d=D(a);a=E(a);return b(d,a)};a.e=b;return a}();
function Kf(a){for(var b=le;;)if(G(a))b=fc.a(b,D(a)),a=G(a);else return C(b)}function bd(a){if(a&&(a.p&4096||a.Zb))return a.name;if("string"===typeof a)return a;throw Error([w("Doesn't support name: "),w(a)].join(""));}
var Lf=function(){function a(a,b,c){return(a.b?a.b(b):a.call(null,b))>(a.b?a.b(c):a.call(null,c))?b:c}var b=null,c=function(){function a(b,d,k,l){var q=null;3<arguments.length&&(q=H(Array.prototype.slice.call(arguments,3),0));return c.call(this,b,d,k,q)}function c(a,d,e,l){return x.c(function(c,d){return b.c(a,c,d)},b.c(a,d,e),l)}a.i=3;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=G(a);var l=D(a);a=E(a);return c(b,d,l,a)};a.e=c;return a}(),b=function(b,e,g,h){switch(arguments.length){case 2:return e;
case 3:return a.call(this,b,e,g);default:return c.e(b,e,g,H(arguments,3))}throw Error("Invalid arity: "+arguments.length);};b.i=3;b.f=c.f;b.a=function(a,b){return b};b.c=a;b.e=c.e;return b}(),Nf=function Mf(b,c){return new V(null,function(){var d=C(c);return d?p(b.b?b.b(D(d)):b.call(null,D(d)))?J(D(d),Mf(b,E(d))):null:null},null,null)};
function Of(a,b,c){return function(d){var e=vb(a);return b.a?b.a(e.a?e.a(ub(a,d),c):e.call(null,ub(a,d),c),0):b.call(null,e.a?e.a(ub(a,d),c):e.call(null,ub(a,d),c),0)}}
var Pf=function(){function a(a,b,c,h,k){var l=tb(a,c,!0);if(p(l)){var q=O.c(l,0,null);return Nf(Of(a,h,k),p(Of(a,b,c).call(null,q))?l:G(l))}return null}function b(a,b,c){var h=Of(a,b,c),k;a:{k=[Lc,Mc];var l=k.length;if(l<=Ee)for(var q=0,r=Ab(Ge);;)if(q<l)var u=q+1,r=Db(r,k[q],null),q=u;else{k=new Df(null,Cb(r),null);break a}else for(q=0,r=Ab(Ff);;)if(q<l)u=q+1,r=Bb(r,k[q]),q=u;else{k=Cb(r);break a}k=void 0}return p(k.call(null,b))?(a=tb(a,c,!0),p(a)?(b=O.c(a,0,null),p(h.b?h.b(b):h.call(null,b))?a:
G(a)):null):Nf(h,sb(a,!0))}var c=null,c=function(c,e,g,h,k){switch(arguments.length){case 3:return b.call(this,c,e,g);case 5:return a.call(this,c,e,g,h,k)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.r=a;return c}();function Qf(a,b,c,d,e){this.j=a;this.start=b;this.end=c;this.step=d;this.l=e;this.h=32375006;this.p=8192}f=Qf.prototype;f.A=function(){var a=this.l;return null!=a?a:this.l=a=ac(this)};
f.S=function(){return 0<this.step?this.start+this.step<this.end?new Qf(this.j,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Qf(this.j,this.start+this.step,this.end,this.step,null):null};f.D=function(a,b){return J(b,this)};f.toString=function(){return Nb(this)};f.N=function(a,b){return Xb.a(this,b)};f.K=function(a,b,c){return Xb.c(this,b,c)};f.F=function(){return 0<this.step?this.start<this.end?this:null:this.start>this.end?this:null};
f.J=function(){return ta(nb(this))?0:Math.ceil((this.end-this.start)/this.step)};f.O=function(){return null==nb(this)?null:this.start};f.T=function(){return null!=nb(this)?new Qf(this.j,this.start+this.step,this.end,this.step,null):F};f.v=function(a,b){return cc(this,b)};f.C=function(a,b){return new Qf(b,this.start,this.end,this.step,this.l)};f.B=function(){return this.j};
f.P=function(a,b){if(b<Ca(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};f.$=function(a,b,c){return b<Ca(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};f.G=function(){return M(F,this.j)};
var Rf=function(){function a(a,b,c){return new Qf(null,a,b,c,null)}function b(a,b){return e.c(a,b,1)}function c(a){return e.c(0,a,1)}function d(){return e.c(0,Number.MAX_VALUE,1)}var e=null,e=function(e,h,k){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,e,h);case 3:return a.call(this,e,h,k)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.b=c;e.a=b;e.c=a;return e}(),Sf=function(){function a(a,b){for(;;)if(C(b)&&0<a){var c=a-1,h=
G(b);a=c;b=h}else return null}function b(a){for(;;)if(C(a))a=G(a);else return null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Tf=function(){function a(a,b){Sf.a(a,b);return b}function b(a){Sf.b(a);return a}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);
};c.b=b;c.a=a;return c}();function Uf(a,b,c,d,e,g,h){var k=ja;try{ja=null==ja?null:ja-1;if(null!=ja&&0>ja)return z(a,"#");z(a,c);C(h)&&(b.c?b.c(D(h),a,g):b.call(null,D(h),a,g));for(var l=G(h),q=sa.b(g);l&&(null==q||0!==q);){z(a,d);b.c?b.c(D(l),a,g):b.call(null,D(l),a,g);var r=G(l);c=q-1;l=r;q=c}p(sa.b(g))&&(z(a,d),b.c?b.c("...",a,g):b.call(null,"...",a,g));return z(a,e)}finally{ja=k}}
var Vf=function(){function a(a,d){var e=null;1<arguments.length&&(e=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,a,e)}function b(a,b){for(var e=C(b),g=null,h=0,k=0;;)if(k<h){var l=g.P(null,k);z(a,l);k+=1}else if(e=C(e))g=e,zc(g)?(e=Jb(g),h=Kb(g),g=e,l=N(e),e=h,h=l):(l=D(g),z(a,l),e=G(g),g=null,h=0),k=0;else return null}a.i=1;a.f=function(a){var d=D(a);a=E(a);return b(d,a)};a.e=b;return a}(),Wf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};
function Xf(a){return[w('"'),w(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Wf[a]})),w('"')].join("")}
var $f=function Yf(b,c,d){if(null==b)return z(c,"nil");if(void 0===b)return z(c,"#\x3cundefined\x3e");if(t){p(function(){var c=P.a(d,qa);return p(c)?(c=b?b.h&131072||b.Yb?!0:b.h?!1:s(cb,b):s(cb,b))?mc(b):c:c}())&&(z(c,"^"),Yf(mc(b),c,d),z(c," "));if(null==b)return z(c,"nil");if(b.bb)return b.Bb(b,c,d);if(b&&(b.h&2147483648||b.H))return b.w(null,c,d);if(ua(b)===Boolean||"number"===typeof b)return z(c,""+w(b));if(null!=b&&b.constructor===Object)return z(c,"#js "),Zf.n?Zf.n(W.a(function(c){return new X(null,
2,5,Y,[cd.b(c),b[c]],null)},Ac(b)),Yf,c,d):Zf.call(null,W.a(function(c){return new X(null,2,5,Y,[cd.b(c),b[c]],null)},Ac(b)),Yf,c,d);if(b instanceof Array)return Uf(c,Yf,"#js ["," ","]",d,b);if("string"==typeof b)return p(pa.b(d))?z(c,Xf(b)):z(c,b);if(kc(b))return Vf.e(c,H(["#\x3c",""+w(b),"\x3e"],0));if(b instanceof Date){var e=function(b,c){for(var d=""+w(b);;)if(N(d)<c)d=[w("0"),w(d)].join("");else return d};return Vf.e(c,H(['#inst "',""+w(b.getUTCFullYear()),"-",e(b.getUTCMonth()+1,2),"-",e(b.getUTCDate(),
2),"T",e(b.getUTCHours(),2),":",e(b.getUTCMinutes(),2),":",e(b.getUTCSeconds(),2),".",e(b.getUTCMilliseconds(),3),"-",'00:00"'],0))}return b instanceof RegExp?Vf.e(c,H(['#"',b.source,'"'],0)):(b?b.h&2147483648||b.H||(b.h?0:s(xb,b)):s(xb,b))?yb(b,c,d):t?Vf.e(c,H(["#\x3c",""+w(b),"\x3e"],0)):null}return null},ag=function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){var b;if(sc(a))b="";else{b=w;var e=ka(),g=new ha;
a:{var h=new Mb(g);$f(D(a),h,e);a=C(G(a));for(var k=null,l=0,q=0;;)if(q<l){var r=k.P(null,q);z(h," ");$f(r,h,e);q+=1}else if(a=C(a))k=a,zc(k)?(a=Jb(k),l=Kb(k),k=a,r=N(a),a=l,l=r):(r=D(k),z(h," "),$f(r,h,e),a=G(k),k=null,l=0),q=0;else break a}b=""+b(g)}return b}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}();function Zf(a,b,c,d){return Uf(c,function(a,c,d){b.c?b.c(Ua(a),c,d):b.call(null,Ua(a),c,d);z(c," ");return b.c?b.c(Va(a),c,d):b.call(null,Va(a),c,d)},"{",", ","}",d,C(a))}
zf.prototype.H=!0;zf.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Ub.prototype.H=!0;Ub.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};re.prototype.H=!0;re.prototype.w=function(a,b,c){return Uf(b,$f,"["," ","]",c,this)};hd.prototype.H=!0;hd.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};sf.prototype.H=!0;sf.prototype.w=function(a,b,c){return Zf(this,$f,b,c)};ma.prototype.H=!0;ma.prototype.w=function(a,b,c){return Zf(this,$f,b,c)};V.prototype.H=!0;
V.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};bc.prototype.H=!0;bc.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Gf.prototype.H=!0;Gf.prototype.w=function(a,b,c){return Uf(b,$f,"#{"," ","}",c,this)};Ye.prototype.H=!0;Ye.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Z.prototype.H=!0;Z.prototype.w=function(a,b,c){return Uf(b,$f,"["," ","]",c,this)};pe.prototype.H=!0;pe.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};
$e.prototype.H=!0;$e.prototype.w=function(a,b,c){return Zf(this,$f,b,c)};Df.prototype.H=!0;Df.prototype.w=function(a,b,c){return Uf(b,$f,"#{"," ","}",c,this)};X.prototype.H=!0;X.prototype.w=function(a,b,c){return Uf(b,$f,"["," ","]",c,this)};Vc.prototype.H=!0;Vc.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Ce.prototype.H=!0;Ce.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Wc.prototype.H=!0;Wc.prototype.w=function(a,b){return z(b,"()")};$.prototype.H=!0;
$.prototype.w=function(a,b,c){return Uf(b,$f,"["," ","]",c,this)};$c.prototype.H=!0;$c.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Qf.prototype.H=!0;Qf.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Ze.prototype.H=!0;Ze.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};Bf.prototype.H=!0;Bf.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};df.prototype.H=!0;df.prototype.w=function(a,b,c){return Uf(b,$f,"("," ",")",c,this)};
X.prototype.Xa=!0;X.prototype.Ya=function(a,b){return Gc.a(this,b)};re.prototype.Xa=!0;re.prototype.Ya=function(a,b){return Gc.a(this,b)};U.prototype.Xa=!0;U.prototype.Ya=function(a,b){return Ob(this,b)};Sb.prototype.Xa=!0;Sb.prototype.Ya=function(a,b){return Ob(this,b)};function bg(a,b){if(a?a.$b:a)return a.$b(a,b);var c;c=bg[m(null==a?null:a)];if(!c&&(c=bg._,!c))throw v("IReset.-reset!",a);return c.call(null,a,b)}
var cg=function(){function a(a,b,c,d,e){if(a?a.ec:a)return a.ec(a,b,c,d,e);var r;r=cg[m(null==a?null:a)];if(!r&&(r=cg._,!r))throw v("ISwap.-swap!",a);return r.call(null,a,b,c,d,e)}function b(a,b,c,d){if(a?a.dc:a)return a.dc(a,b,c,d);var e;e=cg[m(null==a?null:a)];if(!e&&(e=cg._,!e))throw v("ISwap.-swap!",a);return e.call(null,a,b,c,d)}function c(a,b,c){if(a?a.cc:a)return a.cc(a,b,c);var d;d=cg[m(null==a?null:a)];if(!d&&(d=cg._,!d))throw v("ISwap.-swap!",a);return d.call(null,a,b,c)}function d(a,b){if(a?
a.bc:a)return a.bc(a,b);var c;c=cg[m(null==a?null:a)];if(!c&&(c=cg._,!c))throw v("ISwap.-swap!",a);return c.call(null,a,b)}var e=null,e=function(e,h,k,l,q){switch(arguments.length){case 2:return d.call(this,e,h);case 3:return c.call(this,e,h,k);case 4:return b.call(this,e,h,k,l);case 5:return a.call(this,e,h,k,l,q)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.c=c;e.n=b;e.r=a;return e}();function dg(a,b,c,d){this.state=a;this.j=b;this.lc=c;this.Rb=d;this.h=2153938944;this.p=16386}f=dg.prototype;
f.A=function(){return this[ba]||(this[ba]=++ca)};f.Pb=function(a,b,c){a=C(this.Rb);for(var d=null,e=0,g=0;;)if(g<e){var h=d.P(null,g),k=O.c(h,0,null),h=O.c(h,1,null);h.n?h.n(k,this,b,c):h.call(null,k,this,b,c);g+=1}else if(a=C(a))zc(a)?(d=Jb(a),a=Kb(a),k=d,e=N(d),d=k):(d=D(a),k=O.c(d,0,null),h=O.c(d,1,null),h.n?h.n(k,this,b,c):h.call(null,k,this,b,c),a=G(a),d=null,e=0),g=0;else return null};f.w=function(a,b,c){z(b,"#\x3cAtom: ");$f(this.state,b,c);return z(b,"\x3e")};f.B=function(){return this.j};
f.hb=function(){return this.state};f.v=function(a,b){return this===b};
var fg=function(){function a(a){return new dg(a,null,null,null)}var b=null,c=function(){function a(c,d){var k=null;1<arguments.length&&(k=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,c,k)}function b(a,c){var d=Dc(c)?R.a(vf,c):c,e=P.a(d,eg),d=P.a(d,qa);return new dg(a,d,e,null)}a.i=1;a.f=function(a){var c=D(a);a=E(a);return b(c,a)};a.e=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:return c.e(b,H(arguments,1))}throw Error("Invalid arity: "+
arguments.length);};b.i=1;b.f=c.f;b.b=a;b.e=c.e;return b}();function gg(a,b){if(a instanceof dg){var c=a.lc;if(null!=c&&!p(c.b?c.b(b):c.call(null,b)))throw Error([w("Assert failed: "),w("Validator rejected reference state"),w("\n"),w(ag.e(H([Zc(new Sb(null,"validate","validate",1233162959,null),new Sb(null,"new-value","new-value",972165309,null))],0)))].join(""));c=a.state;a.state=b;null!=a.Rb&&zb(a,c,b);return b}return bg(a,b)}function I(a){return bb(a)}
var hg=function(){function a(a,b,c,d){return a instanceof dg?gg(a,b.c?b.c(a.state,c,d):b.call(null,a.state,c,d)):cg.n(a,b,c,d)}function b(a,b,c){return a instanceof dg?gg(a,b.a?b.a(a.state,c):b.call(null,a.state,c)):cg.c(a,b,c)}function c(a,b){return a instanceof dg?gg(a,b.b?b.b(a.state):b.call(null,a.state)):cg.a(a,b)}var d=null,e=function(){function a(c,d,e,g,u){var B=null;4<arguments.length&&(B=H(Array.prototype.slice.call(arguments,4),0));return b.call(this,c,d,e,g,B)}function b(a,c,d,e,g){return a instanceof
dg?gg(a,R.r(c,a.state,d,e,g)):cg.r(a,c,d,e,g)}a.i=4;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=G(a);var e=D(a);a=G(a);var g=D(a);a=E(a);return b(c,d,e,g,a)};a.e=b;return a}(),d=function(d,h,k,l,q){switch(arguments.length){case 2:return c.call(this,d,h);case 3:return b.call(this,d,h,k);case 4:return a.call(this,d,h,k,l);default:return e.e(d,h,k,l,H(arguments,4))}throw Error("Invalid arity: "+arguments.length);};d.i=4;d.f=e.f;d.a=c;d.c=b;d.n=a;d.e=e.e;return d}(),ig={};
function jg(a){if(a?a.Wb:a)return a.Wb(a);var b;b=jg[m(null==a?null:a)];if(!b&&(b=jg._,!b))throw v("IEncodeJS.-clj-\x3ejs",a);return b.call(null,a)}function kg(a){return(a?p(p(null)?null:a.Vb)||(a.Cb?0:s(ig,a)):s(ig,a))?jg(a):"string"===typeof a||"number"===typeof a||a instanceof U||a instanceof Sb?lg.b?lg.b(a):lg.call(null,a):ag.e(H([a],0))}
var lg=function mg(b){if(null==b)return null;if(b?p(p(null)?null:b.Vb)||(b.Cb?0:s(ig,b)):s(ig,b))return jg(b);if(b instanceof U)return bd(b);if(b instanceof Sb)return""+w(b);if(xc(b)){var c={};b=C(b);for(var d=null,e=0,g=0;;)if(g<e){var h=d.P(null,g),k=O.c(h,0,null),h=O.c(h,1,null);c[kg(k)]=mg(h);g+=1}else if(b=C(b))zc(b)?(e=Jb(b),b=Kb(b),d=e,e=N(e)):(e=D(b),d=O.c(e,0,null),e=O.c(e,1,null),c[kg(d)]=mg(e),b=G(b),d=null,e=0),g=0;else break;return c}if(tc(b)){c=[];b=C(W.a(mg,b));d=null;for(g=e=0;;)if(g<
e)k=d.P(null,g),c.push(k),g+=1;else if(b=C(b))d=b,zc(d)?(b=Jb(d),g=Kb(d),d=b,e=N(b),b=g):(b=D(d),c.push(b),b=G(d),d=null,e=0),g=0;else break;return c}return t?b:null},ng={};function og(a,b){if(a?a.Ub:a)return a.Ub(a,b);var c;c=og[m(null==a?null:a)];if(!c&&(c=og._,!c))throw v("IEncodeClojure.-js-\x3eclj",a);return c.call(null,a,b)}
var qg=function(){function a(a){return b.e(a,H([new ma(null,1,[pg,!1],null)],0))}var b=null,c=function(){function a(c,d){var k=null;1<arguments.length&&(k=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,c,k)}function b(a,c){if(a?p(p(null)?null:a.sc)||(a.Cb?0:s(ng,a)):s(ng,a))return og(a,R.a(wf,c));if(C(c)){var d=Dc(c)?R.a(vf,c):c,e=P.a(d,pg);return function(a,b,c,d){return function L(e){return Dc(e)?Tf.b(W.a(L,e)):tc(e)?Od(gc(e),W.a(L,e)):e instanceof Array?ne(W.a(L,e)):ua(e)===Object?
Od(Ge,function(){return function(a,b,c,d){return function wb(g){return new V(null,function(a,b,c,d){return function(){for(;;){var a=C(g);if(a){if(zc(a)){var b=Jb(a),c=N(b),h=new ed(Array(c),0);a:{for(var k=0;;)if(k<c){var l=y.a(b,k),l=new X(null,2,5,Y,[d.b?d.b(l):d.call(null,l),L(e[l])],null);h.add(l);k+=1}else{b=!0;break a}b=void 0}return b?id(h.ba(),wb(Kb(a))):id(h.ba(),null)}h=D(a);return J(new X(null,2,5,Y,[d.b?d.b(h):d.call(null,h),L(e[h])],null),wb(E(a)))}return null}}}(a,b,c,d),null,null)}}(a,
b,c,d)(Ac(e))}()):t?e:null}}(c,d,e,p(e)?cd:w)(a)}return null}a.i=1;a.f=function(a){var c=D(a);a=E(a);return b(c,a)};a.e=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:return c.e(b,H(arguments,1))}throw Error("Invalid arity: "+arguments.length);};b.i=1;b.f=c.f;b.b=a;b.e=c.e;return b}();var ra=new U(null,"dup","dup"),rg=new U(null,"r","r"),sg=new U(null,"pnodes","pnodes"),Rb=new U(null,"default","default"),tg=new U(null,"ppath","ppath"),ug=new U("zip","branch?","zip/branch?"),pg=new U(null,"keywordize-keys","keywordize-keys"),vg=new U(null,"changed?","changed?"),oa=new U(null,"flush-on-newline","flush-on-newline"),wg=new U(null,"end","end"),xg=new U(null,"l","l"),yg=new U("zip","make-node","zip/make-node"),sa=new U(null,"print-length","print-length"),zg=new U("mori","not-found",
"mori/not-found"),t=new U(null,"else","else"),pa=new U(null,"readably","readably"),eg=new U(null,"validator","validator"),qa=new U(null,"meta","meta"),Ag=new U("zip","children","zip/children");var Bg,Cg;function Dg(a){return a.m?a.m():a.call(null)}var Eg=function(){function a(a,b,c){return xc(c)?jb(c,a,b):null==c?b:c instanceof Array?Yb.c(c,a,b):t?hb.c(c,a,b):null}function b(a,b){return c.c(a,a.m?a.m():a.call(null),b)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();
function Fg(a,b,c,d){if(a?a.Db:a)return a.Db(a,b,c,d);var e;e=Fg[m(null==a?null:a)];if(!e&&(e=Fg._,!e))throw v("CollFold.coll-fold",a);return e.call(null,a,b,c,d)}
var Hg=function Gg(b,c){"undefined"===typeof Bg&&(Bg=function(b,c,g,h){this.Z=b;this.Aa=c;this.jc=g;this.hc=h;this.p=0;this.h=917504},Bg.bb=!0,Bg.ab="clojure.core.reducers/t6077",Bg.Bb=function(b,c){return z(c,"clojure.core.reducers/t6077")},Bg.prototype.N=function(b,c){return hb.c(this,c,c.m?c.m():c.call(null))},Bg.prototype.K=function(b,c,g){return hb.c(this.Aa,this.Z.b?this.Z.b(c):this.Z.call(null,c),g)},Bg.prototype.B=function(){return this.hc},Bg.prototype.C=function(b,c){return new Bg(this.Z,
this.Aa,this.jc,c)});return new Bg(c,b,Gg,null)},Jg=function Ig(b,c){"undefined"===typeof Cg&&(Cg=function(b,c,g,h){this.Z=b;this.Aa=c;this.fc=g;this.ic=h;this.p=0;this.h=917504},Cg.bb=!0,Cg.ab="clojure.core.reducers/t6083",Cg.Bb=function(b,c){return z(c,"clojure.core.reducers/t6083")},Cg.prototype.Db=function(b,c,g,h){return Fg(this.Aa,c,g,this.Z.b?this.Z.b(h):this.Z.call(null,h))},Cg.prototype.N=function(b,c){return hb.c(this.Aa,this.Z.b?this.Z.b(c):this.Z.call(null,c),c.m?c.m():c.call(null))},
Cg.prototype.K=function(b,c,g){return hb.c(this.Aa,this.Z.b?this.Z.b(c):this.Z.call(null,c),g)},Cg.prototype.B=function(){return this.ic},Cg.prototype.C=function(b,c){return new Cg(this.Z,this.Aa,this.fc,c)});return new Cg(c,b,Ig,null)},Kg=function(){function a(a,b){return Jg(b,function(b){return function(){var c=null;return c=function(c,e,h){switch(arguments.length){case 0:return b.m?b.m():b.call(null);case 2:return b.a?b.a(c,a.b?a.b(e):a.call(null,e)):b.call(null,c,a.b?a.b(e):a.call(null,e));case 3:return b.a?
b.a(c,a.a?a.a(e,h):a.call(null,e,h)):b.call(null,c,a.a?a.a(e,h):a.call(null,e,h))}throw Error("Invalid arity: "+arguments.length);}}()})}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Lg=function(){function a(a,b){return Jg(b,function(b){return function(){var c=null;return c=function(c,e,h){switch(arguments.length){case 0:return b.m?
b.m():b.call(null);case 2:return p(a.b?a.b(e):a.call(null,e))?b.a?b.a(c,e):b.call(null,c,e):c;case 3:return p(a.a?a.a(e,h):a.call(null,e,h))?b.c?b.c(c,e,h):b.call(null,c,e,h):c}throw Error("Invalid arity: "+arguments.length);}}()})}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Mg=function(){function a(a){return Jg(a,
function(a){return function(){var b=null;return b=function(b,d){switch(arguments.length){case 0:return a.m?a.m():a.call(null);case 2:return wc(d)?c.b(d).K(null,a,b):a.a?a.a(b,d):a.call(null,b,d)}throw Error("Invalid arity: "+arguments.length);}}()})}function b(){return function(a){return c.b(a)}}var c=null,c=function(c){switch(arguments.length){case 0:return b.call(this);case 1:return a.call(this,c)}throw Error("Invalid arity: "+arguments.length);};c.m=b;c.b=a;return c}(),Ng=function(){function a(a,
b){return Lg.a(xd(a),b)}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Og=function(){function a(a,b){return Hg(b,function(b){return function(){var c=null;return c=function(c,e,h){switch(arguments.length){case 0:return b.m?b.m():b.call(null);case 2:return p(a.b?a.b(e):a.call(null,e))?b.a?b.a(c,e):b.call(null,c,e):
new Vb(c);case 3:return p(a.a?a.a(e,h):a.call(null,e,h))?b.c?b.c(c,e,h):b.call(null,c,e,h):new Vb(c)}throw Error("Invalid arity: "+arguments.length);}}()})}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Pg=function(){function a(a,b){return Hg(b,function(b){return function(a){return function(){var c=null;return c=
function(c,d,e){switch(arguments.length){case 0:return b.m?b.m():b.call(null);case 2:return hg.a(a,Nc),0>bb(a)?new Vb(c):b.a?b.a(c,d):b.call(null,c,d);case 3:return hg.a(a,Nc),0>bb(a)?new Vb(c):b.c?b.c(c,d,e):b.call(null,c,d,e)}throw Error("Invalid arity: "+arguments.length);}}()}(fg.b(a))})}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);
};c.b=b;c.a=a;return c}(),Qg=function(){function a(a,b){return Hg(b,function(b){return function(a){return function(){var c=null;return c=function(c,d,e){switch(arguments.length){case 0:return b.m?b.m():b.call(null);case 2:return hg.a(a,Nc),0>bb(a)?b.a?b.a(c,d):b.call(null,c,d):c;case 3:return hg.a(a,Nc),0>bb(a)?b.c?b.c(c,d,e):b.call(null,c,d,e):c}throw Error("Invalid arity: "+arguments.length);}}()}(fg.b(a))})}function b(a){return function(b){return c.a(a,b)}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}(),Sg=function Rg(b,c,d,e){if(sc(b))return d.m?d.m():d.call(null);if(N(b)<=c)return Eg.c(e,d.m?d.m():d.call(null),b);if(t){var g=Oc(N(b)),h=qe.c(b,0,g);b=qe.c(b,g,N(b));return Dg(function(b,c,e,g){return function(){var b=g(c),h;h=g(e);return d.a?d.a(b.m?b.m():b.call(null),h.m?h.m():h.call(null)):d.call(null,b.m?b.m():b.call(null),h.m?h.m():h.call(null))}}(g,h,b,function(b,g,h){return function(r){return function(){return function(){return Rg(r,
c,d,e)}}(b,g,h)}}(g,h,b)))}return null};X.prototype.Db=function(a,b,c,d){return Sg(this,b,c,d)};Fg.object=function(a,b,c,d){return Eg.c(d,c.m?c.m():c.call(null),a)};Fg["null"]=function(a,b,c){return c.m?c.m():c.call(null)};function Tg(a,b){var c=R.c(Lf,a,b);return J(c,Ld(function(a){return function(b){return a===b}}(c),b))}
var Ug=function(){function a(a,b){return N(a)<N(b)?x.c(fc,b,a):x.c(fc,a,b)}var b=null,c=function(){function a(c,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,c,d,l)}function b(a,c,d){a=Tg(N,fc.e(d,c,H([a],0)));return x.c(Od,D(a),E(a))}a.i=2;a.f=function(a){var c=D(a);a=G(a);var d=D(a);a=E(a);return b(c,d,a)};a.e=b;return a}(),b=function(b,e,g){switch(arguments.length){case 0:return Ff;case 1:return b;case 2:return a.call(this,b,e);default:return c.e(b,
e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.m=function(){return Ff};b.b=function(a){return a};b.a=a;b.e=c.e;return b}(),Vg=function(){function a(a,b){for(;;)if(N(b)<N(a)){var c=a;a=b;b=c}else return x.c(function(a,b){return function(a,c){return Fc(b,c)?a:pc.a(a,c)}}(a,b),a,a)}var b=null,c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){a=Tg(function(a){return-N(a)},
fc.e(e,d,H([a],0)));return x.c(b,D(a),E(a))}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.b=function(a){return a};b.a=a;b.e=c.e;return b}(),Wg=function(){function a(a,b){return N(a)<N(b)?x.c(function(a,c){return Fc(b,c)?pc.a(a,c):a},a,a):x.c(pc,a,b)}var b=null,
c=function(){function a(b,d,k){var l=null;2<arguments.length&&(l=H(Array.prototype.slice.call(arguments,2),0));return c.call(this,b,d,l)}function c(a,d,e){return x.c(b,a,fc.a(e,d))}a.i=2;a.f=function(a){var b=D(a);a=G(a);var d=D(a);a=E(a);return c(b,d,a)};a.e=c;return a}(),b=function(b,e,g){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:return c.e(b,e,H(arguments,2))}throw Error("Invalid arity: "+arguments.length);};b.i=2;b.f=c.f;b.b=function(a){return a};b.a=a;b.e=
c.e;return b}();n("mori.apply",R);n("mori.count",N);n("mori.empty",gc);n("mori.first",D);n("mori.rest",E);n("mori.seq",C);n("mori.conj",fc);n("mori.cons",J);n("mori.find",function(a,b){return null!=a&&vc(a)&&Fc(a,b)?new X(null,2,5,Y,[b,P.a(a,b)],null):null});n("mori.nth",O);n("mori.last",ec);n("mori.assoc",Q);n("mori.dissoc",jc);n("mori.get_in",Qd);n("mori.update_in",Rd);n("mori.assoc_in",function Xg(b,c,d){var e=O.c(c,0,null);return(c=Qc(c))?Q.c(b,e,Xg(P.a(b,e),c,d)):Q.c(b,e,d)});n("mori.fnil",Ad);
n("mori.disj",pc);n("mori.pop",oc);n("mori.peek",nc);n("mori.hash",A);n("mori.get",P);n("mori.has_key",Fc);n("mori.is_empty",sc);n("mori.reverse",Yc);n("mori.take",Cd);n("mori.drop",Dd);n("mori.partition",Pd);n("mori.partition_by",function Yg(b,c){return new V(null,function(){var d=C(c);if(d){var e=D(d),g=b.b?b.b(e):b.call(null,e),e=J(e,Nf(function(c,d){return function(c){return Pb.a(d,b.b?b.b(c):b.call(null,c))}}(e,g,d,d),G(d)));return J(e,Yg(b,C(Dd(N(e),d))))}return null},null,null)});
n("mori.iterate",function Zg(b,c){return J(c,new V(null,function(){return Zg(b,b.b?b.b(c):b.call(null,c))},null,null))});n("mori.into",Od);n("mori.merge",Cf);n("mori.subvec",qe);n("mori.take_while",Nf);n("mori.drop_while",function(a,b){return new V(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=C(b),g;g=(g=e)?a.b?a.b(D(e)):a.call(null,D(e)):g;if(p(g))g=a,e=E(e),a=g,b=e;else return e}}),null,null)});
n("mori.group_by",function(a,b){return x.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return Q.c(b,e,fc.a(P.c(b,e,le),d))},Ge,b)});n("mori.interpose",function(a,b){return Dd(1,Gd.a(Ed.b(a),b))});n("mori.interleave",Gd);n("mori.concat",md);function Nd(a){return a instanceof Array||wc(a)}n("mori.flatten",function(a){return Kd(function(a){return!Nd(a)},E(Md(a)))});n("mori.keys",Af);n("mori.vals",function(a){return(a=C(a))?new Bf(a,null):null});n("mori.prim_seq",dc);n("mori.map",W);
n("mori.mapcat",Id);n("mori.reduce",x);n("mori.reduce_kv",function(a,b,c){return null!=c?jb(c,a,b):b});n("mori.filter",Kd);n("mori.remove",Ld);n("mori.some",vd);n("mori.every",ud);n("mori.equals",Pb);n("mori.range",Rf);n("mori.repeat",Ed);n("mori.repeatedly",Fd);n("mori.sort",Jc);n("mori.sort_by",Kc);n("mori.into_array",za);n("mori.subseq",Pf);n("mori.rmap",Kg);n("mori.rfilter",Lg);n("mori.rremove",Ng);n("mori.rtake",Pg);n("mori.rtake_while",Og);n("mori.rdrop",Qg);n("mori.rflatten",Mg);
n("mori.list",Zc);n("mori.vector",oe);n("mori.array_map",wf);n("mori.hash_map",vf);n("mori.set",function(a){a=C(a);if(null==a)return Ff;if(a instanceof Ub&&0===a.o){a=a.d;a:{for(var b=0,c=Ab(Ff);;)if(b<a.length)var d=b+1,c=c.qa(null,a[b]),b=d;else{a=c;break a}a=void 0}return a.ya(null)}if(t)for(d=Ab(Ff);;)if(null!=a)b=a.S(null),d=d.qa(null,a.O(null)),a=b;else return d.ya(null);else return null});n("mori.sorted_set",If);n("mori.sorted_set_by",Jf);n("mori.sorted_map",xf);n("mori.sorted_map_by",yf);
n("mori.keyword",cd);n("mori.zipmap",function(a,b){for(var c=Ab(Ge),d=C(a),e=C(b);;)if(d&&e)c=qd.c(c,D(d),D(e)),d=G(d),e=G(e);else return Cb(c)});n("mori.is_list",function(a){return a?a.h&33554432||a.uc?!0:a.h?!1:s(pb,a):s(pb,a)});n("mori.is_seq",Dc);n("mori.is_vector",yc);n("mori.is_map",xc);n("mori.is_set",uc);n("mori.is_keyword",function(a){return a instanceof U});n("mori.is_collection",tc);n("mori.is_sequential",wc);n("mori.is_associative",vc);n("mori.is_counted",Zb);n("mori.is_indexed",$b);
n("mori.is_reduceable",function(a){return a?a.h&524288||a.Lb?!0:a.h?!1:s(gb,a):s(gb,a)});n("mori.is_seqable",function(a){return a?a.h&8388608||a.ac?!0:a.h?!1:s(mb,a):s(mb,a)});n("mori.is_reversible",Xc);n("mori.union",Ug);n("mori.intersection",Vg);n("mori.difference",Wg);n("mori.is_subset",function(a,b){return N(a)<=N(b)&&ud(function(a){return Fc(b,a)},a)});n("mori.is_superset",function(a,b){return N(a)>=N(b)&&ud(function(b){return Fc(a,b)},b)});n("mori.partial",zd);n("mori.comp",yd);
n("mori.pipeline",function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return x.a?x.a(function(a,b){return b.b?b.b(a):b.call(null,a)},a):x.call(null,function(a,b){return b.b?b.b(a):b.call(null,a)},a)}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}());
n("mori.curry",function(){function a(a,d){var e=null;1<arguments.length&&(e=H(Array.prototype.slice.call(arguments,1),0));return b.call(this,a,e)}function b(a,b){return function(e){return R.a(a,J.a?J.a(e,b):J.call(null,e,b))}}a.i=1;a.f=function(a){var d=D(a);a=E(a);return b(d,a)};a.e=b;return a}());
n("mori.juxt",function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return function(){function b(a){var c=null;0<arguments.length&&(c=H(Array.prototype.slice.call(arguments,0),0));return e.call(this,c)}function e(b){return za.b?za.b(W.a?W.a(function(a){return R.a(a,b)},a):W.call(null,function(a){return R.a(a,b)},a)):za.call(null,W.a?W.a(function(a){return R.a(a,b)},a):W.call(null,function(a){return R.a(a,b)},a))}
b.i=0;b.f=function(a){a=C(a);return e(a)};b.e=e;return b}()}a.i=0;a.f=function(a){a=C(a);return b(a)};a.e=b;return a}());
n("mori.knit",function(){function a(a){var d=null;0<arguments.length&&(d=H(Array.prototype.slice.call(arguments,0),0));return b.call(this,d)}function b(a){return function(b){return za.b?za.b(W.c?W.c(function(a,b){return a.b?a.b(b):a.call(null,b)},a,b):W.call(null,function(a,b){return a.b?a.b(b):a.call(null,b)},a,b)):za.call(null,W.c?W.c(function(a,b){return a.b?a.b(b):a.call(null,b)},a,b):W.call(null,function(a,b){return a.b?a.b(b):a.call(null,b)},a,b))}}a.i=0;a.f=function(a){a=C(a);return b(a)};
a.e=b;return a}());n("mori.sum",function(a,b){return a+b});n("mori.inc",function(a){return a+1});n("mori.dec",function(a){return a-1});n("mori.is_even",function(a){return 0===(a%2+2)%2});n("mori.is_odd",function(a){return 1===(a%2+2)%2});n("mori.each",function(a,b){for(var c=C(a),d=null,e=0,g=0;;)if(g<e){var h=d.P(null,g);b.b?b.b(h):b.call(null,h);g+=1}else if(c=C(c))d=c,zc(d)?(c=Jb(d),e=Kb(d),d=c,h=N(c),c=e,e=h):(h=D(d),b.b?b.b(h):b.call(null,h),c=G(d),d=null,e=0),g=0;else return null});
n("mori.identity",wd);n("mori.constantly",function(a){return function(){function b(b){0<arguments.length&&H(Array.prototype.slice.call(arguments,0),0);return a}b.i=0;b.f=function(b){C(b);return a};b.e=function(){return a};return b}()});n("mori.clj_to_js",lg);
n("mori.js_to_clj",function(){function a(a,b){return qg.e(a,H([pg,b],0))}function b(a){return qg.b(a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.a=a;return c}());
n("mori.proxy",function(a){if("undefined"!==typeof Proxy)return Proxy.create(function(){return{has:function(b){return Fc(a,b)},hasOwn:function(b){return Fc(a,b)},get:function(b,c){var d=P.c?P.c(a,c,zg):P.call(null,a,c,zg);return ad(d,zg)?Zb(a)&&"length"===c?N.b?N.b(a):N.call(null,a):null:t?d:null},set:function(){return null},enumerate:function(){return za.b?za.b(Af.b?Af.b(a):Af.call(null,a)):za.call(null,Af.b?Af.b(a):Af.call(null,a))},keys:function(){return xc(a)?za.b?za.b(Af.b?Af.b(a):Af.call(null,
a)):za.call(null,Af.b?Af.b(a):Af.call(null,a)):yc(a)?za.b?za.b(Rf.b?Rf.b(N.b?N.b(a):N.call(null,a)):Rf.call(null,N.b?N.b(a):N.call(null,a))):za.call(null,Rf.b?Rf.b(N.b?N.b(a):N.call(null,a)):Rf.call(null,N.b?N.b(a):N.call(null,a))):null}}}());throw Error("ES6 Proxy not supported!");});V.prototype.inspect=function(){return this.toString()};Ub.prototype.inspect=function(){return this.toString()};bc.prototype.inspect=function(){return this.toString()};df.prototype.inspect=function(){return this.toString()};
Ye.prototype.inspect=function(){return this.toString()};Ze.prototype.inspect=function(){return this.toString()};Vc.prototype.inspect=function(){return this.toString()};$c.prototype.inspect=function(){return this.toString()};Wc.prototype.inspect=function(){return this.toString()};X.prototype.inspect=function(){return this.toString()};hd.prototype.inspect=function(){return this.toString()};pe.prototype.inspect=function(){return this.toString()};re.prototype.inspect=function(){return this.toString()};
$.prototype.inspect=function(){return this.toString()};Z.prototype.inspect=function(){return this.toString()};ma.prototype.inspect=function(){return this.toString()};$e.prototype.inspect=function(){return this.toString()};sf.prototype.inspect=function(){return this.toString()};Df.prototype.inspect=function(){return this.toString()};Gf.prototype.inspect=function(){return this.toString()};Qf.prototype.inspect=function(){return this.toString()};function $g(a,b,c,d){return M(new X(null,2,5,Y,[d,null],null),new ma(null,3,[yg,c,Ag,b,ug,a],null))}function ah(a){return a.b?a.b(0):a.call(null,0)}function bh(a){return ug.b(mc(a)).call(null,ah(a))}function ch(a){if(p(bh(a)))return Ag.b(mc(a)).call(null,ah(a));throw"called children on a leaf node";}function dh(a,b,c){return yg.b(mc(a)).call(null,b,c)}
function eh(a){if(p(bh(a))){var b=O.c(a,0,null),c=O.c(a,1,null),d=ch(a),e=O.c(d,0,null),g=Qc(d);return p(d)?M(new X(null,2,5,Y,[e,new ma(null,4,[xg,le,sg,p(c)?fc.a(sg.b(c),b):new X(null,1,5,Y,[b],null),tg,c,rg,g],null)],null),mc(a)):null}return null}
function fh(a){var b=O.c(a,0,null),c=O.c(a,1,null),d=Dc(c)?R.a(vf,c):c,c=P.a(d,xg),e=P.a(d,tg),g=P.a(d,sg),h=P.a(d,rg),d=P.a(d,vg);return p(g)?(g=nc(g),M(p(d)?new X(null,2,5,Y,[dh(a,g,md.a(c,J(b,h))),p(e)?Q.c(e,vg,!0):e],null):new X(null,2,5,Y,[g,e],null),mc(a))):null}function gh(a){var b=O.c(a,0,null),c=O.c(a,1,null),c=Dc(c)?R.a(vf,c):c,d=P.a(c,xg),e=P.a(c,rg),g=O.c(e,0,null),h=Qc(e);return p(p(c)?e:c)?M(new X(null,2,5,Y,[g,Q.e(c,xg,fc.a(d,b),H([rg,h],0))],null),mc(a)):null}
function hh(a){var b=O.c(a,0,null),c=O.c(a,1,null),c=Dc(c)?R.a(vf,c):c,d=P.a(c,xg),e=P.a(c,rg);return p(p(c)?e:c)?M(new X(null,2,5,Y,[ec(e),Q.e(c,xg,R.n(fc,d,b,Kf(e)),H([rg,null],0))],null),mc(a)):a}function ih(a){var b=O.c(a,0,null),c=O.c(a,1,null),c=Dc(c)?R.a(vf,c):c,d=P.a(c,xg),e=P.a(c,rg);return p(p(c)?C(d):c)?M(new X(null,2,5,Y,[nc(d),Q.e(c,xg,oc(d),H([rg,J(b,e)],0))],null),mc(a)):null}
function jh(a,b){O.c(a,0,null);var c=O.c(a,1,null);return M(new X(null,2,5,Y,[b,Q.c(c,vg,!0)],null),mc(a))}var kh=function(){function a(a,d,e){var g=null;2<arguments.length&&(g=H(Array.prototype.slice.call(arguments,2),0));return b.call(this,a,d,g)}function b(a,b,e){return jh(a,R.c(b,ah(a),e))}a.i=2;a.f=function(a){var d=D(a);a=G(a);var e=D(a);a=E(a);return b(d,e,a)};a.e=b;return a}();n("mori.zip.zipper",$g);n("mori.zip.seq_zip",function(a){return $g(Dc,wd,function(a,c){return M(c,mc(a))},a)});n("mori.zip.vector_zip",function(a){return $g(yc,C,function(a,c){return M(ne(c),mc(a))},a)});n("mori.zip.node",ah);n("mori.zip.is_branch",{}.nc);n("mori.zip.children",ch);n("mori.zip.make_node",dh);n("mori.zip.path",function(a){return sg.b(a.b?a.b(1):a.call(null,1))});n("mori.zip.lefts",function(a){return C(xg.b(a.b?a.b(1):a.call(null,1)))});
n("mori.zip.rights",function(a){return rg.b(a.b?a.b(1):a.call(null,1))});n("mori.zip.down",eh);n("mori.zip.up",fh);n("mori.zip.root",function(a){for(;;){if(Pb.a(wg,a.b?a.b(1):a.call(null,1)))return ah(a);var b=fh(a);if(p(b))a=b;else return ah(a)}});n("mori.zip.right",gh);n("mori.zip.rightmost",hh);n("mori.zip.left",ih);
n("mori.zip.leftmost",function(a){var b=O.c(a,0,null),c=O.c(a,1,null),c=Dc(c)?R.a(vf,c):c,d=P.a(c,xg),e=P.a(c,rg);return p(p(c)?C(d):c)?M(new X(null,2,5,Y,[D(d),Q.e(c,xg,le,H([rg,md.e(E(d),new X(null,1,5,Y,[b],null),H([e],0))],0))],null),mc(a)):a});n("mori.zip.insert_left",function(a,b){var c=O.c(a,0,null),d=O.c(a,1,null),d=Dc(d)?R.a(vf,d):d,e=P.a(d,xg);if(null==d)throw"Insert at top";return M(new X(null,2,5,Y,[c,Q.e(d,xg,fc.a(e,b),H([vg,!0],0))],null),mc(a))});
n("mori.zip.insert_right",function(a,b){var c=O.c(a,0,null),d=O.c(a,1,null),d=Dc(d)?R.a(vf,d):d,e=P.a(d,rg);if(null==d)throw"Insert at top";return M(new X(null,2,5,Y,[c,Q.e(d,rg,J(b,e),H([vg,!0],0))],null),mc(a))});n("mori.zip.replace",jh);n("mori.zip.edit",kh);n("mori.zip.insert_child",function(a,b){return jh(a,dh(a,ah(a),J(b,ch(a))))});n("mori.zip.append_child",function(a,b){return jh(a,dh(a,ah(a),md.a(ch(a),new X(null,1,5,Y,[b],null))))});
n("mori.zip.next",function(a){if(Pb.a(wg,a.b?a.b(1):a.call(null,1)))return a;var b;b=bh(a);b=p(b)?eh(a):b;if(p(b))return b;b=gh(a);if(p(b))return b;for(;;)if(p(fh(a))){b=gh(fh(a));if(p(b))return b;a=fh(a)}else return new X(null,2,5,Y,[ah(a),wg],null)});n("mori.zip.prev",function(a){var b=ih(a);if(p(b))for(a=b;;)if(b=bh(a),b=p(b)?eh(a):b,p(b))a=hh(b);else return a;else return fh(a)});n("mori.zip.is_end",function(a){return Pb.a(wg,a.b?a.b(1):a.call(null,1))});
n("mori.zip.remove",function(a){O.c(a,0,null);var b=O.c(a,1,null),b=Dc(b)?R.a(vf,b):b,c=P.a(b,xg),d=P.a(b,tg),e=P.a(b,sg),g=P.a(b,rg);if(null==b)throw"Remove at top";if(0<N(c))for(a=M(new X(null,2,5,Y,[nc(c),Q.e(b,xg,oc(c),H([vg,!0],0))],null),mc(a));;)if(b=bh(a),b=p(b)?eh(a):b,p(b))a=hh(b);else return a;else return M(new X(null,2,5,Y,[dh(a,nc(e),g),p(d)?Q.c(d,vg,!0):d],null),mc(a))});n("mori.mutable.thaw",function(a){return Ab(a)});n("mori.mutable.freeze",od);n("mori.mutable.conj1",function(a,b){return a.qa(null,b)});n("mori.mutable.conj",pd);n("mori.mutable.assoc",qd);n("mori.mutable.dissoc",rd);n("mori.mutable.pop",function(a){return Gb(a)});n("mori.mutable.disj",sd);;return this.mori;}.call({});});

},{}]},{},[6])