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
