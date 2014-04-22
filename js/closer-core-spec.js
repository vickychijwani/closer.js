!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.closerCoreSpec=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function() {
  var ArgTypeError, ArityError, assert, firstFailure, mori, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  ArityError = (function(_super) {
    __extends(ArityError, _super);

    function ArityError() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      Error.captureStackTrace(this, this.constructor);
      this.name = 'ArityError';
      this.message = args.length === 3 ? "Expected " + args[0] + ".." + args[1] + " args, got " + args[2] : args[0];
    }

    return ArityError;

  })(Error);

  ArgTypeError = (function(_super) {
    __extends(ArgTypeError, _super);

    function ArgTypeError(message) {
      Error.captureStackTrace(this, this.constructor);
      this.name = 'ArgTypeError';
      this.message = message;
    }

    return ArgTypeError;

  })(Error);

  firstFailure = function(args, testFn) {
    return _.find(_.flatten(args), function(arg) {
      return !testFn(arg);
    });
  };

  assert = {
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
    seqable: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_seqable(arg) || _.isString(arg);
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " is not seqable");
      }
    },
    sequential: function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return mori.is_sequential(arg) || _.isString(arg);
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
    "function": function() {
      var args, unexpectedArg;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      unexpectedArg = firstFailure(args, function(arg) {
        return typeof arg === 'function';
      });
      if (unexpectedArg) {
        throw new ArgTypeError("" + unexpectedArg + " is not a function");
      }
    },
    arity: function() {
      var args, expected_max, expected_min, _ref;
      expected_min = arguments[0], expected_max = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      args = _.flatten(args, true);
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

  module.exports = assert;

  _ = _dereq_('lodash-node');

  mori = _dereq_('mori');

}).call(this);

},{"lodash-node":113,"mori":215}],2:[function(_dereq_,module,exports){
(function() {
  var assert, core, m, _,
    __slice = [].slice;

  core = {
    '+': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.numbers(nums);
      return _.reduce(nums, (function(sum, num) {
        return sum + num;
      }), 0);
    },
    '-': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(0);
      }
      return _.reduce(nums.slice(1), (function(diff, num) {
        return diff - num;
      }), nums[0]);
    },
    '*': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.numbers(nums);
      return _.reduce(nums, (function(prod, num) {
        return prod * num;
      }), 1);
    },
    '/': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(1);
      }
      return _.reduce(nums.slice(1), (function(quo, num) {
        return quo / num;
      }), nums[0]);
    },
    'inc': function(num) {
      assert.arity(1, 1, arguments);
      assert.numbers(num);
      return ++num;
    },
    'dec': function(num) {
      assert.arity(1, 1, arguments);
      assert.numbers(num);
      return --num;
    },
    'max': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      return _.max(nums);
    },
    'min': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      return _.min(nums);
    },
    'quot': function(num, div) {
      var sign;
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      sign = num > 0 && div > 0 || num < 0 && div < 0 ? 1 : -1;
      return sign * Math.floor(Math.abs(num / div));
    },
    'rem': function(num, div) {
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      return num % div;
    },
    'mod': function(num, div) {
      var rem;
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      rem = num % div;
      if (rem === 0 || (num > 0 && div > 0 || num < 0 && div < 0)) {
        return rem;
      } else {
        return rem + div;
      }
    },
    '=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      args = _.uniq(args);
      if (args.length === 1) {
        return true;
      }
      return m.equals.apply(this, args);
    },
    'not=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      return core.not(core['='].apply(this, args));
    },
    '==': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return true;
      }
      assert.numbers(args);
      return core['='].apply(this, args);
    },
    '<': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return true;
      }
      assert.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val < args[idx + 1]);
      }), true);
    },
    '>': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return true;
      }
      assert.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val > args[idx + 1]);
      }), true);
    },
    '<=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return true;
      }
      assert.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val <= args[idx + 1]);
      }), true);
    },
    '>=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return true;
      }
      assert.numbers(args);
      return _.reduce(args, (function(result, val, idx) {
        return result && (idx + 1 === args.length || val >= args[idx + 1]);
      }), true);
    },
    'identical?': function(x, y) {
      assert.arity(2, 2, arguments);
      return x === y;
    },
    'true?': function(arg) {
      assert.arity(1, 1, arguments);
      return arg === true;
    },
    'false?': function(arg) {
      assert.arity(1, 1, arguments);
      return arg === false;
    },
    'nil?': function(arg) {
      assert.arity(1, 1, arguments);
      return arg === null;
    },
    'some?': function(arg) {
      assert.arity(1, 1, arguments);
      return arg !== null;
    },
    'number?': function(x) {
      assert.arity(1, 1, arguments);
      return typeof x === 'number';
    },
    'integer?': function(x) {
      assert.arity(1, 1, arguments);
      return typeof x === 'number' && x % 1 === 0;
    },
    'float?': function(x) {
      assert.arity(1, 1, arguments);
      return typeof x === 'number' && x % 1 !== 0;
    },
    'zero?': function(x) {
      assert.arity(1, 1, arguments);
      return core['=='](x, 0);
    },
    'pos?': function(x) {
      assert.arity(1, 1, arguments);
      return core['>'](x, 0);
    },
    'neg?': function(x) {
      assert.arity(1, 1, arguments);
      return core['<'](x, 0);
    },
    'even?': function(x) {
      assert.arity(1, 1, arguments);
      assert.integers(x);
      return core['zero?'](core['mod'](x, 2));
    },
    'odd?': function(x) {
      return core['not'](core['even?'](x));
    },
    'contains?': function(coll, key) {
      assert.arity(2, 2, arguments);
      assert.associativeOrSet(coll);
      return m.has_key(coll, key);
    },
    'empty?': function(coll) {
      assert.arity(1, 1, arguments);
      return m.is_empty(coll);
    },
    'vector?': function(coll) {
      assert.arity(1, 1, arguments);
      return m.is_vector(coll);
    },
    'map?': function(coll) {
      assert.arity(1, 1, arguments);
      return m.is_map(coll);
    },
    'boolean': function(arg) {
      assert.arity(1, 1, arguments);
      return arg !== false && arg !== null;
    },
    'not': function(arg) {
      assert.arity(1, 1, arguments);
      return !core.boolean(arg);
    },
    'str': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      return _.reduce(args, (function(str, arg) {
        return str += core['nil?'](arg) ? '' : arg.toString();
      }), '');
    },
    'count': function(coll) {
      assert.arity(1, 1, arguments);
      assert.seqable(coll);
      return m.count(coll);
    },
    'empty': function(coll) {
      var error;
      assert.arity(1, 1, arguments);
      try {
        return m.empty(coll);
      } catch (_error) {
        error = _error;
        return null;
      }
    },
    'not-empty': function(coll) {
      assert.arity(1, 1, arguments);
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
      assert.arity(2, 3, arguments);
      return m.get(coll, key, notFound);
    },
    'seq': function(coll) {
      assert.arity(1, 1, arguments);
      assert.seqable(coll);
      return m.seq(coll);
    },
    'first': function(coll) {
      assert.arity(1, 1, arguments);
      return m.first(coll);
    },
    'rest': function(coll) {
      assert.arity(1, 1, arguments);
      return m.rest(coll);
    },
    'next': function(coll) {
      var rest;
      assert.arity(1, 1, arguments);
      rest = core.rest(coll);
      if (core['empty?'](rest)) {
        return null;
      } else {
        return rest;
      }
    },
    'last': function(coll) {
      assert.arity(1, 1, arguments);
      return m.last(coll);
    },
    'nth': function(coll, index, notFound) {
      assert.arity(2, 3, arguments);
      assert.sequential(coll);
      assert.numbers(index);
      if (coll === null) {
        return (notFound !== void 0 ? notFound : null);
      }
      if (_.isString(coll) && index >= coll.length && notFound === void 0) {
        throw new Error("index out of bounds");
      }
      if (notFound !== void 0) {
        return m.nth(coll, index, notFound);
      } else {
        return m.nth(coll, index);
      }
    },
    'peek': function(coll) {
      assert.arity(1, 1, arguments);
      assert.stack(coll);
      return m.peek(coll);
    },
    'pop': function(coll) {
      assert.arity(1, 1, arguments);
      assert.stack(coll);
      return m.pop(coll);
    },
    'cons': function(x, seq) {
      assert.arity(2, 2, arguments);
      return m.cons(x, seq);
    },
    'conj': function() {
      var coll, xs;
      coll = arguments[0], xs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assert.arity(2, Infinity, arguments);
      if (core['map?'](coll) && _.any(xs, function(x) {
        return core['vector?'](x) && core.count(x) !== 2;
      })) {
        throw new TypeError('vector args to conjoin to a map must be pairs');
      }
      return m.conj.apply(this, _.flatten([coll, xs]));
    },
    'into': function(to, from) {
      assert.arity(2, 2, arguments);
      if (to === null && from === null) {
        return null;
      }
      return m.reduce(core.conj, to, from);
    },
    'concat': function() {
      var seqs;
      seqs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.seqable(seqs);
      return m.concat.apply(this, seqs);
    },
    'flatten': function(coll) {
      assert.arity(1, 1, arguments);
      return m.flatten(coll);
    },
    'reverse': function(coll) {
      assert.arity(1, 1, arguments);
      assert.seqable(coll);
      return m.reverse(coll);
    },
    'assoc': function() {
      var kvs, map;
      map = arguments[0], kvs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assert.arity_custom(arguments, function(args) {
        if (args.length < 3 || args.length % 2 === 0) {
          return "Expected odd number of args (at least 3), got " + args.length;
        }
      });
      return m.assoc.apply(this, _.flatten([map, kvs]));
    },
    'dissoc': function() {
      var keys, map;
      map = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assert.arity(1, Infinity, arguments);
      if (keys.length === 0) {
        return map;
      }
      return m.dissoc.apply(this, _.flatten([map, keys]));
    },
    'find': function(map, key) {
      assert.arity(2, 2, arguments);
      assert.associative(map);
      return m.find(map, key);
    },
    'range': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, 3, arguments);
      assert.numbers(args);
      return m.range.apply(this, args);
    },
    'identity': function(x) {
      assert.arity(1, 1, arguments);
      return x;
    },
    'map': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assert.arity(2, Infinity, arguments);
      assert["function"](f);
      return m.map.apply(this, arguments);
    },
    'mapcat': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assert.arity(2, Infinity, arguments);
      assert["function"](f);
      return m.mapcat.apply(this, arguments);
    },
    'filter': function(pred, coll) {
      assert.arity(2, 2, arguments);
      assert["function"](pred);
      return m.filter(pred, coll);
    },
    'remove': function(pred, coll) {
      assert.arity(2, 2, arguments);
      assert["function"](pred);
      return m.remove(pred, coll);
    },
    'reduce': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(2, 3, arguments);
      assert["function"](args[0]);
      return m.reduce.apply(this, args);
    },
    'reduce-kv': function(f, init, coll) {
      assert.arity(3, 3, arguments);
      assert["function"](f);
      return m.reduce_kv(f, init, coll);
    },
    'take': function(n, coll) {
      assert.arity(2, 2, arguments);
      assert.numbers(n);
      assert.seqable(coll);
      return m.take(n, coll);
    },
    'drop': function(n, coll) {
      assert.arity(2, 2, arguments);
      assert.numbers(n);
      assert.seqable(coll);
      return m.drop(n, coll);
    }
  };

  module.exports = core;

  _ = _dereq_('lodash-node');

  m = _dereq_('mori');

  assert = _dereq_('./assert');

}).call(this);

},{"./assert":1,"lodash-node":113,"mori":215}],3:[function(_dereq_,module,exports){
(function() {
  var Closer, Parser, builder, closer, con, nodes, oldParse, parser;

  parser = _dereq_('./parser').parser;

  nodes = _dereq_('./nodes');

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
    return start;
  };

  parser.yy.loc = function(loc) {
    var newLoc;
    if (!this.locations) {
      return null;
    }
    if ("length" in loc) {
      loc = this.locComb(loc[0], loc[1]);
    }
    newLoc = {
      start: {
        line: this.startLine + loc.first_line - 1,
        column: loc.first_column
      },
      end: {
        line: this.startLine + loc.last_line - 1,
        column: loc.last_column
      }
    };
    return newLoc;
  };

  parser.yy.escapeString = function(s) {
    return s.replace(/\\\n/, '').replace(/\\([^xubfnvrt0\\])/g, '$1');
  };

  oldParse = parser.parse;

  parser.parse = function(source, options) {
    this.yy.inRegex = false;
    this.yy.raw = [];
    this.yy.comments = [];
    this.yy.options = options || {};
    return oldParse.call(this, source);
  };

  Parser = (function() {
    function Parser(options) {
      this.yy.source = options.source || null;
      this.yy.startLine = options.line || 1;
      this.yy.locations = options.locations;
    }

    return Parser;

  })();

  Parser.prototype = parser;

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options || {});
    }

    Closer.prototype.parse = function(source, options) {
      return this.parser.parse(source, options);
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
      return new Closer(options).parse(src, options);
    },
    node: parser.yy.Node
  };

  module.exports = closer;

}).call(this);

},{"./nodes":4,"./parser":5}],4:[function(_dereq_,module,exports){
(function() {
  exports.defineNodes = function(builder) {
    var convertExprToPattern, def, defaultIni, funIni;
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
        delete obj.loc;
        return obj;
      };
    };
    convertExprToPattern = function(expr) {
      if (expr.type === 'ObjectExpression') {
        expr.type = 'ObjectPattern';
      }
      if (expr.type === 'ArrayExpression') {
        return expr.type = 'ArrayPattern';
      }
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
    def('Property', function(key, value, kind, loc) {
      this.key = key;
      this.value = value;
      this.kind = kind;
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
    def('LabeledStatement', function(label, body, loc) {
      this.label = label;
      this.body = body;
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
    def('SwitchStatement', function(discriminant, cases, lexical, loc) {
      this.discriminant = discriminant;
      if (cases.length) {
        this.cases = cases;
      }
      return this.loc = loc;
    });
    def('SwitchCase', function(test, consequent, loc) {
      this.test = test;
      this.consequent = consequent;
      return this.loc = loc;
    });
    def('WithStatement', function(object, body, loc) {
      this.object = object;
      this.body = body;
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
      this.loc = loc;
      return convertExprToPattern(left);
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
    def('DoWhileStatement', function(body, test, loc) {
      this.body = body;
      this.test = test;
      return this.loc = loc;
    });
    def('ForStatement', function(init, test, update, body, loc) {
      this.init = init;
      this.test = test;
      this.update = update;
      this.body = body;
      this.loc = loc;
      if (init) {
        return convertExprToPattern(init);
      }
    });
    def('ForInStatement', function(left, right, body, each, loc) {
      this.left = left;
      this.right = right;
      this.body = body;
      this.each = !!each;
      this.loc = loc;
      return convertExprToPattern(left);
    });
    def('IfStatement', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    def('ObjectPattern', function(properties, loc) {
      this.properties = properties;
      return this.loc = loc;
    });
    def('ArrayPattern', function(elements, loc) {
      this.elements = elements;
      return this.loc = loc;
    });
    return def;
  };

}).call(this);

},{}],5:[function(_dereq_,module,exports){
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
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"IdentifierList":5,"Atom":6,"INTEGER":7,"FLOAT":8,"STRING":9,"true":10,"false":11,"nil":12,"COLON":13,"CollectionLiteral":14,"[":15,"items":16,"]":17,"QUOTE":18,"(":19,")":20,"{":21,"SExprPairs[items]":22,"}":23,"SHARP":24,"RestArgs":25,"&":26,"Fn":27,"List":28,"FnParamsAndBody":29,"BlockStatementWithReturn":30,"FnDefinition":31,"FN":32,"DEFN":33,"ConditionalExpr":34,"IF":35,"SExpr[test]":36,"SExprStmt[consequent]":37,"alternate":38,"WHEN":39,"BlockStatement[consequent]":40,"VarDeclaration":41,"DEF":42,"init":43,"LetBinding":44,"SExpr":45,"LetBindings":46,"LetForm":47,"LET":48,"DoForm":49,"args":50,"DO":51,"SExprStmt":52,"SExprPairs":53,"SExprs":54,"NonEmptyDoForm":55,"BlockStatement":56,"Program":57,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",7:"INTEGER",8:"FLOAT",9:"STRING",10:"true",11:"false",12:"nil",13:"COLON",15:"[",17:"]",18:"QUOTE",19:"(",20:")",21:"{",22:"SExprPairs[items]",23:"}",24:"SHARP",26:"&",32:"FN",33:"DEFN",35:"IF",36:"SExpr[test]",37:"SExprStmt[consequent]",39:"WHEN",40:"BlockStatement[consequent]",42:"DEF",48:"LET",51:"DO"},
productions_: [0,[3,1],[5,0],[5,2],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,1],[14,3],[14,4],[14,3],[14,4],[25,2],[25,0],[27,1],[27,3],[29,5],[31,2],[31,3],[34,4],[34,3],[41,3],[44,2],[46,2],[46,0],[47,5],[28,0],[28,1],[28,1],[28,1],[28,1],[28,2],[28,2],[45,1],[45,1],[45,3],[52,1],[53,0],[53,3],[54,1],[54,2],[55,1],[49,1],[49,0],[56,1],[30,1],[57,1],[57,0],[16,0],[16,1],[38,0],[38,1],[43,0],[43,1],[50,0],[50,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: this.$ = yy.Node('Identifier', String($$[$0]), yy.loc(_$[$0])); 
break;
case 2: this.$ = []; 
break;
case 3:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
  
break;
case 4: this.$ = parseNumLiteral('Integer', $$[$0], _$[$0], yy, yytext); 
break;
case 5: this.$ = parseNumLiteral('Float', $$[$0], _$[$0], yy, yytext); 
break;
case 6: this.$ = parseLiteral('String', parseString($$[$0]), _$[$0], yy.raw[yy.raw.length-1], yy); 
break;
case 7: this.$ = parseLiteral('Boolean', true, _$[$0], yytext, yy); 
break;
case 8: this.$ = parseLiteral('Boolean', false, _$[$0], yytext, yy); 
break;
case 9: this.$ = parseLiteral('Nil', null, _$[$0], yytext, yy); 
break;
case 10: this.$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(_$[$0])), [yy.Node('Literal', String($$[$0]), yy.loc(_$[$0]))], yy.loc(_$[$0])); 
break;
case 12: this.$ = parseCollectionLiteral('vector', getValueIfUndefined($$[$0-1], []), _$[$0-1], yy); 
break;
case 13: this.$ = parseCollectionLiteral('list', getValueIfUndefined($$[$0-1], []), _$[$0-1], yy); 
break;
case 14: this.$ = parseCollectionLiteral('hash_map', getValueIfUndefined($$[$0-1], []), _$[$0-1], yy); 
break;
case 15: this.$ = parseCollectionLiteral('set', getValueIfUndefined($$[$0-1], []), _$[$0-1], yy); 
break;
case 16: this.$ = $$[$0]; 
break;
case 17: this.$ = null; 
break;
case 18: this.$ = yy.Node('Identifier', String($$[$0]), yy.loc(_$[$0])); 
break;
case 19: this.$ = $$[$0-1]; 
break;
case 20:
        this.$ = yy.Node('FunctionExpression', null, $$[$0-3], $$[$0-2],
            $$[$0], false, false, yy.loc(_$[$0]));
    
break;
case 21: this.$ = $$[$0]; 
break;
case 22:
        $$[$0].type = 'FunctionDeclaration';
        $$[$0].id = $$[$0-1];
        this.$ = $$[$0];
    
break;
case 23:
        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null));
    
break;
case 24:
        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null);
    
break;
case 25:
        var decl = yy.Node('VariableDeclarator', $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-2]));
        this.$ = yy.Node('VariableDeclaration', 'var', [decl], yy.loc(_$[$0-2]));
    
break;
case 26:
        this.$ = yy.Node('VariableDeclarator', $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-1]));
    
break;
case 27:
        this.$ = $$[$0-1];
        // TODO let bindings are supposed to be local!
        var binding = yy.Node('VariableDeclaration', 'var', [$$[$0]], yy.loc(_$[$0]));
        $$[$0-1].push(binding);
    
break;
case 28: this.$ = []; 
break;
case 29:
        var body = [].concat($$[$0-2]).concat($$[$0]);
        this.$ = yy.Node('BlockStatement', body, yy.loc(_$[$0-4]));
    
break;
case 30: this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 35: this.$ = yy.Node('CallExpression', $$[$0-1], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-1])); 
break;
case 36: this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0-1])); 
break;
case 37: this.$ = $$[$0]; 
break;
case 38: this.$ = $$[$0]; 
break;
case 39: this.$ = $$[$0-1]; 
break;
case 40:
        if (expressionTypes.indexOf($$[$0].type) !== -1) {
            this.$ = yy.Node('ExpressionStatement', $$[$0], $$[$0].loc);
        } else {
            this.$ = $$[$0];
        }
    
break;
case 41: this.$ = []; 
break;
case 42: this.$ = $$[$0-2]; $$[$0-2].push($$[$0-1], $$[$0]); 
break;
case 43: this.$ = [$$[$0]]; 
break;
case 44:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 45:
        for (var i = 0; i < $$[$0].length; ++i) {
            var SExpr = $$[$0][i];
            if (expressionTypes.indexOf(SExpr.type) !== -1) {
                $$[$0][i] = yy.Node('ExpressionStatement', SExpr, SExpr.loc);
            }
        }
    
break;
case 47:
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, _$[$0], yytext, yy);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 48:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 49:
        var lastSExpr = $$[$0].body[$$[$0].body.length-1];
        lastSExpr.type = 'ReturnStatement';
        lastSExpr.argument = lastSExpr.expression;
        delete lastSExpr.expression;
        this.$ = $$[$0];
    
break;
case 50:
        var prog = yy.Node('Program', $$[$0], yy.loc(_$[$0]));
//        if (yy.tokens.length) prog.tokens = yy.tokens;
        if (yy.comments.length) prog.comments = yy.comments;
//        if (prog.loc) prog.range = rangeBlock($$[$0]);
        return prog;
    
break;
case 51:
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
        });
    //        prog.tokens = yy.tokens;
    //        prog.range = [0, 0];
        return prog;
    
break;
}
},
table: [{1:[2,51],3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:4,54:3,55:2,57:1},{1:[3]},{1:[2,50]},{1:[2,45],3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,45],21:[1,18],24:[1,19],45:21},{1:[2,43],4:[2,43],7:[2,43],8:[2,43],9:[2,43],10:[2,43],11:[2,43],12:[2,43],13:[2,43],15:[2,43],17:[2,43],18:[2,43],19:[2,43],20:[2,43],21:[2,43],23:[2,43],24:[2,43]},{1:[2,37],4:[2,37],7:[2,37],8:[2,37],9:[2,37],10:[2,37],11:[2,37],12:[2,37],13:[2,37],15:[2,37],17:[2,37],18:[2,37],19:[2,37],20:[2,37],21:[2,37],23:[2,37],24:[2,37]},{1:[2,38],4:[2,38],7:[2,38],8:[2,38],9:[2,38],10:[2,38],11:[2,38],12:[2,38],13:[2,38],15:[2,38],17:[2,38],18:[2,38],19:[2,38],20:[2,38],21:[2,38],23:[2,38],24:[2,38]},{4:[1,35],19:[1,36],20:[2,30],27:27,28:22,31:23,32:[1,29],33:[1,30],34:24,35:[1,31],39:[1,32],41:25,42:[1,33],47:26,48:[1,34],51:[1,28]},{1:[2,4],4:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],11:[2,4],12:[2,4],13:[2,4],15:[2,4],17:[2,4],18:[2,4],19:[2,4],20:[2,4],21:[2,4],23:[2,4],24:[2,4]},{1:[2,5],4:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],15:[2,5],17:[2,5],18:[2,5],19:[2,5],20:[2,5],21:[2,5],23:[2,5],24:[2,5]},{1:[2,6],4:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],15:[2,6],17:[2,6],18:[2,6],19:[2,6],20:[2,6],21:[2,6],23:[2,6],24:[2,6]},{1:[2,7],4:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],15:[2,7],17:[2,7],18:[2,7],19:[2,7],20:[2,7],21:[2,7],23:[2,7],24:[2,7]},{1:[2,8],4:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],15:[2,8],17:[2,8],18:[2,8],19:[2,8],20:[2,8],21:[2,8],23:[2,8],24:[2,8]},{1:[2,9],4:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],15:[2,9],17:[2,9],18:[2,9],19:[2,9],20:[2,9],21:[2,9],23:[2,9],24:[2,9]},{4:[1,37]},{1:[2,11],4:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],15:[2,11],17:[2,11],18:[2,11],19:[2,11],20:[2,11],21:[2,11],23:[2,11],24:[2,11]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],16:38,17:[2,52],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:4,54:39},{19:[1,40]},{4:[2,41],7:[2,41],8:[2,41],9:[2,41],10:[2,41],11:[2,41],12:[2,41],13:[2,41],15:[2,41],18:[2,41],19:[2,41],21:[2,41],23:[2,41],24:[2,41],53:41},{21:[1,42]},{1:[2,1],4:[2,1],7:[2,1],8:[2,1],9:[2,1],10:[2,1],11:[2,1],12:[2,1],13:[2,1],15:[2,1],17:[2,1],18:[2,1],19:[2,1],20:[2,1],21:[2,1],23:[2,1],24:[2,1],26:[2,1]},{1:[2,44],4:[2,44],7:[2,44],8:[2,44],9:[2,44],10:[2,44],11:[2,44],12:[2,44],13:[2,44],15:[2,44],17:[2,44],18:[2,44],19:[2,44],20:[2,44],21:[2,44],23:[2,44],24:[2,44]},{20:[1,43]},{20:[2,31]},{20:[2,32]},{20:[2,33]},{20:[2,34]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,58],21:[1,18],24:[1,19],45:4,50:44,54:45},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,47],21:[1,18],24:[1,19],45:4,49:46,54:3,55:47},{15:[1,49],29:48},{3:50,4:[1,20]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:51},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:52},{3:53,4:[1,20]},{15:[1,54]},{4:[2,18],7:[2,18],8:[2,18],9:[2,18],10:[2,18],11:[2,18],12:[2,18],13:[2,18],15:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],24:[2,18]},{4:[1,35],19:[1,36],20:[2,30],27:27,28:55,31:23,32:[1,29],33:[1,30],34:24,35:[1,31],39:[1,32],41:25,42:[1,33],47:26,48:[1,34],51:[1,28]},{1:[2,10],4:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],15:[2,10],17:[2,10],18:[2,10],19:[2,10],20:[2,10],21:[2,10],23:[2,10],24:[2,10]},{17:[1,56]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],17:[2,53],18:[1,17],19:[1,7],20:[2,53],21:[1,18],23:[2,53],24:[1,19],45:21},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],16:57,18:[1,17],19:[1,7],20:[2,52],21:[1,18],24:[1,19],45:4,54:39},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],23:[1,58],24:[1,19],45:59},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],16:60,18:[1,17],19:[1,7],21:[1,18],23:[2,52],24:[1,19],45:4,54:39},{1:[2,39],4:[2,39],7:[2,39],8:[2,39],9:[2,39],10:[2,39],11:[2,39],12:[2,39],13:[2,39],15:[2,39],17:[2,39],18:[2,39],19:[2,39],20:[2,39],21:[2,39],23:[2,39],24:[2,39]},{20:[2,35]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,59],21:[1,18],24:[1,19],45:21},{20:[2,36]},{20:[2,46]},{20:[2,21]},{4:[2,2],5:61,17:[2,2],26:[2,2]},{15:[1,49],29:62},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:64,52:63},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,47],21:[1,18],24:[1,19],45:4,49:66,54:3,55:47,56:65},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,56],21:[1,18],24:[1,19],43:67,45:68},{4:[2,28],17:[2,28],46:69},{20:[1,70]},{1:[2,12],4:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],15:[2,12],17:[2,12],18:[2,12],19:[2,12],20:[2,12],21:[2,12],23:[2,12],24:[2,12]},{20:[1,71]},{1:[2,14],4:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],15:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[2,14],21:[2,14],23:[2,14],24:[2,14]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:72},{23:[1,73]},{3:75,4:[1,20],17:[2,17],25:74,26:[1,76]},{20:[2,22]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,54],21:[1,18],24:[1,19],38:77,45:64,52:78},{4:[2,40],7:[2,40],8:[2,40],9:[2,40],10:[2,40],11:[2,40],12:[2,40],13:[2,40],15:[2,40],18:[2,40],19:[2,40],20:[2,40],21:[2,40],24:[2,40]},{20:[2,24]},{20:[2,48]},{20:[2,25]},{20:[2,57]},{3:81,4:[1,20],17:[1,79],44:80},{4:[2,19],7:[2,19],8:[2,19],9:[2,19],10:[2,19],11:[2,19],12:[2,19],13:[2,19],15:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],24:[2,19]},{1:[2,13],4:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],15:[2,13],17:[2,13],18:[2,13],19:[2,13],20:[2,13],21:[2,13],23:[2,13],24:[2,13]},{4:[2,42],7:[2,42],8:[2,42],9:[2,42],10:[2,42],11:[2,42],12:[2,42],13:[2,42],15:[2,42],18:[2,42],19:[2,42],21:[2,42],23:[2,42],24:[2,42]},{1:[2,15],4:[2,15],7:[2,15],8:[2,15],9:[2,15],10:[2,15],11:[2,15],12:[2,15],13:[2,15],15:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[2,15],21:[2,15],23:[2,15],24:[2,15]},{17:[1,82]},{4:[2,3],17:[2,3],26:[2,3]},{3:83,4:[1,20]},{20:[2,23]},{20:[2,55]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,47],21:[1,18],24:[1,19],45:4,49:84,54:3,55:47},{4:[2,27],17:[2,27]},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],21:[1,18],24:[1,19],45:85},{3:15,4:[1,20],6:5,7:[1,8],8:[1,9],9:[1,10],10:[1,11],11:[1,12],12:[1,13],13:[1,14],14:6,15:[1,16],18:[1,17],19:[1,7],20:[2,47],21:[1,18],24:[1,19],30:86,45:4,49:66,54:3,55:47,56:87},{17:[2,16]},{20:[2,29]},{4:[2,26],17:[2,26]},{20:[2,20]},{20:[2,49]}],
defaultActions: {2:[2,50],23:[2,31],24:[2,32],25:[2,33],26:[2,34],44:[2,35],46:[2,36],47:[2,46],48:[2,21],62:[2,22],65:[2,24],66:[2,48],67:[2,25],68:[2,57],77:[2,23],78:[2,55],83:[2,16],84:[2,29],86:[2,20],87:[2,49]},
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


var expressionTypes = ['Literal', 'Identifier', 'UnaryExpression', 'CallExpression', 'FunctionExpression',
    'ObjectExpression', 'NewExpression'];

