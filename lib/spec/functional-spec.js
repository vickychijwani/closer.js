(function() {
  var closerAssertions, closerCore, emptySeq, eq, evaluate, falsy, key, list, map, nil, repl, seq, set, throws, truthy, vec, _, __$this, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
    __slice = [].slice;

  _ = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window._ : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self._ : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global._ : void 0) != null ? _ref : require('lodash-node');

  repl = require('../src/repl');

  closerCore = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.closerCore : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.closerCore : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.closerCore : void 0) != null ? _ref3 : require('../src/closer-core');

  closerAssertions = (_ref6 = (_ref7 = (_ref8 = typeof window !== "undefined" && window !== null ? window.closerAssertions : void 0) != null ? _ref8 : typeof self !== "undefined" && self !== null ? self.closerAssertions : void 0) != null ? _ref7 : typeof global !== "undefined" && global !== null ? global.closerAssertions : void 0) != null ? _ref6 : require('../src/assertions');

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

  evaluate = function(src, options) {
    return eval(repl.generateJS(src, options));
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
    return expect(evaluate(src)).toCljEqual(true);
  };

  falsy = function(src) {
    return expect(evaluate(src)).toCljEqual(false);
  };

  nil = function(src) {
    return expect(evaluate(src)).toCljEqual(null);
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

  __$this = (function() {
    var Soldier;
    Soldier = (function() {
      function Soldier(enemy) {
        if (enemy == null) {
          enemy = null;
        }
        this.pos = {
          x: 0,
          y: 0
        };
        this.enemy = enemy;
      }

      Soldier.prototype['move-x-y'] = function(x, y) {
        this.pos.x = x;
        return this.pos.y = y;
      };

      return Soldier;

    })();
    return new Soldier(new Soldier());
  })();

  describe('Functional tests', function() {
    it('identifiers can shadow core functions', function() {
      eq('(min 1 2 3)', 1);
      throws('(def min 2), (min 1 2 3)');
      throws('(defn min [x] x), (min 1 2 3)');
      eq('(def min 2), min', 2);
      eq('(let [] (def min 2)), (min 1 2 3)', 1);
      eq('(def m (min 1 2 3)), (let [] (def min 2)), m', 1);
      throws('(defn blah [min] (min 1 2 3)), (blah 2)');
      eq('(defn blah [min] (min 1 2 3)), (blah min)', 1);
      return eq('[(min 1 2 3), (let [min 1 max 9] (range min max)), (min 1 2 3), ((fn [min max] (range min max)) 1 9)]', vec(1, seq([1, 2, 3, 4, 5, 6, 7, 8]), 1, seq([1, 2, 3, 4, 5, 6, 7, 8])));
    });
    it('identifiers must never shadow special forms', function() {
      eq('(let [fn 45] [fn ((fn [] "b"))])', vec(45, 'b'));
      return eq('(let [if 45] [if (if false "a" "b")])', vec(45, 'b'));
    });
    it('closures', function() {
      return eq('(defn adder [x] (fn [y] (+ x y))), (def add-3 (adder 3)), (add-3 4)', 7);
    });
    it('js interop - \'this\' access', function() {
      __$this['move-x-y'](0, 0);
      __$this.enemy['move-x-y'](10, 20);
      return eq('(let [epos (.pos (.enemy this))] (.move-x-y this (.x epos) (.y epos))) [(.x (.pos this)) (.y (.pos this))]', vec(10, 20));
    });
    it('loop + recur', function() {
      return eq('(loop [x 5 coll []] (if (zero? x) coll (recur (dec x) (conj coll x))))', vec([5, 4, 3, 2, 1]));
    });
    it('defn / fn + recur', function() {
      return eq('(defn factorial [n] ((fn [n acc] (if (zero? n) acc (recur (dec n) (* acc n)))) n 1)) (map factorial (range 1 6))', seq([1, 2, 6, 24, 120]));
    });
    it('lexical scoping in dotimes and doseq forms', function() {
      eq('(defn x [n] (+ n 1)) (doseq [x (range 7)] (+ x 3)) (x 10034)', 10035);
      return eq('(defn x [n] (+ n 1)) (dotimes [x 7] (+ x 3)) (x 10034)', 10035);
    });
    it('let within loop', function() {
      eq('(loop [i 10] (let [i i] (if (zero? i) i (recur (dec i)))))', 0);
      return eq('(loop [i 10] (let [j i] (if (zero? j) j (recur (dec j)))))', 0);
    });
    it('destructuring forms', function() {
      eq('(defn blah [[a b & c :as coll1] d e & [f g & h :as coll2]] {:args [a b c d e f g h] :coll1 coll1 :coll2 coll2}) (blah [1 2 3 4] 5 6 7 8 9)', map(key('args'), vec(1, 2, seq([3, 4]), 5, 6, 7, 8, seq([9])), key('coll1'), vec([1, 2, 3, 4]), key('coll2'), seq([7, 8, 9])));
      throws('(fn [[a :as coll1] :as coll2])');
      throws('(fn [[:as coll1 a]])');
      nil('((fn [[x]] x) [])');
      eq('(defn blah [{{[a {:as m, :keys [b], e :d, :strs [c]}] [3 4]} :a}] [a b c e]) (blah {:a {\'(3 4) [1 {:b true, :d :e, "c" :c}]}})', vec(1, true, key('c'), key('e')));
      eq('(defn blah [{a 0 {b 0 c 1} 1}] [a b c]) (blah ["hello" "world"])', vec('hello', 'w', 'o'));
      eq('(let [[a b] [1 {:d "d" \'(3 4) true}] {:keys [d] e [3 4]} b] [a d e])', vec(1, 'd', true));
      return eq('(loop [[a :as coll] [1 2 3 4] copy \'()] (if a (recur (rest coll) (conj copy a)) copy))', list([4, 3, 2, 1]));
    });
    it('averaging numbers', function() {
      eq('(defn avg [& xs] (/ (apply + xs) (count xs))) (avg 1 2 3 4)', 2.5);
      return eq('(#(/ (apply + %&) (count %&)) 1 2 3 4)', 2.5);
    });
    it('quick sort', function() {
      return eq('(defn qsort [[pivot :as coll]] (if pivot (concat (qsort (filter #(< % pivot) coll)) (filter #{pivot} coll) (qsort (filter #(> % pivot) coll))))) (qsort [8 3 7 3 2 10 1])', seq([1, 2, 3, 3, 7, 8, 10]));
    });
    return it('fibonacci sequence', function() {
      return eq('(defn fib-seq [] (map first (iterate (fn [[a b]] [b (+ a b)]) [0 1]))) (take 10 (fib-seq))', seq([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]));
    });
  });

}).call(this);
