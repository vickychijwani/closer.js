class ArityError extends Error
  constructor: (args...) ->
    Error.captureStackTrace @, @.constructor
    @name = 'ArityError'
    @message = if args.length is 3
      "Expected #{args[0]}..#{args[1]} args, got #{args[2]}"
    else args[0]

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

  associativeOrSet: (args...) ->
    if unexpectedArg = firstFailure(args, (arg) -> mori.is_associative(arg) or mori.is_set(arg))
      throw new ArgTypeError "#{unexpectedArg} is not a set or an associative collection"

  associative: (args...) ->
    if unexpectedArg = firstFailure(args, (arg) -> mori.is_associative(arg))
      throw new ArgTypeError "#{unexpectedArg} is not an associative collection"

  seqable: (args...) ->
    unexpectedArg = firstFailure args, (arg) -> mori.is_seqable(arg) or _.isString(arg) or _.isArray(arg)
    if unexpectedArg
      throw new ArgTypeError "#{unexpectedArg} is not seqable"

  sequential: (args...) ->
    unexpectedArg = firstFailure args, (arg) -> mori.is_sequential(arg) or _.isString(arg) or _.isArray(arg)
    if unexpectedArg
      throw new ArgTypeError "#{unexpectedArg} is not sequential"

  stack: (args...) ->
    unexpectedArg = firstFailure args, (arg) -> mori.is_vector(arg) or mori.is_list(arg)
    if unexpectedArg
      throw new ArgTypeError "#{unexpectedArg} does not support stack operations"

  function: (args...) ->
    unexpectedArg = firstFailure args, (arg) ->
      typeof arg is 'function' or mori.is_vector(arg) or mori.is_map(arg) or
      mori.is_set(arg) or mori.is_keyword(arg)
    if unexpectedArg
      throw new ArgTypeError "#{unexpectedArg} is not a function"

  arity: (expected_min, expected_max, args...) ->
    args = _.flatten args, true
    unless expected_min <= args.length <= expected_max
      throw new ArityError expected_min, expected_max, args.length

  arity_custom: (args, checkFn) ->
    if msg = checkFn args
      throw new ArityError msg


module.exports = assert

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require './lodash'
mori = require 'mori'