function parseNumLiteral(type, token, loc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), loc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yy.loc(loc));
    } else {
        node = parseLiteral(type, Number(token), loc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, rawloc, raw, yy) {
    var loc = yy.loc(rawloc);
    return yy.Node('Literal', value, loc, raw);
//    return yy.Node('NewExpression', yy.Node('Identifier', type, loc), [lit], loc);
}

function parseCollectionLiteral(type, items, rawloc, yy) {
    var loc = yy.loc(rawloc);
    var value = type === 'set' ? [yy.Node('ArrayExpression', items, loc)] : items;
    return yy.Node('CallExpression', yy.Node('Identifier', type, loc), value, loc);
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
    return 7;

break;
case 2:
    return 8;

break;
case 3:
    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2);
    return 9;

break;
case 4: /* ignore */ 
break;
case 5:return 26;
break;
case 6:return 19;
break;
case 7:return 20;
break;
case 8:return 15;
break;
case 9:return 17;
break;
case 10:return 21;
break;
case 11:return 23;
break;
case 12:return 24;
break;
case 13:return 18;
break;
case 14:return 13;
break;
case 15:return 42;
break;
case 16:return 32;
break;
case 17:return 33;
break;
case 18:return 35;
break;
case 19:return 39;
break;
case 20:return 51;
break;
case 21:return 48;
break;
case 22:return 10;
break;
case 23:return 11;
break;
case 24:return 12;
break;
case 25:
    return 4;

break;
case 26:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s,]+))/,/^(?:([-+]?([1-9][0-9]+|[0-9])))/,/^(?:([-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])*"))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:#)/,/^(?:')/,/^(?::)/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:when)/,/^(?:do)/,/^(?:let)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([a-zA-Z*+!\-_=<>?/.][0-9a-zA-Z*+!\-_=<>?/.]*))/,/^(?:.)/],
conditions: {"regex":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true}}
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


