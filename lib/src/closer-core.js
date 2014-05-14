(function() {
  var assertions, core, m, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
    __slice = [].slice;

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
      return m.equals.apply(null, args);
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
    'identity': function(x) {
      assertions.arity(1, arguments.length);
      return x;
    },
    'apply': function() {
      var args, f, i, last, lastSeq, rest, _i, _ref;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      last = args[args.length - 1];
      rest = args.slice(0, args.length - 1);
      assertions["function"](f);
      assertions.seqable(last);
      lastSeq = core.seq(last);
      for (i = _i = 0, _ref = core.count(lastSeq); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        rest.push(core.nth(lastSeq, i));
      }
      return f.apply(null, rest);
    },
    'map': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](f);
      return m.map.apply(null, arguments);
    },
    'mapcat': function() {
      var colls, f;
      f = arguments[0], colls = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(2, Infinity, arguments.length);
      assertions["function"](f);
      return m.mapcat.apply(null, arguments);
    },
    'filter': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      return m.filter(pred, coll);
    },
    'remove': function(pred, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](pred);
      return m.remove(pred, coll);
    },
    'reduce': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(2, 3, arguments.length);
      assertions["function"](args[0]);
      return m.reduce.apply(null, args);
    },
    'reduce_$_kv': function(f, init, coll) {
      assertions.arity(3, arguments.length);
      assertions["function"](f);
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
      return m.partition_by(f, coll);
    },
    'group_$_by': function(f, coll) {
      assertions.arity(2, arguments.length);
      assertions["function"](f);
      assertions.seqable(coll);
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
      return m.repeatedly.apply(null, arguments);
    },
    'comp': function() {
      var fs;
      fs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assertions.arity(0, Infinity, arguments.length);
      assertions["function"].apply(null, fs);
      return m.comp.apply(null, fs);
    },
    'partial': function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      assertions.arity(1, Infinity, arguments.length);
      assertions["function"](f);
      return m.partial.apply(null, arguments);
    }
  };

  module.exports = core;

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  m = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.mori : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.mori : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.mori : void 0) != null ? _ref3 : require('mori');

  assertions = (_ref6 = (_ref7 = (_ref8 = typeof window !== "undefined" && window !== null ? window.assertions : void 0) != null ? _ref8 : typeof self !== "undefined" && self !== null ? self.assertions : void 0) != null ? _ref7 : typeof global !== "undefined" && global !== null ? global.assertions : void 0) != null ? _ref6 : require('./assertions');

  if (typeof self !== "undefined" && self !== null) {
    self.closerCore = core;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closerCore = core;
  }

}).call(this);
