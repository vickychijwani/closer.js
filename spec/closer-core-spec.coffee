types = require '../closer-types'
global_helpers = require './closer-helpers'
helpers = require './closer-core-helpers'
evaluate = helpers.evaluate

beforeEach ->
  @addMatchers toDeepEqual: global_helpers.toDeepEqual

eq = (src, expected) ->
  expect(evaluate src).toDeepEqual expected

describe 'Closer core library', ->

  # arithmetic
  describe '+', ->
    it 'adds numbers', ->
      eq '(+)', new types.Integer 0
      eq '(+ 3.3 0 -6e2 2)', new types.Float -594.7

  describe '-', ->
    it 'subtracts numbers', ->
      eq '(- -3.54)', new types.Float 3.54
      eq '(- 10 3.5 -4)', new types.Float 10.5

  describe '*', ->
    it 'multiplies numbers', ->
      eq '(*)', new types.Integer 1
      eq '(* 3 -6)', new types.Integer -18

  describe '/', ->
    it 'divides numbers', ->
      eq '(/ -4)', new types.Float -0.25
      eq '(/ 14 -2)', new types.Integer -7
      eq '(/ 14 -2.0)', new types.Float -7
      eq '(/ 14 -2 -2)', new types.Float 3.5

  describe 'inc', ->
    it 'increments a number', ->
      eq '(inc -2e-3)', new types.Float 0.998

  describe 'dec', ->
    it 'decrements a number', ->
      eq '(dec -2e-3)', new types.Float -1.002

  describe 'max', ->
    it 'finds the maximum of the given numbers', ->
      eq '(max -1e10 653.32 1.345e4)', new types.Float 1.345e4

  describe 'min', ->
    it 'finds the minimum of the given numbers', ->
      eq '(min -1e10 653.32 1.345e4)', new types.Float -1e10

  describe 'quot', ->
    it 'computes the quotient of a division', ->
      eq '(quot 10 3)', new types.Integer 3
      eq '(quot -5.9 3)', new types.Float -1.0
      eq '(quot -10 -3)', new types.Integer 3
      eq '(quot 10 -3)', new types.Integer -3

  describe 'rem', ->
    it 'computes the remainder of a division (same as % in other languages)', ->
      eq '(rem 10.1 3)', new types.Float 10.1 % 3
      eq '(rem -10.1 3)', new types.Float -10.1 % 3
      eq '(rem -10.1 -3)', new types.Float -10.1 % -3
      eq '(rem 10.1 -3)', new types.Float 10.1 % -3

  describe 'mod', ->
    it 'computes the modulus of a division (NOT the same as % in other languages)', ->
      eq '(mod 10.1 3)', new types.Float 10.1 % 3
      eq '(mod -10.1 3)', new types.Float 3 - 10.1 % 3
      eq '(mod -10.1 -3)', new types.Float -10.1 % 3
      eq '(mod 10.1 -3)', new types.Float 10.1 % 3 - 3


  # comparison
  describe '=', ->
    it 'returns true if all its arguments are equal (by value, not identity)', ->
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

  describe 'not=', ->
    it 'returns true if some of its arguments are unequal (by value, not identity)', ->
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

  describe '==', ->
    it 'returns true if all its arguments are numeric and equal, or if given only 1 argument', ->
      eq '(== 1)', types.Boolean.true
      eq '(== [1 2 3])', types.Boolean.true  # == returns true for 1 arg irrespective of type
      eq '(== 2 2.0 (/ 8 (+ 2 2.0)))', types.Boolean.true


  # logic
  describe 'boolean', ->
    it 'coerces its argument into a boolean value (false for nil and false, else true)', ->
      eq '(boolean nil)', types.Boolean.false
      eq '(boolean false)', types.Boolean.false
      eq '(boolean true)', types.Boolean.true
      eq '(boolean 34.75)', types.Boolean.true
      eq '(boolean "hello")', types.Boolean.true
      eq '(boolean [1 2])', types.Boolean.true
      eq '(boolean (fn [x y] (+ x y)))', types.Boolean.true

  describe 'not', ->
    it 'returns the complement of calling boolean on its argument (true for nil and false, else false)', ->
      eq '(not nil)', types.Boolean.true
      eq '(not false)', types.Boolean.true
      eq '(not true)', types.Boolean.false
      eq '(not 34.75)', types.Boolean.false
      eq '(not "hello")', types.Boolean.false
      eq '(not [1 2])', types.Boolean.false
      eq '(not (fn [x y] (+ x y)))', types.Boolean.false


  # test
  describe 'true?', ->
    it 'returns true if and only if its argument is the value true', ->
      eq '(true? true)', types.Boolean.true
      eq '(true? "hello")', types.Boolean.false
      eq '(true? (fn []))', types.Boolean.false

  describe 'false?', ->
    it 'returns true if and only if its argument is the value false', ->
      eq '(false? false)', types.Boolean.true
      eq '(false? "hello")', types.Boolean.false
      eq '(false? (fn []))', types.Boolean.false

  describe 'nil?', ->
    it 'returns true if and only if its argument is the value nil', ->
      eq '(nil? nil)', types.Boolean.true
      eq '(nil? "hello")', types.Boolean.false
      eq '(nil? (fn []))', types.Boolean.false

  describe 'some?', ->
    it 'returns true if and only if its argument is NOT the value nil', ->
      eq '(some? nil)', types.Boolean.false
      eq '(some? "hello")', types.Boolean.true
      eq '(some? (fn []))', types.Boolean.true

  describe 'contains?', ->
    it 'returns true if the collection contains the given key', ->
      eq '(contains? #{nil 2} nil)', types.Boolean.true
      eq '(contains? #{1 2} 3)', types.Boolean.false
      eq '(contains? #{#{1 2}} #{2 1})', types.Boolean.true
      eq '(contains? #{[1 2]} \'(1 2))', types.Boolean.true
      eq '(contains? #{[1 2]} \'(2 1))', types.Boolean.false