if (typeof _dereq_ !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = _dereq_('fs').readFileSync(_dereq_('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && _dereq_.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,_dereq_("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":221,"fs":216,"path":222}],6:[function(_dereq_,module,exports){
(function() {
  var closer, core, escodegen, estraverse, mori, parse, wireCallsToCore;

  closer = _dereq_('../closer');

  core = _dereq_('../closer-core');

  escodegen = _dereq_('escodegen');

  estraverse = _dereq_('estraverse');

  mori = _dereq_('mori');

  wireCallsToCore = function(ast) {
    estraverse.replace(ast, {
      enter: function(node) {
        var calleeObj, calleeProp, obj, prop, _ref;
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name in core) {
          calleeObj = closer.node('Identifier', 'core', node.loc);
          calleeProp = closer.node('Literal', node.callee.name, node.loc);
          node.callee = closer.node('MemberExpression', calleeObj, calleeProp, true, node.loc);
        } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && ((_ref = node.callee.name) === 'list' || _ref === 'vector' || _ref === 'set' || _ref === 'hash_map' || _ref === 'keyword')) {
          calleeObj = closer.node('Identifier', 'mori', node.loc);
          calleeProp = closer.node('Identifier', node.callee.name, node.loc);
          node.callee = closer.node('MemberExpression', calleeObj, calleeProp, false, node.loc);
        } else if (node.type === 'Identifier' && node.name in core) {
          obj = closer.node('Identifier', 'core', node.loc);
          prop = closer.node('Literal', node.name, node.loc);
          node = closer.node('MemberExpression', obj, prop, true, node.loc);
        }
        return node;
      }
    });
    return ast;
  };

  parse = function(src, options) {
    return wireCallsToCore(closer.parse(src, options));
  };

  exports.evaluate = function(src, options) {
    return eval(escodegen.generate(parse(src, options)));
  };

}).call(this);

},{"../closer":3,"../closer-core":2,"escodegen":9,"estraverse":25,"mori":215}],7:[function(_dereq_,module,exports){
(function() {
  var emptySeq, eq, evaluate, falsy, global_helpers, helpers, key, list, map, mori, nil, seq, set, throws, truthy, vec, _,
    __slice = [].slice;

  _ = _dereq_('lodash-node');

  mori = _dereq_('mori');

  global_helpers = _dereq_('./closer-helpers');

  helpers = _dereq_('./closer-core-helpers');

  evaluate = helpers.evaluate;

  beforeEach(function() {
    return this.addMatchers({
      toMoriEqual: function(expected) {
        this.message = function() {
          return "Expected " + this.actual + " to equal " + expected;
        };
        return mori.equals(this.actual, expected);
      }
    });
  });

  eq = function(src, expected) {
    return expect(evaluate(src)).toMoriEqual(expected);
  };

  throws = function(src) {
    return expect(function() {
      return evaluate(src);
    }).toThrow();
  };

  truthy = function(src) {
    return expect(evaluate(src)).toEqual(true);
  };

  falsy = function(src) {
    return expect(evaluate(src)).toEqual(false);
  };

  nil = function(src) {
    return expect(evaluate(src)).toEqual(null);
  };

  key = function(x) {
    return mori.keyword(x);
  };

  seq = function(seqable) {
    return mori.seq(seqable);
  };

  emptySeq = function() {
    return mori.empty(mori.seq([1]));
  };

  vec = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return mori.vector.apply(this, _.flatten(xs));
  };

  list = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return mori.list.apply(this, _.flatten(xs));
  };

  set = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return mori.set(_.flatten(xs));
  };

  map = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return mori.hash_map.apply(this, _.flatten(xs));
  };

  describe('Closer core library', function() {
    describe('(+ x y & more)', function() {
      return it('adds the given numbers', function() {
        throws('(+ "string")');
        eq('(+)', 0);
        return eq('(+ 3.3 0 -6e2 2)', -594.7);
      });
    });
    describe('(- x y & more)', function() {
      return it('subtracts all but the first number from the first one', function() {
        throws('(-)');
        throws('(- "string")');
        eq('(- -3.54)', 3.54);
        return eq('(- 10 3.5 -4)', 10.5);
      });
    });
    describe('(* x y & more)', function() {
      return it('multiplies the given numbers', function() {
        throws('(* "string")');
        eq('(*)', 1);
        return eq('(* 3 -6)', -18);
      });
    });
    describe('(/ x y & more)', function() {
      return it('divides the first number by the rest', function() {
        throws('(/)');
        throws('(/ "string")');
        eq('(/ -4)', -0.25);
        eq('(/ 14 -2)', -7);
        eq('(/ 14 -2.0)', -7);
        return eq('(/ 14 -2 -2)', 3.5);
      });
    });
    describe('(inc x)', function() {
      return it('increments x by 1', function() {
        throws('(inc 2 3 4)');
        throws('(inc "string")');
        return eq('(inc -2e-3)', 0.998);
      });
    });
    describe('(dec x)', function() {
      return it('decrements x by 1', function() {
        throws('(dec 2 3 4)');
        throws('(dec "string")');
        return eq('(dec -2e-3)', -1.002);
      });
    });
    describe('(max x y & more)', function() {
      return it('finds the maximum of the given numbers', function() {
        throws('(max)');
        throws('(max "string" [1 2])');
        return eq('(max -1e10 653.32 1.345e4)', 1.345e4);
      });
    });
    describe('(min x y & more)', function() {
      return it('finds the minimum of the given numbers', function() {
        throws('(min)');
        throws('(min "string" [1 2])');
        return eq('(min -1e10 653.32 1.345e4)', -1e10);
      });
    });
    describe('(quot num div)', function() {
      return it('computes the quotient of dividing num by div', function() {
        throws('(quot 10)');
        throws('(quot [1 2] 3)');
        eq('(quot 10 3)', 3);
        eq('(quot -5.9 3)', -1.0);
        eq('(quot -10 -3)', 3);
        return eq('(quot 10 -3)', -3);
      });
    });
    describe('(rem num div)', function() {
      return it('computes the remainder of dividing num by div (same as % in other languages)', function() {
        throws('(rem 10)');
        throws('(rem [1 2] 3)');
        eq('(rem 10.1 3)', 10.1 % 3);
        eq('(rem -10.1 3)', -10.1 % 3);
        eq('(rem -10.1 -3)', -10.1 % -3);
        return eq('(rem 10.1 -3)', 10.1 % -3);
      });
    });
    describe('(mod num div)', function() {
      return it('computes the modulus of num and div (NOT the same as % in other languages)', function() {
        throws('(mod 10)');
        throws('(mod [1 2] 3)');
        eq('(mod 10.1 3)', 10.1 % 3);
        eq('(mod -10.1 3)', 3 - 10.1 % 3);
        eq('(mod -10.1 -3)', -10.1 % 3);
        return eq('(mod 10.1 -3)', 10.1 % 3 - 3);
      });
    });
    describe('(= x y & more)', function() {
      return it('returns true if all its arguments are equal (by value, not identity)', function() {
        throws('(=)');
        truthy('(= nil nil)');
        truthy('(= 1)');
        truthy('(= (fn [x y] (+ x y)))');
        truthy('(let [a 1] (= a a (/ 4 (+ 2 2)) (mod 5 4)))');
        falsy('(let [a 1] (= a a (/ 4 (+ 2 2)) (mod 5 3)))');
        truthy('(= 1 1.0)');
        truthy('(= 1.0 (/ 2.0 2))');
        truthy('(= "hello" "hello")');
        truthy('(= true (= 4 (* 2 2)))');
        falsy('(= true (= 4 (* 2 3)))');
        truthy('(= :keyword :keyword)');
        falsy('(= 1 [1])');
        falsy('(= [3 4] [4 3])');
        truthy('(= [3 4] \'(3 4))');
        truthy('(= [3 4] \'((+ 2 1) (/ 16 4)))');
        falsy('(= [3 4] \'((+ 2 1) (/ 16 8)))');
        falsy('(= [3 4] \'((+ 2 1) (/ 16 4) 5))');
        truthy('(= #{1 2} #{2 1})');
        truthy('(= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})');
        falsy('(= #{1 2} #{2 1 3})');
        return falsy('(= #{1 2} [2 1])');
      });
    });
    describe('(not= x y & more)', function() {
      return it('returns true if some of its arguments are unequal (by value, not identity)', function() {
        throws('(not=)');
        falsy('(not= nil nil)');
        falsy('(not= 1)');
        falsy('(not= (fn [x y] (+ x y)))');
        falsy('(let [a 1] (not= a a (/ 4 (+ 2 2)) (mod 5 4)))');
        truthy('(let [a 1] (not= a a (/ 4 (+ 2 2)) (mod 5 3)))');
        falsy('(not= 1 1.0)');
        falsy('(not= 1.0 (/ 2.0 2))');
        falsy('(not= "hello" "hello")');
        falsy('(not= true (= 4 (* 2 2)))');
        truthy('(not= true (= 4 (* 2 3)))');
        falsy('(not= :keyword :keyword)');
        truthy('(not= 1 [1])');
        truthy('(not= [3 4] [4 3])');
        falsy('(not= [3 4] \'(3 4))');
        falsy('(not= [3 4] \'((+ 2 1) (/ 16 4)))');
        truthy('(not= [3 4] \'((+ 2 1) (/ 16 8)))');
        truthy('(not= [3 4] \'((+ 2 1) (/ 16 4) 5))');
        falsy('(not= #{1 2} #{2 1})');
        falsy('(not= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})');
        truthy('(not= #{1 2} #{2 1 3})');
        return truthy('(not= #{1 2} [2 1])');
      });
    });
    describe('(== x y & more)', function() {
      return it('returns true if all its arguments are numeric and equal', function() {
        throws('(==)');
        throws('(== "hello" "hello")');
        truthy('(== [1 2 3])');
        return truthy('(let [a 2] (== a a 2.0 (/ 8 (+ 2 2.0))))');
      });
    });
    describe('(< x y & more)', function() {
      return it('returns true if its arguments are in monotonically increasing order', function() {
        throws('(<)');
        throws('(< "hello" "hello")');
        truthy('(< [1 2 3])');
        truthy('(< 0.76 3.45 (+ 2 2) 5)');
        falsy('(< 0.76 3.45 (+ 2 2) 3)');
        falsy('(< 0.76 3.45 (+ 2 2) 4)');
        return throws('(< 0.76 3.45 (+ 2 2) nil)');
      });
    });
    describe('(> x y & more)', function() {
      return it('returns true if its arguments are in monotonically decreasing order', function() {
        throws('(>)');
        throws('(> "hello" "hello")');
        truthy('(> [1 2 3])');
        truthy('(> 5 (+ 2 2) 3.45 0.76)');
        falsy('(> 3 (+ 2 2) 3.45 0.76)');
        falsy('(> 4 (+ 2 2) 3.45 0.76)');
        return throws('(> nil (+ 2 2) 3.45 0.76)');
      });
    });
    describe('(<= x y & more)', function() {
      return it('returns true if its arguments are in monotonically non-decreasing order', function() {
        throws('(<=)');
        throws('(<= "hello" "hello")');
        truthy('(<= [1 2 3])');
        truthy('(<= 0.76 3.45 (+ 2 2) 5)');
        falsy('(<= 0.76 3.45 (+ 2 2) 3)');
        truthy('(<= 0.76 3.45 (+ 2 2) 4)');
        return throws('(<= 0.76 3.45 (+ 2 2) nil)');
      });
    });
    describe('(>= x y & more)', function() {
      return it('returns true if its arguments are in monotonically non-increasing order', function() {
        throws('(>=)');
        throws('(>= "hello" "hello")');
        truthy('(>= [1 2 3])');
        truthy('(>= 5 (+ 2 2) 3.45 0.76)');
        falsy('(>= 3 (+ 2 2) 3.45 0.76)');
        truthy('(>= 4 (+ 2 2) 3.45 0.76)');
        return throws('(>= nil (+ 2 2) 3.45 0.76)');
      });
    });
    describe('(identical? x y)', function() {
      return it('returns true if x and y are the same object', function() {
        throws('(identical? 1 1 1)');
        truthy('(identical? 1 1)');
        truthy('(identical? 1.56 1.56)');
        truthy('(identical? true true)');
        truthy('(identical? nil nil)');
        falsy('(identical? :keyword :keyword)');
        falsy('(identical? #{1 2} #{1 2})');
        truthy('(let [a #{1 2}] (identical? a a))');
        return truthy('(identical? "string" "string")');
      });
    });
    describe('(true? x)', function() {
      return it('returns true if and only if x is the value true', function() {
        throws('(true? nil false)');
        truthy('(true? true)');
        falsy('(true? "hello")');
        return falsy('(true? (fn []))');
      });
    });
    describe('(false? x)', function() {
      return it('returns true if and only if x is the value false', function() {
        throws('(false? nil false)');
        truthy('(false? false)');
        falsy('(false? nil)');
        return falsy('(false? (fn []))');
      });
    });
    describe('(nil? x)', function() {
      return it('returns true if and only if x is the value nil', function() {
        throws('(nil? nil false)');
        truthy('(nil? nil)');
        falsy('(nil? false)');
        return falsy('(nil? (fn []))');
      });
    });
    describe('(some? x)', function() {
      return it('returns true if and only if x is NOT the value nil', function() {
        throws('(some? nil false)');
        falsy('(some? nil)');
        truthy('(some? "hello")');
        return truthy('(some? (fn []))');
      });
    });
    describe('(number? x)', function() {
      return it('returns true if and only if x is a number', function() {
        truthy('(number? 0)');
        truthy('(number? 0.0)');
        falsy('(number? "0")');
        falsy('(number? [])');
        return falsy('(number? nil)');
      });
    });
    describe('(integer? x)', function() {
      return it('returns true if and only if x is an integer', function() {
        truthy('(integer? 0)');
        truthy('(integer? 0.0)');
        falsy('(integer? 0.1)');
        falsy('(integer? "0")');
        falsy('(integer? [])');
        return falsy('(integer? nil)');
      });
    });
    describe('(float? x)', function() {
      return it('returns true if and only if x is a floating-point number', function() {
        falsy('(float? 0)');
        falsy('(float? 0.0)');
        truthy('(float? 0.1)');
        falsy('(float? "0.0")');
        falsy('(float? [])');
        return falsy('(float? nil)');
      });
    });
    describe('(zero? x)', function() {
      return it('returns true if and only if x is numerically 0', function() {
        truthy('(zero? 0)');
        truthy('(zero? 0.0)');
        throws('(zero? "0.0")');
        throws('(zero? [])');
        return throws('(zero? nil)');
      });
    });
    describe('(pos? x)', function() {
      return it('returns true if and only if x is a number > 0', function() {
        truthy('(pos? 3)');
        truthy('(pos? 3.54)');
        falsy('(pos? 0)');
        falsy('(pos? -4.5)');
        throws('(pos? "0.0")');
        throws('(pos? [])');
        return throws('(pos? nil)');
      });
    });
    describe('(neg? x)', function() {
      return it('returns true if and only if x is a number < 0', function() {
        truthy('(neg? -3)');
        truthy('(neg? -3.54)');
        falsy('(neg? 0)');
        falsy('(neg? 4.5)');
        throws('(neg? "0.0")');
        throws('(neg? [])');
        return throws('(neg? nil)');
      });
    });
    describe('(even? x)', function() {
      return it('returns true if and only if x is an even integer', function() {
        truthy('(even? 0)');
        truthy('(even? 68)');
        falsy('(even? 69)');
        truthy('(even? 0.0)');
        return throws('(even? "0.0")');
      });
    });
    describe('(odd? x)', function() {
      return it('returns true if and only if x is an odd integer', function() {
        falsy('(odd? 0)');
        falsy('(odd? 68)');
        truthy('(odd? 69)');
        truthy('(odd? 1.0)');
        return throws('(odd? "1.0")');
      });
    });
    describe('(contains? coll key)', function() {
      return it('returns true if the collection contains the given key', function() {
        throws('(contains? #{nil 2} nil 2)');
        throws('(contains? "string" "str")');
        throws('(contains? \'(1 2) 2)');
        truthy('(contains? #{nil 2} nil)');
        falsy('(contains? #{1 2} 3)');
        truthy('(contains? #{{1 2}} {1 2})');
        falsy('(contains? #{{1 2}} {2 1})');
        truthy('(contains? {#{1 2} true} #{2 1})');
        truthy('(contains? #{[1 2]} \'(1 2))');
        falsy('(contains? #{[1 2]} \'(2 1))');
        truthy('(contains? [98 54] 0)');
        truthy('(contains? [98 54] 1)');
        falsy('(contains? [98 54] 2)');
        return falsy('(contains? [98 54] 98)');
      });
    });
    describe('(empty? coll)', function() {
      return it('returns true if coll has no items - same as (not (seq coll))', function() {
        throws('(empty? 3)');
        throws('(empty? [] \'())');
        truthy('(empty? nil)');
        truthy('(empty? "")');
        falsy('(empty? "string")');
        falsy('(empty? [1 2 3])');
        truthy('(empty? [])');
        falsy('(empty? {:k1 "v1" :k2 "v2"})');
        return truthy('(empty? #{})');
      });
    });
    describe('(vector? coll)', function() {
      return it('returns true if coll is a vector', function() {
        falsy('(vector? 3)');
        falsy('(vector? \'())');
        truthy('(vector? [])');
        throws('(vector? [] [])');
        return truthy('(vector? (first (seq {1 2})))');
      });
    });
    describe('(map? coll)', function() {
      return it('returns true if coll is a map', function() {
        falsy('(map? 3)');
        falsy('(map? #{})');
        truthy('(map? {})');
        return throws('(map? {} {})');
      });
    });
    describe('(boolean x)', function() {
      return it('coerces x into a boolean value (false for nil and false, else true)', function() {
        throws('(boolean nil false)');
        falsy('(boolean nil)');
        falsy('(boolean false)');
        truthy('(boolean true)');
        truthy('(boolean 34.75)');
        truthy('(boolean "hello")');
        truthy('(boolean :keyword)');
        truthy('(boolean [1 2])');
        return truthy('(boolean (fn [x y] (+ x y)))');
      });
    });
    describe('(not x)', function() {
      return it('returns the complement of (boolean x) (true for nil and false, else false)', function() {
        throws('(not nil false)');
        truthy('(not nil)');
        truthy('(not false)');
        falsy('(not true)');
        falsy('(not 34.75)');
        falsy('(not "hello")');
        falsy('(not :keyword)');
        falsy('(not [1 2])');
        return falsy('(not (fn [x y] (+ x y)))');
      });
    });
    describe('(str x & ys)', function() {
      return it('concatenates the string values of each of its arguments', function() {
        eq('(str)', '');
        eq('(str nil)', '');
        eq('(str 34)', '34');
        eq('(str 34.45)', '34.45');
        eq('(str 3e3)', '3000');
        eq('(str 3e-4)', '0.0003');
        eq('(str 1 true "hello" :keyword)', '1truehello:keyword');
        eq('(str [1 2 :key])', '[1 2 :key]');
        eq('(str (seq [1 2 :key]))', '(1 2 :key)');
        eq('(str \'(1 2 3))', '(1 2 3)');
        eq('(str #{1 2 3})', '#{1 2 3}');
        eq('(str {1 2 3 4})', '{1 2, 3 4}');
        eq('(str (seq {1 2 3 4}))', '([1 2] [3 4])');
        return eq('(str [1 2 \'(3 4 5)])', '[1 2 (3 4 5)]');
      });
    });
    describe('(count coll)', function() {
      return it('returns the number of items the collection', function() {
        throws('(count [1 2 3] "hello")');
        throws('(count 1)');
        throws('(count true)');
        eq('(count nil)', 0);
        eq('(count "hello")', 5);
        eq('(count [1 2 3])', 3);
        eq('(count [1 2 #{3 4 5}])', 3);
        return eq('(count {:key1 "value1" :key2 "value2"})', 2);
      });
    });
    describe('(empty coll)', function() {
      return it('returns an empty collection of the same category as coll, or nil', function() {
        throws('(empty)');
        nil('(empty 1)');
        nil('(empty "hello")');
        eq('(empty [1 2 #{3 4}])', vec());
        eq('(empty \'(1 2))', list());
        eq('(empty #{1 2})', set());
        eq('(empty {1 2})', map());
        return eq('(empty (seq #{1 2}))', emptySeq());
      });
    });
    describe('(not-empty coll)', function() {
      return it('if coll is empty, returns nil, else coll', function() {
        throws('(not-empty)');
        throws('(not-empty 1)');
        nil('(not-empty nil)');
        nil('(not-empty #{})');
        eq('(not-empty #{1})', set(1));
        nil('(not-empty "")');
        return eq('(not-empty "hello")', 'hello');
      });
    });
    describe('(get coll key not-found)', function() {
      return it('returns the value mapped to key if present, else not-found or nil', function() {
        throws('(get [1 2 3])');
        nil('(get nil 2)');
        nil('(get 2 2)');
        nil('(get {:k1 "v1" :k2 "v2"} :k3)');
        eq('(get {:k1 "v1" :k2 "v2"} :k3 :not-found)', key('not-found'));
        eq('(get {:k1 "v1" :k2 "v2"} :k2 :not-found)', 'v2');
        eq('(get {#{35 49} true} #{49 35})', true);
        nil('(get #{45 89 32} 1)');
        eq('(get #{45 89 32} 89)', 89);
        eq('(get [45 89 32] 1)', 89);
        nil('(get [45 89 32] 89)');
        nil('(get \'(45 89 32) 1)');
        nil('(get \'(45 89 32) 89)');
        nil('(get \'(45 89 32) 1)');
        return eq('(get "qwerty" 2)', 'e');
      });
    });
    describe('(seq coll)', function() {
      return it('returns a seq on the collection, or nil if it is empty or nil', function() {
        throws('(seq [1 2 3] [4 5 6])');
        throws('(seq true)');
        nil('(seq nil)');
        nil('(seq "")');
        nil('(seq {})');
        eq('(seq "qwe")', seq('qwe'));
        eq('(seq [1 2 3])', seq(vec(1, 2, 3)));
        eq('(seq \'(1 2 3))', seq(list(1, 2, 3)));
        eq('(seq #{1 2 3})', seq(set(1, 2, 3)));
        return eq('(seq {1 2 3 4})', seq(map(1, 2, 3, 4)));
      });
    });
    describe('(first coll)', function() {
      return it('returns the first item in the collection, or nil if coll is nil', function() {
        throws('(first [1 2 3] [4 5 6])');
        throws('(first 3)');
        nil('(first nil)');
        nil('(first [])');
        nil('(first "")');
        eq('(first "string")', 's');
        eq('(first \'(1 2 3))', 1);
        eq('(first #{1 2 3})', 1);
        return eq('(first {1 2 3 4})', vec(1, 2));
      });
    });
    describe('(rest coll)', function() {
      return it('returns all but the first item in the collection, or an empty seq if there are no more', function() {
        throws('(rest [1 2 3] [4 5 6])');
        throws('(rest 3)');
        eq('(rest nil)', emptySeq());
        eq('(rest [])', emptySeq());
        eq('(rest "s")', emptySeq());
        eq('(rest "string")', seq('tring'));
        eq('(rest \'(1 2 3))', seq([2, 3]));
        eq('(rest #{1 2 3})', seq([2, 3]));
        return eq('(rest {1 2 3 4})', seq([vec(3, 4)]));
      });
    });
    describe('(next coll)', function() {
      return it('returns all but the first item in the collection, or nil if there are no more', function() {
        throws('(next [1 2 3] [4 5 6])');
        throws('(next 3)');
        nil('(next nil)');
        nil('(next [])');
        nil('(next "s")');
        eq('(next "string")', seq('tring'));
        eq('(next \'(1 2 3))', seq([2, 3]));
        eq('(next #{1 2 3})', seq([2, 3]));
        return eq('(next {1 2 3 4})', seq([vec(3, 4)]));
      });
    });
    describe('(last coll)', function() {
      return it('returns the last item in coll, in linear time', function() {
        throws('(last [1 2 3] [4 5 6])');
        throws('(last 3)');
        nil('(last nil)');
        nil('(last [])');
        nil('(last "")');
        eq('(last "string")', 'g');
        eq('(last \'(1 2 3))', 3);
        eq('(last #{1 2 3})', 3);
        return eq('(last {1 2 3 4})', vec(3, 4));
      });
    });
    describe('(nth coll index not-found)', function() {
      return it('returns the value at index in coll, takes O(n) time on lists and seqs', function() {
        throws('(nth [1 2] 0 0 0)');
        throws('(nth #{1 2} 0)');
        throws('(nth {1 2} 0)');
        nil('(nth nil 3)');
        eq('(nth [1 2] 0)', 1);
        eq('(nth [1 2] 0.45)', 1);
        throws('(nth [1 2] nil)');
        throws('(nth [1 2] nil "not-found")');
        throws('(nth [1 2] 2)');
        eq('(nth [1 2] 2 "not-found")', 'not-found');
        eq('(nth "string" 0)', 's');
        throws('(nth "string" 6)');
        eq('(nth "string" 6 "not-found")', 'not-found');
        eq('(nth \'(1 2 3 4) 3)', 4);
        return eq('(nth (seq #{1 2 3 4}) 3)', 4);
      });
    });
    describe('(peek coll)', function() {
      return it('returns the first item of a list or the last item of a vector', function() {
        throws('(peek [1 2] [3 4])');
        throws('(peek #{1 2})');
        throws('(peek {1 2})');
        throws('(peek (seq #{1 2}))');
        throws('(peek "string")');
        nil('(peek nil)');
        nil('(peek [])');
        nil('(peek \'())');
        eq('(peek \'(1 2 3))', 1);
        return eq('(peek [1 2 3])', 3);
      });
    });
    describe('(pop coll)', function() {
      return it('returns coll with (peek coll) removed, throws if coll is empty', function() {
        throws('(pop [1 2] [3 4])');
        throws('(pop #{1 2})');
        throws('(pop {1 2})');
        throws('(pop (seq #{1 2}))');
        throws('(pop "string")');
        nil('(pop nil)');
        throws('(pop [])');
        throws('(pop \'())');
        eq('(pop \'(1 2 3))', list(2, 3));
        return eq('(pop [1 2 3])', vec(1, 2));
      });
    });
    describe('(cons x seq)', function() {
      return it('returns a new seq of the form (x seq)', function() {
        throws('(cons 1 2 [3 4 5])');
        eq('(cons 3 nil)', seq([3]));
        eq('(cons nil nil)', seq([null]));
        throws('(cons nil 3)');
        eq('(cons true "string")', seq([true, 's', 't', 'r', 'i', 'n', 'g']));
        return eq('(cons 1 {1 2 3 4})', seq([1, vec(1, 2), vec(3, 4)]));
      });
    });
    describe('(conj coll & xs)', function() {
      return it('adds xs to coll in the most efficient way possible', function() {
        throws('(conj [1 2 3])');
        throws('(conj "string" "s")');
        eq('(conj #{1 2 3} 4 true)', set(1, 2, 3, 4, true));
        eq('(conj nil 1)', seq([1]));
        eq('(conj {1 2} [3 4])', map(1, 2, 3, 4));
        throws('(conj {1 2} [3 4 5 6])');
        eq('(conj {1 2} [3 4] [5 6])', map(1, 2, 3, 4, 5, 6));
        eq('(conj {1 2} {3 4 5 6})', map(1, 2, 3, 4, 5, 6));
        throws('(conj {1 2} \'(3 4))');
        throws('(conj {1 2} #{3 4})');
        eq('(conj [1] 2 3)', vec(1, 2, 3));
        eq('(conj (seq [1]) 2 3)', seq([3, 2, 1]));
        eq('(conj \'(1) 2 3)', list(3, 2, 1));
        eq('(conj #{1 2} [3])', set(1, 2, vec(3)));
        eq('(conj [1 2] [3])', vec(1, 2, vec(3)));
        return eq('(conj \'(1 2) [3])', list(vec(3), 1, 2));
      });
    });
    describe('(into to from)', function() {
      return it('conjs all items from the second collection into the first', function() {
        throws('(into [])');
        nil('(into nil nil)');
        eq('(into :key nil)', key('key'));
        eq('(into :key [])', key('key'));
        throws('(into :key [1])');
        eq('(into [1 2] [3 4])', vec(1, 2, 3, 4));
        eq('(into nil [3 4])', seq([4, 3]));
        eq('(into \'(1 2) [3 4])', list(4, 3, 1, 2));
        eq('(into [1 2] \'(3 4))', list(1, 2, 3, 4));
        eq('(into #{1 2} [3 4])', set(1, 2, 3, 4));
        eq('(into {1 2} {3 4})', map(1, 2, 3, 4));
        throws('(into {1 2} [3 4])');
        eq('(into {1 2} [[3 4]])', map(1, 2, 3, 4));
        throws('(into {1 2} [[3]])');
        throws('(into {1 2} [[3 4 5]])');
        eq('(into {1 2} \'([3 4]))', map(1, 2, 3, 4));
        eq('(into {1 2} #{[3 4]})', map(1, 2, 3, 4));
        return throws('(into {1 2} [\'(3 4)])');
      });
    });
    describe('(concat seqs)', function() {
      return it('concatenates the given seqables into one sequence', function() {
        eq('(concat)', emptySeq());
        eq('(concat nil)', emptySeq());
        eq('(concat #{1} [2] \'(3) {4 5} "67")', seq([1, 2, 3, vec(4, 5), '6', '7']));
        throws('(concat #{1} [2] \'(3) {4 5} "67" 3)');
        return throws('(concat #{1} [2] \'(3) {4 5} "67" true)');
      });
    });
    describe('(flatten coll)', function() {
      return it('converts an arbitrarily-nested collection into a flat sequence', function() {
        throws('(flatten)');
        eq('(flatten nil)', emptySeq());
        eq('(flatten 3)', emptySeq());
        eq('(flatten "string")', emptySeq());
        eq('(flatten [1 \'(2 [3])])', seq([1, 2, 3]));
        eq('(flatten #{1 2 #{3}})', emptySeq());
        eq('(flatten {:a 1, :b 2})', emptySeq());
        return eq('(flatten (seq {:a 1, :b 2}))', seq([key('a'), 1, key('b'), 2]));
      });
    });
    describe('(reverse coll)', function() {
      return it('reverses the collection', function() {
        throws('(reverse)');
        eq('(reverse nil)', emptySeq());
        throws('(reverse 3)');
        eq('(reverse "")', emptySeq());
        eq('(reverse "string")', seq(['g', 'n', 'i', 'r', 't', 's']));
        eq('(reverse [1 2 \'(3 4)])', seq([list(3, 4), 2, 1]));
        eq('(reverse #{1 2 3})', seq([3, 2, 1]));
        return eq('(reverse {:a 1 :b 2})', seq([vec(key('b'), 2), vec(key('a'), 1)]));
      });
    });
    describe('(assoc map & kvs)', function() {
      return it('adds / updates the given key-value pairs in the given map / vector', function() {
        throws('(assoc #{1 2} 3 3)');
        throws('(assoc \'(1 2) 3 3)');
        throws('(assoc "string" 1 "h")');
        eq('(assoc {1 2 3 4} 1 3 4 5)', map(1, 3, 3, 4, 4, 5));
        throws('(assoc {1 2} 3 4 5)');
        eq('(assoc [1 2 3] 3 4)', vec(1, 2, 3, 4));
        throws('(assoc [1 2 3] 4 4)');
        throws('(assoc [1 2 3] 3)');
        eq('(assoc {1 2} nil 4)', map(1, 2, null, 4));
        return throws('(assoc [1 2] nil 4)');
      });
    });
    describe('(dissoc map & keys)', function() {
      return it('removes entries corresponding to the given keys from map', function() {
        throws('(dissoc #{1 2} 0)');
        throws('(dissoc \'(1 2) 0)');
        throws('(dissoc "string" 0)');
        throws('(dissoc [1 2] 0)');
        eq('(dissoc {1 2})', map(1, 2));
        eq('(dissoc [1 2])', vec(1, 2));
        eq('(dissoc {1 2, 3 4, 5 6} 3 5)', map(1, 2));
        eq('(dissoc {1 2, 3 4, 5 6} 3 5 4 6 7)', map(1, 2));
        return nil('(dissoc nil (fn []) true)');
      });
    });
    describe('(find map key)', function() {
      return it('returns the map entry for a given key', function() {
        throws('(find {:a 1 :b 2} :a :b)');
        nil('(find nil nil)');
        nil('(find nil 3)');
        eq('(find {:a 1 :b 2} :a)', vec(key('a'), 1));
        eq('(find [1 2 3 4] 2)', vec(2, 3));
        throws('(find \'(1 2 3 4) 2)');
        throws('(find #{1 2 3 4} 2)');
        return throws('(find "string" 2)');
      });
    });
    describe('(range), (range end), (range start end), (range start end step)', function() {
      return it('returns a seq of numbers in the range [start, end), where start defaults to 0, step to 1, and end to infinity', function() {
        throws('(range 1 10 2 2)');
        eq('(nth (range) 23)', 23);
        eq('(range 5)', seq([0, 1, 2, 3, 4]));
        eq('(range 2 5)', seq([2, 3, 4]));
        eq('(range 1 10 2)', seq([1, 3, 5, 7, 9]));
        eq('(range 10 2 2)', emptySeq());
        eq('(range 10 2 -2)', seq([10, 8, 6, 4]));
        eq('(range 1.2 6.9 1.6)', seq([1.2, 2.8, 4.4, 6.0]));
        return throws('(range 1.2 6.9 "1.6")');
      });
    });
    describe('(identity x)', function() {
      return it('returns its argument', function() {
        throws('(identity 34 45)');
        nil('(identity nil)');
        return eq('(identity {:k1 "v1" :k2 #{1 2}})', map(key('k1'), 'v1', key('k2'), set(1, 2)));
      });
    });
    describe('(map f colls)', function() {
      return it('applies f sequentially to every item in the given collections', function() {
        throws('(map +)');
        eq('(map inc [1 2 3])', seq([2, 3, 4]));
        eq('(map + [1 2] \'(3 4) #{5 6})', seq([9, 12]));
        return eq('(map first {:a 1, :b 2})', seq([key('a'), key('b')]));
      });
    });
    describe('(mapcat f colls)', function() {
      return it('applies concat to the result of applying map to f and colls', function() {
        throws('(mapcat +)');
        return eq('(mapcat reverse {2 1, 4 3, 6 5})', seq([1, 2, 3, 4, 5, 6]));
      });
    });
    describe('(filter pred coll)', function() {
      return it('returns a seq of the items in coll for which (pred item) is true', function() {
        throws('(filter even?)');
        throws('(filter true [1 2 3 4])');
        eq('(filter even? nil)', emptySeq());
        eq('(filter even? [1 2 3 4])', seq([2, 4]));
        eq('(filter even? \'(1 2 3 4))', seq([2, 4]));
        eq('(filter even? #{1 2 3 4})', seq([2, 4]));
        eq('(filter (fn [pair] (< (nth pair 0) (nth pair 1))) {1 2 4 3})', seq([vec(1, 2)]));
        return eq('(filter (fn [s] (= s "s")) "strings")', seq(['s', 's']));
      });
    });
    describe('(remove pred coll)', function() {
      return it('returns a seq of the items in coll for which (pred item) is false', function() {
        throws('(remove even?)');
        throws('(remove true [1 2 3 4])');
        eq('(remove even? nil)', emptySeq());
        eq('(remove even? [1 2 3 4])', seq([1, 3]));
        eq('(remove even? \'(1 2 3 4))', seq([1, 3]));
        eq('(remove even? #{1 2 3 4})', seq([1, 3]));
        eq('(remove (fn [pair] (< (nth pair 0) (nth pair 1))) {1 2 4 3})', seq([vec(4, 3)]));
        return eq('(remove (fn [s] (= s "s")) "strings")', seq(['t', 'r', 'i', 'n', 'g']));
      });
    });
    describe('(reduce f coll), (reduce f val coll)', function() {
      return it('applies f to the first item in coll, then to that result and the second item, and so on', function() {
        throws('(reduce +)');
        throws('(reduce + 2)');
        eq('(reduce + nil)', 0);
        eq('(reduce + [1 2 3 4])', 10);
        eq('(reduce + \'(1 2 3 4))', 10);
        eq('(reduce + #{1 2 3 4})', 10);
        eq('(reduce + 10 [1 2 3 4])', 20);
        eq('(reduce concat {1 2 3 4})', seq([1, 2, 3, 4]));
        return throws('(reduce nil [1 2 3 4])');
      });
    });
    describe('(reduce-kv f init coll)', function() {
      return it('works like reduce, but f is given 3 arguments: result, key, and value', function() {
        throws('(reduce-kv +)');
        throws('(reduce-kv + [1 2 3 4])');
        eq('(reduce-kv + 0 [0 1 2 3])', 12);
        eq('(reduce-kv + 0 {0 1 2 3})', 6);
        eq('(reduce-kv + 4 {0 1 2 3})', 10);
        throws('(reduce-kv + 0 #{0 1 2 3})');
        return throws('(reduce-kv + 0 \'(0 1 2 3))');
      });
    });
    describe('(take n coll)', function() {
      return it('returns a seq of the first n items of coll, or all items if there are fewer than n', function() {
        throws('(take 10)');
        throws('(take 10 3)');
        throws('(take "2" [1 2 3 4])');
        eq('(take 3 (range))', seq([0, 1, 2]));
        eq('(take 2 [1 2 3 4])', seq([1, 2]));
        eq('(take 2 \'(1 2 3 4))', seq([1, 2]));
        eq('(take 2 #{1 2 3 4})', seq([1, 2]));
        eq('(take 2 {1 2 3 4 5 6})', seq([vec(1, 2), vec(3, 4)]));
        return eq('(take 2.1 [1 2 3 4])', seq([1, 2, 3]));
      });
    });
    return describe('(drop n coll)', function() {
      return it('returns a seq of all but the first n items of coll, or an empty seq if there are fewer than n', function() {
        throws('(drop 10)');
        throws('(drop 10 3)');
        throws('(drop "2" [1 2 3 4])');
        eq('(drop 3 (take 6 (range)))', seq([3, 4, 5]));
        eq('(drop 2 [1 2 3 4])', seq([3, 4]));
        eq('(drop 2 \'(1 2 3 4))', seq([3, 4]));
        eq('(drop 2 #{1 2 3 4})', seq([3, 4]));
        eq('(drop 2 {1 2 3 4 5 6})', seq([vec(5, 6)]));
        return eq('(drop 2.1 [1 2 3 4])', seq([4]));
      });
    });
  });

}).call(this);

},{"./closer-core-helpers":6,"./closer-helpers":8,"lodash-node":113,"mori":215}],8:[function(_dereq_,module,exports){
(function() {
  var closer, json_diff, type, _i, _len, _ref,
    __slice = [].slice;

  json_diff = _dereq_('json-diff');

  exports.toDeepEqual = function(expected) {
    this.message = function() {
      return 'actual != expected, diff is:\n' + json_diff.diffString(this.actual, expected);
    };
    return typeof json_diff.diff(this.actual, expected) === 'undefined';
  };

  closer = _dereq_('../closer');

  _ref = ['keyword', 'vector', 'list', 'set', 'hash_map', 'seq'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    type = _ref[_i];
    exports[type] = (function(type2) {
      return function() {
        var args, items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        items = type2 === 'keyword' ? [closer.node('Literal', items[0])] : items;
        args = type2 === 'set' ? [closer.node('ArrayExpression', items)] : items;
        return closer.node('CallExpression', closer.node('Identifier', type2), args);
      };
    })(type);
  }

  exports.Identifier = function(name) {
    return {
      type: 'Identifier',
      name: name
    };
  };

  exports.Literal = function(value) {
    if (value == null) {
      value = null;
    }
    return {
      type: 'Literal',
      value: value
    };
  };

  exports.UnaryExpression = function(operator, argument) {
    return {
      type: 'UnaryExpression',
      operator: operator,
      argument: argument,
      prefix: true
    };
  };

  exports.CallExpression = function(callee, args) {
    return {
      type: 'CallExpression',
      callee: callee,
      "arguments": (typeof args !== 'undefined' ? args : [])
    };
  };

  exports.FunctionExpression = function(id, params, rest, body) {
    return {
      type: 'FunctionExpression',
      id: id,
      params: params,
      defaults: [],
      rest: rest,
      body: body,
      generator: false,
      expression: false
    };
  };

  exports.EmptyStatement = function() {
    return {
      type: 'EmptyStatement'
    };
  };

  exports.ExpressionStatement = function(expression) {
    return {
      type: 'ExpressionStatement',
      expression: expression
    };
  };

  exports.IfStatement = function(test, consequent, alternate) {
    return {
      type: 'IfStatement',
      test: test,
      consequent: consequent,
      alternate: (typeof alternate !== 'undefined' ? alternate : null)
    };
  };

  exports.ReturnStatement = function(argument) {
    return {
      type: 'ReturnStatement',
      argument: argument
    };
  };

  exports.VariableDeclaration = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: args
    };
  };

  exports.VariableDeclarator = function(id, init) {
    return {
      type: 'VariableDeclarator',
      id: id,
      init: init
    };
  };

  exports.FunctionDeclaration = function(id, params, rest, body) {
    var node;
    node = exports.FunctionExpression(id, params, rest, body);
    node.type = 'FunctionDeclaration';
    return node;
  };

  exports.BlockStatement = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'BlockStatement',
      body: args
    };
  };

  exports.Program = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'Program',
      body: args
    };
  };

}).call(this);

},{"../closer":3,"json-diff":27}],9:[function(_dereq_,module,exports){
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

    estraverse = _dereq_('estraverse');
    esutils = _dereq_('esutils');

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
            if (expr.hasOwnProperty('raw') && parse) {
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
            if (stmt.raw) {
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
                SourceNode = _dereq_('source-map').SourceNode;
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

    exports.version = _dereq_('./package.json').version;
    exports.generate = generate;
    exports.attachComments = estraverse.attachComments;
    exports.Precedence = updateDeeply({}, Precedence);
    exports.browser = false;
    exports.FORMAT_MINIFY = FORMAT_MINIFY;
    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
}());
/* vim: set sw=4 ts=4 et tw=80 : */

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./package.json":24,"estraverse":10,"esutils":13,"source-map":14}],10:[function(_dereq_,module,exports){
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

},{}],11:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
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

    var code = _dereq_('./code');

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

},{"./code":11}],13:[function(_dereq_,module,exports){
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

    exports.code = _dereq_('./code');
    exports.keyword = _dereq_('./keyword');
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":11,"./keyword":12}],14:[function(_dereq_,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = _dereq_('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = _dereq_('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = _dereq_('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":19,"./source-map/source-map-generator":20,"./source-map/source-node":21}],15:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var util = _dereq_('./util');

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

},{"./util":22,"amdefine":23}],16:[function(_dereq_,module,exports){
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
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var base64 = _dereq_('./base64');

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

},{"./base64":17,"amdefine":23}],17:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

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

},{"amdefine":23}],18:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

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

},{"amdefine":23}],19:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var util = _dereq_('./util');
  var binarySearch = _dereq_('./binary-search');
  var ArraySet = _dereq_('./array-set').ArraySet;
  var base64VLQ = _dereq_('./base64-vlq');

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

},{"./array-set":15,"./base64-vlq":16,"./binary-search":18,"./util":22,"amdefine":23}],20:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var base64VLQ = _dereq_('./base64-vlq');
  var util = _dereq_('./util');
  var ArraySet = _dereq_('./array-set').ArraySet;

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

},{"./array-set":15,"./base64-vlq":16,"./util":22,"amdefine":23}],21:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var SourceMapGenerator = _dereq_('./source-map-generator').SourceMapGenerator;
  var util = _dereq_('./util');

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

},{"./source-map-generator":20,"./util":22,"amdefine":23}],22:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

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

},{"amdefine":23}],23:[function(_dereq_,module,exports){
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
        path = _dereq_('path'),
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

}).call(this,_dereq_("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"/../../node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":221,"path":222}],24:[function(_dereq_,module,exports){
module.exports={
  "name": "escodegen",
  "description": "ECMAScript code generator",
  "homepage": "http://github.com/Constellation/escodegen",
  "main": "escodegen.js",
  "bin": {
    "esgenerate": "./bin/esgenerate.js",
    "escodegen": "./bin/escodegen.js"
  },
  "version": "1.3.1",
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
    "estraverse": "~1.5.0",
    "esutils": "~1.0.0",
    "esprima": "~1.1.1",
    "source-map": "~0.1.30"
  },
  "optionalDependencies": {
    "source-map": "~0.1.30"
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
  "_id": "escodegen@1.3.1",
  "_from": "escodegen@"
}

},{}],25:[function(_dereq_,module,exports){
module.exports=_dereq_(10)
},{}],26:[function(_dereq_,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var Theme, color, colorize, colorizeToArray, colorizeToCallback, extendedTypeOf, subcolorizeToCallback,
    __hasProp = {}.hasOwnProperty;

  color = _dereq_('cli-color');

  extendedTypeOf = _dereq_('./util').extendedTypeOf;

  Theme = {
    ' ': function(s) {
      return s;
    },
    '+': color.green,
    '-': color.red
  };

  subcolorizeToCallback = function(key, diff, output, color, indent) {
    var item, looksLikeDiff, m, op, prefix, subindent, subkey, subvalue, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    prefix = key ? "" + key + ": " : '';
    subindent = indent + '  ';
    switch (extendedTypeOf(diff)) {
      case 'object':
        if (('__old' in diff) && ('__new' in diff) && (Object.keys(diff).length === 2)) {
          subcolorizeToCallback(key, diff.__old, output, '-', indent);
          return subcolorizeToCallback(key, diff.__new, output, '+', indent);
        } else {
          output(color, "" + indent + prefix + "{");
          for (subkey in diff) {
            if (!__hasProp.call(diff, subkey)) continue;
            subvalue = diff[subkey];
            if (m = subkey.match(/^(.*)__deleted$/)) {
              subcolorizeToCallback(m[1], subvalue, output, '-', subindent);
            } else if (m = subkey.match(/^(.*)__added$/)) {
              subcolorizeToCallback(m[1], subvalue, output, '+', subindent);
            } else {
              subcolorizeToCallback(subkey, subvalue, output, color, subindent);
            }
          }
          return output(color, "" + indent + "}");
        }
        break;
      case 'array':
        output(color, "" + indent + prefix + "[");
        looksLikeDiff = true;
        for (_i = 0, _len = diff.length; _i < _len; _i++) {
          item = diff[_i];
          if ((extendedTypeOf(item) !== 'array') || !((item.length === 2) || ((item.length === 1) && (item[0] === ' '))) || !(typeof item[0] === 'string') || item[0].length !== 1 || !((_ref = item[0]) === ' ' || _ref === '-' || _ref === '+' || _ref === '~')) {
            looksLikeDiff = false;
          }
        }
        if (looksLikeDiff) {
          for (_j = 0, _len1 = diff.length; _j < _len1; _j++) {
            _ref1 = diff[_j], op = _ref1[0], subvalue = _ref1[1];
            if (op === ' ' && !(subvalue != null)) {
              output(' ', subindent + '...');
            } else {
              if (op !== ' ' && op !== '~' && op !== '+' && op !== '-') {
                throw new Error("Unexpected op '" + op + "' in " + (JSON.stringify(diff, null, 2)));
              }
              if (op === '~') op = ' ';
              subcolorizeToCallback('', subvalue, output, op, subindent);
            }
          }
        } else {
          for (_k = 0, _len2 = diff.length; _k < _len2; _k++) {
            subvalue = diff[_k];
            subcolorizeToCallback('', subvalue, output, color, subindent);
          }
        }
        return output(color, "" + indent + "]");
      default:
        return output(color, indent + prefix + JSON.stringify(diff));
    }
  };

  colorizeToCallback = function(diff, output) {
    return subcolorizeToCallback('', diff, output, ' ', '');
  };

  colorizeToArray = function(diff) {
    var output;
    output = [];
    colorizeToCallback(diff, function(color, line) {
      return output.push("" + color + line);
    });
    return output;
  };

  colorize = function(diff, options) {
    var output;
    if (options == null) options = {};
    output = [];
    colorizeToCallback(diff, function(color, line) {
      var _ref, _ref1, _ref2;
      if ((_ref = options.color) != null ? _ref : true) {
        return output.push(((_ref1 = (_ref2 = options.theme) != null ? _ref2[color] : void 0) != null ? _ref1 : Theme[color])("" + color + line) + "\n");
      } else {
        return output.push("" + color + line + "\n");
      }
    });
    return output.join('');
  };

  module.exports = {
    colorize: colorize,
    colorizeToArray: colorizeToArray,
    colorizeToCallback: colorizeToCallback
  };

}).call(this);

},{"./util":28,"cli-color":29}],27:[function(_dereq_,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var SequenceMatcher, arrayDiff, colorize, descalarize, diff, diffScore, diffString, diffWithScore, extendedTypeOf, findMatchingObject, isScalar, isScalarized, objectDiff, scalarize,
    __hasProp = {}.hasOwnProperty;

  SequenceMatcher = _dereq_('difflib').SequenceMatcher;

  extendedTypeOf = _dereq_('./util').extendedTypeOf;

  colorize = _dereq_('./colorize').colorize;

  isScalar = function(obj) {
    return typeof obj !== 'object';
  };

  objectDiff = function(obj1, obj2) {
    var change, key, keys1, keys2, result, score, subscore, value1, value2, _ref, _ref1;
    result = {};
    score = 0;
    keys1 = Object.keys(obj1);
    keys2 = Object.keys(obj2);
    for (key in obj1) {
      if (!__hasProp.call(obj1, key)) continue;
      value1 = obj1[key];
      if (!(!(key in obj2))) continue;
      result["" + key + "__deleted"] = value1;
      score -= 30;
    }
    for (key in obj2) {
      if (!__hasProp.call(obj2, key)) continue;
      value2 = obj2[key];
      if (!(!(key in obj1))) continue;
      result["" + key + "__added"] = value2;
      score -= 30;
    }
    for (key in obj1) {
      if (!__hasProp.call(obj1, key)) continue;
      value1 = obj1[key];
      if (!(key in obj2)) continue;
      score += 20;
      value2 = obj2[key];
      _ref = diffWithScore(value1, value2), subscore = _ref[0], change = _ref[1];
      if (change) result[key] = change;
      score += Math.min(20, Math.max(-10, subscore / 5));
    }
    if (Object.keys(result).length === 0) {
      _ref1 = [100 * Object.keys(obj1).length, void 0], score = _ref1[0], result = _ref1[1];
    } else {
      score = Math.max(0, score);
    }
    return [score, result];
  };

  findMatchingObject = function(item, fuzzyOriginals) {
    var bestMatch, candidate, key, score;
    bestMatch = null;
    for (key in fuzzyOriginals) {
      if (!__hasProp.call(fuzzyOriginals, key)) continue;
      candidate = fuzzyOriginals[key];
      if (key !== '__next') {
        if (extendedTypeOf(item) === extendedTypeOf(candidate)) {
          score = diffScore(item, candidate);
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              score: score,
              key: key
            };
          }
        }
      }
    }
    return bestMatch;
  };

  scalarize = function(array, originals, fuzzyOriginals) {
    var bestMatch, item, proxy, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (isScalar(item)) {
        _results.push(item);
      } else if (fuzzyOriginals && (bestMatch = findMatchingObject(item, fuzzyOriginals)) && bestMatch.score > 40) {
        originals[bestMatch.key] = item;
        _results.push(bestMatch.key);
      } else {
        proxy = "__$!SCALAR" + originals.__next++;
        originals[proxy] = item;
        _results.push(proxy);
      }
    }
    return _results;
  };

  isScalarized = function(item, originals) {
    return (typeof item === 'string') && (item in originals);
  };

  descalarize = function(item, originals) {
    if (isScalarized(item, originals)) {
      return originals[item];
    } else {
      return item;
    }
  };

  arrayDiff = function(obj1, obj2, stats) {
    var allEqual, change, i, i1, i2, item, item1, item2, j, j1, j2, op, opcodes, originals1, originals2, result, score, seq1, seq2, _i, _j, _k, _l, _len, _m, _n, _ref;
    originals1 = {
      __next: 1
    };
    seq1 = scalarize(obj1, originals1);
    originals2 = {
      __next: originals1.__next
    };
    seq2 = scalarize(obj2, originals2, originals1);
    opcodes = new SequenceMatcher(null, seq1, seq2).getOpcodes();
    result = [];
    score = 0;
    allEqual = true;
    for (_i = 0, _len = opcodes.length; _i < _len; _i++) {
      _ref = opcodes[_i], op = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
      if (op !== 'equal') allEqual = false;
      switch (op) {
        case 'equal':
          for (i = _j = i1; i1 <= i2 ? _j < i2 : _j > i2; i = i1 <= i2 ? ++_j : --_j) {
            item = seq1[i];
            if (isScalarized(item, originals1)) {
              if (!isScalarized(item, originals2)) {
                throw new AssertionError("internal bug: isScalarized(item, originals1) != isScalarized(item, originals2) for item " + (JSON.stringify(item)));
              }
              item1 = descalarize(item, originals1);
              item2 = descalarize(item, originals2);
              change = diff(item1, item2);
              if (change) {
                result.push(['~', change]);
                allEqual = false;
              } else {
                result.push([' ']);
              }
            } else {
              result.push([' ', item]);
            }
            score += 10;
          }
          break;
        case 'delete':
          for (i = _k = i1; i1 <= i2 ? _k < i2 : _k > i2; i = i1 <= i2 ? ++_k : --_k) {
            result.push(['-', descalarize(seq1[i], originals1)]);
            score -= 5;
          }
          break;
        case 'insert':
          for (j = _l = j1; j1 <= j2 ? _l < j2 : _l > j2; j = j1 <= j2 ? ++_l : --_l) {
            result.push(['+', descalarize(seq2[j], originals2)]);
            score -= 5;
          }
          break;
        case 'replace':
          for (i = _m = i1; i1 <= i2 ? _m < i2 : _m > i2; i = i1 <= i2 ? ++_m : --_m) {
            result.push(['-', descalarize(seq1[i], originals1)]);
            score -= 5;
          }
          for (j = _n = j1; j1 <= j2 ? _n < j2 : _n > j2; j = j1 <= j2 ? ++_n : --_n) {
            result.push(['+', descalarize(seq2[j], originals2)]);
            score -= 5;
          }
      }
    }
    if (allEqual || (opcodes.length === 0)) {
      result = void 0;
      score = 100;
    } else {
      score = Math.max(0, score);
    }
    return [score, result];
  };

  diffWithScore = function(obj1, obj2) {
    var type1, type2;
    type1 = extendedTypeOf(obj1);
    type2 = extendedTypeOf(obj2);
    if (type1 === type2) {
      switch (type1) {
        case 'object':
          return objectDiff(obj1, obj2);
        case 'array':
          return arrayDiff(obj1, obj2);
      }
    }
    if (obj1 !== obj2) {
      return [
        0, {
          __old: obj1,
          __new: obj2
        }
      ];
    } else {
      return [100, void 0];
    }
  };

  diff = function(obj1, obj2) {
    var change, score, _ref;
    _ref = diffWithScore(obj1, obj2), score = _ref[0], change = _ref[1];
    return change;
  };

  diffScore = function(obj1, obj2) {
    var change, score, _ref;
    _ref = diffWithScore(obj1, obj2), score = _ref[0], change = _ref[1];
    return score;
  };

  diffString = function(obj1, obj2, options) {
    return colorize(diff(obj1, obj2), options);
  };

  module.exports = {
    diff: diff,
    diffString: diffString
  };

}).call(this);

},{"./colorize":26,"./util":28,"difflib":36}],28:[function(_dereq_,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var extendedTypeOf;

  extendedTypeOf = function(obj) {
    var result;
    result = typeof obj;
    if (!(obj != null)) {
      return 'null';
    } else if (result === 'object' && obj.constructor === Array) {
      return 'array';
    } else {
      return result;
    }
  };

  module.exports = {
    extendedTypeOf: extendedTypeOf
  };

}).call(this);

},{}],29:[function(_dereq_,module,exports){
'use strict';

var defineProperties = Object.defineProperties
  , map              = _dereq_('es5-ext/lib/Object/map')

  , toString, codes, properties, init;

toString = function (code, str) {
	return '\x1b[' + code[0] + 'm' + (str || "") + '\x1b[' + code[1] + 'm';
};

codes = {
	// styles
	bold:      [1, 22],
	italic:    [3, 23],
	underline: [4, 24],
	inverse:   [7, 27],
	strike:    [9, 29]
};

['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'].forEach(
	function (color, index) {
		// foreground
		codes[color] = [30 + index, 39];
		// background
		codes['bg' + color[0].toUpperCase() + color.slice(1)] = [40 + index, 49];
	}
);
codes.gray = [90, 39];

properties = map(codes, function (code) {
	return {
		get: function () {
			this.style.push(code);
			return this;
		},
		enumerable: true
	};
});
properties.bright = {
	get: function () {
		this._bright = true;
		return this;
	},
	enumerable: true
};
properties.bgBright = {
	get: function () {
		this._bgBright = true;
		return this;
	},
	enumerable: true
};

init = function () {
	var o = defineProperties(function self(msg) {
		return self.style.reduce(function (msg, code) {
			if ((self._bright && (code[0] >= 30) && (code[0] < 38)) ||
					(self._bgBright && (code[0] >= 40) && (code[0] < 48))) {
				code = [code[0] + 60, code[1]];
			}
			return toString(code, msg);
		}, msg);
	}, properties);
	o.style = [];
	return o[this];
};

module.exports = defineProperties(function (msg) {
	return msg;
}, map(properties, function (code, name) {
	return {
		get: init.bind(name),
		enumerable: true
	};
}));

},{"es5-ext/lib/Object/map":33}],30:[function(_dereq_,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var call       = Function.prototype.call
  , keys       = Object.keys
  , isCallable = _dereq_('./is-callable')
  , callable   = _dereq_('./valid-callable')
  , value      = _dereq_('./valid-value');

module.exports = function (method) {
	return function (obj, cb) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		value(obj);
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(isCallable(compareFn) ? compareFn : undefined);
		}
		return list[method](function (key, index) {
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./is-callable":32,"./valid-callable":34,"./valid-value":35}],31:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./_iterate')('forEach');

},{"./_iterate":30}],32:[function(_dereq_,module,exports){
// Inspired by: http://www.davidflanagan.com/2009/08/typeof-isfuncti.html

'use strict';

var forEach = Array.prototype.forEach.bind([]);

module.exports = function (obj) {
	var type;
	if (!obj) {
		return false;
	}
	type = typeof obj;
	if (type === 'function') {
		return true;
	}
	if (type !== 'object') {
		return false;
	}

	try {
		forEach(obj);
		return true;
	} catch (e) {
		if (e instanceof TypeError) {
			return false;
		}
		throw e;
	}
};

},{}],33:[function(_dereq_,module,exports){
'use strict';

var forEach = _dereq_('./for-each');

module.exports = function (obj, cb) {
	var o = {};
	forEach(obj, function (value, key) {
		o[key] = cb.call(this, value, key, obj);
	}, arguments[2]);
	return o;
};

},{"./for-each":31}],34:[function(_dereq_,module,exports){
'use strict';

var isCallable = _dereq_('./is-callable');

module.exports = function (fn) {
	if (!isCallable(fn)) {
		throw new TypeError(fn + " is not a function");
	}
	return fn;
};

},{"./is-callable":32}],35:[function(_dereq_,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) {
		throw new TypeError("Cannot use null or undefined");
	}
	return value;
};

},{}],36:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/difflib');

},{"./lib/difflib":37}],37:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.3.1

/*
Module difflib -- helpers for computing deltas between objects.

Function getCloseMatches(word, possibilities, n=3, cutoff=0.6):
    Use SequenceMatcher to return list of the best "good enough" matches.

Function contextDiff(a, b):
    For two lists of strings, return a delta in context diff format.

Function ndiff(a, b):
    Return a delta: the difference between `a` and `b` (lists of strings).

Function restore(delta, which):
    Return one of the two sequences that generated an ndiff delta.

Function unifiedDiff(a, b):
    For two lists of strings, return a delta in unified diff format.

Class SequenceMatcher:
    A flexible class for comparing pairs of sequences of any type.

Class Differ:
    For producing human-readable deltas from sequences of lines of text.
*/


