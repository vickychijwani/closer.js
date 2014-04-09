helpers = require './closer-core-helpers'
evaluate = helpers.evaluate

assertEqual = (src, expected) ->
  expect(evaluate src).toBe expected

assertAlmostEqual = (src, expected) ->
  expect(evaluate src).toBeCloseTo expected

describe 'Closer core library', ->

  # arithmetic
  describe '+', ->
    it 'returns 0 when given no arguments', ->
      assertEqual '(+)', 0
    it 'adds numbers', ->
      assertAlmostEqual '(+ 3.3 0 -6e2 2)', -594.7

  describe '-', ->
    it 'negates a single number', ->
      assertAlmostEqual '(- -3.54)', 3.54
    it 'subtracts numbers', ->
      assertAlmostEqual '(- 10 3.5 -4)', 10.5

  describe '*', ->
    it 'returns 1 when given no arguments', ->
      assertEqual '(*)', 1
    it 'multiplies numbers', ->
      assertAlmostEqual '(* 3 -6.1)', -18.3

  describe '/', ->
    it 'inverts a single number', ->
      assertAlmostEqual '(/ -3.34)', -1/3.34
    it 'divides numbers', ->
      assertAlmostEqual '(/ 14 -2 -3)', 14/6

  describe 'inc', ->
    it 'increments a number', ->
      assertAlmostEqual '(inc -2e-3)', 0.998

  describe 'dec', ->
    it 'decrements a number', ->
      assertAlmostEqual '(dec -2e-3)', -1.002

  describe 'max', ->
    it 'finds the maximum of the given numbers', ->
      assertAlmostEqual '(max -1e10 653.32 1.345e4)', 1.345e4

  describe 'min', ->
    it 'finds the minimum of the given numbers', ->
      assertAlmostEqual '(min -1e10 653.32 1.345e4)', -1e10

  describe 'quot', ->
    it 'computes the quotient of a division', ->
      assertEqual '(quot 10 3)', 3
      assertEqual '(quot -5.9 3)', -1.0
      assertEqual '(quot -10 -3)', 3
      assertEqual '(quot 10 -3)', -3

  describe 'rem', ->
    it 'computes the remainder of a division (same as % in other languages)', ->
      assertEqual '(rem 10 3)', 1
      assertEqual '(rem -10 3)', -1
      assertEqual '(rem -10 -3)', -1
      assertEqual '(rem 10 -3)', 1

  describe 'mod', ->
    it 'computes the modulus of a division (NOT the same as % in other languages)', ->
      assertEqual '(mod 10 3)', 1
      assertEqual '(mod -10 3)', 2
      assertEqual '(mod -10 -3)', -1
      assertEqual '(mod 10 -3)', -2
