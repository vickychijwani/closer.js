class ArityError extends Error
  constructor: (expected_min, expected_max, actual) ->
    Error.captureStackTrace @, @.constructor
    @name = 'ArityError'
    @message = "Expected #{expected_min}..#{expected_max} args, got #{actual}"

class ArgTypeError extends Error
  constructor: (args, expectedTypes) ->
    Error.captureStackTrace @, @.constructor
    actual = _.pluck args, 'type'
    expected = _.pluck expectedTypes, 'typeName'
    @name = 'ArgTypeError'
    @message = "Expected #{expected.join(' or ')}, got [#{actual.join(', ')}]"

unexpectedTypes = (args, expectedTypes) ->
  _.find args, (arg) -> not _.any(expectedTypes, (type) -> mori['is_' + type](arg))

firstFailure = (args, testFn) ->
  _.find args, (arg) -> not testFn(arg)

assert =

  # throws TypeError if any of the given literals is not of one of the given types
  types: (args, expectedTypes) ->
    if unexpectedArg = unexpectedTypes args, expectedTypes
      throw new Error "#{unexpectedArg} is not of type #{expectedTypes.join(' or ')}"

  numbers: (args...) ->
    unexpectedArg = firstFailure(_.flatten(args), (arg) -> typeof arg is 'number')
    if unexpectedArg isnt undefined
      throw new Error "#{unexpectedArg} is not a number"

  integers: (args...) ->
    unexpectedArg = firstFailure(_.flatten(args), (arg) -> typeof arg is 'number' and arg % 1 is 0)
    if unexpectedArg isnt undefined
      throw new Error "#{unexpectedArg} is not a integer"

  associative: (args...) ->
    if unexpectedArg = unexpectedTypes args, ['associative', 'set']
      throw new Error "#{unexpectedArg} is not an associative collection"

  seqable: (args...) ->
    unexpectedArg = firstFailure args, (arg) -> mori.is_seqable(arg) or _.isString(arg)
    if unexpectedArg
      throw new Error "#{unexpectedArg} is not seqable"

  arity: (expected_min, expected_max, args...) ->
    args = _.flatten args, true
    unless expected_min <= args.length <= expected_max
      throw new ArityError expected_min, expected_max, args.length


module.exports = assert

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
mori = require 'mori'