(function() {
  var Differ, Heap, IS_CHARACTER_JUNK, IS_LINE_JUNK, SequenceMatcher, assert, contextDiff, floor, getCloseMatches, max, min, ndiff, restore, unifiedDiff, _any, _arrayCmp, _calculateRatio, _countLeading, _formatRangeContext, _formatRangeUnified, _has,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  floor = Math.floor, max = Math.max, min = Math.min;

  Heap = _dereq_('heap');

  assert = _dereq_('assert');

  _calculateRatio = function(matches, length) {
    if (length) {
      return 2.0 * matches / length;
    } else {
      return 1.0;
    }
  };

  _arrayCmp = function(a, b) {
    var i, la, lb, _i, _ref, _ref1;
    _ref = [a.length, b.length], la = _ref[0], lb = _ref[1];
    for (i = _i = 0, _ref1 = min(la, lb); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (a[i] < b[i]) {
        return -1;
      }
      if (a[i] > b[i]) {
        return 1;
      }
    }
    return la - lb;
  };

  _has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  _any = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item) {
        return true;
      }
    }
    return false;
  };

  SequenceMatcher = (function() {

    SequenceMatcher.name = 'SequenceMatcher';

    /*
      SequenceMatcher is a flexible class for comparing pairs of sequences of
      any type, so long as the sequence elements are hashable.  The basic
      algorithm predates, and is a little fancier than, an algorithm
      published in the late 1980's by Ratcliff and Obershelp under the
      hyperbolic name "gestalt pattern matching".  The basic idea is to find
      the longest contiguous matching subsequence that contains no "junk"
      elements (R-O doesn't address junk).  The same idea is then applied
      recursively to the pieces of the sequences to the left and to the right
      of the matching subsequence.  This does not yield minimal edit
      sequences, but does tend to yield matches that "look right" to people.
    
      SequenceMatcher tries to compute a "human-friendly diff" between two
      sequences.  Unlike e.g. UNIX(tm) diff, the fundamental notion is the
      longest *contiguous* & junk-free matching subsequence.  That's what
      catches peoples' eyes.  The Windows(tm) windiff has another interesting
      notion, pairing up elements that appear uniquely in each sequence.
      That, and the method here, appear to yield more intuitive difference
      reports than does diff.  This method appears to be the least vulnerable
      to synching up on blocks of "junk lines", though (like blank lines in
      ordinary text files, or maybe "<P>" lines in HTML files).  That may be
      because this is the only method of the 3 that has a *concept* of
      "junk" <wink>.
    
      Example, comparing two strings, and considering blanks to be "junk":
    
      >>> isjunk = (c) -> c is ' '
      >>> s = new SequenceMatcher(isjunk,
                                  'private Thread currentThread;',
                                  'private volatile Thread currentThread;')
    
      .ratio() returns a float in [0, 1], measuring the "similarity" of the
      sequences.  As a rule of thumb, a .ratio() value over 0.6 means the
      sequences are close matches:
    
      >>> s.ratio().toPrecision(3)
      '0.866'
    
      If you're only interested in where the sequences match,
      .getMatchingBlocks() is handy:
    
      >>> for [a, b, size] in s.getMatchingBlocks()
      ...   console.log("a[#{a}] and b[#{b}] match for #{size} elements");
      a[0] and b[0] match for 8 elements
      a[8] and b[17] match for 21 elements
      a[29] and b[38] match for 0 elements
    
      Note that the last tuple returned by .get_matching_blocks() is always a
      dummy, (len(a), len(b), 0), and this is the only case in which the last
      tuple element (number of elements matched) is 0.
    
      If you want to know how to change the first sequence into the second,
      use .get_opcodes():
    
      >>> for [op, a1, a2, b1, b2] in s.getOpcodes()
      ...   console.log "#{op} a[#{a1}:#{a2}] b[#{b1}:#{b2}]"
      equal a[0:8] b[0:8]
      insert a[8:8] b[8:17]
      equal a[8:29] b[17:38]
    
      See the Differ class for a fancy human-friendly file differencer, which
      uses SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      See also function getCloseMatches() in this module, which shows how
      simple code building on SequenceMatcher can be used to do useful work.
    
      Timing:  Basic R-O is cubic time worst case and quadratic time expected
      case.  SequenceMatcher is quadratic time for the worst case and has
      expected-case behavior dependent in a complicated way on how many
      elements the sequences have in common; best case time is linear.
    
      Methods:
    
      constructor(isjunk=null, a='', b='')
          Construct a SequenceMatcher.
    
      setSeqs(a, b)
          Set the two sequences to be compared.
    
      setSeq1(a)
          Set the first sequence to be compared.
    
      setSeq2(b)
          Set the second sequence to be compared.
    
      findLongestMatch(alo, ahi, blo, bhi)
          Find longest matching block in a[alo:ahi] and b[blo:bhi].
    
      getMatchingBlocks()
          Return list of triples describing matching subsequences.
    
      getOpcodes()
          Return list of 5-tuples describing how to turn a into b.
    
      ratio()
          Return a measure of the sequences' similarity (float in [0,1]).
    
      quickRatio()
          Return an upper bound on .ratio() relatively quickly.
    
      realQuickRatio()
          Return an upper bound on ratio() very quickly.
    */


    function SequenceMatcher(isjunk, a, b, autojunk) {
      this.isjunk = isjunk;
      if (a == null) {
        a = '';
      }
      if (b == null) {
        b = '';
      }
      this.autojunk = autojunk != null ? autojunk : true;
      /*
          Construct a SequenceMatcher.
      
          Optional arg isjunk is null (the default), or a one-argument
          function that takes a sequence element and returns true iff the
          element is junk.  Null is equivalent to passing "(x) -> 0", i.e.
          no elements are considered to be junk.  For example, pass
              (x) -> x in ' \t'
          if you're comparing lines as sequences of characters, and don't
          want to synch up on blanks or hard tabs.
      
          Optional arg a is the first of two sequences to be compared.  By
          default, an empty string.  The elements of a must be hashable.  See
          also .setSeqs() and .setSeq1().
      
          Optional arg b is the second of two sequences to be compared.  By
          default, an empty string.  The elements of b must be hashable. See
          also .setSeqs() and .setSeq2().
      
          Optional arg autojunk should be set to false to disable the
          "automatic junk heuristic" that treats popular elements as junk
          (see module documentation for more information).
      */

      this.a = this.b = null;
      this.setSeqs(a, b);
    }

    SequenceMatcher.prototype.setSeqs = function(a, b) {
      /* 
      Set the two sequences to be compared. 
      
      >>> s = new SequenceMatcher()
      >>> s.setSeqs('abcd', 'bcde')
      >>> s.ratio()
      0.75
      */
      this.setSeq1(a);
      return this.setSeq2(b);
    };

    SequenceMatcher.prototype.setSeq1 = function(a) {
      /* 
      Set the first sequence to be compared. 
      
      The second sequence to be compared is not changed.
      
      >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
      >>> s.ratio()
      0.75
      >>> s.setSeq1('bcde')
      >>> s.ratio()
      1.0
      
      SequenceMatcher computes and caches detailed information about the
      second sequence, so if you want to compare one sequence S against
      many sequences, use .setSeq2(S) once and call .setSeq1(x)
      repeatedly for each of the other sequences.
      
      See also setSeqs() and setSeq2().
      */
      if (a === this.a) {
        return;
      }
      this.a = a;
      return this.matchingBlocks = this.opcodes = null;
    };

    SequenceMatcher.prototype.setSeq2 = function(b) {
      /*
          Set the second sequence to be compared. 
      
          The first sequence to be compared is not changed.
      
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.setSeq2('abcd')
          >>> s.ratio()
          1.0
      
          SequenceMatcher computes and caches detailed information about the
          second sequence, so if you want to compare one sequence S against
          many sequences, use .setSeq2(S) once and call .setSeq1(x)
          repeatedly for each of the other sequences.
      
          See also setSeqs() and setSeq1().
      */
      if (b === this.b) {
        return;
      }
      this.b = b;
      this.matchingBlocks = this.opcodes = null;
      this.fullbcount = null;
      return this._chainB();
    };

    SequenceMatcher.prototype._chainB = function() {
      var b, b2j, elt, i, idxs, indices, isjunk, junk, n, ntest, popular, _i, _j, _len, _len1, _ref;
      b = this.b;
      this.b2j = b2j = {};
      for (i = _i = 0, _len = b.length; _i < _len; i = ++_i) {
        elt = b[i];
        indices = _has(b2j, elt) ? b2j[elt] : b2j[elt] = [];
        indices.push(i);
      }
      junk = {};
      isjunk = this.isjunk;
      if (isjunk) {
        _ref = Object.keys(b2j);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          elt = _ref[_j];
          if (isjunk(elt)) {
            junk[elt] = true;
            delete b2j[elt];
          }
        }
      }
      popular = {};
      n = b.length;
      if (this.autojunk && n >= 200) {
        ntest = floor(n / 100) + 1;
        for (elt in b2j) {
          idxs = b2j[elt];
          if (idxs.length > ntest) {
            popular[elt] = true;
            delete b2j[elt];
          }
        }
      }
      this.isbjunk = function(b) {
        return _has(junk, b);
      };
      return this.isbpopular = function(b) {
        return _has(popular, b);
      };
    };

    SequenceMatcher.prototype.findLongestMatch = function(alo, ahi, blo, bhi) {
      /* 
      Find longest matching block in a[alo...ahi] and b[blo...bhi].  
      
      If isjunk is not defined:
      
      Return [i,j,k] such that a[i...i+k] is equal to b[j...j+k], where
          alo <= i <= i+k <= ahi
          blo <= j <= j+k <= bhi
      and for all [i',j',k'] meeting those conditions,
          k >= k'
          i <= i'
          and if i == i', j <= j'
      
      In other words, of all maximal matching blocks, return one that
      starts earliest in a, and of all those maximal matching blocks that
      start earliest in a, return the one that starts earliest in b.
      
      >>> isjunk = (x) -> x is ' '
      >>> s = new SequenceMatcher(isjunk, ' abcd', 'abcd abcd')
      >>> s.findLongestMatch(0, 5, 0, 9)
      [1, 0, 4]
      
      >>> s = new SequenceMatcher(null, 'ab', 'c')
      >>> s.findLongestMatch(0, 2, 0, 1)
      [0, 0, 0]
      */

      var a, b, b2j, besti, bestj, bestsize, i, isbjunk, j, j2len, k, newj2len, _i, _j, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      _ref = [this.a, this.b, this.b2j, this.isbjunk], a = _ref[0], b = _ref[1], b2j = _ref[2], isbjunk = _ref[3];
      _ref1 = [alo, blo, 0], besti = _ref1[0], bestj = _ref1[1], bestsize = _ref1[2];
      j2len = {};
      for (i = _i = alo; alo <= ahi ? _i < ahi : _i > ahi; i = alo <= ahi ? ++_i : --_i) {
        newj2len = {};
        _ref2 = (_has(b2j, a[i]) ? b2j[a[i]] : []);
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          j = _ref2[_j];
          if (j < blo) {
            continue;
          }
          if (j >= bhi) {
            break;
          }
          k = newj2len[j] = (j2len[j - 1] || 0) + 1;
          if (k > bestsize) {
            _ref3 = [i - k + 1, j - k + 1, k], besti = _ref3[0], bestj = _ref3[1], bestsize = _ref3[2];
          }
        }
        j2len = newj2len;
      }
      while (besti > alo && bestj > blo && !isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref4 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref4[0], bestj = _ref4[1], bestsize = _ref4[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && !isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      while (besti > alo && bestj > blo && isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref5 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref5[0], bestj = _ref5[1], bestsize = _ref5[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      return [besti, bestj, bestsize];
    };

    SequenceMatcher.prototype.getMatchingBlocks = function() {
      /*
          Return list of triples describing matching subsequences.
      
          Each triple is of the form [i, j, n], and means that
          a[i...i+n] == b[j...j+n].  The triples are monotonically increasing in
          i and in j.  it's also guaranteed that if
          [i, j, n] and [i', j', n'] are adjacent triples in the list, and
          the second is not the last triple in the list, then i+n != i' or
          j+n != j'.  IOW, adjacent triples never describe adjacent equal
          blocks.
      
          The last triple is a dummy, [a.length, b.length, 0], and is the only
          triple with n==0.
      
          >>> s = new SequenceMatcher(null, 'abxcd', 'abcd')
          >>> s.getMatchingBlocks()
          [[0, 0, 2], [3, 2, 2], [5, 4, 0]]
      */

      var ahi, alo, bhi, blo, i, i1, i2, j, j1, j2, k, k1, k2, la, lb, matchingBlocks, nonAdjacent, queue, x, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      if (this.matchingBlocks) {
        return this.matchingBlocks;
      }
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      queue = [[0, la, 0, lb]];
      matchingBlocks = [];
      while (queue.length) {
        _ref1 = queue.pop(), alo = _ref1[0], ahi = _ref1[1], blo = _ref1[2], bhi = _ref1[3];
        _ref2 = x = this.findLongestMatch(alo, ahi, blo, bhi), i = _ref2[0], j = _ref2[1], k = _ref2[2];
        if (k) {
          matchingBlocks.push(x);
          if (alo < i && blo < j) {
            queue.push([alo, i, blo, j]);
          }
          if (i + k < ahi && j + k < bhi) {
            queue.push([i + k, ahi, j + k, bhi]);
          }
        }
      }
      matchingBlocks.sort(_arrayCmp);
      i1 = j1 = k1 = 0;
      nonAdjacent = [];
      for (_i = 0, _len = matchingBlocks.length; _i < _len; _i++) {
        _ref3 = matchingBlocks[_i], i2 = _ref3[0], j2 = _ref3[1], k2 = _ref3[2];
        if (i1 + k1 === i2 && j1 + k1 === j2) {
          k1 += k2;
        } else {
          if (k1) {
            nonAdjacent.push([i1, j1, k1]);
          }
          _ref4 = [i2, j2, k2], i1 = _ref4[0], j1 = _ref4[1], k1 = _ref4[2];
        }
      }
      if (k1) {
        nonAdjacent.push([i1, j1, k1]);
      }
      nonAdjacent.push([la, lb, 0]);
      return this.matchingBlocks = nonAdjacent;
    };

    SequenceMatcher.prototype.getOpcodes = function() {
      /* 
      Return list of 5-tuples describing how to turn a into b.
      
      Each tuple is of the form [tag, i1, i2, j1, j2].  The first tuple
      has i1 == j1 == 0, and remaining tuples have i1 == the i2 from the
      tuple preceding it, and likewise for j1 == the previous j2.
      
      The tags are strings, with these meanings:
      
      'replace':  a[i1...i2] should be replaced by b[j1...j2]
      'delete':   a[i1...i2] should be deleted.
                  Note that j1==j2 in this case.
      'insert':   b[j1...j2] should be inserted at a[i1...i1].
                  Note that i1==i2 in this case.
      'equal':    a[i1...i2] == b[j1...j2]
      
      >>> s = new SequenceMatcher(null, 'qabxcd', 'abycdf')
      >>> s.getOpcodes()
      [ [ 'delete'  , 0 , 1 , 0 , 0 ] ,
        [ 'equal'   , 1 , 3 , 0 , 2 ] ,
        [ 'replace' , 3 , 4 , 2 , 3 ] ,
        [ 'equal'   , 4 , 6 , 3 , 5 ] ,
        [ 'insert'  , 6 , 6 , 5 , 6 ] ]
      */

      var ai, answer, bj, i, j, size, tag, _i, _len, _ref, _ref1, _ref2;
      if (this.opcodes) {
        return this.opcodes;
      }
      i = j = 0;
      this.opcodes = answer = [];
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], ai = _ref1[0], bj = _ref1[1], size = _ref1[2];
        tag = '';
        if (i < ai && j < bj) {
          tag = 'replace';
        } else if (i < ai) {
          tag = 'delete';
        } else if (j < bj) {
          tag = 'insert';
        }
        if (tag) {
          answer.push([tag, i, ai, j, bj]);
        }
        _ref2 = [ai + size, bj + size], i = _ref2[0], j = _ref2[1];
        if (size) {
          answer.push(['equal', ai, i, bj, j]);
        }
      }
      return answer;
    };

    SequenceMatcher.prototype.getGroupedOpcodes = function(n) {
      var codes, group, groups, i1, i2, j1, j2, nn, tag, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (n == null) {
        n = 3;
      }
      /* 
      Isolate change clusters by eliminating ranges with no changes.
      
      Return a list groups with upto n lines of context.
      Each group is in the same format as returned by get_opcodes().
      
      >>> a = [1...40].map(String)
      >>> b = a.slice()
      >>> b[8...8] = 'i'
      >>> b[20] += 'x'
      >>> b[23...28] = []
      >>> b[30] += 'y'
      >>> s = new SequenceMatcher(null, a, b)
      >>> s.getGroupedOpcodes()
      [ [ [ 'equal'  , 5 , 8  , 5 , 8 ],
          [ 'insert' , 8 , 8  , 8 , 9 ],
          [ 'equal'  , 8 , 11 , 9 , 12 ] ],
        [ [ 'equal'   , 16 , 19 , 17 , 20 ],
          [ 'replace' , 19 , 20 , 20 , 21 ],
          [ 'equal'   , 20 , 22 , 21 , 23 ],
          [ 'delete'  , 22 , 27 , 23 , 23 ],
          [ 'equal'   , 27 , 30 , 23 , 26 ] ],
        [ [ 'equal'   , 31 , 34 , 27 , 30 ],
          [ 'replace' , 34 , 35 , 30 , 31 ],
          [ 'equal'   , 35 , 38 , 31 , 34 ] ] ]
      */

      codes = this.getOpcodes();
      if (!codes.length) {
        codes = [['equal', 0, 1, 0, 1]];
      }
      if (codes[0][0] === 'equal') {
        _ref = codes[0], tag = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
        codes[0] = [tag, max(i1, i2 - n), i2, max(j1, j2 - n), j2];
      }
      if (codes[codes.length - 1][0] === 'equal') {
        _ref1 = codes[codes.length - 1], tag = _ref1[0], i1 = _ref1[1], i2 = _ref1[2], j1 = _ref1[3], j2 = _ref1[4];
        codes[codes.length - 1] = [tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)];
      }
      nn = n + n;
      groups = [];
      group = [];
      for (_i = 0, _len = codes.length; _i < _len; _i++) {
        _ref2 = codes[_i], tag = _ref2[0], i1 = _ref2[1], i2 = _ref2[2], j1 = _ref2[3], j2 = _ref2[4];
        if (tag === 'equal' && i2 - i1 > nn) {
          group.push([tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)]);
          groups.push(group);
          group = [];
          _ref3 = [max(i1, i2 - n), max(j1, j2 - n)], i1 = _ref3[0], j1 = _ref3[1];
        }
        group.push([tag, i1, i2, j1, j2]);
      }
      if (group.length && !(group.length === 1 && group[0][0] === 'equal')) {
        groups.push(group);
      }
      return groups;
    };

    SequenceMatcher.prototype.ratio = function() {
      /*
          Return a measure of the sequences' similarity (float in [0,1]).
      
          Where T is the total number of elements in both sequences, and
          M is the number of matches, this is 2.0*M / T.
          Note that this is 1 if the sequences are identical, and 0 if
          they have nothing in common.
      
          .ratio() is expensive to compute if you haven't already computed
          .getMatchingBlocks() or .getOpcodes(), in which case you may
          want to try .quickRatio() or .realQuickRatio() first to get an
          upper bound.
          
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.quickRatio()
          0.75
          >>> s.realQuickRatio()
          1.0
      */

      var match, matches, _i, _len, _ref;
      matches = 0;
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        match = _ref[_i];
        matches += match[2];
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.quickRatio = function() {
      /*
          Return an upper bound on ratio() relatively quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute.
      */

      var avail, elt, fullbcount, matches, numb, _i, _j, _len, _len1, _ref, _ref1;
      if (!this.fullbcount) {
        this.fullbcount = fullbcount = {};
        _ref = this.b;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elt = _ref[_i];
          fullbcount[elt] = (fullbcount[elt] || 0) + 1;
        }
      }
      fullbcount = this.fullbcount;
      avail = {};
      matches = 0;
      _ref1 = this.a;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        elt = _ref1[_j];
        if (_has(avail, elt)) {
          numb = avail[elt];
        } else {
          numb = fullbcount[elt] || 0;
        }
        avail[elt] = numb - 1;
        if (numb > 0) {
          matches++;
        }
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.realQuickRatio = function() {
      /*
          Return an upper bound on ratio() very quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute than either .ratio() or .quickRatio().
      */

      var la, lb, _ref;
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      return _calculateRatio(min(la, lb), la + lb);
    };

    return SequenceMatcher;

  })();

  getCloseMatches = function(word, possibilities, n, cutoff) {
    var result, s, score, x, _i, _j, _len, _len1, _ref, _results;
    if (n == null) {
      n = 3;
    }
    if (cutoff == null) {
      cutoff = 0.6;
    }
    /*
      Use SequenceMatcher to return list of the best "good enough" matches.
    
      word is a sequence for which close matches are desired (typically a
      string).
    
      possibilities is a list of sequences against which to match word
      (typically a list of strings).
    
      Optional arg n (default 3) is the maximum number of close matches to
      return.  n must be > 0.
    
      Optional arg cutoff (default 0.6) is a float in [0, 1].  Possibilities
      that don't score at least that similar to word are ignored.
    
      The best (no more than n) matches among the possibilities are returned
      in a list, sorted by similarity score, most similar first.
    
      >>> getCloseMatches('appel', ['ape', 'apple', 'peach', 'puppy'])
      ['apple', 'ape']
      >>> KEYWORDS = require('coffee-script').RESERVED
      >>> getCloseMatches('wheel', KEYWORDS)
      ['when', 'while']
      >>> getCloseMatches('accost', KEYWORDS)
      ['const']
    */

    if (!(n > 0)) {
      throw new Error("n must be > 0: (" + n + ")");
    }
    if (!((0.0 <= cutoff && cutoff <= 1.0))) {
      throw new Error("cutoff must be in [0.0, 1.0]: (" + cutoff + ")");
    }
    result = [];
    s = new SequenceMatcher();
    s.setSeq2(word);
    for (_i = 0, _len = possibilities.length; _i < _len; _i++) {
      x = possibilities[_i];
      s.setSeq1(x);
      if (s.realQuickRatio() >= cutoff && s.quickRatio() >= cutoff && s.ratio() >= cutoff) {
        result.push([s.ratio(), x]);
      }
    }
    result = Heap.nlargest(result, n, _arrayCmp);
    _results = [];
    for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
      _ref = result[_j], score = _ref[0], x = _ref[1];
      _results.push(x);
    }
    return _results;
  };

  _countLeading = function(line, ch) {
    /*
      Return number of `ch` characters at the start of `line`.
    
      >>> _countLeading('   abc', ' ')
      3
    */

    var i, n, _ref;
    _ref = [0, line.length], i = _ref[0], n = _ref[1];
    while (i < n && line[i] === ch) {
      i++;
    }
    return i;
  };

  Differ = (function() {

    Differ.name = 'Differ';

    /*
      Differ is a class for comparing sequences of lines of text, and
      producing human-readable differences or deltas.  Differ uses
      SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      Each line of a Differ delta begins with a two-letter code:
    
          '- '    line unique to sequence 1
          '+ '    line unique to sequence 2
          '  '    line common to both sequences
          '? '    line not present in either input sequence
    
      Lines beginning with '? ' attempt to guide the eye to intraline
      differences, and were not present in either input sequence.  These lines
      can be confusing if the sequences contain tab characters.
    
      Note that Differ makes no claim to produce a *minimal* diff.  To the
      contrary, minimal diffs are often counter-intuitive, because they synch
      up anywhere possible, sometimes accidental matches 100 pages apart.
      Restricting synch points to contiguous matches preserves some notion of
      locality, at the occasional cost of producing a longer diff.
    
      Example: Comparing two texts.
    
      >>> text1 = ['1. Beautiful is better than ugly.\n',
      ...   '2. Explicit is better than implicit.\n',
      ...   '3. Simple is better than complex.\n',
      ...   '4. Complex is better than complicated.\n']
      >>> text1.length
      4
      >>> text2 = ['1. Beautiful is better than ugly.\n',
      ...   '3.   Simple is better than complex.\n',
      ...   '4. Complicated is better than complex.\n',
      ...   '5. Flat is better than nested.\n']
    
      Next we instantiate a Differ object:
    
      >>> d = new Differ()
    
      Note that when instantiating a Differ object we may pass functions to
      filter out line and character 'junk'.
    
      Finally, we compare the two:
    
      >>> result = d.compare(text1, text2)
      [ '  1. Beautiful is better than ugly.\n',
        '- 2. Explicit is better than implicit.\n',
        '- 3. Simple is better than complex.\n',
        '+ 3.   Simple is better than complex.\n',
        '?   ++\n',
        '- 4. Complex is better than complicated.\n',
        '?          ^                     ---- ^\n',
        '+ 4. Complicated is better than complex.\n',
        '?         ++++ ^                      ^\n',
        '+ 5. Flat is better than nested.\n' ]
    
      Methods:
    
      constructor(linejunk=null, charjunk=null)
          Construct a text differencer, with optional filters.
      compare(a, b)
          Compare two sequences of lines; generate the resulting delta.
    */


    function Differ(linejunk, charjunk) {
      this.linejunk = linejunk;
      this.charjunk = charjunk;
      /*
          Construct a text differencer, with optional filters.
      
          The two optional keyword parameters are for filter functions:
      
          - `linejunk`: A function that should accept a single string argument,
            and return true iff the string is junk. The module-level function
            `IS_LINE_JUNK` may be used to filter out lines without visible
            characters, except for at most one splat ('#').  It is recommended
            to leave linejunk null. 
      
          - `charjunk`: A function that should accept a string of length 1. The
            module-level function `IS_CHARACTER_JUNK` may be used to filter out
            whitespace characters (a blank or tab; **note**: bad idea to include
            newline in this!).  Use of IS_CHARACTER_JUNK is recommended.
      */

    }

    Differ.prototype.compare = function(a, b) {
      /*
          Compare two sequences of lines; generate the resulting delta.
      
          Each sequence must contain individual single-line strings ending with
          newlines. Such sequences can be obtained from the `readlines()` method
          of file-like objects.  The delta generated also consists of newline-
          terminated strings, ready to be printed as-is via the writeline()
          method of a file-like object.
      
          Example:
      
          >>> d = new Differ
          >>> d.compare(['one\n', 'two\n', 'three\n'],
          ...           ['ore\n', 'tree\n', 'emu\n'])
          [ '- one\n',
            '?  ^\n',
            '+ ore\n',
            '?  ^\n',
            '- two\n',
            '- three\n',
            '?  -\n',
            '+ tree\n',
            '+ emu\n' ]
      */

      var ahi, alo, bhi, blo, cruncher, g, line, lines, tag, _i, _j, _len, _len1, _ref, _ref1;
      cruncher = new SequenceMatcher(this.linejunk, a, b);
      lines = [];
      _ref = cruncher.getOpcodes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], tag = _ref1[0], alo = _ref1[1], ahi = _ref1[2], blo = _ref1[3], bhi = _ref1[4];
        switch (tag) {
          case 'replace':
            g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
            break;
          case 'delete':
            g = this._dump('-', a, alo, ahi);
            break;
          case 'insert':
            g = this._dump('+', b, blo, bhi);
            break;
          case 'equal':
            g = this._dump(' ', a, alo, ahi);
            break;
          default:
            throw new Error("unknow tag (" + tag + ")");
        }
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._dump = function(tag, x, lo, hi) {
      /*
          Generate comparison results for a same-tagged range.
      */

      var i, _i, _results;
      _results = [];
      for (i = _i = lo; lo <= hi ? _i < hi : _i > hi; i = lo <= hi ? ++_i : --_i) {
        _results.push("" + tag + " " + x[i]);
      }
      return _results;
    };

    Differ.prototype._plainReplace = function(a, alo, ahi, b, blo, bhi) {
      var first, g, line, lines, second, _i, _j, _len, _len1, _ref;
      assert(alo < ahi && blo < bhi);
      if (bhi - blo < ahi - alo) {
        first = this._dump('+', b, blo, bhi);
        second = this._dump('-', a, alo, ahi);
      } else {
        first = this._dump('-', a, alo, ahi);
        second = this._dump('+', b, blo, bhi);
      }
      lines = [];
      _ref = [first, second];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._fancyReplace = function(a, alo, ahi, b, blo, bhi) {
      /*
          When replacing one block of lines with another, search the blocks
          for *similar* lines; the best-matching pair (if any) is used as a
          synch point, and intraline difference marking is done on the
          similar pair. Lots of work, but often worth it.
      
          Example:
          >>> d = new Differ
          >>> d._fancyReplace(['abcDefghiJkl\n'], 0, 1,
          ...                 ['abcdefGhijkl\n'], 0, 1)
          [ '- abcDefghiJkl\n',
            '?    ^  ^  ^\n',
            '+ abcdefGhijkl\n',
            '?    ^  ^  ^\n' ]
      */

      var aelt, ai, ai1, ai2, atags, belt, bestRatio, besti, bestj, bj, bj1, bj2, btags, cruncher, cutoff, eqi, eqj, i, j, la, lb, line, lines, tag, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _o, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      _ref = [0.74, 0.75], bestRatio = _ref[0], cutoff = _ref[1];
      cruncher = new SequenceMatcher(this.charjunk);
      _ref1 = [null, null], eqi = _ref1[0], eqj = _ref1[1];
      lines = [];
      for (j = _i = blo; blo <= bhi ? _i < bhi : _i > bhi; j = blo <= bhi ? ++_i : --_i) {
        bj = b[j];
        cruncher.setSeq2(bj);
        for (i = _j = alo; alo <= ahi ? _j < ahi : _j > ahi; i = alo <= ahi ? ++_j : --_j) {
          ai = a[i];
          if (ai === bj) {
            if (eqi === null) {
              _ref2 = [i, j], eqi = _ref2[0], eqj = _ref2[1];
            }
            continue;
          }
          cruncher.setSeq1(ai);
          if (cruncher.realQuickRatio() > bestRatio && cruncher.quickRatio() > bestRatio && cruncher.ratio() > bestRatio) {
            _ref3 = [cruncher.ratio(), i, j], bestRatio = _ref3[0], besti = _ref3[1], bestj = _ref3[2];
          }
        }
      }
      if (bestRatio < cutoff) {
        if (eqi === null) {
          _ref4 = this._plainReplace(a, alo, ahi, b, blo, bhi);
          for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
            line = _ref4[_k];
            lines.push(line);
          }
          return lines;
        }
        _ref5 = [eqi, eqj, 1.0], besti = _ref5[0], bestj = _ref5[1], bestRatio = _ref5[2];
      } else {
        eqi = null;
      }
      _ref6 = this._fancyHelper(a, alo, besti, b, blo, bestj);
      for (_l = 0, _len1 = _ref6.length; _l < _len1; _l++) {
        line = _ref6[_l];
        lines.push(line);
      }
      _ref7 = [a[besti], b[bestj]], aelt = _ref7[0], belt = _ref7[1];
      if (eqi === null) {
        atags = btags = '';
        cruncher.setSeqs(aelt, belt);
        _ref8 = cruncher.getOpcodes();
        for (_m = 0, _len2 = _ref8.length; _m < _len2; _m++) {
          _ref9 = _ref8[_m], tag = _ref9[0], ai1 = _ref9[1], ai2 = _ref9[2], bj1 = _ref9[3], bj2 = _ref9[4];
          _ref10 = [ai2 - ai1, bj2 - bj1], la = _ref10[0], lb = _ref10[1];
          switch (tag) {
            case 'replace':
              atags += Array(la + 1).join('^');
              btags += Array(lb + 1).join('^');
              break;
            case 'delete':
              atags += Array(la + 1).join('-');
              break;
            case 'insert':
              btags += Array(lb + 1).join('+');
              break;
            case 'equal':
              atags += Array(la + 1).join(' ');
              btags += Array(lb + 1).join(' ');
              break;
            default:
              throw new Error("unknow tag (" + tag + ")");
          }
        }
        _ref11 = this._qformat(aelt, belt, atags, btags);
        for (_n = 0, _len3 = _ref11.length; _n < _len3; _n++) {
          line = _ref11[_n];
          lines.push(line);
        }
      } else {
        lines.push('  ' + aelt);
      }
      _ref12 = this._fancyHelper(a, besti + 1, ahi, b, bestj + 1, bhi);
      for (_o = 0, _len4 = _ref12.length; _o < _len4; _o++) {
        line = _ref12[_o];
        lines.push(line);
      }
      return lines;
    };

    Differ.prototype._fancyHelper = function(a, alo, ahi, b, blo, bhi) {
      var g;
      g = [];
      if (alo < ahi) {
        if (blo < bhi) {
          g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
        } else {
          g = this._dump('-', a, alo, ahi);
        }
      } else if (blo < bhi) {
        g = this._dump('+', b, blo, bhi);
      }
      return g;
    };

    Differ.prototype._qformat = function(aline, bline, atags, btags) {
      /*
          Format "?" output and deal with leading tabs.
      
          Example:
      
          >>> d = new Differ
          >>> d._qformat('\tabcDefghiJkl\n', '\tabcdefGhijkl\n',
          [ '- \tabcDefghiJkl\n',
            '? \t ^ ^  ^\n',
            '+ \tabcdefGhijkl\n',
            '? \t ^ ^  ^\n' ]
      */

      var common, lines;
      lines = [];
      common = min(_countLeading(aline, '\t'), _countLeading(bline, '\t'));
      common = min(common, _countLeading(atags.slice(0, common), ' '));
      common = min(common, _countLeading(btags.slice(0, common), ' '));
      atags = atags.slice(common).replace(/\s+$/, '');
      btags = btags.slice(common).replace(/\s+$/, '');
      lines.push('- ' + aline);
      if (atags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + atags + "\n");
      }
      lines.push('+ ' + bline);
      if (btags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + btags + "\n");
      }
      return lines;
    };

    return Differ;

  })();

  IS_LINE_JUNK = function(line, pat) {
    if (pat == null) {
      pat = /^\s*#?\s*$/;
    }
    /*
      Return 1 for ignorable line: iff `line` is blank or contains a single '#'.
        
      Examples:
    
      >>> IS_LINE_JUNK('\n')
      true
      >>> IS_LINE_JUNK('  #   \n')
      true
      >>> IS_LINE_JUNK('hello\n')
      false
    */

    return pat.test(line);
  };

  IS_CHARACTER_JUNK = function(ch, ws) {
    if (ws == null) {
      ws = ' \t';
    }
    /*
      Return 1 for ignorable character: iff `ch` is a space or tab.
    
      Examples:
      >>> IS_CHARACTER_JUNK(' ').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\t').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\n').should.be.false
      false
      >>> IS_CHARACTER_JUNK('x').should.be.false
      false
    */

    return __indexOf.call(ws, ch) >= 0;
  };

  _formatRangeUnified = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (length === 1) {
      return "" + beginning;
    }
    if (!length) {
      beginning--;
    }
    return "" + beginning + "," + length;
  };

  unifiedDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, started, tag, todate, tofile, tofiledate, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a unified diff.
    
      Unified diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with ---, +++, or @@) are
      created with a trailing newline.  
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The unidiff format normally has a header for filenames and modification
      times.  Any or all of these may be specified using strings for
      'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
    
      Example:
    
      >>> unifiedDiff('one two three four'.split(' '),
      ...             'zero one tree four'.split(' '), {
      ...               fromfile: 'Original'
      ...               tofile: 'Current',
      ...               fromfiledate: '2005-01-26 23:30:50',
      ...               tofiledate: '2010-04-02 10:20:52',
      ...               lineterm: ''
      ...             })
      [ '--- Original\t2005-01-26 23:30:50',
        '+++ Current\t2010-04-02 10:20:52',
        '@@ -1,4 +1,4 @@',
        '+zero',
        ' one',
        '-two',
        '-three',
        '+tree',
        ' four' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    lines = [];
    started = false;
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("--- " + fromfile + fromdate + lineterm);
        lines.push("+++ " + tofile + todate + lineterm);
      }
      _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
      file1Range = _formatRangeUnified(first[1], last[2]);
      file2Range = _formatRangeUnified(first[3], last[4]);
      lines.push("@@ -" + file1Range + " +" + file2Range + " @@" + lineterm);
      for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
        _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], j1 = _ref3[3], j2 = _ref3[4];
        if (tag === 'equal') {
          _ref4 = a.slice(i1, i2);
          for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            line = _ref4[_k];
            lines.push(' ' + line);
          }
          continue;
        }
        if (tag === 'replace' || tag === 'delete') {
          _ref5 = a.slice(i1, i2);
          for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
            line = _ref5[_l];
            lines.push('-' + line);
          }
        }
        if (tag === 'replace' || tag === 'insert') {
          _ref6 = b.slice(j1, j2);
          for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
            line = _ref6[_m];
            lines.push('+' + line);
          }
        }
      }
    }
    return lines;
  };

  _formatRangeContext = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (!length) {
      beginning--;
    }
    if (length <= 1) {
      return "" + beginning;
    }
    return "" + beginning + "," + (beginning + length - 1);
  };

  contextDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, prefix, started, tag, todate, tofile, tofiledate, _, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a context diff.
    
      Context diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with *** or ---) are
      created with a trailing newline.  This is helpful so that inputs
      created from file.readlines() result in diffs that are suitable for
      file.writelines() since both the inputs and outputs have trailing
      newlines.
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The context diff format normally has a header for filenames and
      modification times.  Any or all of these may be specified using
      strings for 'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
      If not specified, the strings default to blanks.
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n', 'four\n']
      >>> b = ['zero\n', 'one\n', 'tree\n', 'four\n']
      >>> contextDiff(a, b, {fromfile: 'Original', tofile: 'Current'})
      [ '*** Original\n',
        '--- Current\n',
        '***************\n',
        '*** 1,4 ****\n',
        '  one\n',
        '! two\n',
        '! three\n',
        '  four\n',
        '--- 1,4 ----\n',
        '+ zero\n',
        '  one\n',
        '! tree\n',
        '  four\n' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    prefix = {
      insert: '+ ',
      "delete": '- ',
      replace: '! ',
      equal: '  '
    };
    started = false;
    lines = [];
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("*** " + fromfile + fromdate + lineterm);
        lines.push("--- " + tofile + todate + lineterm);
        _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
        lines.push('***************' + lineterm);
        file1Range = _formatRangeContext(first[1], last[2]);
        lines.push("*** " + file1Range + " ****" + lineterm);
        if (_any((function() {
          var _j, _len1, _ref3, _results;
          _results = [];
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], _ = _ref3[1], _ = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            _results.push(tag === 'replace' || tag === 'delete');
          }
          return _results;
        })())) {
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            if (tag !== 'insert') {
              _ref4 = a.slice(i1, i2);
              for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                line = _ref4[_k];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
        file2Range = _formatRangeContext(first[3], last[4]);
        lines.push("--- " + file2Range + " ----" + lineterm);
        if (_any((function() {
          var _l, _len3, _ref5, _results;
          _results = [];
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], _ = _ref5[3], _ = _ref5[4];
            _results.push(tag === 'replace' || tag === 'insert');
          }
          return _results;
        })())) {
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], j1 = _ref5[3], j2 = _ref5[4];
            if (tag !== 'delete') {
              _ref6 = b.slice(j1, j2);
              for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
                line = _ref6[_m];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
      }
    }
    return lines;
  };

  ndiff = function(a, b, linejunk, charjunk) {
    if (charjunk == null) {
      charjunk = IS_CHARACTER_JUNK;
    }
    /*
      Compare `a` and `b` (lists of strings); return a `Differ`-style delta.
    
      Optional keyword parameters `linejunk` and `charjunk` are for filter
      functions (or None):
    
      - linejunk: A function that should accept a single string argument, and
        return true iff the string is junk.  The default is null, and is
        recommended; 
    
      - charjunk: A function that should accept a string of length 1. The
        default is module-level function IS_CHARACTER_JUNK, which filters out
        whitespace characters (a blank or tab; note: bad idea to include newline
        in this!).
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> ndiff(a, b)
      [ '- one\n',
        '?  ^\n',
        '+ ore\n',
        '?  ^\n',
        '- two\n',
        '- three\n',
        '?  -\n',
        '+ tree\n',
        '+ emu\n' ]
    */

    return (new Differ(linejunk, charjunk)).compare(a, b);
  };

  restore = function(delta, which) {
    /*
      Generate one of the two sequences that generated a delta.
    
      Given a `delta` produced by `Differ.compare()` or `ndiff()`, extract
      lines originating from file 1 or 2 (parameter `which`), stripping off line
      prefixes.
    
      Examples:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> diff = ndiff(a, b)
      >>> restore(diff, 1)
      [ 'one\n',
        'two\n',
        'three\n' ]
      >>> restore(diff, 2)
      [ 'ore\n',
        'tree\n',
        'emu\n' ]
    */

    var line, lines, prefixes, tag, _i, _len, _ref;
    tag = {
      1: '- ',
      2: '+ '
    }[which];
    if (!tag) {
      throw new Error("unknow delta choice (must be 1 or 2): " + which);
    }
    prefixes = ['  ', tag];
    lines = [];
    for (_i = 0, _len = delta.length; _i < _len; _i++) {
      line = delta[_i];
      if (_ref = line.slice(0, 2), __indexOf.call(prefixes, _ref) >= 0) {
        lines.push(line.slice(2));
      }
    }
    return lines;
  };

  exports._arrayCmp = _arrayCmp;

  exports.SequenceMatcher = SequenceMatcher;

  exports.getCloseMatches = getCloseMatches;

  exports._countLeading = _countLeading;

  exports.Differ = Differ;

  exports.IS_LINE_JUNK = IS_LINE_JUNK;

  exports.IS_CHARACTER_JUNK = IS_CHARACTER_JUNK;

  exports._formatRangeUnified = _formatRangeUnified;

  exports.unifiedDiff = unifiedDiff;

  exports._formatRangeContext = _formatRangeContext;

  exports.contextDiff = contextDiff;

  exports.ndiff = ndiff;

  exports.restore = restore;

}).call(this);

},{"assert":217,"heap":38}],38:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/heap');

},{"./lib/heap":39}],39:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;

  /* 
  Default comparison function to be used
  */


  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };

  /* 
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
  */


  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };

  /*
  Push item onto heap, maintaining the heap invariant.
  */


  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };

  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
  */


  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };

  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be 
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
  */


  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };

  /*
  Fast version of a heappush followed by a heappop.
  */


  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };

  /*
  Transform list into a heap, in-place, in O(array.length) time.
  */


  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };

  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
  */


  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };

  /*
  Find the n largest elements in a dataset.
  */


  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };

  /*
  Find the n smallest elements in a dataset.
  */


  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = Heap;
  } else {
    window.Heap = Heap;
  }

}).call(this);

},{}],40:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'compact': _dereq_('./arrays/compact'),
  'difference': _dereq_('./arrays/difference'),
  'drop': _dereq_('./arrays/rest'),
  'findIndex': _dereq_('./arrays/findIndex'),
  'findLastIndex': _dereq_('./arrays/findLastIndex'),
  'first': _dereq_('./arrays/first'),
  'flatten': _dereq_('./arrays/flatten'),
  'head': _dereq_('./arrays/first'),
  'indexOf': _dereq_('./arrays/indexOf'),
  'initial': _dereq_('./arrays/initial'),
  'intersection': _dereq_('./arrays/intersection'),
  'last': _dereq_('./arrays/last'),
  'lastIndexOf': _dereq_('./arrays/lastIndexOf'),
  'object': _dereq_('./arrays/zipObject'),
  'pull': _dereq_('./arrays/pull'),
  'range': _dereq_('./arrays/range'),
  'remove': _dereq_('./arrays/remove'),
  'rest': _dereq_('./arrays/rest'),
  'sortedIndex': _dereq_('./arrays/sortedIndex'),
  'tail': _dereq_('./arrays/rest'),
  'take': _dereq_('./arrays/first'),
  'union': _dereq_('./arrays/union'),
  'uniq': _dereq_('./arrays/uniq'),
  'unique': _dereq_('./arrays/uniq'),
  'unzip': _dereq_('./arrays/zip'),
  'without': _dereq_('./arrays/without'),
  'xor': _dereq_('./arrays/xor'),
  'zip': _dereq_('./arrays/zip'),
  'zipObject': _dereq_('./arrays/zipObject')
};

},{"./arrays/compact":41,"./arrays/difference":42,"./arrays/findIndex":43,"./arrays/findLastIndex":44,"./arrays/first":45,"./arrays/flatten":46,"./arrays/indexOf":47,"./arrays/initial":48,"./arrays/intersection":49,"./arrays/last":50,"./arrays/lastIndexOf":51,"./arrays/pull":52,"./arrays/range":53,"./arrays/remove":54,"./arrays/rest":55,"./arrays/sortedIndex":56,"./arrays/union":57,"./arrays/uniq":58,"./arrays/without":59,"./arrays/xor":60,"./arrays/zip":61,"./arrays/zipObject":62}],41:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are all falsey.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to compact.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result.push(value);
    }
  }
  return result;
}

