types = require '../closer-types'
global_helpers = require './closer-helpers'
helpers = require './closer-core-helpers'
evaluate = helpers.evaluate

beforeEach -> @addMatchers toDeepEqual: global_helpers.toDeepEqual
eq = (src, expected) -> expect(evaluate src).toDeepEqual expected
throws = (src) -> expect(-> evaluate src).toThrow()
truthy = (src) -> eq src, types.Boolean.true
falsy = (src) -> eq src, types.Boolean.false

describe 'Closer core library', ->

  # arithmetic
  describe '(+ x y & more)', ->
    it 'adds the given numbers', ->
      throws '(+ "string")'
      eq '(+)', new types.Integer 0
      eq '(+ 3.3 0 -6e2 2)', new types.Float -594.7

  describe '(- x y & more)', ->
    it 'subtracts all but the first number from the first one', ->
      throws '(-)'
      throws '(- "string")'
      eq '(- -3.54)', new types.Float 3.54
      eq '(- 10 3.5 -4)', new types.Float 10.5

  describe '(* x y & more)', ->
    it 'multiplies the given numbers', ->
      throws '(* "string")'
      eq '(*)', new types.Integer 1
      eq '(* 3 -6)', new types.Integer -18

  describe '(/ x y & more)', ->
    it 'divides the first number by the rest', ->
      throws '(/)'
      throws '(/ "string")'
      eq '(/ -4)', new types.Float -0.25
      eq '(/ 14 -2)', new types.Integer -7
      eq '(/ 14 -2.0)', new types.Float -7
      eq '(/ 14 -2 -2)', new types.Float 3.5

  describe '(inc x)', ->
    it 'increments x by 1', ->
      throws '(inc 2 3 4)'
      throws '(inc "string")'
      eq '(inc -2e-3)', new types.Float 0.998

  describe '(dec x)', ->
    it 'decrements x by 1', ->
      throws '(dec 2 3 4)'
      throws '(dec "string")'
      eq '(dec -2e-3)', new types.Float -1.002

  describe '(max x y & more)', ->
    it 'finds the maximum of the given numbers', ->
      throws '(max)'
      throws '(max "string" [1 2])'
      eq '(max -1e10 653.32 1.345e4)', new types.Float 1.345e4

  describe '(min x y & more)', ->
    it 'finds the minimum of the given numbers', ->
      throws '(min)'
      throws '(min "string" [1 2])'
      eq '(min -1e10 653.32 1.345e4)', new types.Float -1e10

  describe '(quot num div)', ->
    it 'computes the quotient of dividing num by div', ->
      throws '(quot 10)'
      throws '(quot [1 2] 3)'
      eq '(quot 10 3)', new types.Integer 3
      eq '(quot -5.9 3)', new types.Float -1.0
      eq '(quot -10 -3)', new types.Integer 3
      eq '(quot 10 -3)', new types.Integer -3

  describe '(rem num div)', ->
    it 'computes the remainder of dividing num by div (same as % in other languages)', ->
      throws '(rem 10)'
      throws '(rem [1 2] 3)'
      eq '(rem 10.1 3)', new types.Float 10.1 % 3
      eq '(rem -10.1 3)', new types.Float -10.1 % 3
      eq '(rem -10.1 -3)', new types.Float -10.1 % -3
      eq '(rem 10.1 -3)', new types.Float 10.1 % -3

  describe '(mod num div)', ->
    it 'computes the modulus of num and div (NOT the same as % in other languages)', ->
      throws '(mod 10)'
      throws '(mod [1 2] 3)'
      eq '(mod 10.1 3)', new types.Float 10.1 % 3
      eq '(mod -10.1 3)', new types.Float 3 - 10.1 % 3
      eq '(mod -10.1 -3)', new types.Float -10.1 % 3
      eq '(mod 10.1 -3)', new types.Float 10.1 % 3 - 3


  # comparison
  describe '(= x y & more)', ->
    it 'returns true if all its arguments are equal (by value, not identity)', ->
      throws '(=)'
      truthy '(= nil nil)'
      truthy '(= 1)'
      truthy '(= (fn [x y] (+ x y)))'   # always returns true for 1 arg
      truthy '(let [a 1] (= a a (/ 4 (+ 2 2)) (mod 5 4)))'
      falsy '(let [a 1] (= a a (/ 4 (+ 2 2)) (mod 5 3)))'
      falsy '(= 1 1.0)'
      truthy '(= 1.0 (/ 2.0 2))'
      truthy '(= "hello" "hello")'
      truthy '(= true (= 4 (* 2 2)))'
      falsy '(= true (= 4 (* 2 3)))'
      truthy '(= [3 4] \'(3 4))'
      truthy '(= [3 4] \'((+ 2 1) (/ 16 4)))'
      falsy '(= [3 4] \'((+ 2 1) (/ 16 8)))'
      falsy '(= [3 4] \'((+ 2 1) (/ 16 4) 5))'
      truthy '(= #{1 2} #{2 1})'
      falsy '(= #{1 2} #{2 1 3})'
      falsy '(= #{1 2} [2 1])'

  describe '(not= x y & more)', ->
    it 'returns true if some of its arguments are unequal (by value, not identity)', ->
      throws '(not=)'
      falsy '(not= nil nil)'
      falsy '(not= 1)'
      falsy '(not= (fn [x y] (+ x y)))'   # always falsy for 1 arg
      falsy '(let [a 1] (not= a a (/ 4 (+ 2 2)) (mod 5 4)))'
      truthy '(let [a 1] (not= a a (/ 4 (+ 2 2)) (mod 5 3)))'
      truthy '(not= 1 1.0)'
      falsy '(not= 1.0 (/ 2.0 2))'
      falsy '(not= "hello" "hello")'
      falsy '(not= true (= 4 (* 2 2)))'
      truthy '(not= true (= 4 (* 2 3)))'
      falsy '(not= [3 4] \'(3 4))'
      falsy '(not= [3 4] \'((+ 2 1) (/ 16 4)))'
      truthy '(not= [3 4] \'((+ 2 1) (/ 16 8)))'
      truthy '(not= [3 4] \'((+ 2 1) (/ 16 4) 5))'
      falsy '(not= #{1 2} #{2 1})'
      truthy '(not= #{1 2} #{2 1 3})'
      truthy '(not= #{1 2} [2 1])'

  describe '(== x y & more)', ->
    it 'returns true if all its arguments are numeric and equal', ->
      throws '(==)'
      throws '(== "hello" "hello")'
      truthy '(== [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(let [a 2] (== a a 2.0 (/ 8 (+ 2 2.0))))'

  describe '(< x y & more)', ->
    it 'returns true if its arguments are in monotonically increasing order', ->
      throws '(<)'
      throws '(< "hello" "hello")'
      truthy '(< [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(< 0.76 3.45 (+ 2 2) 5)'
      falsy '(< 0.76 3.45 (+ 2 2) 3)'
      falsy '(< 0.76 3.45 (+ 2 2) 4)'
      throws '(< 0.76 3.45 (+ 2 2) nil)'

  describe '(> x y & more)', ->
    it 'returns true if its arguments are in monotonically decreasing order', ->
      throws '(>)'
      throws '(> "hello" "hello")'
      truthy '(> [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(> 5 (+ 2 2) 3.45 0.76)'
      falsy '(> 3 (+ 2 2) 3.45 0.76)'
      falsy '(> 4 (+ 2 2) 3.45 0.76)'
      throws '(> nil (+ 2 2) 3.45 0.76)'

  describe '(<= x y & more)', ->
    it 'returns true if its arguments are in monotonically non-decreasing order', ->
      throws '(<=)'
      throws '(<= "hello" "hello")'
      truthy '(<= [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(<= 0.76 3.45 (+ 2 2) 5)'
      falsy '(<= 0.76 3.45 (+ 2 2) 3)'
      truthy '(<= 0.76 3.45 (+ 2 2) 4)'
      throws '(<= 0.76 3.45 (+ 2 2) nil)'

  describe '(>= x y & more)', ->
    it 'returns true if its arguments are in monotonically non-increasing order', ->
      throws '(>=)'
      throws '(>= "hello" "hello")'
      truthy '(>= [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(>= 5 (+ 2 2) 3.45 0.76)'
      falsy '(>= 3 (+ 2 2) 3.45 0.76)'
      truthy '(>= 4 (+ 2 2) 3.45 0.76)'
      throws '(>= nil (+ 2 2) 3.45 0.76)'

  describe '(identical? x y)', ->
    it 'returns true if x and y are the same object', ->
      throws '(identical? 1 1 1)'
      truthy '(identical? 1 1)'
      falsy '(identical? 1.56 1.56)'
      truthy '(identical? true true)'
      truthy '(identical? nil nil)'
      falsy '(identical? #{1 2} #{1 2})'
      truthy '(let [a #{1 2}] (identical? a a))'
      # different from standard Clojure behaviour; string interning cannot be emulated
      falsy '(identical? "string" "string")'

  describe '(true? x)', ->
    it 'returns true if and only if x is the value true', ->
      throws '(true? nil false)'
      truthy '(true? true)'
      falsy '(true? "hello")'
      falsy '(true? (fn []))'

  describe '(false? x)', ->
    it 'returns true if and only if x is the value false', ->
      throws '(false? nil false)'
      truthy '(false? false)'
      falsy '(false? "hello")'
      falsy '(false? (fn []))'

  describe '(nil? x)', ->
    it 'returns true if and only if x is the value nil', ->
      throws '(nil? nil false)'
      truthy '(nil? nil)'
      falsy '(nil? "hello")'
      falsy '(nil? (fn []))'

  describe '(some? x)', ->
    it 'returns true if and only if x is NOT the value nil', ->
      throws '(some? nil false)'
      falsy '(some? nil)'
      truthy '(some? "hello")'
      truthy '(some? (fn []))'

  describe '(number? x)', ->
    it 'returns true if and only if x is a number', ->
      truthy '(number? 0)'
      truthy '(number? 0.0)'
      truthy '(number? ((fn [] 0)))'
      falsy '(number? "0")'
      falsy '(number? [])'
      falsy '(number? nil)'

  describe '(integer? x)', ->
    it 'returns true if and only if x is an integer', ->
      truthy '(integer? 0)'
      falsy '(integer? 0.0)'
      truthy '(integer? ((fn [] 0)))'
      falsy '(integer? "0")'
      falsy '(integer? [])'
      falsy '(integer? nil)'

  describe '(float? x)', ->
    it 'returns true if and only if x is a floating-point number', ->
      falsy '(float? 0)'
      truthy '(float? 0.0)'
      truthy '(float? ((fn [] 0.0)))'
      falsy '(float? "0.0")'
      falsy '(float? [])'
      falsy '(float? nil)'

  describe '(zero? x)', ->
    it 'returns true if and only if x is numerically 0', ->
      truthy '(zero? 0)'
      truthy '(zero? 0.0)'
      truthy '(zero? ((fn [] 0.0)))'
      throws '(zero? "0.0")'
      throws '(zero? [])'
      throws '(zero? nil)'

  describe '(pos? x)', ->
    it 'returns true if and only if x is a number > 0', ->
      truthy '(pos? 3)'
      truthy '(pos? 3.54)'
      falsy '(pos? 0)'
      falsy '(pos? -4.5)'
      throws '(pos? "0.0")'
      throws '(pos? [])'
      throws '(pos? nil)'

  describe '(neg? x)', ->
    it 'returns true if and only if x is a number < 0', ->
      truthy '(neg? -3)'
      truthy '(neg? -3.54)'
      falsy '(neg? 0)'
      falsy '(neg? 4.5)'
      throws '(neg? "0.0")'
      throws '(neg? [])'
      throws '(neg? nil)'

  describe '(even? x)', ->
    it 'returns true if and only if x is an even integer', ->
      truthy '(even? 0)'
      truthy '(even? 68)'
      falsy '(even? 69)'
      truthy '(even? ((fn [] -56)))'
      falsy '(even? ((fn [] -57)))'
      throws '(even? 0.0)'
      throws '(even? 2.0)'
      throws '(even? "0.0")'

  describe '(odd? x)', ->
    it 'returns true if and only if x is an odd integer', ->
      falsy '(odd? 0)'
      falsy '(odd? 68)'
      truthy '(odd? 69)'
      falsy '(odd? ((fn [] -56)))'
      truthy '(odd? ((fn [] -57)))'
      throws '(odd? 1.0)'
      throws '(odd? "1.0")'

  describe '(contains? coll key)', ->
    it 'returns true if the collection contains the given key', ->
      throws '(contains? #{nil 2} nil 2)'
      throws '(contains? "string" "str")'
      throws '(contains? \'(1 2) 2)'  # not supported for lists
      truthy '(contains? #{nil 2} nil)'
      falsy '(contains? #{1 2} 3)'
      truthy '(contains? #{#{1 2}} #{2 1})'
      truthy '(contains? #{[1 2]} \'(1 2))'
      falsy '(contains? #{[1 2]} \'(2 1))'
      # when coll is a vector, contains? checks if key is a valid index into it
      truthy '(contains? [98 54] 0)'
      truthy '(contains? [98 54] 1)'
      falsy '(contains? [98 54] 2)'
      falsy '(contains? [98 54] 98)'


  # logic
  describe '(boolean x)', ->
    it 'coerces x into a boolean value (false for nil and false, else true)', ->
      throws '(boolean nil false)'
      falsy '(boolean nil)'
      falsy '(boolean false)'
      truthy '(boolean true)'
      truthy '(boolean 34.75)'
      truthy '(boolean "hello")'
      truthy '(boolean [1 2])'
      truthy '(boolean (fn [x y] (+ x y)))'

  describe '(not x)', ->
    it 'returns the complement of (boolean x) (true for nil and false, else false)', ->
      throws '(not nil false)'
      truthy '(not nil)'
      truthy '(not false)'
      falsy '(not true)'
      falsy '(not 34.75)'
      falsy '(not "hello")'
      falsy '(not [1 2])'
      falsy '(not (fn [x y] (+ x y)))'


  # string
  describe '(str x & ys)', ->
    it 'concatenates the string values of each of its arguments', ->
      eq '(str)', new types.String ''
      eq '(str nil)', new types.String ''
      eq '(str 34)', new types.String '34'
      eq '(str 34.45)', new types.String '34.45'
      eq '(str 3e3)', new types.String '3000'    # different from standard Clojure
      eq '(str 3e-4)', new types.String '0.0003'    # different from standard Clojure
      eq '(str true)', new types.String 'true'
      eq '(str "hello")', new types.String 'hello'
      eq '(str [1 2 3])', new types.String '[1 2 3]'
      eq '(str \'(1 2 3))', new types.String '(1 2 3)'
      eq '(str #{1 2 3})', new types.String '#{1 2 3}'
      eq '(str [1 2 \'(3 4 5)])', new types.String '[1 2 (3 4 5)]'


  # collections
  describe '(count coll)', ->
    it 'returns the number of items the collection', ->
      throws '(count [1 2 3] "hello")'
      throws '(count 1)'
      throws '(count true)'
      eq '(count nil)', new types.Integer 0
      eq '(count "hello")', new types.Integer 5
      eq '(count [1 2 3])', new types.Integer 3
      eq '(count [1 2 #{3 4 5}])', new types.Integer 3
