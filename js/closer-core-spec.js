(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var assertions, closerCore, emptySeq, eq, evaluate, falsy, key, list, map, nil, parseOpts, repl, seq, set, throws, truthy, vec, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
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
        falsy('(not= #(+ x y))');
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/repl":7}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function (global){
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./assertions":2}],4:[function(require,module,exports){
(function() {
  var Closer, Parser, builder, closer, con, nodes, oldParse, parser;

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
    this.yy.options = options || {};
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

  if (typeof self !== "undefined" && self !== null) {
    self.closer = closer;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closer = closer;
  }

}).call(this);

},{"./nodes":5,"./parser":6}],5:[function(require,module,exports){
(function() {
  exports.forceNoLoc = false;

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
        if (exports.forceNoLoc === true) {
          delete obj.loc;
        }
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

},{}],6:[function(require,module,exports){
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
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"IdentifierList":5,"Keyword":6,"COLON":7,"AnonArg":8,"ANON_ARG":9,"Atom":10,"INTEGER":11,"FLOAT":12,"STRING":13,"true":14,"false":15,"nil":16,"CollectionLiteral":17,"[":18,"items":19,"]":20,"QUOTE":21,"(":22,")":23,"{":24,"SExprPairs[items]":25,"}":26,"SHARP":27,"Fn":28,"List":29,"AnonFnLiteral":30,"IdOrDestrucForm":31,"DestructuringForm":32,"IdOrDestrucList":33,"FnArgs":34,"&":35,"AsForm":36,"AS":37,"MapDestrucArgs":38,"KEYS":39,"STRS":40,"SExpr":41,"asForm":42,"FnArgsAndBody":43,"BlockStatementWithReturn":44,"FnDefinition":45,"FN":46,"DEFN":47,"ConditionalExpr":48,"IF":49,"SExpr[test]":50,"SExprStmt[consequent]":51,"alternate":52,"WHEN":53,"BlockStatement[consequent]":54,"LogicalExpr":55,"AND":56,"exprs":57,"OR":58,"VarDeclaration":59,"DEF":60,"init":61,"LetBinding":62,"LetBindings":63,"LetForm":64,"LET":65,"DoForm":66,"LoopForm":67,"LOOP":68,"BlockStatement":69,"RecurForm":70,"RECUR":71,"args":72,"DoTimesForm":73,"DOTIMES":74,"WhileForm":75,"WHILE":76,"DotForm":77,"DOT":78,"IDENTIFIER[prop]":79,"SExpr[obj]":80,"SETVAL":81,"DO":82,"SExprStmt":83,"SExprPairs":84,"SExprs":85,"NonEmptyDoForm":86,"Program":87,"END-OF-FILE":88,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",7:"COLON",9:"ANON_ARG",11:"INTEGER",12:"FLOAT",13:"STRING",14:"true",15:"false",16:"nil",18:"[",20:"]",21:"QUOTE",22:"(",23:")",24:"{",25:"SExprPairs[items]",26:"}",27:"SHARP",35:"&",37:"AS",39:"KEYS",40:"STRS",46:"FN",47:"DEFN",49:"IF",50:"SExpr[test]",51:"SExprStmt[consequent]",53:"WHEN",54:"BlockStatement[consequent]",56:"AND",58:"OR",60:"DEF",65:"LET",68:"LOOP",71:"RECUR",74:"DOTIMES",76:"WHILE",78:"DOT",79:"IDENTIFIER[prop]",80:"SExpr[obj]",81:"SETVAL",82:"DO",88:"END-OF-FILE"},
productions_: [0,[3,1],[5,0],[5,2],[6,2],[8,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[17,3],[17,4],[17,3],[17,4],[28,1],[28,1],[28,1],[28,3],[28,1],[28,1],[31,1],[31,1],[33,0],[33,2],[34,1],[34,3],[36,2],[38,0],[38,2],[38,5],[38,5],[38,3],[32,4],[32,3],[43,4],[45,2],[45,3],[30,4],[48,4],[48,3],[55,2],[55,2],[59,3],[62,2],[63,2],[63,0],[64,5],[67,5],[70,2],[73,6],[75,3],[77,4],[29,0],[29,1],[29,1],[29,1],[29,1],[29,1],[29,3],[29,1],[29,1],[29,1],[29,1],[29,1],[29,2],[29,2],[41,1],[41,1],[41,3],[41,1],[83,1],[84,0],[84,3],[85,1],[85,2],[86,1],[66,1],[66,0],[69,1],[44,1],[87,2],[87,1],[19,0],[19,1],[42,0],[42,1],[52,0],[52,1],[57,0],[57,1],[61,0],[61,1],[72,0],[72,1]],
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
case 52:
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
case 53:
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
case 54:
        var init = parseVarDecl($$[$0-3],
            parseNumLiteral('Integer', '0', yy.loc(_$[$0-3]), yy),
            yy.loc(_$[$0-3]), yy);
        var maxId = yy.Node('Identifier', '__$max', yy.loc(_$[$0-2]));
        addVarDecl(init, maxId, $$[$0-2], yy.loc(_$[$0-2]), yy);
        var test = yy.Node('BinaryExpression', '<', $$[$0-3], maxId, yy.loc(_$[$0-3]));
        var update = yy.Node('UpdateExpression', '++', $$[$0-3], true, yy.loc(_$[$0-3]));
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 55:
        var whileLoop = yy.Node('WhileStatement', $$[$0-1], $$[$0], yy.loc(_$[$0-2]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([whileLoop], yy.loc(_$[$0-2]), yy);
        this.$ = whileLoop;
    
break;
case 56:
        $$[$0] = getValueIfUndefined($$[$0], []);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Literal', $$[$0-2], yy.loc(_$[$0-2])),
            true, yy.loc(_$[$0-3]));
        var fnCall = yy.Node('CallExpression', callee, $$[$0], yy.loc(_$[$0-3]));
        if ($$[$0].length > 0) {
            this.$ = fnCall;
        } else {
            // (.prop obj) can either be a call to a 0-argument fn, or a property access.
            // if both are possible, the function call is chosen.
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
case 57: this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 63: this.$ = yy.Node('AssignmentExpression', '=', $$[$0-1], $$[$0], yy.loc(_$[$0-2])); 
break;
case 69:
        yy.locComb(this._$, _$[$0]);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Identifier', 'call', yy.loc(_$[$0-1])),
            false, yy.loc(_$[$0-1]));
        $$[$0] = getValueIfUndefined($$[$0], []);
        $$[$0].unshift(yy.Node('Literal', null, yy.loc(_$[$0-1])));   // value for "this"
        this.$ = yy.Node('CallExpression', callee, $$[$0], yy.loc(this._$));
    
break;
case 70: this.$ = wrapInIIFE($$[$0], yy.loc(_$[$0-1]), yy); 
break;
case 71: this.$ = $$[$0]; 
break;
case 72: this.$ = $$[$0]; 
break;
case 73: this.$ = $$[$0-1]; 
break;
case 75: this.$ = wrapInExpressionStatement($$[$0], yy); 
break;
case 76: this.$ = []; 
break;
case 77: this.$ = $$[$0-2]; $$[$0-2].push($$[$0-1], $$[$0]); 
break;
case 78: this.$ = [$$[$0]]; 
break;
case 79:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 80:
        for (var i = 0, len = $$[$0].length; i < len; ++i) {
            $$[$0][i] = wrapInExpressionStatement($$[$0][i], yy);
        }
    
break;
case 82:
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 83:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 84:
        this.$ = createReturnStatementIfPossible($$[$0], yy);
    
break;
case 85:
        var prog = yy.Node('Program', $$[$0-1], yy.loc(_$[$0-1]));
        destrucArgIdx = 0;
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
case 86:
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
            range: [0, 0]
        });
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
}
},
table: [{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,85:4,86:2,87:1,88:[1,3]},{1:[3]},{88:[1,26]},{1:[2,86]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,80],24:[1,21],27:[1,22],30:9,41:27,88:[2,80]},{4:[2,78],7:[2,78],9:[2,78],11:[2,78],12:[2,78],13:[2,78],14:[2,78],15:[2,78],16:[2,78],18:[2,78],20:[2,78],21:[2,78],22:[2,78],23:[2,78],24:[2,78],26:[2,78],27:[2,78],88:[2,78]},{4:[2,71],7:[2,71],9:[2,71],11:[2,71],12:[2,71],13:[2,71],14:[2,71],15:[2,71],16:[2,71],18:[2,71],20:[2,71],21:[2,71],22:[2,71],23:[2,71],24:[2,71],26:[2,71],27:[2,71],37:[2,71],39:[2,71],40:[2,71],88:[2,71]},{4:[2,72],7:[2,72],9:[2,72],11:[2,72],12:[2,72],13:[2,72],14:[2,72],15:[2,72],16:[2,72],18:[2,72],20:[2,72],21:[2,72],22:[2,72],23:[2,72],24:[2,72],26:[2,72],27:[2,72],37:[2,72],39:[2,72],40:[2,72],88:[2,72]},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:28,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,74],7:[2,74],9:[2,74],11:[2,74],12:[2,74],13:[2,74],14:[2,74],15:[2,74],16:[2,74],18:[2,74],20:[2,74],21:[2,74],22:[2,74],23:[2,74],24:[2,74],26:[2,74],27:[2,74],37:[2,74],39:[2,74],40:[2,74],88:[2,74]},{4:[2,6],7:[2,6],9:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],18:[2,6],20:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],26:[2,6],27:[2,6],37:[2,6],39:[2,6],40:[2,6],88:[2,6]},{4:[2,7],7:[2,7],9:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],18:[2,7],20:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],26:[2,7],27:[2,7],37:[2,7],39:[2,7],40:[2,7],88:[2,7]},{4:[2,8],7:[2,8],9:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],18:[2,8],20:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],26:[2,8],27:[2,8],37:[2,8],39:[2,8],40:[2,8],88:[2,8]},{4:[2,9],7:[2,9],9:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],18:[2,9],20:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],26:[2,9],27:[2,9],37:[2,9],39:[2,9],40:[2,9],88:[2,9]},{4:[2,10],7:[2,10],9:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],18:[2,10],20:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],26:[2,10],27:[2,10],37:[2,10],39:[2,10],40:[2,10],88:[2,10]},{4:[2,11],7:[2,11],9:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11],20:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],26:[2,11],27:[2,11],37:[2,11],39:[2,11],40:[2,11],88:[2,11]},{4:[2,12],7:[2,12],9:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12],20:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],26:[2,12],27:[2,12],37:[2,12],39:[2,12],40:[2,12],88:[2,12]},{4:[2,13],7:[2,13],9:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13],20:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],26:[2,13],27:[2,13],37:[2,13],39:[2,13],40:[2,13],88:[2,13]},{4:[2,14],7:[2,14],9:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14],20:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],26:[2,14],27:[2,14],37:[2,14],39:[2,14],40:[2,14],88:[2,14]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:61,20:[2,87],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,85:62},{22:[1,63]},{4:[2,76],7:[2,76],9:[2,76],11:[2,76],12:[2,76],13:[2,76],14:[2,76],15:[2,76],16:[2,76],18:[2,76],21:[2,76],22:[2,76],24:[2,76],26:[2,76],27:[2,76],84:64},{22:[1,66],24:[1,65]},{4:[1,67]},{4:[2,1],7:[2,1],9:[2,1],11:[2,1],12:[2,1],13:[2,1],14:[2,1],15:[2,1],16:[2,1],18:[2,1],20:[2,1],21:[2,1],22:[2,1],23:[2,1],24:[2,1],26:[2,1],27:[2,1],35:[2,1],37:[2,1],39:[2,1],40:[2,1],88:[2,1]},{4:[2,5],7:[2,5],9:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],18:[2,5],20:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],26:[2,5],27:[2,5],37:[2,5],39:[2,5],40:[2,5],88:[2,5]},{1:[2,85]},{4:[2,79],7:[2,79],9:[2,79],11:[2,79],12:[2,79],13:[2,79],14:[2,79],15:[2,79],16:[2,79],18:[2,79],20:[2,79],21:[2,79],22:[2,79],23:[2,79],24:[2,79],26:[2,79],27:[2,79],88:[2,79]},{23:[1,68]},{23:[2,58]},{23:[2,59]},{23:[2,60]},{23:[2,61]},{23:[2,62]},{3:69,4:[1,24]},{23:[2,64]},{23:[2,65]},{23:[2,66]},{23:[2,67]},{23:[2,68]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:70,85:71},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:72,85:4,86:73},{18:[1,75],43:74},{3:76,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:77},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:78},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,93],24:[1,21],27:[1,22],30:9,41:5,57:79,85:80},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,93],24:[1,21],27:[1,22],30:9,41:5,57:81,85:80},{3:82,4:[1,24]},{18:[1,83]},{18:[1,84]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:85,85:71},{18:[1,86]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:87},{4:[1,88]},{4:[2,19],7:[2,19],9:[2,19],11:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],18:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],27:[2,19]},{4:[2,20],7:[2,20],9:[2,20],11:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],18:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],27:[2,20]},{4:[2,21],7:[2,21],9:[2,21],11:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],18:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],27:[2,21]},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:89,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,23],7:[2,23],9:[2,23],11:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],18:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],27:[2,23]},{4:[2,24],7:[2,24],9:[2,24],11:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],18:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],27:[2,24]},{20:[1,90]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],20:[2,88],21:[1,20],22:[1,8],23:[2,88],24:[1,21],26:[2,88],27:[1,22],30:9,41:27},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:91,21:[1,20],22:[1,8],23:[2,87],24:[1,21],27:[1,22],30:9,41:5,85:62},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],26:[1,92],27:[1,22],30:9,41:93},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:94,21:[1,20],22:[1,8],24:[1,21],26:[2,87],27:[1,22],30:9,41:5,85:62},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:95,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,4],7:[2,4],9:[2,4],11:[2,4],12:[2,4],13:[2,4],14:[2,4],15:[2,4],16:[2,4],18:[2,4],20:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],26:[2,4],27:[2,4],37:[2,4],39:[2,4],40:[2,4],88:[2,4]},{4:[2,73],7:[2,73],9:[2,73],11:[2,73],12:[2,73],13:[2,73],14:[2,73],15:[2,73],16:[2,73],18:[2,73],20:[2,73],21:[2,73],22:[2,73],23:[2,73],24:[2,73],26:[2,73],27:[2,73],37:[2,73],39:[2,73],40:[2,73],88:[2,73]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:96},{23:[2,69]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,98],24:[1,21],27:[1,22],30:9,41:27},{23:[2,70]},{23:[2,81]},{23:[2,40]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:98,34:97,35:[2,27]},{18:[1,75],43:99},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:101,83:100},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:102,85:4,86:73},{23:[2,45]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,94],24:[1,21],27:[1,22],30:9,41:27},{23:[2,46]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,95],24:[1,21],27:[1,22],30:9,41:105,61:104},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:106},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:107},{23:[2,53]},{3:108,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:109,85:4,86:73},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:110},{23:[1,111]},{4:[2,15],7:[2,15],9:[2,15],11:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],18:[2,15],20:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],26:[2,15],27:[2,15],37:[2,15],39:[2,15],40:[2,15],88:[2,15]},{23:[1,112]},{4:[2,17],7:[2,17],9:[2,17],11:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],18:[2,17],20:[2,17],21:[2,17],22:[2,17],23:[2,17],24:[2,17],26:[2,17],27:[2,17],37:[2,17],39:[2,17],40:[2,17],88:[2,17]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:113},{26:[1,114]},{23:[1,115]},{23:[2,63]},{20:[1,116]},{3:119,4:[1,24],18:[1,121],20:[2,29],24:[1,122],31:118,32:120,35:[1,117],37:[2,29]},{23:[2,41]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,91],24:[1,21],27:[1,22],30:9,41:101,52:123,83:124},{4:[2,75],7:[2,75],9:[2,75],11:[2,75],12:[2,75],13:[2,75],14:[2,75],15:[2,75],16:[2,75],18:[2,75],21:[2,75],22:[2,75],23:[2,75],24:[2,75],27:[2,75]},{23:[2,44]},{23:[2,83]},{23:[2,47]},{23:[2,96]},{3:119,4:[1,24],18:[1,121],20:[1,125],24:[1,122],31:127,32:120,62:126},{3:119,4:[1,24],18:[1,121],20:[1,128],24:[1,122],31:127,32:120,62:126},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:129},{23:[2,55]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:130,85:71},{4:[2,22],7:[2,22],9:[2,22],11:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],18:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],27:[2,22]},{4:[2,16],7:[2,16],9:[2,16],11:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],18:[2,16],20:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],26:[2,16],27:[2,16],37:[2,16],39:[2,16],40:[2,16],88:[2,16]},{4:[2,77],7:[2,77],9:[2,77],11:[2,77],12:[2,77],13:[2,77],14:[2,77],15:[2,77],16:[2,77],18:[2,77],21:[2,77],22:[2,77],24:[2,77],26:[2,77],27:[2,77]},{4:[2,18],7:[2,18],9:[2,18],11:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],18:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],26:[2,18],27:[2,18],37:[2,18],39:[2,18],40:[2,18],88:[2,18]},{4:[2,42],7:[2,42],9:[2,42],11:[2,42],12:[2,42],13:[2,42],14:[2,42],15:[2,42],16:[2,42],18:[2,42],20:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],26:[2,42],27:[2,42],37:[2,42],39:[2,42],40:[2,42],88:[2,42]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,44:131,66:103,69:132,85:4,86:73},{3:119,4:[1,24],18:[1,121],24:[1,122],31:133,32:120},{4:[2,28],18:[2,28],20:[2,28],24:[2,28],35:[2,28],37:[2,28]},{4:[2,25],7:[2,25],9:[2,25],11:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],18:[2,25],20:[2,25],21:[2,25],22:[2,25],24:[2,25],27:[2,25],35:[2,25],37:[2,25]},{4:[2,26],7:[2,26],9:[2,26],11:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],18:[2,26],20:[2,26],21:[2,26],22:[2,26],24:[2,26],27:[2,26],35:[2,26],37:[2,26]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:98,34:134,35:[2,27],37:[2,27]},{4:[2,32],18:[2,32],24:[2,32],26:[2,32],37:[2,32],38:135,39:[2,32],40:[2,32]},{23:[2,43]},{23:[2,92]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:136,85:4,86:73},{4:[2,49],18:[2,49],20:[2,49],24:[2,49]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:137},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:138,85:4,86:73},{20:[1,139]},{23:[2,56]},{23:[2,39]},{23:[2,84]},{20:[2,30],37:[2,30]},{20:[2,89],36:141,37:[1,142],42:140},{3:119,4:[1,24],18:[1,121],24:[1,122],26:[1,143],31:147,32:120,36:144,37:[1,142],39:[1,145],40:[1,146]},{23:[2,51]},{4:[2,48],18:[2,48],20:[2,48],24:[2,48]},{23:[2,52]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:148,85:4,86:73},{20:[1,149]},{20:[2,90]},{3:150,4:[1,24]},{4:[2,38],7:[2,38],9:[2,38],11:[2,38],12:[2,38],13:[2,38],14:[2,38],15:[2,38],16:[2,38],18:[2,38],20:[2,38],21:[2,38],22:[2,38],24:[2,38],27:[2,38],35:[2,38],37:[2,38]},{4:[2,33],18:[2,33],24:[2,33],26:[2,33],37:[2,33],39:[2,33],40:[2,33]},{18:[1,151]},{18:[1,152]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:153},{23:[2,54]},{4:[2,37],7:[2,37],9:[2,37],11:[2,37],12:[2,37],13:[2,37],14:[2,37],15:[2,37],16:[2,37],18:[2,37],20:[2,37],21:[2,37],22:[2,37],24:[2,37],27:[2,37],35:[2,37],37:[2,37]},{4:[2,31],18:[2,31],20:[2,31],24:[2,31],26:[2,31],37:[2,31],39:[2,31],40:[2,31]},{4:[2,2],5:154,20:[2,2]},{4:[2,2],5:155,20:[2,2]},{4:[2,36],18:[2,36],24:[2,36],26:[2,36],37:[2,36],39:[2,36],40:[2,36]},{3:157,4:[1,24],20:[1,156]},{3:157,4:[1,24],20:[1,158]},{4:[2,34],18:[2,34],24:[2,34],26:[2,34],37:[2,34],39:[2,34],40:[2,34]},{4:[2,3],20:[2,3]},{4:[2,35],18:[2,35],24:[2,35],26:[2,35],37:[2,35],39:[2,35],40:[2,35]}],
defaultActions: {3:[2,86],26:[2,85],29:[2,58],30:[2,59],31:[2,60],32:[2,61],33:[2,62],35:[2,64],36:[2,65],37:[2,66],38:[2,67],39:[2,68],70:[2,69],72:[2,70],73:[2,81],74:[2,40],79:[2,45],81:[2,46],85:[2,53],96:[2,63],99:[2,41],102:[2,44],103:[2,83],104:[2,47],105:[2,96],109:[2,55],123:[2,43],124:[2,92],130:[2,56],131:[2,39],132:[2,84],136:[2,51],138:[2,52],141:[2,90],148:[2,54]},
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