module.exports = compact;

},{}],42:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseFlatten = _dereq_('../internals/baseFlatten');

/**
 * Creates an array excluding all values of the provided arrays using strict
 * equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
 * // => [1, 3, 4]
 */
function difference(array) {
  return baseDifference(array, baseFlatten(arguments, true, true, 1));
}

module.exports = difference;

},{"../internals/baseDifference":120,"../internals/baseFlatten":121}],43:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * This method is like `_.find` except that it returns the index of the first
 * element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.findIndex(characters, function(chr) {
 *   return chr.age < 20;
 * });
 * // => 2
 *
 * // using "_.where" callback shorthand
 * _.findIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findIndex(characters, 'blocked');
 * // => 1
 */
function findIndex(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0;

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    if (callback(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = findIndex;

},{"../functions/createCallback":102}],44:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': true },
 *   { 'name': 'fred',    'age': 40, 'blocked': false },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
 * ];
 *
 * _.findLastIndex(characters, function(chr) {
 *   return chr.age > 30;
 * });
 * // => 1
 *
 * // using "_.where" callback shorthand
 * _.findLastIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findLastIndex(characters, 'blocked');
 * // => 2
 */
function findLastIndex(array, callback, thisArg) {
  var length = array ? array.length : 0;
  callback = createCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(array[length], length, array)) {
      return length;
    }
  }
  return -1;
}

module.exports = findLastIndex;

},{"../functions/createCallback":102}],45:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the first element or first `n` elements of an array. If a callback
 * is provided elements at the beginning of the array are returned as long
 * as the callback returns truey. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias head, take
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the first element(s) of `array`.
 * @example
 *
 * _.first([1, 2, 3]);
 * // => 1
 *
 * _.first([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.first([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.first(characters, 'blocked');
 * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
 * // => ['barney', 'fred']
 */
function first(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = -1;
    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[0] : undefined;
    }
  }
  return slice(array, 0, nativeMin(nativeMax(0, n), length));
}

module.exports = first;

},{"../functions/createCallback":102,"../internals/slice":155}],46:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    map = _dereq_('../collections/map');

/**
 * Flattens a nested array (the nesting can be to any depth). If `isShallow`
 * is truey, the array will only be flattened a single level. If a callback
 * is provided each element of the array is passed through the callback before
 * flattening. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new flattened array.
 * @example
 *
 * _.flatten([1, [2], [3, [[4]]]]);
 * // => [1, 2, 3, 4];
 *
 * _.flatten([1, [2], [3, [[4]]]], true);
 * // => [1, 2, 3, [[4]]];
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.flatten(characters, 'pets');
 * // => ['hoppy', 'baby puss', 'dino']
 */
function flatten(array, isShallow, callback, thisArg) {
  // juggle arguments
  if (typeof isShallow != 'boolean' && isShallow != null) {
    thisArg = callback;
    callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
    isShallow = false;
  }
  if (callback != null) {
    array = map(array, callback, thisArg);
  }
  return baseFlatten(array, isShallow);
}

module.exports = flatten;

},{"../collections/map":82,"../internals/baseFlatten":121}],47:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    sortedIndex = _dereq_('./sortedIndex');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found using
 * strict equality for comparisons, i.e. `===`. If the array is already sorted
 * providing `true` for `fromIndex` will run a faster binary search.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {boolean|number} [fromIndex=0] The index to search from or `true`
 *  to perform a binary search on a sorted array.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 1
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 4
 *
 * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
 * // => 2
 */
function indexOf(array, value, fromIndex) {
  if (typeof fromIndex == 'number') {
    var length = array ? array.length : 0;
    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
  } else if (fromIndex) {
    var index = sortedIndex(array, value);
    return array[index] === value ? index : -1;
  }
  return baseIndexOf(array, value, fromIndex);
}

module.exports = indexOf;

},{"../internals/baseIndexOf":122,"./sortedIndex":56}],48:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets all but the last element or last `n` elements of an array. If a
 * callback is provided elements at the end of the array are excluded from
 * the result as long as the callback returns truey. The callback is bound
 * to `thisArg` and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 *
 * _.initial([1, 2, 3], 2);
 * // => [1]
 *
 * _.initial([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [1]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.initial(characters, 'blocked');
 * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
 * // => ['barney', 'fred']
 */
function initial(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : callback || n;
  }
  return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
}

module.exports = initial;

},{"../functions/createCallback":102,"../internals/slice":155}],49:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    cacheIndexOf = _dereq_('../internals/cacheIndexOf'),
    createCache = _dereq_('../internals/createCache'),
    getArray = _dereq_('../internals/getArray'),
    isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray'),
    largeArraySize = _dereq_('../internals/largeArraySize'),
    releaseArray = _dereq_('../internals/releaseArray'),
    releaseObject = _dereq_('../internals/releaseObject');

/**
 * Creates an array of unique values present in all provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of shared values.
 * @example
 *
 * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2]
 */
function intersection() {
  var args = [],
      argsIndex = -1,
      argsLength = arguments.length,
      caches = getArray(),
      indexOf = baseIndexOf,
      trustIndexOf = indexOf === baseIndexOf,
      seen = getArray();

  while (++argsIndex < argsLength) {
    var value = arguments[argsIndex];
    if (isArray(value) || isArguments(value)) {
      args.push(value);
      caches.push(trustIndexOf && value.length >= largeArraySize &&
        createCache(argsIndex ? args[argsIndex] : seen));
    }
  }
  var array = args[0],
      index = -1,
      length = array ? array.length : 0,
      result = [];

  outer:
  while (++index < length) {
    var cache = caches[0];
    value = array[index];

    if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
      argsIndex = argsLength;
      (cache || seen).push(value);
      while (--argsIndex) {
        cache = caches[argsIndex];
        if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
          continue outer;
        }
      }
      result.push(value);
    }
  }
  while (argsLength--) {
    cache = caches[argsLength];
    if (cache) {
      releaseObject(cache);
    }
  }
  releaseArray(caches);
  releaseArray(seen);
  return result;
}

module.exports = intersection;

},{"../internals/baseIndexOf":122,"../internals/cacheIndexOf":127,"../internals/createCache":132,"../internals/getArray":136,"../internals/largeArraySize":142,"../internals/releaseArray":150,"../internals/releaseObject":151,"../objects/isArguments":172,"../objects/isArray":173}],50:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the last element or last `n` elements of an array. If a callback is
 * provided elements at the end of the array are returned as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the last element(s) of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 *
 * _.last([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.last([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [2, 3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.last(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.last(characters, { 'employer': 'na' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function last(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[length - 1] : undefined;
    }
  }
  return slice(array, nativeMax(0, length - n));
}

module.exports = last;

},{"../functions/createCallback":102,"../internals/slice":155}],51:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the index at which the last occurrence of `value` is found using strict
 * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
 * as the offset from the end of the collection.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 4
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var index = array ? array.length : 0;
  if (typeof fromIndex == 'number') {
    index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
  }
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = lastIndexOf;

},{}],52:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all provided values from the given array using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {...*} [value] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3, 1, 2, 3];
 * _.pull(array, 2, 3);
 * console.log(array);
 * // => [1, 1]
 */
function pull(array) {
  var args = arguments,
      argsIndex = 0,
      argsLength = args.length,
      length = array ? array.length : 0;

  while (++argsIndex < argsLength) {
    var index = -1,
        value = args[argsIndex];
    while (++index < length) {
      if (array[index] === value) {
        splice.call(array, index--, 1);
        length--;
      }
    }
  }
  return array;
}

module.exports = pull;

},{}],53:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var ceil = Math.ceil;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to but not including `end`. If `start` is less than `stop` a
 * zero-length range is created unless a negative `step` is specified.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns a new range array.
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
function range(start, end, step) {
  start = +start || 0;
  step = typeof step == 'number' ? step : (+step || 1);

  if (end == null) {
    end = start;
    start = 0;
  }
  // use `Array(length)` so engines like Chakra and V8 avoid slower modes
  // http://youtu.be/XAqIpGU8ZZk#t=17m25s
  var index = -1,
      length = nativeMax(0, ceil((end - start) / (step || 1))),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
}

module.exports = range;

},{}],54:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all elements from an array that the callback returns truey for
 * and returns an array of removed elements. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4, 5, 6];
 * var evens = _.remove(array, function(num) { return num % 2 == 0; });
 *
 * console.log(array);
 * // => [1, 3, 5]
 *
 * console.log(evens);
 * // => [2, 4, 6]
 */
function remove(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    var value = array[index];
    if (callback(value, index, array)) {
      result.push(value);
      splice.call(array, index--, 1);
      length--;
    }
  }
  return result;
}

module.exports = remove;

},{"../functions/createCallback":102}],55:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * The opposite of `_.initial` this method gets all but the first element or
 * first `n` elements of an array. If a callback function is provided elements
 * at the beginning of the array are excluded from the result as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias drop, tail
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.rest([1, 2, 3]);
 * // => [2, 3]
 *
 * _.rest([1, 2, 3], 2);
 * // => [3]
 *
 * _.rest([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.rest(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.rest(characters, { 'employer': 'slate' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function rest(array, callback, thisArg) {
  if (typeof callback != 'number' && callback != null) {
    var n = 0,
        index = -1,
        length = array ? array.length : 0;

    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
  }
  return slice(array, n);
}

module.exports = rest;

},{"../functions/createCallback":102,"../internals/slice":155}],56:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    identity = _dereq_('../utilities/identity');

/**
 * Uses a binary search to determine the smallest index at which a value
 * should be inserted into a given sorted array in order to maintain the sort
 * order of the array. If a callback is provided it will be executed for
 * `value` and each element of `array` to compute their sort ranking. The
 * callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([20, 30, 50], 40);
 * // => 2
 *
 * // using "_.pluck" callback shorthand
 * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
 * // => 2
 *
 * var dict = {
 *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
 * };
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return dict.wordToNumber[word];
 * });
 * // => 2
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return this.wordToNumber[word];
 * }, dict);
 * // => 2
 */
function sortedIndex(array, value, callback, thisArg) {
  var low = 0,
      high = array ? array.length : low;

  // explicitly reference `identity` for better inlining in Firefox
  callback = callback ? createCallback(callback, thisArg, 1) : identity;
  value = callback(value);

  while (low < high) {
    var mid = (low + high) >>> 1;
    (callback(array[mid]) < value)
      ? low = mid + 1
      : high = mid;
  }
  return low;
}

module.exports = sortedIndex;

},{"../functions/createCallback":102,"../utilities/identity":201}],57:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    baseUniq = _dereq_('../internals/baseUniq');

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of combined values.
 * @example
 *
 * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2, 3, 5, 4]
 */
function union() {
  return baseUniq(baseFlatten(arguments, true, true));
}

module.exports = union;

},{"../internals/baseFlatten":121,"../internals/baseUniq":126}],58:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseUniq = _dereq_('../internals/baseUniq'),
    createCallback = _dereq_('../functions/createCallback');

/**
 * Creates a duplicate-value-free version of an array using strict equality
 * for comparisons, i.e. `===`. If the array is sorted, providing
 * `true` for `isSorted` will use a faster algorithm. If a callback is provided
 * each element of `array` is passed through the callback before uniqueness
 * is computed. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias unique
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a duplicate-value-free array.
 * @example
 *
 * _.uniq([1, 2, 1, 3, 1]);
 * // => [1, 2, 3]
 *
 * _.uniq([1, 1, 2, 2, 3], true);
 * // => [1, 2, 3]
 *
 * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
 * // => ['A', 'b', 'C']
 *
 * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
 * // => [1, 2.5, 3]
 *
 * // using "_.pluck" callback shorthand
 * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniq(array, isSorted, callback, thisArg) {
  // juggle arguments
  if (typeof isSorted != 'boolean' && isSorted != null) {
    thisArg = callback;
    callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
    isSorted = false;
  }
  if (callback != null) {
    callback = createCallback(callback, thisArg, 3);
  }
  return baseUniq(array, isSorted, callback);
}

module.exports = uniq;

},{"../functions/createCallback":102,"../internals/baseUniq":126}],59:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    slice = _dereq_('../internals/slice');

/**
 * Creates an array excluding all provided values using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to filter.
 * @param {...*} [value] The values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
 * // => [2, 3, 4]
 */
function without(array) {
  return baseDifference(array, slice(arguments, 1));
}

module.exports = without;

},{"../internals/baseDifference":120,"../internals/slice":155}],60:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseUniq = _dereq_('../internals/baseUniq'),
    isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray');

/**
 * Creates an array that is the symmetric difference of the provided arrays.
 * See http://en.wikipedia.org/wiki/Symmetric_difference.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of values.
 * @example
 *
 * _.xor([1, 2, 3], [5, 2, 1, 4]);
 * // => [3, 5, 4]
 *
 * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
 * // => [1, 4, 5]
 */
function xor() {
  var index = -1,
      length = arguments.length;

  while (++index < length) {
    var array = arguments[index];
    if (isArray(array) || isArguments(array)) {
      var result = result
        ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
        : array;
    }
  }
  return result || [];
}

module.exports = xor;

},{"../internals/baseDifference":120,"../internals/baseUniq":126,"../objects/isArguments":172,"../objects/isArray":173}],61:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var max = _dereq_('../collections/max'),
    pluck = _dereq_('../collections/pluck');

/**
 * Creates an array of grouped elements, the first of which contains the first
 * elements of the given arrays, the second of which contains the second
 * elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @alias unzip
 * @category Arrays
 * @param {...Array} [array] Arrays to process.
 * @returns {Array} Returns a new array of grouped elements.
 * @example
 *
 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 */
function zip() {
  var array = arguments.length > 1 ? arguments : arguments[0],
      index = -1,
      length = array ? max(pluck(array, 'length')) : 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = pluck(array, index);
  }
  return result;
}

module.exports = zip;

},{"../collections/max":83,"../collections/pluck":85}],62:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArray = _dereq_('../objects/isArray');

/**
 * Creates an object composed from arrays of `keys` and `values`. Provide
 * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
 * or two arrays, one of `keys` and one of corresponding `values`.
 *
 * @static
 * @memberOf _
 * @alias object
 * @category Arrays
 * @param {Array} keys The array of keys.
 * @param {Array} [values=[]] The array of values.
 * @returns {Object} Returns an object composed of the given keys and
 *  corresponding values.
 * @example
 *
 * _.zipObject(['fred', 'barney'], [30, 40]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function zipObject(keys, values) {
  var index = -1,
      length = keys ? keys.length : 0,
      result = {};

  if (!values && length && !isArray(keys[0])) {
    values = [];
  }
  while (++index < length) {
    var key = keys[index];
    if (values) {
      result[key] = values[index];
    } else if (key) {
      result[key[0]] = key[1];
    }
  }
  return result;
}

module.exports = zipObject;

},{"../objects/isArray":173}],63:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'chain': _dereq_('./chaining/chain'),
  'tap': _dereq_('./chaining/tap'),
  'value': _dereq_('./chaining/wrapperValueOf'),
  'wrapperChain': _dereq_('./chaining/wrapperChain'),
  'wrapperToString': _dereq_('./chaining/wrapperToString'),
  'wrapperValueOf': _dereq_('./chaining/wrapperValueOf')
};

},{"./chaining/chain":64,"./chaining/tap":65,"./chaining/wrapperChain":66,"./chaining/wrapperToString":67,"./chaining/wrapperValueOf":68}],64:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var lodashWrapper = _dereq_('../internals/lodashWrapper');

/**
 * Creates a `lodash` object that wraps the given value with explicit
 * method chaining enabled.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _.chain(characters)
 *     .sortBy('age')
 *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
 *     .first()
 *     .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  value = new lodashWrapper(value);
  value.__chain__ = true;
  return value;
}

module.exports = chain;

},{"../internals/lodashWrapper":143}],65:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Invokes `interceptor` with the `value` as the first argument and then
 * returns `value`. The purpose of this method is to "tap into" a method
 * chain in order to perform operations on intermediate results within
 * the chain.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3, 4])
 *  .tap(function(array) { array.pop(); })
 *  .reverse()
 *  .value();
 * // => [3, 2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

module.exports = tap;

},{}],66:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Enables explicit method chaining on the wrapper object.
 *
 * @name chain
 * @memberOf _
 * @category Chaining
 * @returns {*} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // without explicit chaining
 * _(characters).first();
 * // => { 'name': 'barney', 'age': 36 }
 *
 * // with explicit chaining
 * _(characters).chain()
 *   .first()
 *   .pick('age')
 *   .value();
 * // => { 'age': 36 }
 */
function wrapperChain() {
  this.__chain__ = true;
  return this;
}

module.exports = wrapperChain;

},{}],67:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Produces the `toString` result of the wrapped value.
 *
 * @name toString
 * @memberOf _
 * @category Chaining
 * @returns {string} Returns the string result.
 * @example
 *
 * _([1, 2, 3]).toString();
 * // => '1,2,3'
 */
