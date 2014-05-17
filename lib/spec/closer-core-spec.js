(function() {
  var assertions, closerCore, emptySeq, eq, evaluate, falsy, key, list, map, nil, obj, parseOpts, repl, seq, set, throws, truthy, vec, _, __$this, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
    __slice = [].slice;

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  repl = require('../src/repl');

  closerCore = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.closerCore : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.closerCore : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.closerCore : void 0) != null ? _ref3 : require('../src/closer-core');

  assertions = (_ref6 = (_ref7 = (_ref8 = typeof window !== "undefined" && window !== null ? window.assertions : void 0) != null ? _ref8 : typeof self !== "undefined" && self !== null ? self.assertions : void 0) != null ? _ref7 : typeof global !== "undefined" && global !== null ? global.assertions : void 0) != null ? _ref6 : require('../src/assertions');

  beforeEach(function() {
    return this.addMatchers({
      toCljEqual: function(expected) {
        this.message = function() {
          return "Expected " + this.actual + " to equal " + expected;
        };
        return closerCore._$EQ_(this.actual, expected);
      }
    });
  });

  parseOpts = {
    loc: false
  };

  evaluate = function(src) {
    return eval(repl.generateJS(src, parseOpts));
  };

  eq = function(src, expected) {
    return expect(evaluate(src)).toCljEqual(expected);
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
    return closerCore.keyword(x);
  };

  seq = function(seqable) {
    return closerCore.seq(seqable);
  };

  emptySeq = function() {
    return closerCore.empty(closerCore.seq([1]));
  };

  vec = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return closerCore.vector.apply(null, _.flatten(xs));
  };

  list = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return closerCore.list.apply(null, _.flatten(xs));
  };

  set = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return closerCore.hash_$_set.apply(null, _.flatten(xs));
  };

  map = function() {
    var xs;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return closerCore.hash_$_map.apply(null, _.flatten(xs));
  };

  __$this = {};

  obj = {
    'a': 1
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
    describe('(rand), (rand n)', function() {
      return it('returns a random floating-point number between 0 (inclusive) and n (default 1) (exclusive)', function() {
        throws('(rand 3.4 7.9)');
        truthy('(every? #(and (>= % 0) (< % 1)) (repeatedly 50 rand))');
        return truthy('(every? #(and (>= % 0) (< % 3)) (repeatedly 50 #(rand 3)))');
      });
    });
    describe('(rand-int n)', function() {
      return it('returns a random integer between 0 (inclusive) and n (exclusive)', function() {
        throws('(rand-int 3 8)');
        truthy('(every? #{0 1} (repeatedly 50 #(rand-int 2)))');
        truthy('(every? #{0 1} (repeatedly 50 #(rand-int 1.1)))');
        return truthy('(every? #{0 -1} (repeatedly 50 #(rand-int -1.1)))');
      });
    });
    describe('(= x y & more)', function() {
      return it('returns true if all its arguments are equal (by value, not identity)', function() {
        throws('(=)');
        truthy('(= nil nil)');
        truthy('(= 1)');
        truthy('(= #(+ x y))');
        truthy('(let [a 1] (= a a 1))');
        falsy('(let [a 1] (= a a 2))');
        truthy('(= 1 1.0)');
        truthy('(= "hello" "hello")');
        truthy('(= true true)');
        falsy('(= true false)');
        truthy('(= :keyword :keyword)');
        falsy('(= :keyword "keyword")');
        falsy('(= 1 [1])');
        falsy('(= [3 4] [4 3])');
        truthy('(= [3 4] \'(3 4))');
        falsy('(= [3 4] \'(3 5))');
        truthy('(= #{1 2} #{2 1})');
        truthy('(= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})');
        falsy('(= #{1 2} #{2 1 3})');
        falsy('(= #{1 2} [2 1])');
        truthy('(= (to-array [0 1 2 3]) (range 4))');
        truthy('(= obj {"a" 1})');
        return falsy('(= obj {:a 1})');
      });
    });
    describe('(not= x y & more)', function() {
      return it('returns true if some of its arguments are unequal (by value, not identity)', function() {
        throws('(not=)');
        falsy('(not= nil nil)');
        falsy('(not= 1)');
        falsy('(not= #(+ x y))');
        falsy('(let [a 1] (not= a a 1))');
        truthy('(let [a 1] (not= a a 2))');
        falsy('(not= 1 1.0)');
        falsy('(not= "hello" "hello")');
        falsy('(not= true true)');
        truthy('(not= true false)');
        falsy('(not= :keyword :keyword)');
        truthy('(not= :keyword "keyword")');
        truthy('(not= 1 [1])');
        truthy('(not= [3 4] [4 3])');
        falsy('(not= [3 4] \'(3 4))');
        truthy('(not= [3 4] \'(3 5))');
        falsy('(not= #{1 2} #{2 1})');
        falsy('(not= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})');
        truthy('(not= #{1 2} #{2 1 3})');
        truthy('(not= #{1 2} [2 1])');
        falsy('(not= (to-array [0 1 2 3]) (range 4))');
        falsy('(not= obj {"a" 1})');
        return truthy('(not= obj {:a 1})');
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
        return falsy('(true? #())');
      });
    });
    describe('(false? x)', function() {
      return it('returns true if and only if x is the value false', function() {
        throws('(false? nil false)');
        truthy('(false? false)');
        falsy('(false? nil)');
        return falsy('(false? #())');
      });
    });
    describe('(nil? x)', function() {
      return it('returns true if and only if x is the value nil', function() {
        throws('(nil? nil false)');
        truthy('(nil? nil)');
        falsy('(nil? false)');
        return falsy('(nil? #())');
      });
    });
    describe('(some? x)', function() {
      return it('returns true if and only if x is NOT the value nil', function() {
        throws('(some? nil false)');
        falsy('(some? nil)');
        truthy('(some? "hello")');
        return truthy('(some? #())');
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
    describe('(keyword? x)', function() {
      return it('returns true if x is a keyword', function() {
        throws('(keyword? :k1 :k2)');
        truthy('(keyword? :key)');
        return falsy('(keyword? ":key")');
      });
    });
    describe('(list? x)', function() {
      return it('returns true if x is a list', function() {
        throws('(list? \'() \'())');
        truthy('(list? \'())');
        falsy('(list? 3)');
        falsy('(list? [])');
        return falsy('(list? (range))');
      });
    });
    describe('(seq? x)', function() {
      return it('returns true if x is a seq', function() {
        throws('(seq? (range) (range))');
        truthy('(seq? (range))');
        truthy('(seq? \'())');
        falsy('(seq? 3)');
        return falsy('(seq? [])');
      });
    });
    describe('(vector? x)', function() {
      return it('returns true if x is a vector', function() {
        throws('(vector? [] [])');
        truthy('(vector? [])');
        truthy('(vector? (first (seq {1 2})))');
        falsy('(vector? 3)');
        return falsy('(vector? \'())');
      });
    });
    describe('(map? x)', function() {
      return it('returns true if x is a map', function() {
        throws('(map? {} {})');
        truthy('(map? {})');
        falsy('(map? 3)');
        return falsy('(map? #{})');
      });
    });
    describe('(set? x)', function() {
      return it('returns true if x is a set', function() {
        throws('(set? #{} #{})');
        truthy('(set? #{})');
        falsy('(set? 3)');
        falsy('(set? {})');
        return falsy('(set? [])');
      });
    });
    describe('(coll? x)', function() {
      return it('returns true if x is a collection', function() {
        throws('(coll? [] #{})');
        truthy('(coll? [])');
        truthy('(coll? \'())');
        truthy('(coll? (range))');
        truthy('(coll? {})');
        truthy('(coll? #{})');
        falsy('(coll? 3)');
        return falsy('(coll? "string")');
      });
    });
    describe('(sequential? coll)', function() {
      return it('returns true if coll is a sequential collection', function() {
        throws('(sequential? [] \'())');
        truthy('(sequential? [])');
        truthy('(sequential? \'())');
        truthy('(sequential? (range))');
        falsy('(sequential? #{})');
        falsy('(sequential? {})');
        return falsy('(sequential? "string")');
      });
    });
    describe('(associative? coll)', function() {
      return it('returns true if coll is an associative collection', function() {
        throws('(associative? [] {})');
        truthy('(associative? [])');
        truthy('(associative? {})');
        falsy('(associative? \'())');
        falsy('(associative? (range))');
        falsy('(associative? #{})');
        return falsy('(associative? "string")');
      });
    });
    describe('(counted? coll)', function() {
      return it('returns true if coll can be counted in constant time', function() {
        throws('(counted? [] \'())');
        truthy('(counted? [])');
        truthy('(counted? \'())');
        truthy('(counted? #{})');
        truthy('(counted? {})');
        truthy('(counted? (range))');
        return falsy('(counted? "string")');
      });
    });
    describe('(seqable? coll)', function() {
      return it('returns true if coll can be converted into a seq', function() {
        throws('(seqable? [] \'())');
        truthy('(seqable? [])');
        truthy('(seqable? \'())');
        truthy('(seqable? (range))');
        truthy('(seqable? #{})');
        truthy('(seqable? {})');
        falsy('(seqable? "string")');
        falsy('(seqable? 3)');
        return falsy('(seqable? nil)');
      });
    });
    describe('(reversible? coll)', function() {
      return it('returns true if coll is a reversible collection', function() {
        throws('(reversible? [] []])');
        truthy('(reversible? [])');
        falsy('(reversible? \'())');
        falsy('(reversible? (range))');
        falsy('(reversible? #{})');
        falsy('(reversible? {})');
        return falsy('(reversible? "string")');
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
        return truthy('(boolean #(+ x y))');
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
        return falsy('(not #(+ x y))');
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
    describe('(println args)', function() {
      return it('prints the given args separated by a single space and followed by a newline', function() {
        var oldLog;
        oldLog = console.log;
        console.log = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return args.join(' ');
        };
        eq('(println 1 2 [3 4])', '1 2 [3 4]');
        eq('(println #{1 2} {3 4})', '#{1 2} {3 4}');
        return console.log = oldLog;
      });
    });
    describe('(keyword name)', function() {
      return it('returns a keyword with the given name (do not use : in the name, it will be added automatically)', function() {
        throws('(keyword "k1" "k2")');
        eq('(keyword "key")', key('key'));
        eq('(keyword :key)', key('key'));
        nil('(keyword [])');
        nil('(keyword #())');
        nil('(keyword 3)');
        return nil('(keyword true)');
      });
    });
    describe('(list items)', function() {
      return it('creates a new list containing the given items', function() {
        eq('(list)', list());
        return eq('(list 1 2 3 1)', list(1, 2, 3, 1));
      });
    });
    describe('(vector items)', function() {
      return it('creates a new vector containing the given items', function() {
        eq('(vector)', vec());
        return eq('(vector 1 2 3 1)', vec(1, 2, 3, 1));
      });
    });
    describe('(hash-map keyvals)', function() {
      return it('creates a new hash-map containing the given key-value pairs', function() {
        eq('(hash-map)', map());
        throws('(hash-map 1)');
        truthy('(let [kv (first (hash-map \'() 1 [] 2))] (and (list? (first kv))) (= (last kv) 2))');
        return truthy('(let [kv (first (hash-map [] 1 \'() 2))] (and (vector? (first kv))) (= (last kv) 2))');
      });
    });
    describe('(hash-set keys)', function() {
      return it('creates a new hash-set containing the given keys', function() {
        eq('(hash-set)', set());
        truthy('(vector? (#{[] 1 2 \'()} []))');
        return truthy('(list? (#{\'() 1 2 []} \'()))');
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
    describe('(disj set), (disj set ks)', function() {
      return it('returns a new set with the keys removed', function() {
        throws('(disj)');
        eq('(disj #{1 2 3})', set(1, 2, 3));
        throws('(disj 3)');
        eq('(disj #{1 2 3 []} 2 4 \'())', set(1, 3));
        throws('(disj {1 2, 3 4} 1)');
        return throws('(disj [1 2 3 4] 0 1)');
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
        return nil('(dissoc nil #() true)');
      });
    });
    describe('(keys map)', function() {
      return it('returns a seq of the map\'s keys', function() {
        throws('(keys {:a 1, :b 2} {:c 3, :d 4})');
        throws('(keys [1 2 3 4])');
        throws('(keys \'(1 2 3 4))');
        throws('(keys #{1 2 3 4})');
        throws('(keys "string")');
        return eq('(keys {:a 1, :b 2})', seq([key('a'), key('b')]));
      });
    });
    describe('(vals map)', function() {
      return it('returns a seq of the map\'s values', function() {
        throws('(vals {:a 1, :b 2} {:c 3, :d 4})');
        throws('(vals [1 2 3 4])');
        throws('(vals \'(1 2 3 4))');
        throws('(vals #{1 2 3 4})');
        throws('(vals "string")');
        return eq('(vals {:a 1, :b 2})', seq([1, 2]));
      });
    });
    describe('(key e)', function() {
      return it('returns the key of the given map entry', function() {
        throws('(key (first {1 2}) (first {3 4}))');
        throws('(key nil)');
        throws('(key 3)');
        eq('(key (last {1 2, 3 4}))', 3);
        throws('(key \'(3 4))');
        eq('(key [3 4])', 3);
        return throws('(key [3 4 5 6])');
      });
    });
    describe('(val e)', function() {
      return it('returns the value of the given map entry', function() {
        throws('(val (first {1 2}) (first {3 4}))');
        throws('(val nil)');
        throws('(val 3)');
        eq('(val (last {1 2, 3 4}))', 4);
        throws('(val \'(3 4))');
        eq('(val [3 4])', 4);
        return throws('(val [3 4 5 6])');
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
    describe('(to-array coll)', function() {
      return it('converts coll to a javascript array', function() {
        throws('(to-array [] [])');
        throws('(to-array 1)');
        eq('(to-array nil)', []);
        eq('(to-array [1 [2]])', [1, vec(2)]);
        eq('(to-array \'(1 \'(2)))', [1, list(2)]);
        eq('(to-array #{1 #{2}})', [1, set(2)]);
        eq('(to-array {1 {2 3}})', [vec(1, map(2, 3))]);
        return eq('(to-array "string")', 'string'.split(''));
      });
    });
    describe('(identity x)', function() {
      return it('returns its argument', function() {
        throws('(identity 34 45)');
        nil('(identity nil)');
        return eq('(identity {:k1 "v1" :k2 #{1 2}})', map(key('k1'), 'v1', key('k2'), set(1, 2)));
      });
    });
    describe('(apply f x y z seq)', function() {
      return it('applies the given function with arguments x, y, z and the elements of seq', function() {
        throws('(apply +)');
        eq('(apply + [1 2 3 4])', 10);
        eq('(apply + 1 2 [3 4])', 10);
        throws('(apply + 1 [2 3] 4)');
        throws('(apply true 1 2 [3 4])');
        return eq('(apply concat {1 2, 3 4, 5 6})', seq([1, 2, 3, 4, 5, 6]));
      });
    });
    describe('(map f colls)', function() {
      return it('applies f sequentially to every item in the given collections', function() {
        throws('(map +)');
        eq('(map inc [1 2 3])', seq([2, 3, 4]));
        eq('(map + [1 2] \'(3 4) #{5 6})', seq([9, 12]));
        eq('(map first {:a 1, :b 2})', seq([key('a'), key('b')]));
        eq('(map #(if (even? %) (- %) %) [1 2 3 4])', vec(1, -2, 3, -4));
        eq('(map #{1} [1 2 4 1])', seq([1, null, null, 1]));
        eq('(map {1 2, 3 4, 5 6, 7 8} #{3 7})', seq([4, 8]));
        return eq('(map :name [{:name "name1"} {:name "name2"}])', seq(['name1', 'name2']));
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
        eq('(filter (fn [[k v]] (< k v)) {1 2 4 3})', seq([vec(1, 2)]));
        return eq('(filter #{"s"} "strings")', seq(['s', 's']));
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
        eq('(remove #{2 4} (range 1 5))', seq([1, 3]));
        eq('(remove (fn [[k v]] (< k v)) {1 2 4 3})', seq([vec(4, 3)]));
        return eq('(remove #{"s"} "strings")', seq(['t', 'r', 'i', 'n', 'g']));
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
    describe('(drop n coll)', function() {
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
    describe('(some pred coll)', function() {
      return it('returns the first logically true value of (pred x) for any x in coll, else nil', function() {
        throws('(some even?)');
        throws('(some true [1 2 3])');
        throws('(some even? 1)');
        truthy('(some even? \'(1 2 3 4))');
        nil('(some even? \'(1 3 5 7))');
        eq('(some {2 "two" 3 "three"} [nil 4 3])', 'three');
        eq('(some #(if (even? %) %) [1 2 3 4])', 2);
        return eq('(some #{2} (range 10))', 2);
      });
    });
    describe('(every? pred coll)', function() {
      return it('returns true if (pred x) is true for every x in coll, else false', function() {
        throws('(every? even?)');
        throws('(every? true [1 2 3])');
        throws('(every? even? 1)');
        truthy('(every? even? [2 4 6])');
        falsy('(every? even? [1 3 5])');
        falsy('(every? #{1 2} [1 2 3])');
        truthy('(every? #{1 2} [1 2 2 1])');
        truthy('(every? true? [])');
        return truthy('(every? false? [])');
      });
    });
    describe('(sort coll), (sort cmp coll)', function() {
      return it('sorts the given collection, optionally using the given comparison function', function() {
        throws('(sort > [3 1 2 4] [7 5 6 8])');
        throws('(sort 3)');
        throws('(sort 3 [7 5 6 8])');
        throws('(sort > 3)');
        eq('(sort [3 1 2 4])', seq([1, 2, 3, 4]));
        eq('(sort \'(3 1 2 4))', seq([1, 2, 3, 4]));
        eq('(sort #{3 1 2 4})', seq([1, 2, 3, 4]));
        eq('(sort {3 1, 2 4})', seq([vec(2, 4), vec(3, 1)]));
        eq('(sort "string")', seq(["g", "i", "n", "r", "s", "t"]));
        eq('(sort > [3 1 2 4])', seq([4, 3, 2, 1]));
        throws('(sort > "string")');
        return throws('(sort > {3 1, 2 4})');
      });
    });
    describe('(sort-by keyfn coll), (sort-by keyfn cmp coll)', function() {
      return it('sorts the given collection, optionally using the given comparison function', function() {
        throws('(sort-by [3 1 2 4])');
        throws('(sort-by true [3 1 2 4])');
        throws('(sort-by - 3)');
        throws('(sort-by true > [3 1 2 4])');
        throws('(sort-by - true [3 1 2 4])');
        throws('(sort-by - > 3)');
        eq('(sort-by - [3 1 2 4])', seq([4, 3, 2, 1]));
        eq('(sort-by - \'(3 1 2 4))', seq([4, 3, 2, 1]));
        eq('(sort-by - #{3 1 2 4})', seq([4, 3, 2, 1]));
        eq('(sort-by #(apply + %) {3 1, 2 4, 6 5})', seq([vec(3, 1), vec(2, 4), vec(6, 5)]));
        eq('(sort-by count ["aa" "a" "aaa"])', seq(["a", "aa", "aaa"]));
        eq('(sort-by :age [{:age 29} {:age 16} {:age 32}])', seq([map(key('age'), 16), map(key('age'), 29), map(key('age'), 32)]));
        return eq('(sort-by - > [3 1 2 4])', seq([1, 2, 3, 4]));
      });
    });
    describe('(partition n coll), (partition n step coll), (partition n step pad coll)', function() {
      return it('partitions coll into groups of n items each', function() {
        throws('(partition 2)');
        throws('(partition true [1 2 3 4])');
        throws('(partition 2 true [1 2 3 4])');
        throws('(partition 3 3 3 [1 2 3 4])');
        throws('(partition 2 2)');
        eq('(partition 4 (range 10))', seq([seq([0, 1, 2, 3]), seq([4, 5, 6, 7])]));
        eq('(partition 4 4 (range 10))', seq([seq([0, 1, 2, 3]), seq([4, 5, 6, 7])]));
        eq('(partition 4 4 [] (range 10))', seq([seq([0, 1, 2, 3]), seq([4, 5, 6, 7]), seq([8, 9])]));
        eq('(partition 4 4 [10 11] (range 10))', seq([seq([0, 1, 2, 3]), seq([4, 5, 6, 7]), seq([8, 9, 10, 11])]));
        eq('(partition 4 4 (range 10 20) (range 10))', seq([seq([0, 1, 2, 3]), seq([4, 5, 6, 7]), seq([8, 9, 10, 11])]));
        eq('(partition 5 3 (range 10))', seq([seq([0, 1, 2, 3, 4]), seq([3, 4, 5, 6, 7])]));
        eq('(partition 2 \'(1 2 3 4))', seq([seq([1, 2]), seq([3, 4])]));
        eq('(partition 2 #{1 2 3 4})', seq([seq([1, 2]), seq([3, 4])]));
        eq('(partition 1 {1 2 3 4})', seq([seq([vec(1, 2)]), seq([vec(3, 4)])]));
        return eq('(partition 2 "string")', seq([seq(['s', 't']), seq(['r', 'i']), seq(['n', 'g'])]));
      });
    });
    describe('(partition-by f coll)', function() {
      return it('partitions coll with a new group being started whenever the value returned by f changes', function() {
        throws('(partition-by #(nth % 0))');
        throws('(partition-by 2 [1 2 3 4])');
        throws('(partition-by #(nth % 0) 3)');
        eq('(partition-by #{3} [1 2 2.4 3 3 4 5 3])', seq([seq([1, 2, 2.4]), seq([3, 3]), seq([4, 5]), seq([3])]));
        eq('(partition-by odd? \'(1 1 2 3 3))', seq([seq([1, 1]), seq([2]), seq([3, 3])]));
        eq('(partition-by #(< % 3) #{1 2 3})', seq([seq([1, 2]), seq([3])]));
        eq('(partition-by #(% 1) {1 1, 2 1, 3 4})', seq([seq([vec(1, 1), vec(2, 1)]), seq([vec(3, 4)])]));
        return eq('(partition-by identity "mummy")', seq([seq(['m']), seq(['u']), seq(['m', 'm']), seq(['y'])]));
      });
    });
    describe('(group-by f coll)', function() {
      return it('returns a map of items grouped by the result of applying f to each element', function() {
        throws('(group-by even?)');
        throws('(group-by 3 [1 2 3 4])');
        throws('(group-by even? 2)');
        eq('(group-by even? [1 2 3 4])', map(true, vec(2, 4), false, vec(1, 3)));
        eq('(group-by even? \'(1 2 3 4))', map(true, vec(2, 4), false, vec(1, 3)));
        eq('(group-by even? #{1 2 3 4})', map(true, vec(2, 4), false, vec(1, 3)));
        eq('(group-by #(% 1) {1 1, 2 1, 3 4, 5 6})', map(1, vec(vec(1, 1), vec(2, 1)), 4, vec(vec(3, 4)), 6, vec(vec(5, 6))));
        return eq('(group-by #{"c"} "soccer")', map(null, vec('s', 'o', 'e', 'r'), 'c', vec('c', 'c')));
      });
    });
    describe('(zipmap keys vals)', function() {
      return it('returns a map with the keys mapped to the corresponding vals', function() {
        throws('(zipmap [1 2 3])');
        throws('(zipmap [1 2 3] 3)');
        throws('(zipmap 3 [1 2 3])');
        eq('(zipmap nil nil)', map());
        eq('(zipmap [1 2 3] nil)', map());
        eq('(zipmap nil [1 2 3])', map());
        eq('(zipmap [1 2 3 4] \'(5 6))', map(1, 5, 2, 6));
        eq('(zipmap #{1 2 3} "string")', map(1, "s", 2, "t", 3, "r"));
        eq('(zipmap {1 2, 3 4} [5])', map(vec(1, 2), 5));
        return eq('(zipmap [1 2 [] 1 \'()] (range))', map(1, 3, 2, 1, vec(), 4));
      });
    });
    describe('(iterate f x)', function() {
      return it('creates a lazy sequence of x, f(x), f(f(x)), etc. f must be free of side-effects', function() {
        throws('(iterate inc)');
        throws('(iterate true 1)');
        eq('(take 5 (iterate inc 5))', seq([5, 6, 7, 8, 9]));
        return eq('(nth (iterate #(* % 2) 1) 10)', 1024);
      });
    });
    describe('(constantly x)', function() {
      return it('returns a function which takes any number of arguments and returns x', function() {
        throws('(constantly 2 3)');
        return eq('(map (constantly 0) [1 2 3])', seq([0, 0, 0]));
      });
    });
    describe('(repeat x), (repeat n x)', function() {
      return it('returns a lazy sequence of (infinite, or n if given) xs', function() {
        throws('(repeat 3 5 6)');
        throws('(repeat true? 3)');
        eq('(take 5 (repeat 3))', seq([3, 3, 3, 3, 3]));
        return eq('(repeat 5 3)', seq([3, 3, 3, 3, 3]));
      });
    });
    describe('(repeatedly f), (repeatedly n f)', function() {
      return it('returns a lazy sequence of (infinite, or n if given) calls to the zero-arg function f', function() {
        throws('(repeatedly 3 rand rand)');
        throws('(repeat true? rand)');
        throws('(repeatedly 3 3)');
        throws('(repeatedly 3)');
        truthy('(every? #{0 1} (take 50 (repeatedly #(rand-int 2))))');
        return truthy('(every? #{0 1} (repeatedly 50 #(rand-int 2)))');
      });
    });
    describe('(comp fs)', function() {
      return it('returns the composition of the given functions (the returned function takes a variable number of arguments)', function() {
        throws('(comp - 3)');
        eq('((comp) [1 2 3])', vec([1, 2, 3]));
        eq('((comp - /) 8 3)', -8 / 3);
        eq('((comp str +) 8 4 5)', '17');
        return eq('(def count-if (comp count filter)) (count-if even? [2 3 1 5 4])', 2);
      });
    });
    return describe('(partial f args)', function() {
      return it('partially applies f to the given args, returning a function that can be invoked with more args to f', function() {
        throws('(partial)');
        throws('(partial true)');
        throws('((partial identity))');
        eq('((partial identity) 3)', 3);
        eq('((partial identity 3))', 3);
        return eq('(def times-hundred (partial * 100)) (times-hundred 5)', 500);
      });
    });
  });

}).call(this);
