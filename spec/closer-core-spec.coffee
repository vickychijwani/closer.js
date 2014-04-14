types = require '../closer-types'
global_helpers = require './closer-helpers'
helpers = require './closer-core-helpers'
evaluate = helpers.evaluate

beforeEach ->
  @addMatchers toDeepEqual: global_helpers.toDeepEqual

eq = (src, expected) ->
  expect(evaluate src).toDeepEqual expected

thr = (src) ->
  expect(-> evaluate src).toThrow()

describe 'Closer core library', ->

  # arithmetic
  describe '(+ x y & more)', ->
    it 'adds the given numbers', ->
      thr '(+ "string")'
      eq '(+)', new types.Integer 0
      eq '(+ 3.3 0 -6e2 2)', new types.Float -594.7

  describe '(- x y & more)', ->
    it 'subtracts all but the first number from the first one', ->
      thr '(-)'
      thr '(- "string")'
      eq '(- -3.54)', new types.Float 3.54
      eq '(- 10 3.5 -4)', new types.Float 10.5

  describe '(* x y & more)', ->
    it 'multiplies the given numbers', ->
      thr '(* "string")'
      eq '(*)', new types.Integer 1
      eq '(* 3 -6)', new types.Integer -18

  describe '(/ x y & more)', ->
    it 'divides the first number by the rest', ->
      thr '(/)'
      thr '(/ "string")'
      eq '(/ -4)', new types.Float -0.25
      eq '(/ 14 -2)', new types.Integer -7
      eq '(/ 14 -2.0)', new types.Float -7
      eq '(/ 14 -2 -2)', new types.Float 3.5

  describe '(inc x)', ->
    it 'increments x by 1', ->
      thr '(inc 2 3 4)'
      thr '(inc "string")'
      eq '(inc -2e-3)', new types.Float 0.998

  describe '(dec x)', ->
    it 'decrements x by 1', ->
      thr '(dec 2 3 4)'
      thr '(dec "string")'
      eq '(dec -2e-3)', new types.Float -1.002

  describe '(max x y & more)', ->
    it 'finds the maximum of the given numbers', ->
      thr '(max)'
      thr '(max "string" [1 2])'
      eq '(max -1e10 653.32 1.345e4)', new types.Float 1.345e4

  describe '(min x y & more)', ->
    it 'finds the minimum of the given numbers', ->
      thr '(min)'
      thr '(min "string" [1 2])'
      eq '(min -1e10 653.32 1.345e4)', new types.Float -1e10

  describe '(quot num div)', ->
    it 'computes the quotient of dividing num by div', ->
      thr '(quot 10)'
      thr '(quot [1 2] 3)'
      eq '(quot 10 3)', new types.Integer 3
      eq '(quot -5.9 3)', new types.Float -1.0
      eq '(quot -10 -3)', new types.Integer 3
      eq '(quot 10 -3)', new types.Integer -3

  describe '(rem num div)', ->
    it 'computes the remainder of dividing num by div (same as % in other languages)', ->
      thr '(rem 10)'
      thr '(rem [1 2] 3)'
      eq '(rem 10.1 3)', new types.Float 10.1 % 3
      eq '(rem -10.1 3)', new types.Float -10.1 % 3
      eq '(rem -10.1 -3)', new types.Float -10.1 % -3
      eq '(rem 10.1 -3)', new types.Float 10.1 % -3

  describe '(mod num div)', ->
    it 'computes the modulus of num and div (NOT the same as % in other languages)', ->
      thr '(mod 10)'
      thr '(mod [1 2] 3)'
      eq '(mod 10.1 3)', new types.Float 10.1 % 3
      eq '(mod -10.1 3)', new types.Float 3 - 10.1 % 3
      eq '(mod -10.1 -3)', new types.Float -10.1 % 3
      eq '(mod 10.1 -3)', new types.Float 10.1 % 3 - 3


  # comparison
  describe '(= x y & more)', ->
    it 'returns true if all its arguments are equal (by value, not identity)', ->
      thr '(=)'
      eq '(= nil nil)', types.Boolean.true
      eq '(= 1)', types.Boolean.true
      eq '(= (fn [x y] (+ x y)))', types.Boolean.true   # always returns true for 1 arg
      eq '(= 1 (/ 4 (+ 2 2)) (mod 5 4))', types.Boolean.true
      eq '(= 1 (/ 4 (+ 2 2)) (mod 5 3))', types.Boolean.false
      eq '(= 1 1.0)', types.Boolean.false
      eq '(= 1.0 (/ 2.0 2))', types.Boolean.true
      eq '(= "hello" "hello")', types.Boolean.true
      eq '(= true (= 4 (* 2 2)))', types.Boolean.true
      eq '(= true (= 4 (* 2 3)))', types.Boolean.false
      eq '(= [3 4] \'(3 4))', types.Boolean.true
      eq '(= [3 4] \'((+ 2 1) (/ 16 4)))', types.Boolean.true
      eq '(= [3 4] \'((+ 2 1) (/ 16 8)))', types.Boolean.false
      eq '(= [3 4] \'((+ 2 1) (/ 16 4) 5))', types.Boolean.false
      eq '(= #{1 2} #{2 1})', types.Boolean.true
      eq '(= #{1 2} #{2 1 3})', types.Boolean.false
      eq '(= #{1 2} [2 1])', types.Boolean.false

  describe '(not= x y & more)', ->
    it 'returns true if some of its arguments are unequal (by value, not identity)', ->
      thr '(not=)'
      eq '(not= nil nil)', types.Boolean.false
      eq '(not= 1)', types.Boolean.false
      eq '(not= (fn [x y] (+ x y)))', types.Boolean.false   # always returns false for 1 arg
      eq '(not= 1 (/ 4 (+ 2 2)) (mod 5 4))', types.Boolean.false
      eq '(not= 1 (/ 4 (+ 2 2)) (mod 5 3))', types.Boolean.true
      eq '(not= 1 1.0)', types.Boolean.true
      eq '(not= 1.0 (/ 2.0 2))', types.Boolean.false
      eq '(not= "hello" "hello")', types.Boolean.false
      eq '(not= true (= 4 (* 2 2)))', types.Boolean.false
      eq '(not= true (= 4 (* 2 3)))', types.Boolean.true
      eq '(not= [3 4] \'(3 4))', types.Boolean.false
      eq '(not= [3 4] \'((+ 2 1) (/ 16 4)))', types.Boolean.false
      eq '(not= [3 4] \'((+ 2 1) (/ 16 8)))', types.Boolean.true
      eq '(not= [3 4] \'((+ 2 1) (/ 16 4) 5))', types.Boolean.true
      eq '(not= #{1 2} #{2 1})', types.Boolean.false
      eq '(not= #{1 2} #{2 1 3})', types.Boolean.true
      eq '(not= #{1 2} [2 1])', types.Boolean.true

  describe '(== x y & more)', ->
    it 'returns true if all its arguments are numeric and equal, or if given only 1 argument', ->
      thr '(==)'
      thr '(== "hello" "hello")'
      eq '(== 1)', types.Boolean.true
      eq '(== [1 2 3])', types.Boolean.true  # == returns true for 1 arg irrespective of type
      eq '(== 2 2.0 (/ 8 (+ 2 2.0)))', types.Boolean.true

  describe '(identical? x y)', ->
    it 'returns true if x and y are the same object', ->
      thr '(identical? 1 1 1)'
      eq '(identical? 1 1)', types.Boolean.true
      eq '(identical? 1.56 1.56)', types.Boolean.false
      eq '(identical? true true)', types.Boolean.true
      eq '(identical? nil nil)', types.Boolean.true
      eq '(identical? #{1 2} #{1 2})', types.Boolean.false
      eq '(let [a #{1 2}] (identical? a a))', types.Boolean.true
      # different from standard Clojure behaviour; string interning cannot be emulated
      eq '(identical? "string" "string")', types.Boolean.false

  describe '(true? x)', ->
    it 'returns true if and only if x is the value true', ->
      thr '(true? nil false)'
      eq '(true? true)', types.Boolean.true
      eq '(true? "hello")', types.Boolean.false
      eq '(true? (fn []))', types.Boolean.false

  describe '(false? x)', ->
    it 'returns true if and only if x is the value false', ->
      thr '(false? nil false)'
      eq '(false? false)', types.Boolean.true
      eq '(false? "hello")', types.Boolean.false
      eq '(false? (fn []))', types.Boolean.false

  describe '(nil? x)', ->
    it 'returns true if and only if x is the value nil', ->
      thr '(nil? nil false)'
      eq '(nil? nil)', types.Boolean.true
      eq '(nil? "hello")', types.Boolean.false
      eq '(nil? (fn []))', types.Boolean.false

  describe '(some? x)', ->
    it 'returns true if and only if x is NOT the value nil', ->
      thr '(some? nil false)'
      eq '(some? nil)', types.Boolean.false
      eq '(some? "hello")', types.Boolean.true
      eq '(some? (fn []))', types.Boolean.true

  describe '(contains? coll key)', ->
    it 'returns true if the collection contains the given key', ->
      thr '(contains? #{nil 2} nil 2)'
      thr '(contains? "string" "str")'
      thr '(contains? \'(1 2) 2)'  # not supported for lists
      eq '(contains? #{nil 2} nil)', types.Boolean.true
      eq '(contains? #{1 2} 3)', types.Boolean.false
      eq '(contains? #{#{1 2}} #{2 1})', types.Boolean.true
      eq '(contains? #{[1 2]} \'(1 2))', types.Boolean.true
      eq '(contains? #{[1 2]} \'(2 1))', types.Boolean.false
      # when coll is a vector, contains? checks if key is a valid index into it
      eq '(contains? [98 54] 0)', types.Boolean.true
      eq '(contains? [98 54] 1)', types.Boolean.true
      eq '(contains? [98 54] 2)', types.Boolean.false
      eq '(contains? [98 54] 98)', types.Boolean.false


  # logic
  describe '(boolean x)', ->
    it 'coerces x into a boolean value (false for nil and false, else true)', ->
      thr '(boolean nil false)'
      eq '(boolean nil)', types.Boolean.false
      eq '(boolean false)', types.Boolean.false
      eq '(boolean true)', types.Boolean.true
      eq '(boolean 34.75)', types.Boolean.true
      eq '(boolean "hello")', types.Boolean.true
      eq '(boolean [1 2])', types.Boolean.true
      eq '(boolean (fn [x y] (+ x y)))', types.Boolean.true

  describe '(not x)', ->
    it 'returns the complement of (boolean x) (true for nil and false, else false)', ->
      thr '(not nil false)'
      eq '(not nil)', types.Boolean.true
      eq '(not false)', types.Boolean.true
      eq '(not true)', types.Boolean.false
      eq '(not 34.75)', types.Boolean.false
      eq '(not "hello")', types.Boolean.false
      eq '(not [1 2])', types.Boolean.false
      eq '(not (fn [x y] (+ x y)))', types.Boolean.false