var destrucArgIdx = 0;
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
case 16:return 78;
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
case 22:return 82;
break;
case 23:return 65;
break;
case 24:return 68;
break;
case 25:return 71;
break;
case 26:return 56;
break;
case 27:return 58;
break;
case 28:return 81;
break;
case 29:return 74;
break;
case 30:return 76;
break;
case 31:return 37;
break;
case 32:return 39;
break;
case 33:return 40;
break;
case 34:return 14;
break;
case 35:return 15;
break;
case 36:return 16;
break;
case 37:
    return 4;

break;
case 38:return 'ILLEGAL-TOKEN';
break;
case 39: return 88; 
break;
case 40:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s,]+))/,/^(?:([-+]?([1-9][0-9]+|[0-9])))/,/^(?:([-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])*"))/,/^(?:(%(&|[1-9]|[0-9]|)?))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:#)/,/^(?:')/,/^(?::)/,/^(?:\.)/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:when)/,/^(?:do)/,/^(?:let)/,/^(?:loop)/,/^(?:recur)/,/^(?:and)/,/^(?:or)/,/^(?:set!)/,/^(?:dotimes)/,/^(?:while)/,/^(?::as)/,/^(?::keys)/,/^(?::strs)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*))/,/^(?:.)/,/^(?:$)/,/^(?:.)/],
conditions: {"regex":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":true}}
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
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":9,"estraverse":26,"fs":8,"path":10}],7:[function(require,module,exports){
(function (global){
(function() {
  var closer, closerCore, escodegen, estraverse, wireCallsToCore, wireThisAccess, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('./closer');

  closerCore = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.closerCore : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.closerCore : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.closerCore : void 0) != null ? _ref3 : require('./closer-core');

  escodegen = require('escodegen');

  estraverse = require('estraverse');

  wireCallsToCore = function(ast) {
    estraverse.replace(ast, {
      leave: function(node) {
        var obj, prop;
        if (node.type === 'Identifier' && node.name in closerCore) {
          obj = closer.node('Identifier', 'closerCore', node.loc);
          prop = closer.node('Identifier', node.name, node.loc);
          node = closer.node('MemberExpression', obj, prop, false, node.loc);
        }
        return node;
      }
    });
    return ast;
  };

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

  exports.parse = function(src, options) {
    return wireThisAccess(wireCallsToCore(closer.parse(src, options)));
  };

  exports.generateJS = function(src, options) {
    return escodegen.generate(exports.parse(src, options));
  };

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./closer":4,"./closer-core":3,"escodegen":11,"estraverse":26}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":9}],11:[function(require,module,exports){
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
},{"./package.json":25,"estraverse":26,"esutils":14,"source-map":15}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./code":12}],14:[function(require,module,exports){
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

},{"./code":12,"./keyword":13}],15:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":20,"./source-map/source-map-generator":21,"./source-map/source-node":22}],16:[function(require,module,exports){
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

},{"./util":23,"amdefine":24}],17:[function(require,module,exports){
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

},{"./base64":18,"amdefine":24}],18:[function(require,module,exports){
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

},{"amdefine":24}],19:[function(require,module,exports){
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

},{"amdefine":24}],20:[function(require,module,exports){
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

},{"./array-set":16,"./base64-vlq":17,"./binary-search":19,"./util":23,"amdefine":24}],21:[function(require,module,exports){
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

},{"./array-set":16,"./base64-vlq":17,"./util":23,"amdefine":24}],22:[function(require,module,exports){
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

},{"./source-map-generator":21,"./util":23,"amdefine":24}],23:[function(require,module,exports){
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

},{"amdefine":24}],24:[function(require,module,exports){
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
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":9,"path":10}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}]},{},[1])