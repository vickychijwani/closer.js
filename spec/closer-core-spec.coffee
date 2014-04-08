helpers = require './closer-core-helpers'
evaluate = helpers.evaluate

assertEqual = (src, expected) ->
  expect(evaluate src).toBe expected

assertAlmostEqual = (src, expected) ->
  expect(evaluate src).toBeCloseTo expected

describe 'Closer core library', ->

  # arithmetic
  describe '+', ->
    it 'handles 0 arguments', ->
      assertEqual '(+)', 0
    it 'adds numbers', ->
      assertAlmostEqual '(+ 3.3 0 -6e2 2)', -594.7

  describe '-', ->
    it 'negates a single number', ->
      assertAlmostEqual '(- -3.54)', 3.54
    it 'subtracts numbers', ->
      assertAlmostEqual '(- 10 3.5 -4)', 10.5

  describe '*', ->
    it 'handles 0 arguments', ->
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
