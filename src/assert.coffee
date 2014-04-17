class ArityError extends Error
  constructor: (expected_min, expected_max, actual) ->
    Error.captureStackTrace @, @.constructor
    @name = 'ArityError'
    @message = "Expected #{expected_min}..#{expected_max} args, got #{actual}"

class ArgTypeError extends Error
  constructor: (message) ->
    Error.captureStackTrace @, @.constructor
    @name = 'ArgTypeError'
    @message = message

firstFailure = (args, testFn) ->
  _.find args, (arg) -> not testFn(arg)

assert =

  numbers: (args...) ->
    unexpectedArg = firstFailure(_.flatten(args), (arg) -> typeof arg is 'number')
    if unexpectedArg isnt undefined
      throw new ArgTypeError "#{unexpectedArg} is not a number"

  integers: (args...) ->
    unexpectedArg = firstFailure(_.flatten(args), (arg) -> typeof arg is 'number' and arg % 1 is 0)
    if unexpectedArg isnt undefined
      throw new ArgTypeError "#{unexpectedArg} is not a integer"

  associative: (args...) ->
    if unexpectedArg = firstFailure(args, (arg) -> mori.is_associative(arg) or mori.is_set(arg))
      throw new ArgTypeError "#{unexpectedArg} is not an associative collection"

  seqable: (args...) ->
    unexpectedArg = firstFailure args, (arg) -> mori.is_seqable(arg) or _.isString(arg)
    if unexpectedArg
      throw new ArgTypeError "#{unexpectedArg} is not seqable"

  arity: (expected_min, expected_max, args...) ->
    args = _.flatten args, true
    unless expected_min <= args.length <= expected_max
      throw new ArityError expected_min, expected_max, args.length


module.exports = assert

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
mori = require 'mori'