function wrapperToString() {
  return String(this.__wrapped__);
}

module.exports = wrapperToString;

},{}],68:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    support = _dereq_('../support');

/**
 * Extracts the wrapped value.
 *
 * @name valueOf
 * @memberOf _
 * @alias value
 * @category Chaining
 * @returns {*} Returns the wrapped value.
 * @example
 *
 * _([1, 2, 3]).valueOf();
 * // => [1, 2, 3]
 */
function wrapperValueOf() {
  return this.__wrapped__;
}

module.exports = wrapperValueOf;

},{"../collections/forEach":77,"../support":197}],69:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'all': _dereq_('./collections/every'),
  'any': _dereq_('./collections/some'),
  'at': _dereq_('./collections/at'),
  'collect': _dereq_('./collections/map'),
  'contains': _dereq_('./collections/contains'),
  'countBy': _dereq_('./collections/countBy'),
  'detect': _dereq_('./collections/find'),
  'each': _dereq_('./collections/forEach'),
  'eachRight': _dereq_('./collections/forEachRight'),
  'every': _dereq_('./collections/every'),
  'filter': _dereq_('./collections/filter'),
  'find': _dereq_('./collections/find'),
  'findLast': _dereq_('./collections/findLast'),
  'findWhere': _dereq_('./collections/find'),
  'foldl': _dereq_('./collections/reduce'),
  'foldr': _dereq_('./collections/reduceRight'),
  'forEach': _dereq_('./collections/forEach'),
  'forEachRight': _dereq_('./collections/forEachRight'),
  'groupBy': _dereq_('./collections/groupBy'),
  'include': _dereq_('./collections/contains'),
  'indexBy': _dereq_('./collections/indexBy'),
  'inject': _dereq_('./collections/reduce'),
  'invoke': _dereq_('./collections/invoke'),
  'map': _dereq_('./collections/map'),
  'max': _dereq_('./collections/max'),
  'min': _dereq_('./collections/min'),
  'pluck': _dereq_('./collections/pluck'),
  'reduce': _dereq_('./collections/reduce'),
  'reduceRight': _dereq_('./collections/reduceRight'),
  'reject': _dereq_('./collections/reject'),
  'sample': _dereq_('./collections/sample'),
  'select': _dereq_('./collections/filter'),
  'shuffle': _dereq_('./collections/shuffle'),
  'size': _dereq_('./collections/size'),
  'some': _dereq_('./collections/some'),
  'sortBy': _dereq_('./collections/sortBy'),
  'toArray': _dereq_('./collections/toArray'),
  'where': _dereq_('./collections/where')
};

},{"./collections/at":70,"./collections/contains":71,"./collections/countBy":72,"./collections/every":73,"./collections/filter":74,"./collections/find":75,"./collections/findLast":76,"./collections/forEach":77,"./collections/forEachRight":78,"./collections/groupBy":79,"./collections/indexBy":80,"./collections/invoke":81,"./collections/map":82,"./collections/max":83,"./collections/min":84,"./collections/pluck":85,"./collections/reduce":86,"./collections/reduceRight":87,"./collections/reject":88,"./collections/sample":89,"./collections/shuffle":90,"./collections/size":91,"./collections/some":92,"./collections/sortBy":93,"./collections/toArray":94,"./collections/where":95}],70:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    isString = _dereq_('../objects/isString');

/**
 * Creates an array of elements from the specified indexes, or keys, of the
 * `collection`. Indexes may be specified as individual arguments or as arrays
 * of indexes.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
 *   to retrieve, specified as individual indexes or arrays of indexes.
 * @returns {Array} Returns a new array of elements corresponding to the
 *  provided indexes.
 * @example
 *
 * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
 * // => ['a', 'c', 'e']
 *
 * _.at(['fred', 'barney', 'pebbles'], 0, 2);
 * // => ['fred', 'pebbles']
 */
function at(collection) {
  var args = arguments,
      index = -1,
      props = baseFlatten(args, true, false, 1),
      length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
      result = Array(length);

  while(++index < length) {
    result[index] = collection[props[index]];
  }
  return result;
}

module.exports = at;

},{"../internals/baseFlatten":121,"../objects/isString":187}],71:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Checks if a given value is present in a collection using strict equality
 * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
 * offset from the end of the collection.
 *
 * @static
 * @memberOf _
 * @alias include
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {*} target The value to check for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
 * @example
 *
 * _.contains([1, 2, 3], 1);
 * // => true
 *
 * _.contains([1, 2, 3], 1, 2);
 * // => false
 *
 * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.contains('pebbles', 'eb');
 * // => true
 */
function contains(collection, target, fromIndex) {
  var index = -1,
      indexOf = baseIndexOf,
      length = collection ? collection.length : 0,
      result = false;

  fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
  if (isArray(collection)) {
    result = indexOf(collection, target, fromIndex) > -1;
  } else if (typeof length == 'number') {
    result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
  } else {
    forOwn(collection, function(value) {
      if (++index >= fromIndex) {
        return !(result = value === target);
      }
    });
  }
  return result;
}

module.exports = contains;

},{"../internals/baseIndexOf":122,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isString":187}],72:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` through the callback. The corresponding value
 * of each key is the number of times the key was returned by the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy(['one', 'two', 'three'], 'length');
 * // => { '3': 2, '5': 1 }
 */
var countBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
});

module.exports = countBy;

},{"../internals/createAggregator":131}],73:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Checks if the given callback returns truey value for **all** elements of
 * a collection. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias all
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if all elements passed the callback check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes']);
 * // => false
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.every(characters, 'age');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.every(characters, { 'age': 36 });
 * // => false
 */
function every(collection, callback, thisArg) {
  var result = true;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if (!(result = !!callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return (result = !!callback(value, index, collection));
    });
  }
  return result;
}

module.exports = every;

},{"../functions/createCallback":102,"../objects/forOwn":167}],74:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning an array of all elements
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that passed the callback check.
 * @example
 *
 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [2, 4, 6]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.filter(characters, 'blocked');
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 *
 * // using "_.where" callback shorthand
 * _.filter(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 */
function filter(collection, callback, thisArg) {
  var result = [];
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        result.push(value);
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result.push(value);
      }
    });
  }
  return result;
}

module.exports = filter;

},{"../functions/createCallback":102,"../objects/forOwn":167}],75:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning the first element that
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect, findWhere
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.find(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => { 'name': 'barney', 'age': 36, 'blocked': false }
 *
 * // using "_.where" callback shorthand
 * _.find(characters, { 'age': 1 });
 * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
 *
 * // using "_.pluck" callback shorthand
 * _.find(characters, 'blocked');
 * // => { 'name': 'fred', 'age': 40, 'blocked': true }
 */
function find(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        return value;
      }
    }
  } else {
    var result;
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result = value;
        return false;
      }
    });
    return result;
  }
}

module.exports = find;

},{"../functions/createCallback":102,"../objects/forOwn":167}],76:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forEachRight = _dereq_('./forEachRight');

/**
 * This method is like `_.find` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(num) {
 *   return num % 2 == 1;
 * });
 * // => 3
 */
function findLast(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forEachRight(collection, function(value, index, collection) {
    if (callback(value, index, collection)) {
      result = value;
      return false;
    }
  });
  return result;
}

module.exports = findLast;

},{"../functions/createCallback":102,"./forEachRight":78}],77:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, executing the callback for each
 * element. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * Note: As with other "Collections" methods, objects with a `length` property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
 * // => logs each number and returns '1,2,3'
 *
 * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
 * // => logs each number and returns the object (property order is not guaranteed across environments)
 */
function forEach(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (++index < length) {
      if (callback(collection[index], index, collection) === false) {
        break;
      }
    }
  } else {
    forOwn(collection, callback);
  }
  return collection;
}

module.exports = forEach;

},{"../internals/baseCreateCallback":118,"../objects/forOwn":167}],78:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString'),
    keys = _dereq_('../objects/keys');

/**
 * This method is like `_.forEach` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias eachRight
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
 * // => logs each number from right to left and returns '3,2,1'
 */
function forEachRight(collection, callback, thisArg) {
  var length = collection ? collection.length : 0;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (length--) {
      if (callback(collection[length], length, collection) === false) {
        break;
      }
    }
  } else {
    var props = keys(collection);
    length = props.length;
    forOwn(collection, function(value, key, collection) {
      key = props ? props[--length] : --length;
      return callback(collection[key], key, collection);
    });
  }
  return collection;
}

module.exports = forEachRight;

},{"../internals/baseCreateCallback":118,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isString":187,"../objects/keys":189}],79:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of a collection through the callback. The corresponding value
 * of each key is an array of the elements responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * // using "_.pluck" callback shorthand
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
});

module.exports = groupBy;

},{"../internals/createAggregator":131}],80:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/**
 * Creates an object composed of keys generated from the results of running
 * each element of the collection through the given callback. The corresponding
 * value of each key is the last element responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var keys = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.indexBy(keys, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 */
var indexBy = createAggregator(function(result, value, key) {
  result[key] = value;
});

module.exports = indexBy;

},{"../internals/createAggregator":131}],81:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('./forEach'),
    slice = _dereq_('../internals/slice');

/**
 * Invokes the method named by `methodName` on each element in the `collection`
 * returning an array of the results of each invoked method. Additional arguments
 * will be provided to each invoked method. If `methodName` is a function it
 * will be invoked for, and `this` bound to, each element in the `collection`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|string} methodName The name of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [arg] Arguments to invoke the method with.
 * @returns {Array} Returns a new array of the results of each invoked method.
 * @example
 *
 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invoke([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
function invoke(collection, methodName) {
  var args = slice(arguments, 2),
      index = -1,
      isFunc = typeof methodName == 'function',
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
  });
  return result;
}

module.exports = invoke;

},{"../internals/slice":155,"./forEach":77}],82:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Creates an array of values by running each element in the collection
 * through the callback. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of the results of each `callback` execution.
 * @example
 *
 * _.map([1, 2, 3], function(num) { return num * 3; });
 * // => [3, 6, 9]
 *
 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
 * // => [3, 6, 9] (property order is not guaranteed across environments)
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(characters, 'name');
 * // => ['barney', 'fred']
 */
function map(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = createCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    var result = Array(length);
    while (++index < length) {
      result[index] = callback(collection[index], index, collection);
    }
  } else {
    result = [];
    forOwn(collection, function(value, key, collection) {
      result[++index] = callback(value, key, collection);
    });
  }
  return result;
}

module.exports = map;

},{"../functions/createCallback":102,"../objects/forOwn":167}],83:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = _dereq_('../internals/charAtCallback'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/**
 * Retrieves the maximum value of a collection. If the collection is empty or
 * falsey `-Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.max(characters, function(chr) { return chr.age; });
 * // => { 'name': 'fred', 'age': 40 };
 *
 * // using "_.pluck" callback shorthand
 * _.max(characters, 'age');
 * // => { 'name': 'fred', 'age': 40 };
 */
function max(collection, callback, thisArg) {
  var computed = -Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value > result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current > computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = max;

},{"../functions/createCallback":102,"../internals/charAtCallback":129,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isString":187,"./forEach":77}],84:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = _dereq_('../internals/charAtCallback'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/**
 * Retrieves the minimum value of a collection. If the collection is empty or
 * falsey `Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.min(characters, function(chr) { return chr.age; });
 * // => { 'name': 'barney', 'age': 36 };
 *
 * // using "_.pluck" callback shorthand
 * _.min(characters, 'age');
 * // => { 'name': 'barney', 'age': 36 };
 */
function min(collection, callback, thisArg) {
  var computed = Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value < result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current < computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = min;

},{"../functions/createCallback":102,"../internals/charAtCallback":129,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isString":187,"./forEach":77}],85:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var map = _dereq_('./map');

/**
 * Retrieves the value of a specified property from all elements in the collection.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {string} property The name of the property to pluck.
 * @returns {Array} Returns a new array of property values.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.pluck(characters, 'name');
 * // => ['barney', 'fred']
 */
var pluck = map;

module.exports = pluck;

},{"./map":82}],86:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Reduces a collection to a value which is the accumulated result of running
 * each element in the collection through the callback, where each successive
 * callback execution consumes the return value of the previous execution. If
 * `accumulator` is not provided the first element of the collection will be
 * used as the initial `accumulator` value. The callback is bound to `thisArg`
 * and invoked with four arguments; (accumulator, value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var sum = _.reduce([1, 2, 3], function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function reduce(collection, callback, accumulator, thisArg) {
  if (!collection) return accumulator;
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);

  var index = -1,
      length = collection.length;

  if (typeof length == 'number') {
    if (noaccum) {
      accumulator = collection[++index];
    }
    while (++index < length) {
      accumulator = callback(accumulator, collection[index], index, collection);
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      accumulator = noaccum
        ? (noaccum = false, value)
        : callback(accumulator, value, index, collection)
    });
  }
  return accumulator;
}

module.exports = reduce;

},{"../functions/createCallback":102,"../objects/forOwn":167}],87:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forEachRight = _dereq_('./forEachRight');

/**
 * This method is like `_.reduce` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias foldr
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var list = [[0, 1], [2, 3], [4, 5]];
 * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */
function reduceRight(collection, callback, accumulator, thisArg) {
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);
  forEachRight(collection, function(value, index, collection) {
    accumulator = noaccum
      ? (noaccum = false, value)
      : callback(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = reduceRight;

},{"../functions/createCallback":102,"./forEachRight":78}],88:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    filter = _dereq_('./filter');

/**
 * The opposite of `_.filter` this method returns the elements of a
 * collection that the callback does **not** return truey for.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that failed the callback check.
 * @example
 *
 * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [1, 3, 5]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.reject(characters, 'blocked');
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 *
 * // using "_.where" callback shorthand
 * _.reject(characters, { 'age': 36 });
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 */
function reject(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);
  return filter(collection, function(value, index, collection) {
    return !callback(value, index, collection);
  });
}

module.exports = reject;

},{"../functions/createCallback":102,"./filter":74}],89:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom'),
    isString = _dereq_('../objects/isString'),
    shuffle = _dereq_('./shuffle'),
    values = _dereq_('../objects/values');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Retrieves a random element or `n` random elements from a collection.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to sample.
 * @param {number} [n] The number of elements to sample.
 * @param- {Object} [guard] Allows working with functions like `_.map`
 *  without using their `index` arguments as `n`.
 * @returns {Array} Returns the random sample(s) of `collection`.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 *
 * _.sample([1, 2, 3, 4], 2);
 * // => [3, 1]
 */
function sample(collection, n, guard) {
  if (collection && typeof collection.length != 'number') {
    collection = values(collection);
  }
  if (n == null || guard) {
    return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
  }
  var result = shuffle(collection);
  result.length = nativeMin(nativeMax(0, n), result.length);
  return result;
}

module.exports = sample;

},{"../internals/baseRandom":125,"../objects/isString":187,"../objects/values":196,"./shuffle":90}],90:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom'),
    forEach = _dereq_('./forEach');

/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates
 * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to shuffle.
 * @returns {Array} Returns a new shuffled collection.
 * @example
 *
 * _.shuffle([1, 2, 3, 4, 5, 6]);
 * // => [4, 1, 6, 3, 5, 2]
 */
function shuffle(collection) {
  var index = -1,
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    var rand = baseRandom(0, ++index);
    result[index] = result[rand];
    result[rand] = value;
  });
  return result;
}

module.exports = shuffle;

},{"../internals/baseRandom":125,"./forEach":77}],91:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('../objects/keys');

/**
 * Gets the size of the `collection` by returning `collection.length` for arrays
 * and array-like objects or the number of own enumerable properties for objects.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns `collection.length` or number of own enumerable properties.
 * @example
 *
 * _.size([1, 2]);
 * // => 2
 *
 * _.size({ 'one': 1, 'two': 2, 'three': 3 });
 * // => 3
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  var length = collection ? collection.length : 0;
  return typeof length == 'number' ? length : keys(collection).length;
}

module.exports = size;

},{"../objects/keys":189}],92:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray');

/**
 * Checks if the callback returns a truey value for **any** element of a
 * collection. The function returns as soon as it finds a passing value and
 * does not iterate over the entire collection. The callback is bound to
 * `thisArg` and invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias any
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if any element passed the callback check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.some(characters, 'blocked');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.some(characters, { 'age': 1 });
 * // => false
 */
function some(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if ((result = callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return !(result = callback(value, index, collection));
    });
  }
  return !!result;
}

module.exports = some;

},{"../functions/createCallback":102,"../objects/forOwn":167,"../objects/isArray":173}],93:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var compareAscending = _dereq_('../internals/compareAscending'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    getArray = _dereq_('../internals/getArray'),
    getObject = _dereq_('../internals/getObject'),
    isArray = _dereq_('../objects/isArray'),
    map = _dereq_('./map'),
    releaseArray = _dereq_('../internals/releaseArray'),
    releaseObject = _dereq_('../internals/releaseObject');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection through the callback. This method
 * performs a stable sort, that is, it will preserve the original sort order
 * of equal elements. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an array of property names is provided for `callback` the collection
 * will be sorted by each property value.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of sorted elements.
 * @example
 *
 * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
 * // => [3, 1, 2]
 *
 * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
 * // => [3, 1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'barney',  'age': 26 },
 *   { 'name': 'fred',    'age': 30 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(_.sortBy(characters, 'age'), _.values);
 * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
 *
 * // sorting by multiple properties
 * _.map(_.sortBy(characters, ['name', 'age']), _.values);
 * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
 */
function sortBy(collection, callback, thisArg) {
  var index = -1,
      isArr = isArray(callback),
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  if (!isArr) {
    callback = createCallback(callback, thisArg, 3);
  }
  forEach(collection, function(value, key, collection) {
    var object = result[++index] = getObject();
    if (isArr) {
      object.criteria = map(callback, function(key) { return value[key]; });
    } else {
      (object.criteria = getArray())[0] = callback(value, key, collection);
    }
    object.index = index;
    object.value = value;
  });

  length = result.length;
  result.sort(compareAscending);
  while (length--) {
    var object = result[length];
    result[length] = object.value;
    if (!isArr) {
      releaseArray(object.criteria);
    }
    releaseObject(object);
  }
  return result;
}

module.exports = sortBy;

},{"../functions/createCallback":102,"../internals/compareAscending":130,"../internals/getArray":136,"../internals/getObject":137,"../internals/releaseArray":150,"../internals/releaseObject":151,"../objects/isArray":173,"./forEach":77,"./map":82}],94:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = _dereq_('../objects/isString'),
    slice = _dereq_('../internals/slice'),
    values = _dereq_('../objects/values');

/**
 * Converts the `collection` to an array.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to convert.
 * @returns {Array} Returns the new converted array.
 * @example
 *
 * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
 * // => [2, 3, 4]
 */
function toArray(collection) {
  if (collection && typeof collection.length == 'number') {
    return slice(collection);
  }
  return values(collection);
}

module.exports = toArray;

},{"../internals/slice":155,"../objects/isString":187,"../objects/values":196}],95:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var filter = _dereq_('./filter');

/**
 * Performs a deep comparison of each element in a `collection` to the given
 * `properties` object, returning an array of all elements that have equivalent
 * property values.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Object} props The object of property values to filter by.
 * @returns {Array} Returns a new array of elements that have the given properties.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * _.where(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
 *
 * _.where(characters, { 'pets': ['dino'] });
 * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
 */
var where = filter;

module.exports = where;

},{"./filter":74}],96:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'after': _dereq_('./functions/after'),
  'bind': _dereq_('./functions/bind'),
  'bindAll': _dereq_('./functions/bindAll'),
  'bindKey': _dereq_('./functions/bindKey'),
  'compose': _dereq_('./functions/compose'),
  'createCallback': _dereq_('./functions/createCallback'),
  'curry': _dereq_('./functions/curry'),
  'debounce': _dereq_('./functions/debounce'),
  'defer': _dereq_('./functions/defer'),
  'delay': _dereq_('./functions/delay'),
  'memoize': _dereq_('./functions/memoize'),
  'once': _dereq_('./functions/once'),
  'partial': _dereq_('./functions/partial'),
  'partialRight': _dereq_('./functions/partialRight'),
  'throttle': _dereq_('./functions/throttle'),
  'wrap': _dereq_('./functions/wrap')
};

},{"./functions/after":97,"./functions/bind":98,"./functions/bindAll":99,"./functions/bindKey":100,"./functions/compose":101,"./functions/createCallback":102,"./functions/curry":103,"./functions/debounce":104,"./functions/defer":105,"./functions/delay":106,"./functions/memoize":107,"./functions/once":108,"./functions/partial":109,"./functions/partialRight":110,"./functions/throttle":111,"./functions/wrap":112}],97:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that executes `func`, with  the `this` binding and
 * arguments of the created function, only after being called `n` times.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {number} n The number of times the function must be called before
 *  `func` is executed.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('Done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => logs 'Done saving!', after all saves have completed
 */
function after(n, func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

module.exports = after;

},{"../objects/isFunction":180}],98:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;

},{"../internals/createWrapper":133,"../internals/slice":155}],99:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    createWrapper = _dereq_('../internals/createWrapper'),
    functions = _dereq_('../objects/functions');

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method. Method names may be specified as individual arguments or as arrays
 * of method names. If no method names are provided all the function properties
 * of `object` will be bound.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...string} [methodName] The object method names to
 *  bind, specified as individual method names or arrays of method names.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'onClick': function() { console.log('clicked ' + this.label); }
 * };
 *
 * _.bindAll(view);
 * jQuery('#docs').on('click', view.onClick);
 * // => logs 'clicked docs', when the button is clicked
 */
function bindAll(object) {
  var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
      index = -1,
      length = funcs.length;

  while (++index < length) {
    var key = funcs[index];
    object[key] = createWrapper(object[key], 1, null, null, object);
  }
  return object;
}

module.exports = bindAll;

},{"../internals/baseFlatten":121,"../internals/createWrapper":133,"../objects/functions":169}],100:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes the method at `object[key]`
 * and prepends any additional `bindKey` arguments to those provided to the bound
 * function. This method differs from `_.bind` by allowing bound functions to
 * reference methods that will be redefined or don't yet exist.
 * See http://michaux.ca/articles/lazy-function-definition-pattern.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object the method belongs to.
 * @param {string} key The key of the method.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'name': 'fred',
 *   'greet': function(greeting) {
 *     return greeting + ' ' + this.name;
 *   }
 * };
 *
 * var func = _.bindKey(object, 'greet', 'hi');
 * func();
 * // => 'hi fred'
 *
 * object.greet = function(greeting) {
 *   return greeting + 'ya ' + this.name + '!';
 * };
 *
 * func();
 * // => 'hiya fred!'
 */
function bindKey(object, key) {
  return arguments.length > 2
    ? createWrapper(key, 19, slice(arguments, 2), null, object)
    : createWrapper(key, 3, null, null, object);
}

module.exports = bindKey;

},{"../internals/createWrapper":133,"../internals/slice":155}],101:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that is the composition of the provided functions,
 * where each function consumes the return value of the function that follows.
 * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
 * Each function is executed with the `this` binding of the composed function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {...Function} [func] Functions to compose.
 * @returns {Function} Returns the new composed function.
 * @example
 *
 * var realNameMap = {
 *   'pebbles': 'penelope'
 * };
 *
 * var format = function(name) {
 *   name = realNameMap[name.toLowerCase()] || name;
 *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
 * };
 *
 * var greet = function(formatted) {
 *   return 'Hiya ' + formatted + '!';
 * };
 *
 * var welcome = _.compose(greet, format);
 * welcome('pebbles');
 * // => 'Hiya Penelope!'
 */
function compose() {
  var funcs = arguments,
      length = funcs.length;

  while (length--) {
    if (!isFunction(funcs[length])) {
      throw new TypeError;
    }
  }
  return function() {
    var args = arguments,
        length = funcs.length;

    while (length--) {
      args = [funcs[length].apply(this, args)];
    }
    return args[0];
  };
}

module.exports = compose;

},{"../objects/isFunction":180}],102:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseIsEqual = _dereq_('../internals/baseIsEqual'),
    isObject = _dereq_('../objects/isObject'),
    keys = _dereq_('../objects/keys'),
    property = _dereq_('../utilities/property');

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;

},{"../internals/baseCreateCallback":118,"../internals/baseIsEqual":123,"../objects/isObject":184,"../objects/keys":189,"../utilities/property":207}],103:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper');

/**
 * Creates a function which accepts one or more arguments of `func` that when
 * invoked either executes `func` returning its result, if all `func` arguments
 * have been provided, or returns a function that accepts one or more of the
 * remaining `func` arguments, and so on. The arity of `func` can be specified
 * if `func.length` is not sufficient.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var curried = _.curry(function(a, b, c) {
 *   console.log(a + b + c);
 * });
 *
 * curried(1)(2)(3);
 * // => 6
 *
 * curried(1, 2)(3);
 * // => 6
 *
 * curried(1, 2, 3);
 * // => 6
 */
function curry(func, arity) {
  arity = typeof arity == 'number' ? arity : (+arity || func.length);
  return createWrapper(func, 4, null, null, null, arity);
}

module.exports = curry;

},{"../internals/createWrapper":133}],104:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject'),
    now = _dereq_('../utilities/now');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates a function that will delay the execution of `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * Provide an options object to indicate that `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
 * to the debounced function will return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * var lazyLayout = _.debounce(calculateLayout, 150);
 * jQuery(window).on('resize', lazyLayout);
 *
 * // execute `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * });
 *
 * // ensure `batchLog` is executed once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * source.addEventListener('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }, false);
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  wait = nativeMax(0, wait) || 0;
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = options.leading;
    maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  var delayed = function() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0) {
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      var isCalled = trailingCall;
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
      }
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  };

  var maxDelayed = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (trailing || (maxWait !== wait)) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = null;
      }
    }
  };

  return function() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = null;
    }
    return result;
  };
}

module.exports = debounce;

},{"../objects/isFunction":180,"../objects/isObject":184,"../utilities/now":205}],105:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('../internals/slice');

/**
 * Defers executing the `func` function until the current call stack has cleared.
 * Additional arguments will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to defer.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) { console.log(text); }, 'deferred');
 * // logs 'deferred' after one or more milliseconds
 */
function defer(func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 1);
  return setTimeout(function() { func.apply(undefined, args); }, 1);
}

module.exports = defer;

},{"../internals/slice":155,"../objects/isFunction":180}],106:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('../internals/slice');

/**
 * Executes the `func` function after `wait` milliseconds. Additional arguments
 * will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay execution.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) { console.log(text); }, 1000, 'later');
 * // => logs 'later' after one second
 */
function delay(func, wait) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 2);
  return setTimeout(function() { func.apply(undefined, args); }, wait);
}

module.exports = delay;

},{"../internals/slice":155,"../objects/isFunction":180}],107:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    keyPrefix = _dereq_('../internals/keyPrefix');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided it will be used to determine the cache key for storing the result
 * based on the arguments provided to the memoized function. By default, the
 * first argument provided to the memoized function is used as the cache key.
 * The `func` is executed with the `this` binding of the memoized function.
 * The result cache is exposed as the `cache` property on the memoized function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] A function used to resolve the cache key.
 * @returns {Function} Returns the new memoizing function.
 * @example
 *
 * var fibonacci = _.memoize(function(n) {
 *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 * });
 *
 * fibonacci(9)
 * // => 34
 *
 * var data = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // modifying the result cache
 * var get = _.memoize(function(name) { return data[name]; }, _.identity);
 * get('pebbles');
 * // => { 'name': 'pebbles', 'age': 1 }
 *
 * get.cache.pebbles.name = 'penelope';
 * get('pebbles');
 * // => { 'name': 'penelope', 'age': 1 }
 */
function memoize(func, resolver) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var memoized = function() {
    var cache = memoized.cache,
        key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

    return hasOwnProperty.call(cache, key)
      ? cache[key]
      : (cache[key] = func.apply(this, arguments));
  }
  memoized.cache = {};
  return memoized;
}

