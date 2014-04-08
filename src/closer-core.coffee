_ = require 'lodash-node'

core =

  # arithmetic
  '+': (args...) ->
    _.reduce args, ((sum, num) -> sum + num), 0

  '-': (args...) ->
    args.unshift(0) if args.length is 1
    _.reduce args.slice(1), ((diff, num) -> diff - num), args[0]

  '*': (args...) ->
    _.reduce args, ((prod, num) -> prod * num), 1

  '/': (args...) ->
    args.unshift(1) if args.length is 1
    _.reduce args.slice(1), ((quo, num) -> quo / num), args[0]

  'inc': (num) ->
    ++num

  'dec': (num) ->
    --num


module.exports = core