module.exports = memoize;

},{"../internals/keyPrefix":141,"../objects/isFunction":180}],108:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that is restricted to execute `func` once. Repeat calls to
 * the function will return the value of the first call. The `func` is executed
 * with the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` executes `createApplication` once
 */
function once(func) {
  var ran,
      result;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (ran) {
      return result;
    }
    ran = true;
    result = func.apply(this, arguments);

    // clear the `func` variable so the function may be garbage collected
    func = null;
    return result;
  };
}

module.exports = once;

},{"../objects/isFunction":180}],109:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with any additional
 * `partial` arguments prepended to those provided to the new function. This
 * method is similar to `_.bind` except it does **not** alter the `this` binding.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var greet = function(greeting, name) { return greeting + ' ' + name; };
 * var hi = _.partial(greet, 'hi');
 * hi('fred');
 * // => 'hi fred'
 */
function partial(func) {
  return createWrapper(func, 16, slice(arguments, 1));
}

module.exports = partial;

},{"../internals/createWrapper":133,"../internals/slice":155}],110:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * This method is like `_.partial` except that `partial` arguments are
 * appended to those provided to the new function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var defaultsDeep = _.partialRight(_.merge, _.defaults);
 *
 * var options = {
 *   'variable': 'data',
 *   'imports': { 'jq': $ }
 * };
 *
 * defaultsDeep(options, _.templateSettings);
 *
 * options.variable
 * // => 'data'
 *
 * options.imports
 * // => { '_': _, 'jq': $ }
 */
function partialRight(func) {
  return createWrapper(func, 32, null, slice(arguments, 1));
}

module.exports = partialRight;

},{"../internals/createWrapper":133,"../internals/slice":155}],111:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var debounce = _dereq_('./debounce'),
    isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject');

/** Used as an internal `_.debounce` options object */
var debounceOptions = {
  'leading': false,
  'maxWait': 0,
  'trailing': false
};

/**
 * Creates a function that, when executed, will only call the `func` function
 * at most once per every `wait` milliseconds. Provide an options object to
 * indicate that `func` should be invoked on the leading and/or trailing edge
 * of the `wait` timeout. Subsequent calls to the throttled function will
 * return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to throttle.
 * @param {number} wait The number of milliseconds to throttle executions to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * var throttled = _.throttle(updatePosition, 100);
 * jQuery(window).on('scroll', throttled);
 *
 * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? options.leading : leading;
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  debounceOptions.leading = leading;
  debounceOptions.maxWait = wait;
  debounceOptions.trailing = trailing;

  return debounce(func, wait, debounceOptions);
}

module.exports = throttle;

},{"../objects/isFunction":180,"../objects/isObject":184,"./debounce":104}],112:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper');

/**
 * Creates a function that provides `value` to the wrapper function as its
 * first argument. Additional arguments provided to the function are appended
 * to those provided to the wrapper function. The wrapper is executed with
 * the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {*} value The value to wrap.
 * @param {Function} wrapper The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('Fred, Wilma, & Pebbles');
 * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
 */
function wrap(value, wrapper) {
  return createWrapper(wrapper, 16, [value]);
}

module.exports = wrap;

},{"../internals/createWrapper":133}],113:[function(_dereq_,module,exports){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrays = _dereq_('./arrays'),
    chaining = _dereq_('./chaining'),
    collections = _dereq_('./collections'),
    functions = _dereq_('./functions'),
    objects = _dereq_('./objects'),
    utilities = _dereq_('./utilities'),
    forEach = _dereq_('./collections/forEach'),
    forOwn = _dereq_('./objects/forOwn'),
    isArray = _dereq_('./objects/isArray'),
    lodashWrapper = _dereq_('./internals/lodashWrapper'),
    mixin = _dereq_('./utilities/mixin'),
    support = _dereq_('./support'),
    templateSettings = _dereq_('./utilities/templateSettings');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps the given value to enable intuitive
 * method chaining.
 *
 * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
 * and `unshift`
 *
 * Chaining is supported in custom builds as long as the `value` method is
 * implicitly or explicitly included in the build.
 *
 * The chainable wrapper functions are:
 * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
 * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
 * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
 * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
 * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
 * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
 * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
 * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
 * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
 * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
 * and `zip`
 *
 * The non-chainable wrapper functions are:
 * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
 * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
 * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
 * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
 * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
 * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
 * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
 * `template`, `unescape`, `uniqueId`, and `value`
 *
 * The wrapper functions `first` and `last` return wrapped values when `n` is
 * provided, otherwise they return unwrapped values.
 *
 * Explicit chaining can be enabled by using the `_.chain` method.
 *
 * @name _
 * @constructor
 * @category Chaining
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns a `lodash` instance.
 * @example
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // returns an unwrapped value
 * wrapped.reduce(function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * // returns a wrapped value
 * var squares = wrapped.map(function(num) {
 *   return num * num;
 * });
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
  return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
   ? value
   : new lodashWrapper(value);
}
// ensure `new lodashWrapper` is an instance of `lodash`
lodashWrapper.prototype = lodash.prototype;

// wrap `_.mixin` so it works when provided only one argument
mixin = (function(fn) {
  var functions = objects.functions;
  return function(object, source, options) {
    if (!source || (!options && !functions(source).length)) {
      if (options == null) {
        options = source;
      }
      source = object;
      object = lodash;
    }
    return fn(object, source, options);
  };
}(mixin));

// add functions that return wrapped values when chaining
lodash.after = functions.after;
lodash.assign = objects.assign;
lodash.at = collections.at;
lodash.bind = functions.bind;
lodash.bindAll = functions.bindAll;
lodash.bindKey = functions.bindKey;
lodash.chain = chaining.chain;
lodash.compact = arrays.compact;
lodash.compose = functions.compose;
lodash.constant = utilities.constant;
lodash.countBy = collections.countBy;
lodash.create = objects.create;
lodash.createCallback = functions.createCallback;
lodash.curry = functions.curry;
lodash.debounce = functions.debounce;
lodash.defaults = objects.defaults;
lodash.defer = functions.defer;
lodash.delay = functions.delay;
lodash.difference = arrays.difference;
lodash.filter = collections.filter;
lodash.flatten = arrays.flatten;
lodash.forEach = forEach;
lodash.forEachRight = collections.forEachRight;
lodash.forIn = objects.forIn;
lodash.forInRight = objects.forInRight;
lodash.forOwn = forOwn;
lodash.forOwnRight = objects.forOwnRight;
lodash.functions = objects.functions;
lodash.groupBy = collections.groupBy;
lodash.indexBy = collections.indexBy;
lodash.initial = arrays.initial;
lodash.intersection = arrays.intersection;
lodash.invert = objects.invert;
lodash.invoke = collections.invoke;
lodash.keys = objects.keys;
lodash.map = collections.map;
lodash.mapValues = objects.mapValues;
lodash.max = collections.max;
lodash.memoize = functions.memoize;
lodash.merge = objects.merge;
lodash.min = collections.min;
lodash.omit = objects.omit;
lodash.once = functions.once;
lodash.pairs = objects.pairs;
lodash.partial = functions.partial;
lodash.partialRight = functions.partialRight;
lodash.pick = objects.pick;
lodash.pluck = collections.pluck;
lodash.property = utilities.property;
lodash.pull = arrays.pull;
lodash.range = arrays.range;
lodash.reject = collections.reject;
lodash.remove = arrays.remove;
lodash.rest = arrays.rest;
lodash.shuffle = collections.shuffle;
lodash.sortBy = collections.sortBy;
lodash.tap = chaining.tap;
lodash.throttle = functions.throttle;
lodash.times = utilities.times;
lodash.toArray = collections.toArray;
lodash.transform = objects.transform;
lodash.union = arrays.union;
lodash.uniq = arrays.uniq;
lodash.values = objects.values;
lodash.where = collections.where;
lodash.without = arrays.without;
lodash.wrap = functions.wrap;
lodash.xor = arrays.xor;
lodash.zip = arrays.zip;
lodash.zipObject = arrays.zipObject;

// add aliases
lodash.collect = collections.map;
lodash.drop = arrays.rest;
lodash.each = forEach;
lodash.eachRight = collections.forEachRight;
lodash.extend = objects.assign;
lodash.methods = objects.functions;
lodash.object = arrays.zipObject;
lodash.select = collections.filter;
lodash.tail = arrays.rest;
lodash.unique = arrays.uniq;
lodash.unzip = arrays.zip;

// add functions to `lodash.prototype`
mixin(lodash);

// add functions that return unwrapped values when chaining
lodash.clone = objects.clone;
lodash.cloneDeep = objects.cloneDeep;
lodash.contains = collections.contains;
lodash.escape = utilities.escape;
lodash.every = collections.every;
lodash.find = collections.find;
lodash.findIndex = arrays.findIndex;
lodash.findKey = objects.findKey;
lodash.findLast = collections.findLast;
lodash.findLastIndex = arrays.findLastIndex;
lodash.findLastKey = objects.findLastKey;
lodash.has = objects.has;
lodash.identity = utilities.identity;
lodash.indexOf = arrays.indexOf;
lodash.isArguments = objects.isArguments;
lodash.isArray = isArray;
lodash.isBoolean = objects.isBoolean;
lodash.isDate = objects.isDate;
lodash.isElement = objects.isElement;
lodash.isEmpty = objects.isEmpty;
lodash.isEqual = objects.isEqual;
lodash.isFinite = objects.isFinite;
lodash.isFunction = objects.isFunction;
lodash.isNaN = objects.isNaN;
lodash.isNull = objects.isNull;
lodash.isNumber = objects.isNumber;
lodash.isObject = objects.isObject;
lodash.isPlainObject = objects.isPlainObject;
lodash.isRegExp = objects.isRegExp;
lodash.isString = objects.isString;
lodash.isUndefined = objects.isUndefined;
lodash.lastIndexOf = arrays.lastIndexOf;
lodash.mixin = mixin;
lodash.noConflict = utilities.noConflict;
lodash.noop = utilities.noop;
lodash.now = utilities.now;
lodash.parseInt = utilities.parseInt;
lodash.random = utilities.random;
lodash.reduce = collections.reduce;
lodash.reduceRight = collections.reduceRight;
lodash.result = utilities.result;
lodash.size = collections.size;
lodash.some = collections.some;
lodash.sortedIndex = arrays.sortedIndex;
lodash.template = utilities.template;
lodash.unescape = utilities.unescape;
lodash.uniqueId = utilities.uniqueId;

// add aliases
lodash.all = collections.every;
lodash.any = collections.some;
lodash.detect = collections.find;
lodash.findWhere = collections.find;
lodash.foldl = collections.reduce;
lodash.foldr = collections.reduceRight;
lodash.include = collections.contains;
lodash.inject = collections.reduce;

mixin(function() {
  var source = {}
  forOwn(lodash, function(func, methodName) {
    if (!lodash.prototype[methodName]) {
      source[methodName] = func;
    }
  });
  return source;
}(), false);

// add functions capable of returning wrapped and unwrapped values when chaining
lodash.first = arrays.first;
lodash.last = arrays.last;
lodash.sample = collections.sample;

// add aliases
lodash.take = arrays.first;
lodash.head = arrays.first;

forOwn(lodash, function(func, methodName) {
  var callbackable = methodName !== 'sample';
  if (!lodash.prototype[methodName]) {
    lodash.prototype[methodName]= function(n, guard) {
      var chainAll = this.__chain__,
          result = func(this.__wrapped__, n, guard);

      return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
        ? result
        : new lodashWrapper(result, chainAll);
    };
  }
});

/**
 * The semantic version number.
 *
 * @static
 * @memberOf _
 * @type string
 */
lodash.VERSION = '2.4.1';

// add "Chaining" functions to the wrapper
lodash.prototype.chain = chaining.wrapperChain;
lodash.prototype.toString = chaining.wrapperToString;
lodash.prototype.value = chaining.wrapperValueOf;
lodash.prototype.valueOf = chaining.wrapperValueOf;

// add `Array` functions that return unwrapped values
forEach(['join', 'pop', 'shift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    var chainAll = this.__chain__,
        result = func.apply(this.__wrapped__, arguments);

    return chainAll
      ? new lodashWrapper(result, chainAll)
      : result;
  };
});

// add `Array` functions that return the existing wrapped value
forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    func.apply(this.__wrapped__, arguments);
    return this;
  };
});

// add `Array` functions that return new wrapped values
forEach(['concat', 'slice', 'splice'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
  };
});

lodash.support = support;
(lodash.templateSettings = utilities.templateSettings).imports._ = lodash;
module.exports = lodash;

},{"./arrays":40,"./chaining":63,"./collections":69,"./collections/forEach":77,"./functions":96,"./internals/lodashWrapper":143,"./objects":157,"./objects/forOwn":167,"./objects/isArray":173,"./support":197,"./utilities":198,"./utilities/mixin":202,"./utilities/templateSettings":211}],114:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;

},{}],115:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('./baseCreate'),
    isObject = _dereq_('../objects/isObject'),
    setBindData = _dereq_('./setBindData'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"../objects/isObject":184,"./baseCreate":117,"./setBindData":152,"./slice":155}],116:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = _dereq_('../objects/assign'),
    forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    getArray = _dereq_('./getArray'),
    isArray = _dereq_('../objects/isArray'),
    isObject = _dereq_('../objects/isObject'),
    releaseArray = _dereq_('./releaseArray'),
    slice = _dereq_('./slice');

/** Used to match regexp flags from their coerced string values */
var reFlags = /\w*$/;

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used to identify object classifications that `_.clone` supports */
var cloneableClasses = {};
cloneableClasses[funcClass] = false;
cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
cloneableClasses[boolClass] = cloneableClasses[dateClass] =
cloneableClasses[numberClass] = cloneableClasses[objectClass] =
cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to lookup a built-in constructor by [[Class]] */
var ctorByClass = {};
ctorByClass[arrayClass] = Array;
ctorByClass[boolClass] = Boolean;
ctorByClass[dateClass] = Date;
ctorByClass[funcClass] = Function;
ctorByClass[objectClass] = Object;
ctorByClass[numberClass] = Number;
ctorByClass[regexpClass] = RegExp;
ctorByClass[stringClass] = String;

/**
 * The base implementation of `_.clone` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, callback, stackA, stackB) {
  if (callback) {
    var result = callback(value);
    if (typeof result != 'undefined') {
      return result;
    }
  }
  // inspect [[Class]]
  var isObj = isObject(value);
  if (isObj) {
    var className = toString.call(value);
    if (!cloneableClasses[className]) {
      return value;
    }
    var ctor = ctorByClass[className];
    switch (className) {
      case boolClass:
      case dateClass:
        return new ctor(+value);

      case numberClass:
      case stringClass:
        return new ctor(value);

      case regexpClass:
        result = ctor(value.source, reFlags.exec(value));
        result.lastIndex = value.lastIndex;
        return result;
    }
  } else {
    return value;
  }
  var isArr = isArray(value);
  if (isDeep) {
    // check for circular references and return corresponding clone
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    result = isArr ? ctor(value.length) : {};
  }
  else {
    result = isArr ? slice(value) : assign({}, value);
  }
  // add array properties assigned by `RegExp#exec`
  if (isArr) {
    if (hasOwnProperty.call(value, 'index')) {
      result.index = value.index;
    }
    if (hasOwnProperty.call(value, 'input')) {
      result.input = value.input;
    }
  }
  // exit for shallow clone
  if (!isDeep) {
    return result;
  }
  // add the source value to the stack of traversed objects
  // and associate it with its clone
  stackA.push(value);
  stackB.push(result);

  // recursively populate clone (susceptible to call stack limits)
  (isArr ? forEach : forOwn)(value, function(objValue, key) {
    result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
  });

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseClone;

},{"../collections/forEach":77,"../objects/assign":158,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isObject":184,"./getArray":136,"./releaseArray":150,"./slice":155}],117:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./isNative'),
    isObject = _dereq_('../objects/isObject'),
    noop = _dereq_('../utilities/noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isObject":184,"../utilities/noop":204,"./isNative":140}],118:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = _dereq_('../functions/bind'),
    identity = _dereq_('../utilities/identity'),
    setBindData = _dereq_('./setBindData'),
    support = _dereq_('../support');

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;

},{"../functions/bind":98,"../support":197,"../utilities/identity":201,"./setBindData":152}],119:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('./baseCreate'),
    isObject = _dereq_('../objects/isObject'),
    setBindData = _dereq_('./setBindData'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"../objects/isObject":184,"./baseCreate":117,"./setBindData":152,"./slice":155}],120:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    cacheIndexOf = _dereq_('./cacheIndexOf'),
    createCache = _dereq_('./createCache'),
    largeArraySize = _dereq_('./largeArraySize'),
    releaseObject = _dereq_('./releaseObject');

/**
 * The base implementation of `_.difference` that accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {Array} [values] The array of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 */
function baseDifference(array, values) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      isLarge = length >= largeArraySize,
      result = [];

  if (isLarge) {
    var cache = createCache(values);
    if (cache) {
      indexOf = cacheIndexOf;
      values = cache;
    } else {
      isLarge = false;
    }
  }
  while (++index < length) {
    var value = array[index];
    if (indexOf(values, value) < 0) {
      result.push(value);
    }
  }
  if (isLarge) {
    releaseObject(values);
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":122,"./cacheIndexOf":127,"./createCache":132,"./largeArraySize":142,"./releaseObject":151}],121:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray');

/**
 * The base implementation of `_.flatten` without support for callback
 * shorthands or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
 * @param {number} [fromIndex=0] The index to start from.
 * @returns {Array} Returns a new flattened array.
 */
function baseFlatten(array, isShallow, isStrict, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value && typeof value == 'object' && typeof value.length == 'number'
        && (isArray(value) || isArguments(value))) {
      // recursively flatten arrays (susceptible to call stack limits)
      if (!isShallow) {
        value = baseFlatten(value, isShallow, isStrict);
      }
      var valIndex = -1,
          valLength = value.length,
          resIndex = result.length;

      result.length += valLength;
      while (++valIndex < valLength) {
        result[resIndex++] = value[valIndex];
      }
    } else if (!isStrict) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../objects/isArguments":172,"../objects/isArray":173}],122:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches
 * or `fromIndex` constraints.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],123:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('../objects/forIn'),
    getArray = _dereq_('./getArray'),
    isFunction = _dereq_('../objects/isFunction'),
    objectTypes = _dereq_('./objectTypes'),
    releaseArray = _dereq_('./releaseArray');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;

},{"../objects/forIn":165,"../objects/isFunction":180,"./getArray":136,"./objectTypes":146,"./releaseArray":150}],124:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isPlainObject = _dereq_('../objects/isPlainObject');

/**
 * The base implementation of `_.merge` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 */
function baseMerge(object, source, callback, stackA, stackB) {
  (isArray(source) ? forEach : forOwn)(source, function(source, key) {
    var found,
        isArr,
        result = source,
        value = object[key];

    if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
      // avoid merging previously merged cyclic sources
      var stackLength = stackA.length;
      while (stackLength--) {
        if ((found = stackA[stackLength] == source)) {
          value = stackB[stackLength];
          break;
        }
      }
      if (!found) {
        var isShallow;
        if (callback) {
          result = callback(value, source);
          if ((isShallow = typeof result != 'undefined')) {
            value = result;
          }
        }
        if (!isShallow) {
          value = isArr
            ? (isArray(value) ? value : [])
            : (isPlainObject(value) ? value : {});
        }
        // add `source` and associated `value` to the stack of traversed objects
        stackA.push(source);
        stackB.push(value);

        // recursively merge objects and arrays (susceptible to call stack limits)
        if (!isShallow) {
          baseMerge(value, source, callback, stackA, stackB);
        }
      }
    }
    else {
      if (callback) {
        result = callback(value, source);
        if (typeof result == 'undefined') {
          result = source;
        }
      }
      if (typeof result != 'undefined') {
        value = result;
      }
    }
    object[key] = value;
  });
}

module.exports = baseMerge;

},{"../collections/forEach":77,"../objects/forOwn":167,"../objects/isArray":173,"../objects/isPlainObject":185}],125:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var floor = Math.floor;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without argument juggling or support
 * for returning floating-point numbers.
 *
 * @private
 * @param {number} min The minimum possible value.
 * @param {number} max The maximum possible value.
 * @returns {number} Returns a random number.
 */
function baseRandom(min, max) {
  return min + floor(nativeRandom() * (max - min + 1));
}

module.exports = baseRandom;

},{}],126:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    cacheIndexOf = _dereq_('./cacheIndexOf'),
    createCache = _dereq_('./createCache'),
    getArray = _dereq_('./getArray'),
    largeArraySize = _dereq_('./largeArraySize'),
    releaseArray = _dereq_('./releaseArray'),
    releaseObject = _dereq_('./releaseObject');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function} [callback] The function called per iteration.
 * @returns {Array} Returns a duplicate-value-free array.
 */
function baseUniq(array, isSorted, callback) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      result = [];

  var isLarge = !isSorted && length >= largeArraySize,
      seen = (callback || isLarge) ? getArray() : result;

  if (isLarge) {
    var cache = createCache(seen);
    indexOf = cacheIndexOf;
    seen = cache;
  }
  while (++index < length) {
    var value = array[index],
        computed = callback ? callback(value, index, array) : value;

    if (isSorted
          ? !index || seen[seen.length - 1] !== computed
          : indexOf(seen, computed) < 0
        ) {
      if (callback || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  if (isLarge) {
    releaseArray(seen.array);
    releaseObject(seen);
  } else if (callback) {
    releaseArray(seen);
  }
  return result;
}

module.exports = baseUniq;

},{"./baseIndexOf":122,"./cacheIndexOf":127,"./createCache":132,"./getArray":136,"./largeArraySize":142,"./releaseArray":150,"./releaseObject":151}],127:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    keyPrefix = _dereq_('./keyPrefix');

/**
 * An implementation of `_.contains` for cache objects that mimics the return
 * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache object to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var type = typeof value;
  cache = cache.cache;

  if (type == 'boolean' || value == null) {
    return cache[value] ? 0 : -1;
  }
  if (type != 'number' && type != 'string') {
    type = 'object';
  }
  var key = type == 'number' ? value : keyPrefix + value;
  cache = (cache = cache[type]) && cache[key];

  return type == 'object'
    ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
    : (cache ? 0 : -1);
}

module.exports = cacheIndexOf;

},{"./baseIndexOf":122,"./keyPrefix":141}],128:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keyPrefix = _dereq_('./keyPrefix');

/**
 * Adds a given value to the corresponding cache object.
 *
 * @private
 * @param {*} value The value to add to the cache.
 */
function cachePush(value) {
  var cache = this.cache,
      type = typeof value;

  if (type == 'boolean' || value == null) {
    cache[value] = true;
  } else {
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value,
        typeCache = cache[type] || (cache[type] = {});

    if (type == 'object') {
      (typeCache[key] || (typeCache[key] = [])).push(value);
    } else {
      typeCache[key] = true;
    }
  }
}

module.exports = cachePush;

},{"./keyPrefix":141}],129:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `_.max` and `_.min` as the default callback when a given
 * collection is a string value.
 *
 * @private
 * @param {string} value The character to inspect.
 * @returns {number} Returns the code unit of given character.
 */
function charAtCallback(value) {
  return value.charCodeAt(0);
}

module.exports = charAtCallback;

},{}],130:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `sortBy` to compare transformed `collection` elements, stable sorting
 * them in ascending order.
 *
 * @private
 * @param {Object} a The object to compare to `b`.
 * @param {Object} b The object to compare to `a`.
 * @returns {number} Returns the sort order indicator of `1` or `-1`.
 */
function compareAscending(a, b) {
  var ac = a.criteria,
      bc = b.criteria,
      index = -1,
      length = ac.length;

  while (++index < length) {
    var value = ac[index],
        other = bc[index];

    if (value !== other) {
      if (value > other || typeof value == 'undefined') {
        return 1;
      }
      if (value < other || typeof other == 'undefined') {
        return -1;
      }
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to return the same value for
  // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
  //
  // This also ensures a stable sort in V8 and other engines.
  // See http://code.google.com/p/v8/issues/detail?id=90
  return a.index - b.index;
}

module.exports = compareAscending;

},{}],131:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray');

/**
 * Creates a function that aggregates a collection, creating an object composed
 * of keys generated from the results of running each element of the collection
 * through a callback. The given `setter` function sets the keys and values
 * of the composed object.
 *
 * @private
 * @param {Function} setter The setter function.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter) {
  return function(collection, callback, thisArg) {
    var result = {};
    callback = createCallback(callback, thisArg, 3);

    var index = -1,
        length = collection ? collection.length : 0;

    if (typeof length == 'number') {
      while (++index < length) {
        var value = collection[index];
        setter(result, value, callback(value, index, collection), collection);
      }
    } else {
      forOwn(collection, function(value, key, collection) {
        setter(result, value, callback(value, key, collection), collection);
      });
    }
    return result;
  };
}

module.exports = createAggregator;

},{"../functions/createCallback":102,"../objects/forOwn":167,"../objects/isArray":173}],132:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var cachePush = _dereq_('./cachePush'),
    getObject = _dereq_('./getObject'),
    releaseObject = _dereq_('./releaseObject');

/**
 * Creates a cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [array=[]] The array to search.
 * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
 */
function createCache(array) {
  var index = -1,
      length = array.length,
      first = array[0],
      mid = array[(length / 2) | 0],
      last = array[length - 1];

  if (first && typeof first == 'object' &&
      mid && typeof mid == 'object' && last && typeof last == 'object') {
    return false;
  }
  var cache = getObject();
  cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

  var result = getObject();
  result.array = array;
  result.cache = cache;
  result.push = cachePush;

  while (++index < length) {
    result.push(array[index]);
  }
  return result;
}

module.exports = createCache;

},{"./cachePush":128,"./getObject":137,"./releaseObject":151}],133:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = _dereq_('./baseBind'),
    baseCreateWrapper = _dereq_('./baseCreateWrapper'),
    isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"../objects/isFunction":180,"./baseBind":115,"./baseCreateWrapper":119,"./slice":155}],134:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes');

/**
 * Used by `escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(match) {
  return htmlEscapes[match];
}

module.exports = escapeHtmlChar;

},{"./htmlEscapes":138}],135:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to escape characters for inclusion in compiled string literals */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `template` to escape characters for inclusion in compiled
 * string literals.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

module.exports = escapeStringChar;

},{}],136:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = _dereq_('./arrayPool');

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;

},{"./arrayPool":114}],137:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectPool = _dereq_('./objectPool');

/**
 * Gets an object from the object pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Object} The object from the pool.
 */
function getObject() {
  return objectPool.pop() || {
    'array': null,
    'cache': null,
    'criteria': null,
    'false': false,
    'index': 0,
    'null': false,
    'number': null,
    'object': null,
    'push': null,
    'string': null,
    'true': false,
    'undefined': false,
    'value': null
  };
}

module.exports = getObject;

},{"./objectPool":145}],138:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used to convert characters to HTML entities:
 *
 * Though the `>` character is escaped for symmetry, characters like `>` and `/`
 * don't require escaping in HTML and have no special meaning unless they're part
 * of a tag or an unquoted attribute value.
 * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
 */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

module.exports = htmlEscapes;

},{}],139:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes'),
    invert = _dereq_('../objects/invert');

/** Used to convert HTML entities to characters */
var htmlUnescapes = invert(htmlEscapes);

module.exports = htmlUnescapes;

},{"../objects/invert":171,"./htmlEscapes":138}],140:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],141:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
var keyPrefix = +new Date + '';

module.exports = keyPrefix;

},{}],142:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the size when optimizations are enabled for large arrays */
var largeArraySize = 75;

module.exports = largeArraySize;

},{}],143:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A fast path for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap in a `lodash` instance.
 * @param {boolean} chainAll A flag to enable chaining for all methods
 * @returns {Object} Returns a `lodash` instance.
 */
function lodashWrapper(value, chainAll) {
  this.__chain__ = !!chainAll;
  this.__wrapped__ = value;
}

module.exports = lodashWrapper;

},{}],144:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;

},{}],145:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var objectPool = [];

module.exports = objectPool;

},{}],146:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],147:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = _dereq_('./htmlUnescapes'),
    keys = _dereq_('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g');

module.exports = reEscapedHtml;

},{"../objects/keys":189,"./htmlUnescapes":139}],148:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to match "interpolate" template delimiters */
var reInterpolate = /<%=([\s\S]+?)%>/g;

module.exports = reInterpolate;

},{}],149:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes'),
    keys = _dereq_('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

module.exports = reUnescapedHtml;

},{"../objects/keys":189,"./htmlEscapes":138}],150:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = _dereq_('./arrayPool'),
    maxPoolSize = _dereq_('./maxPoolSize');

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;

},{"./arrayPool":114,"./maxPoolSize":144}],151:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var maxPoolSize = _dereq_('./maxPoolSize'),
    objectPool = _dereq_('./objectPool');

/**
 * Releases the given object back to the object pool.
 *
 * @private
 * @param {Object} [object] The object to release.
 */
function releaseObject(object) {
  var cache = object.cache;
  if (cache) {
    releaseObject(cache);
  }
  object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
  if (objectPool.length < maxPoolSize) {
    objectPool.push(object);
  }
}

module.exports = releaseObject;

},{"./maxPoolSize":144,"./objectPool":145}],152:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./isNative'),
    noop = _dereq_('../utilities/noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"../utilities/noop":204,"./isNative":140}],153:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('../objects/forIn'),
    isFunction = _dereq_('../objects/isFunction');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `isPlainObject` which checks if a given value
 * is an object created by the `Object` constructor, assuming objects created
 * by the `Object` constructor have no inherited enumerable properties and that
 * there are no `Object.prototype` extensions.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 */
function shimIsPlainObject(value) {
  var ctor,
      result;

  // avoid non Object objects, `arguments` objects, and DOM elements
  if (!(value && toString.call(value) == objectClass) ||
      (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
    return false;
  }
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  forIn(value, function(value, key) {
    result = key;
  });
  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
}

module.exports = shimIsPlainObject;

},{"../objects/forIn":165,"../objects/isFunction":180}],154:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = _dereq_('./objectTypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"./objectTypes":146}],155:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],156:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = _dereq_('./htmlUnescapes');

/**
 * Used by `unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} match The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(match) {
  return htmlUnescapes[match];
}

module.exports = unescapeHtmlChar;

},{"./htmlUnescapes":139}],157:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'assign': _dereq_('./objects/assign'),
  'clone': _dereq_('./objects/clone'),
  'cloneDeep': _dereq_('./objects/cloneDeep'),
  'create': _dereq_('./objects/create'),
  'defaults': _dereq_('./objects/defaults'),
  'extend': _dereq_('./objects/assign'),
  'findKey': _dereq_('./objects/findKey'),
  'findLastKey': _dereq_('./objects/findLastKey'),
  'forIn': _dereq_('./objects/forIn'),
  'forInRight': _dereq_('./objects/forInRight'),
  'forOwn': _dereq_('./objects/forOwn'),
  'forOwnRight': _dereq_('./objects/forOwnRight'),
  'functions': _dereq_('./objects/functions'),
  'has': _dereq_('./objects/has'),
  'invert': _dereq_('./objects/invert'),
  'isArguments': _dereq_('./objects/isArguments'),
  'isArray': _dereq_('./objects/isArray'),
  'isBoolean': _dereq_('./objects/isBoolean'),
  'isDate': _dereq_('./objects/isDate'),
  'isElement': _dereq_('./objects/isElement'),
  'isEmpty': _dereq_('./objects/isEmpty'),
  'isEqual': _dereq_('./objects/isEqual'),
  'isFinite': _dereq_('./objects/isFinite'),
  'isFunction': _dereq_('./objects/isFunction'),
  'isNaN': _dereq_('./objects/isNaN'),
  'isNull': _dereq_('./objects/isNull'),
  'isNumber': _dereq_('./objects/isNumber'),
  'isObject': _dereq_('./objects/isObject'),
  'isPlainObject': _dereq_('./objects/isPlainObject'),
  'isRegExp': _dereq_('./objects/isRegExp'),
  'isString': _dereq_('./objects/isString'),
  'isUndefined': _dereq_('./objects/isUndefined'),
  'keys': _dereq_('./objects/keys'),
  'mapValues': _dereq_('./objects/mapValues'),
  'merge': _dereq_('./objects/merge'),
  'methods': _dereq_('./objects/functions'),
  'omit': _dereq_('./objects/omit'),
  'pairs': _dereq_('./objects/pairs'),
  'pick': _dereq_('./objects/pick'),
  'transform': _dereq_('./objects/transform'),
  'values': _dereq_('./objects/values')
};

},{"./objects/assign":158,"./objects/clone":159,"./objects/cloneDeep":160,"./objects/create":161,"./objects/defaults":162,"./objects/findKey":163,"./objects/findLastKey":164,"./objects/forIn":165,"./objects/forInRight":166,"./objects/forOwn":167,"./objects/forOwnRight":168,"./objects/functions":169,"./objects/has":170,"./objects/invert":171,"./objects/isArguments":172,"./objects/isArray":173,"./objects/isBoolean":174,"./objects/isDate":175,"./objects/isElement":176,"./objects/isEmpty":177,"./objects/isEqual":178,"./objects/isFinite":179,"./objects/isFunction":180,"./objects/isNaN":181,"./objects/isNull":182,"./objects/isNumber":183,"./objects/isObject":184,"./objects/isPlainObject":185,"./objects/isRegExp":186,"./objects/isString":187,"./objects/isUndefined":188,"./objects/keys":189,"./objects/mapValues":190,"./objects/merge":191,"./objects/omit":192,"./objects/pairs":193,"./objects/pick":194,"./objects/transform":195,"./objects/values":196}],158:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources will overwrite property assignments of previous
 * sources. If a callback is provided it will be executed to produce the
 * assigned values. The callback is bound to `thisArg` and invoked with two
 * arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @type Function
 * @alias extend
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
 * // => { 'name': 'fred', 'employer': 'slate' }
 *
 * var defaults = _.partialRight(_.assign, function(a, b) {
 *   return typeof a == 'undefined' ? b : a;
 * });
 *
 * var object = { 'name': 'barney' };
 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var assign = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
    callback = args[--argsLength];
  }
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
    }
    }
  }
  return result
};

module.exports = assign;

},{"../internals/baseCreateCallback":118,"../internals/objectTypes":146,"./keys":189}],159:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = _dereq_('../internals/baseClone'),
    baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
 * be cloned, otherwise they will be assigned by reference. If a callback
 * is provided it will be executed to produce the cloned values. If the
 * callback returns `undefined` cloning will be handled by the method instead.
 * The callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var shallow = _.clone(characters);
 * shallow[0] === characters[0];
 * // => true
 *
 * var deep = _.clone(characters, true);
 * deep[0] === characters[0];
 * // => false
 *
 * _.mixin({
 *   'clone': _.partialRight(_.clone, function(value) {
 *     return _.isElement(value) ? value.cloneNode(false) : undefined;
 *   })
 * });
 *
 * var clone = _.clone(document.body);
 * clone.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, callback, thisArg) {
  // allows working with "Collections" methods without using their `index`
  // and `collection` arguments for `isDeep` and `callback`
  if (typeof isDeep != 'boolean' && isDeep != null) {
    thisArg = callback;
    callback = isDeep;
    isDeep = false;
  }
  return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = clone;

},{"../internals/baseClone":116,"../internals/baseCreateCallback":118}],160:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = _dereq_('../internals/baseClone'),
    baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Creates a deep clone of `value`. If a callback is provided it will be
 * executed to produce the cloned values. If the callback returns `undefined`
 * cloning will be handled by the method instead. The callback is bound to
 * `thisArg` and invoked with one argument; (value).
 *
 * Note: This method is loosely based on the structured clone algorithm. Functions
 * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
 * objects created by constructors other than `Object` are cloned to plain `Object` objects.
 * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var deep = _.cloneDeep(characters);
 * deep[0] === characters[0];
 * // => false
 *
 * var view = {
 *   'label': 'docs',
 *   'node': element
 * };
 *
 * var clone = _.cloneDeep(view, function(value) {
 *   return _.isElement(value) ? value.cloneNode(true) : undefined;
 * });
 *
 * clone.node == view.node;
 * // => false
 */
function cloneDeep(value, callback, thisArg) {
  return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = cloneDeep;

},{"../internals/baseClone":116,"../internals/baseCreateCallback":118}],161:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = _dereq_('./assign'),
    baseCreate = _dereq_('../internals/baseCreate');

/**
 * Creates an object that inherits from the given `prototype` object. If a
 * `properties` object is provided its own enumerable properties are assigned
 * to the created object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? assign(result, properties) : result;
}

module.exports = create;

},{"../internals/baseCreate":117,"./assign":158}],162:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional defaults of the same property will be ignored.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param- {Object} [guard] Allows working with `_.reduce` without using its
 *  `key` and `object` arguments as sources.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var object = { 'name': 'barney' };
 * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var defaults = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (typeof result[index] == 'undefined') result[index] = iterable[index];
    }
    }
  }
  return result
};

module.exports = defaults;

},{"../internals/objectTypes":146,"./keys":189}],163:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('./forOwn');

/**
 * This method is like `_.findIndex` except that it returns the key of the
 * first element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': false },
 *   'fred': {    'age': 40, 'blocked': true },
 *   'pebbles': { 'age': 1,  'blocked': false }
 * };
 *
 * _.findKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => 'barney' (property order is not guaranteed across environments)
 *
 * // using "_.where" callback shorthand
 * _.findKey(characters, { 'age': 1 });
 * // => 'pebbles'
 *
 * // using "_.pluck" callback shorthand
 * _.findKey(characters, 'blocked');
 * // => 'fred'
 */
function findKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwn(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findKey;

},{"../functions/createCallback":102,"./forOwn":167}],164:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwnRight = _dereq_('./forOwnRight');

/**
 * This method is like `_.findKey` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': true },
 *   'fred': {    'age': 40, 'blocked': false },
 *   'pebbles': { 'age': 1,  'blocked': true }
 * };
 *
 * _.findLastKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => returns `pebbles`, assuming `_.findKey` returns `barney`
 *
 * // using "_.where" callback shorthand
 * _.findLastKey(characters, { 'age': 40 });
 * // => 'fred'
 *
 * // using "_.pluck" callback shorthand
 * _.findLastKey(characters, 'blocked');
 * // => 'pebbles'
 */
function findLastKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwnRight(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findLastKey;

},{"../functions/createCallback":102,"./forOwnRight":168}],165:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;

},{"../internals/baseCreateCallback":118,"../internals/objectTypes":146}],166:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forIn = _dereq_('./forIn');

/**
 * This method is like `_.forIn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forInRight(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
 */
function forInRight(object, callback, thisArg) {
  var pairs = [];

  forIn(object, function(value, key) {
    pairs.push(key, value);
  });

  var length = pairs.length;
  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(pairs[length--], pairs[length], object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forInRight;

},{"../internals/baseCreateCallback":118,"./forIn":165}],167:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Iterates over own enumerable properties of an object, executing the callback
 * for each property. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, key, object). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
 */
var forOwn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forOwn;

},{"../internals/baseCreateCallback":118,"../internals/objectTypes":146,"./keys":189}],168:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys');

/**
 * This method is like `_.forOwn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
 */
function forOwnRight(object, callback, thisArg) {
  var props = keys(object),
      length = props.length;

  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    var key = props[length];
    if (callback(object[key], key, object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forOwnRight;

},{"../internals/baseCreateCallback":118,"./keys":189}],169:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('./forIn'),
    isFunction = _dereq_('./isFunction');

/**
 * Creates a sorted array of property names of all enumerable properties,
 * own and inherited, of `object` that have function values.
 *
 * @static
 * @memberOf _
 * @alias methods
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names that have function values.
 * @example
 *
 * _.functions(_);
 * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
 */
function functions(object) {
  var result = [];
  forIn(object, function(value, key) {
    if (isFunction(value)) {
      result.push(key);
    }
  });
  return result.sort();
}

module.exports = functions;

},{"./forIn":165,"./isFunction":180}],170:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if the specified property name exists as a direct property of `object`,
 * instead of an inherited property.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to check.
 * @returns {boolean} Returns `true` if key is a direct property, else `false`.
 * @example
 *
 * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
 * // => true
 */
function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

module.exports = has;

},{}],171:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates an object composed of the inverted keys and values of the given object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the created inverted object.
 * @example
 *
 * _.invert({ 'first': 'fred', 'second': 'barney' });
 * // => { 'fred': 'first', 'barney': 'second' }
 */
function invert(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    result[object[key]] = key;
  }
  return result;
}

module.exports = invert;

},{"./keys":189}],172:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
 * @example
 *
 * (function() { return _.isArguments(arguments); })(1, 2, 3);
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == argsClass || false;
}

module.exports = isArguments;

},{}],173:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative');

/** `Object#toString` result shortcuts */
var arrayClass = '[object Array]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is an array.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
 * @example
 *
 * (function() { return _.isArray(arguments); })();
 * // => false
 *
 * _.isArray([1, 2, 3]);
 * // => true
 */
var isArray = nativeIsArray || function(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == arrayClass || false;
};

module.exports = isArray;

},{"../internals/isNative":140}],174:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var boolClass = '[object Boolean]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a boolean value.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
 * @example
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    value && typeof value == 'object' && toString.call(value) == boolClass || false;
}

module.exports = isBoolean;

},{}],175:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var dateClass = '[object Date]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a date.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 */
function isDate(value) {
  return value && typeof value == 'object' && toString.call(value) == dateClass || false;
}

module.exports = isDate;

},{}],176:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 */
function isElement(value) {
  return value && value.nodeType === 1 || false;
}

module.exports = isElement;

},{}],177:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forOwn = _dereq_('./forOwn'),
    isFunction = _dereq_('./isFunction');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    objectClass = '[object Object]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
 * length of `0` and objects with no own enumerable properties are considered
 * "empty".
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({});
 * // => true
 *
 * _.isEmpty('');
 * // => true
 */
function isEmpty(value) {
  var result = true;
  if (!value) {
    return result;
  }
  var className = toString.call(value),
      length = value.length;

  if ((className == arrayClass || className == stringClass || className == argsClass ) ||
      (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
    return !length;
  }
  forOwn(value, function() {
    return (result = false);
  });
  return result;
}

module.exports = isEmpty;

},{"./forOwn":167,"./isFunction":180}],178:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseIsEqual = _dereq_('../internals/baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent to each other. If a callback is provided it will be executed
 * to compare values. If the callback returns `undefined` comparisons will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (a, b).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var copy = { 'name': 'fred' };
 *
 * object == copy;
 * // => false
 *
 * _.isEqual(object, copy);
 * // => true
 *
 * var words = ['hello', 'goodbye'];
 * var otherWords = ['hi', 'goodbye'];
 *
 * _.isEqual(words, otherWords, function(a, b) {
 *   var reGreet = /^(?:hello|hi)$/i,
 *       aGreet = _.isString(a) && reGreet.test(a),
 *       bGreet = _.isString(b) && reGreet.test(b);
 *
 *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
 * });
 * // => true
 */
function isEqual(a, b, callback, thisArg) {
  return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
}

module.exports = isEqual;

},{"../internals/baseCreateCallback":118,"../internals/baseIsEqual":123}],179:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsFinite = global.isFinite,
    nativeIsNaN = global.isNaN;

/**
 * Checks if `value` is, or can be coerced to, a finite number.
 *
 * Note: This is not the same as native `isFinite` which will return true for
 * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
 * @example
 *
 * _.isFinite(-101);
 * // => true
 *
 * _.isFinite('10');
 * // => true
 *
 * _.isFinite(true);
 * // => false
 *
 * _.isFinite('');
 * // => false
 *
 * _.isFinite(Infinity);
 * // => false
 */
function isFinite(value) {
  return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
}

module.exports = isFinite;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],180:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],181:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNumber = _dereq_('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * Note: This is not the same as native `isNaN` which will return `true` for
 * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // `NaN` as a primitive is the only value that is not equal to itself
  // (perform the [[Class]] check first to avoid errors with some host objects in IE)
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":183}],182:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(undefined);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],183:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var numberClass = '[object Number]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a number.
 *
 * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(8.4 * 5);
 * // => true
 */
function isNumber(value) {
  return typeof value == 'number' ||
    value && typeof value == 'object' && toString.call(value) == numberClass || false;
}

module.exports = isNumber;

},{}],184:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = _dereq_('../internals/objectTypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"../internals/objectTypes":146}],185:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative'),
    shimIsPlainObject = _dereq_('../internals/shimIsPlainObject');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

/**
 * Checks if `value` is an object created by the `Object` constructor.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * _.isPlainObject(new Shape);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 */
var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
  if (!(value && toString.call(value) == objectClass)) {
    return false;
  }
  var valueOf = value.valueOf,
      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

  return objProto
    ? (value == objProto || getPrototypeOf(value) == objProto)
    : shimIsPlainObject(value);
};

module.exports = isPlainObject;

},{"../internals/isNative":140,"../internals/shimIsPlainObject":153}],186:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var regexpClass = '[object RegExp]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a regular expression.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
 * @example
 *
 * _.isRegExp(/fred/);
 * // => true
 */
function isRegExp(value) {
  return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
}

module.exports = isRegExp;

},{}],187:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a string.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
 * @example
 *
 * _.isString('fred');
 * // => true
 */
function isString(value) {
  return typeof value == 'string' ||
    value && typeof value == 'object' && toString.call(value) == stringClass || false;
}

module.exports = isString;

},{}],188:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 */
function isUndefined(value) {
  return typeof value == 'undefined';
}

module.exports = isUndefined;

},{}],189:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative'),
    isObject = _dereq_('./isObject'),
    shimKeys = _dereq_('../internals/shimKeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"../internals/isNative":140,"../internals/shimKeys":154,"./isObject":184}],190:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('./forOwn');

/**
 * Creates an object with the same keys as `object` and values generated by
 * running each own enumerable property of `object` through the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new object with values of the results of each `callback` execution.
 * @example
 *
 * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 *
 * var characters = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // using "_.pluck" callback shorthand
 * _.mapValues(characters, 'age');
 * // => { 'fred': 40, 'pebbles': 1 }
 */
function mapValues(object, callback, thisArg) {
  var result = {};
  callback = createCallback(callback, thisArg, 3);

  forOwn(object, function(value, key, object) {
    result[key] = callback(value, key, object);
  });
  return result;
}

module.exports = mapValues;

},{"../functions/createCallback":102,"./forOwn":167}],191:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseMerge = _dereq_('../internals/baseMerge'),
    getArray = _dereq_('../internals/getArray'),
    isObject = _dereq_('./isObject'),
    releaseArray = _dereq_('../internals/releaseArray'),
    slice = _dereq_('../internals/slice');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * will overwrite property assignments of previous sources. If a callback is
 * provided it will be executed to produce the merged values of the destination
 * and source properties. If the callback returns `undefined` merging will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var names = {
 *   'characters': [
 *     { 'name': 'barney' },
 *     { 'name': 'fred' }
 *   ]
 * };
 *
 * var ages = {
 *   'characters': [
 *     { 'age': 36 },
 *     { 'age': 40 }
 *   ]
 * };
 *
 * _.merge(names, ages);
 * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
 *
 * var food = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var otherFood = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(food, otherFood, function(a, b) {
 *   return _.isArray(a) ? a.concat(b) : undefined;
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
 */
function merge(object) {
  var args = arguments,
      length = 2;

  if (!isObject(object)) {
    return object;
  }
  // allows working with `_.reduce` and `_.reduceRight` without using
  // their `index` and `collection` arguments
  if (typeof args[2] != 'number') {
    length = args.length;
  }
  if (length > 3 && typeof args[length - 2] == 'function') {
    var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
  } else if (length > 2 && typeof args[length - 1] == 'function') {
    callback = args[--length];
  }
  var sources = slice(arguments, 1, length),
      index = -1,
      stackA = getArray(),
      stackB = getArray();

  while (++index < length) {
    baseMerge(object, sources[index], callback, stackA, stackB);
  }
  releaseArray(stackA);
  releaseArray(stackB);
  return object;
}

module.exports = merge;

},{"../internals/baseCreateCallback":118,"../internals/baseMerge":124,"../internals/getArray":136,"../internals/releaseArray":150,"../internals/slice":155,"./isObject":184}],192:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseFlatten = _dereq_('../internals/baseFlatten'),
    createCallback = _dereq_('../functions/createCallback'),
    forIn = _dereq_('./forIn');

/**
 * Creates a shallow clone of `object` excluding the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` omitting the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The properties to omit or the
 *  function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object without the omitted properties.
 * @example
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
 * // => { 'name': 'fred' }
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
 *   return typeof value == 'number';
 * });
 * // => { 'name': 'fred' }
 */
function omit(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var props = [];
    forIn(object, function(value, key) {
      props.push(key);
    });
    props = baseDifference(props, baseFlatten(arguments, true, false, 1));

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      result[key] = object[key];
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (!callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = omit;

},{"../functions/createCallback":102,"../internals/baseDifference":120,"../internals/baseFlatten":121,"./forIn":165}],193:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates a two dimensional array of an object's key-value pairs,
 * i.e. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
 */
function pairs(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"./keys":189}],194:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    createCallback = _dereq_('../functions/createCallback'),
    forIn = _dereq_('./forIn'),
    isObject = _dereq_('./isObject');

/**
 * Creates a shallow clone of `object` composed of the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` picking the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The function called per
 *  iteration or property names to pick, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object composed of the picked properties.
 * @example
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
 * // => { 'name': 'fred' }
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
 *   return key.charAt(0) != '_';
 * });
 * // => { 'name': 'fred' }
 */
function pick(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var index = -1,
        props = baseFlatten(arguments, true, false, 1),
        length = isObject(object) ? props.length : 0;

    while (++index < length) {
      var key = props[index];
      if (key in object) {
        result[key] = object[key];
      }
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = pick;

},{"../functions/createCallback":102,"../internals/baseFlatten":121,"./forIn":165,"./isObject":184}],195:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('../internals/baseCreate'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('./forOwn'),
    isArray = _dereq_('./isArray');

/**
 * An alternative to `_.reduce` this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable properties through a callback, with each callback execution
 * potentially mutating the `accumulator` object. The callback is bound to
 * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
 * Callbacks may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
 *   num *= num;
 *   if (num % 2) {
 *     return result.push(num) < 3;
 *   }
 * });
 * // => [1, 9, 25]
 *
 * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 * });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function transform(object, callback, accumulator, thisArg) {
  var isArr = isArray(object);
  if (accumulator == null) {
    if (isArr) {
      accumulator = [];
    } else {
      var ctor = object && object.constructor,
          proto = ctor && ctor.prototype;

      accumulator = baseCreate(proto);
    }
  }
  if (callback) {
    callback = createCallback(callback, thisArg, 4);
    (isArr ? forEach : forOwn)(object, function(value, index, object) {
      return callback(accumulator, value, index, object);
    });
  }
  return accumulator;
}

module.exports = transform;

},{"../collections/forEach":77,"../functions/createCallback":102,"../internals/baseCreate":117,"./forOwn":167,"./isArray":173}],196:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates an array composed of the own enumerable property values of `object`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property values.
 * @example
 *
 * _.values({ 'one': 1, 'two': 2, 'three': 3 });
 * // => [1, 2, 3] (property order is not guaranteed across environments)
 */
function values(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = values;

},{"./keys":189}],197:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./internals/isNative');

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./internals/isNative":140}],198:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'constant': _dereq_('./utilities/constant'),
  'createCallback': _dereq_('./functions/createCallback'),
  'escape': _dereq_('./utilities/escape'),
  'identity': _dereq_('./utilities/identity'),
  'mixin': _dereq_('./utilities/mixin'),
  'noConflict': _dereq_('./utilities/noConflict'),
  'noop': _dereq_('./utilities/noop'),
  'now': _dereq_('./utilities/now'),
  'parseInt': _dereq_('./utilities/parseInt'),
  'property': _dereq_('./utilities/property'),
  'random': _dereq_('./utilities/random'),
  'result': _dereq_('./utilities/result'),
  'template': _dereq_('./utilities/template'),
  'templateSettings': _dereq_('./utilities/templateSettings'),
  'times': _dereq_('./utilities/times'),
  'unescape': _dereq_('./utilities/unescape'),
  'uniqueId': _dereq_('./utilities/uniqueId')
};

},{"./functions/createCallback":102,"./utilities/constant":199,"./utilities/escape":200,"./utilities/identity":201,"./utilities/mixin":202,"./utilities/noConflict":203,"./utilities/noop":204,"./utilities/now":205,"./utilities/parseInt":206,"./utilities/property":207,"./utilities/random":208,"./utilities/result":209,"./utilities/template":210,"./utilities/templateSettings":211,"./utilities/times":212,"./utilities/unescape":213,"./utilities/uniqueId":214}],199:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var getter = _.constant(object);
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],200:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escapeHtmlChar = _dereq_('../internals/escapeHtmlChar'),
    keys = _dereq_('../objects/keys'),
    reUnescapedHtml = _dereq_('../internals/reUnescapedHtml');

/**
 * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
 * corresponding HTML entities.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('Fred, Wilma, & Pebbles');
 * // => 'Fred, Wilma, &amp; Pebbles'
 */
function escape(string) {
  return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}

module.exports = escape;

},{"../internals/escapeHtmlChar":134,"../internals/reUnescapedHtml":149,"../objects/keys":189}],201:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],202:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    functions = _dereq_('../objects/functions'),
    isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * Adds function properties of a source object to the destination object.
 * If `object` is a function methods will be added to its prototype as well.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Function|Object} [object=lodash] object The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
 * @example
 *
 * function capitalize(string) {
 *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
 * }
 *
 * _.mixin({ 'capitalize': capitalize });
 * _.capitalize('fred');
 * // => 'Fred'
 *
 * _('fred').capitalize().value();
 * // => 'Fred'
 *
 * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
 * _('fred').capitalize();
 * // => 'Fred'
 */
function mixin(object, source, options) {
  var chain = true,
      methodNames = source && functions(source);

  if (options === false) {
    chain = false;
  } else if (isObject(options) && 'chain' in options) {
    chain = options.chain;
  }
  var ctor = object,
      isFunc = isFunction(ctor);

  forEach(methodNames, function(methodName) {
    var func = object[methodName] = source[methodName];
    if (isFunc) {
      ctor.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            value = this.__wrapped__,
            args = [value];

        push.apply(args, arguments);
        var result = func.apply(object, args);
        if (chain || chainAll) {
          if (value === result && isObject(result)) {
            return this;
          }
          result = new ctor(result);
          result.__chain__ = chainAll;
        }
        return result;
      };
    }
  });
}

module.exports = mixin;

},{"../collections/forEach":77,"../objects/functions":169,"../objects/isFunction":180,"../objects/isObject":184}],203:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to restore the original `_` reference in `noConflict` */
var oldDash = global._;

/**
 * Reverts the '_' variable to its previous value and returns a reference to
 * the `lodash` function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @returns {Function} Returns the `lodash` function.
 * @example
 *
 * var lodash = _.noConflict();
 */
function noConflict() {
  global._ = oldDash;
  return this;
}

module.exports = noConflict;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],204:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],205:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var stamp = _.now();
 * _.defer(function() { console.log(_.now() - stamp); });
 * // => logs the number of milliseconds it took for the deferred function to be called
 */
var now = isNative(now = Date.now) && now || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internals/isNative":140}],206:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = _dereq_('../objects/isString');

/** Used to detect and test whitespace */
var whitespace = (
  // whitespace
  ' \t\x0B\f\xA0\ufeff' +

  // line terminators
  '\n\r\u2028\u2029' +

  // unicode category "Zs" space separators
  '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
);

/** Used to match leading whitespace and zeros to be removed */
var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeParseInt = global.parseInt;

/**
 * Converts the given value into an integer of the specified radix.
 * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
 * `value` is a hexadecimal, in which case a `radix` of `16` is used.
 *
 * Note: This method avoids differences in native ES3 and ES5 `parseInt`
 * implementations. See http://es5.github.io/#E.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} value The value to parse.
 * @param {number} [radix] The radix used to interpret the value to parse.
 * @returns {number} Returns the new integer value.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 */
var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
  // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
  return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
};

module.exports = parseInt;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isString":187}],207:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;

},{}],208:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMin = Math.min,
    nativeRandom = Math.random;

/**
 * Produces a random number between `min` and `max` (inclusive). If only one
 * argument is provided a number between `0` and the given number will be
 * returned. If `floating` is truey or either `min` or `max` are floats a
 * floating-point number will be returned instead of an integer.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} [min=0] The minimum possible value.
 * @param {number} [max=1] The maximum possible value.
 * @param {boolean} [floating=false] Specify returning a floating-point number.
 * @returns {number} Returns a random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(min, max, floating) {
  var noMin = min == null,
      noMax = max == null;

  if (floating == null) {
    if (typeof min == 'boolean' && noMax) {
      floating = min;
      min = 1;
    }
    else if (!noMax && typeof max == 'boolean') {
      floating = max;
      noMax = true;
    }
  }
  if (noMin && noMax) {
    max = 1;
  }
  min = +min || 0;
  if (noMax) {
    max = min;
    min = 0;
  } else {
    max = +max || 0;
  }
  if (floating || min % 1 || max % 1) {
    var rand = nativeRandom();
    return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
  }
  return baseRandom(min, max);
}

module.exports = random;

},{"../internals/baseRandom":125}],209:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Resolves the value of property `key` on `object`. If `key` is a function
 * it will be invoked with the `this` binding of `object` and its result returned,
 * else the property value is returned. If `object` is falsey then `undefined`
 * is returned.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to resolve.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = {
 *   'cheese': 'crumpets',
 *   'stuff': function() {
 *     return 'nonsense';
 *   }
 * };
 *
 * _.result(object, 'cheese');
 * // => 'crumpets'
 *
 * _.result(object, 'stuff');
 * // => 'nonsense'
 */
function result(object, key) {
  if (object) {
    var value = object[key];
    return isFunction(value) ? object[key]() : value;
  }
}

module.exports = result;

},{"../objects/isFunction":180}],210:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var defaults = _dereq_('../objects/defaults'),
    escape = _dereq_('./escape'),
    escapeStringChar = _dereq_('../internals/escapeStringChar'),
    keys = _dereq_('../objects/keys'),
    reInterpolate = _dereq_('../internals/reInterpolate'),
    templateSettings = _dereq_('./templateSettings'),
    values = _dereq_('../objects/values');

/** Used to match empty string literals in compiled template source */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match ES6 template delimiters
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals */
var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

/**
 * A micro-templating method that handles arbitrary delimiters, preserves
 * whitespace, and correctly escapes quotes within interpolated code.
 *
 * Note: In the development build, `_.template` utilizes sourceURLs for easier
 * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
 *
 * For more information on precompiling templates see:
 * http://lodash.com/custom-builds
 *
 * For more information on Chrome extension sandboxes see:
 * http://developer.chrome.com/stable/extensions/sandboxingEval.html
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} text The template text.
 * @param {Object} data The data object used to populate the text.
 * @param {Object} [options] The options object.
 * @param {RegExp} [options.escape] The "escape" delimiter.
 * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
 * @param {Object} [options.imports] An object to import into the template as local variables.
 * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
 * @param {string} [sourceURL] The sourceURL of the template's compiled source.
 * @param {string} [variable] The data object variable name.
 * @returns {Function|string} Returns a compiled function when no `data` object
 *  is given, else it returns the interpolated text.
 * @example
 *
 * // using the "interpolate" delimiter to create a compiled template
 * var compiled = _.template('hello <%= name %>');
 * compiled({ 'name': 'fred' });
 * // => 'hello fred'
 *
 * // using the "escape" delimiter to escape HTML in data property values
 * _.template('<b><%- value %></b>', { 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // using the "evaluate" delimiter to generate HTML
 * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
 * _.template('hello ${ name }', { 'name': 'pebbles' });
 * // => 'hello pebbles'
 *
 * // using the internal `print` function in "evaluate" delimiters
 * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
 * // => 'hello barney!'
 *
 * // using a custom template delimiters
 * _.templateSettings = {
 *   'interpolate': /{{([\s\S]+?)}}/g
 * };
 *
 * _.template('hello {{ name }}!', { 'name': 'mustache' });
 * // => 'hello mustache!'
 *
 * // using the `imports` option to import jQuery
 * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the `sourceURL` option to specify a custom sourceURL for the template
 * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
 *
 * // using the `variable` option to ensure a with-statement isn't used in the compiled template
 * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 *   var __t, __p = '', __e = _.escape;
 *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
 *   return __p;
 * }
 *
 * // using the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and a stack trace
 * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(text, data, options) {
  // based on John Resig's `tmpl` implementation
  // http://ejohn.org/blog/javascript-micro-templating/
  // and Laura Doktorova's doT.js
  // https://github.com/olado/doT
  var settings = templateSettings.imports._.templateSettings || templateSettings;
  text = String(text || '');

  // avoid missing dependencies when `iteratorTemplate` is not defined
  options = defaults({}, options, settings);

  var imports = defaults({}, options.imports, settings.imports),
      importsKeys = keys(imports),
      importsValues = values(imports);

  var isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // compile the regexp to match each delimiter
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // escape characters that cannot be included in string literals
    source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // replace delimiters with snippets
    if (escapeValue) {
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // the JS engine embedded in Adobe products requires returning the `match`
    // string in order to produce the correct `offset` value
    return match;
  });

  source += "';\n";

  // if `variable` is not specified, wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain
  var variable = options.variable,
      hasVariable = variable;

  if (!hasVariable) {
    variable = 'obj';
    source = 'with (' + variable + ') {\n' + source + '\n}\n';
  }
  // cleanup code by stripping empty strings
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // frame code as the function body
  source = 'function(' + variable + ') {\n' +
    (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
    "var __t, __p = '', __e = _.escape" +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  try {
    var result = Function(importsKeys, 'return ' + source ).apply(undefined, importsValues);
  } catch(e) {
    e.source = source;
    throw e;
  }
  if (data) {
    return result(data);
  }
  // provide the compiled function's source by its `toString` method, in
  // supported environments, or the `source` property as a convenience for
  // inlining compiled templates during the build process
  result.source = source;
  return result;
}

module.exports = template;

},{"../internals/escapeStringChar":135,"../internals/reInterpolate":148,"../objects/defaults":162,"../objects/keys":189,"../objects/values":196,"./escape":200,"./templateSettings":211}],211:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escape = _dereq_('./escape'),
    reInterpolate = _dereq_('../internals/reInterpolate');

/**
 * By default, the template delimiters used by Lo-Dash are similar to those in
 * embedded Ruby (ERB). Change the following template settings to use alternative
 * delimiters.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'escape': /<%-([\s\S]+?)%>/g,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'evaluate': /<%([\s\S]+?)%>/g,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type string
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type Object
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type Function
     */
    '_': { 'escape': escape }
  }
};

module.exports = templateSettings;

},{"../internals/reInterpolate":148,"./escape":200}],212:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Executes the callback `n` times, returning an array of the results
 * of each callback execution. The callback is bound to `thisArg` and invoked
 * with one argument; (index).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} n The number of times to execute the callback.
 * @param {Function} callback The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns an array of the results of each `callback` execution.
 * @example
 *
 * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
 * // => [3, 6, 4]
 *
 * _.times(3, function(n) { mage.castSpell(n); });
 * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
 *
 * _.times(3, function(n) { this.cast(n); }, mage);
 * // => also calls `mage.castSpell(n)` three times
 */
function times(n, callback, thisArg) {
  n = (n = +n) > -1 ? n : 0;
  var index = -1,
      result = Array(n);

  callback = baseCreateCallback(callback, thisArg, 1);
  while (++index < n) {
    result[index] = callback(index);
  }
  return result;
}

module.exports = times;

},{"../internals/baseCreateCallback":118}],213:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('../objects/keys'),
    reEscapedHtml = _dereq_('../internals/reEscapedHtml'),
    unescapeHtmlChar = _dereq_('../internals/unescapeHtmlChar');

/**
 * The inverse of `_.escape` this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
 * corresponding characters.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('Fred, Barney &amp; Pebbles');
 * // => 'Fred, Barney & Pebbles'
 */
function unescape(string) {
  return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
}

module.exports = unescape;

},{"../internals/reEscapedHtml":147,"../internals/unescapeHtmlChar":156,"../objects/keys":189}],214:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to generate unique IDs */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return String(prefix == null ? '' : prefix) + id;
}

module.exports = uniqueId;

},{}],215:[function(_dereq_,module,exports){
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

},{}],216:[function(_dereq_,module,exports){

},{}],217:[function(_dereq_,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = _dereq_('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":219}],218:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],219:[function(_dereq_,module,exports){
(function (process,global){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":218,"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":221,"inherits":220}],220:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],221:[function(_dereq_,module,exports){
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

},{}],222:[function(_dereq_,module,exports){
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

}).call(this,_dereq_("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":221}]},{},[7])
(7)
});