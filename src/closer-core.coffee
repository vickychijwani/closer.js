core =

  # arithmetic
  '+': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    _.reduce nums, ((sum, num) -> sum + num), 0

  '-': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(0) if nums.length is 1
    _.reduce nums.slice(1), ((diff, num) -> diff - num), nums[0]

  '*': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    _.reduce nums, ((prod, num) -> prod * num), 1

  '/': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(1) if nums.length is 1
    _.reduce nums.slice(1), ((quo, num) -> quo / num), nums[0]

  'inc': (num) ->
    assert.arity 1, 1, arguments
    assert.numbers num
    ++num

  'dec': (num) ->
    assert.arity 1, 1, arguments
    assert.numbers num
    --num

  'max': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.max nums

  'min': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.min nums

  'quot': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    sign = if num > 0 and div > 0 or num < 0 and div < 0 then 1 else -1
    sign * Math.floor Math.abs num / div

  'rem': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    num % div

  'mod': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    rem = num % div
    if rem is 0 or (num > 0 and div > 0 or num < 0 and div < 0)
    then rem else rem + div


  # comparison / test
  '=': (args...) ->
    assert.arity 1, Infinity, arguments
    args = _.uniq args   # remove duplicates
    return true if args.length is 1
    m.equals.apply @, args

  'not=': (args...) ->
    assert.arity 1, Infinity, arguments
    core.not core['='].apply @, args

  '==': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    core['='].apply @, args

  '<': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val < args[idx+1])
    ), true

  '>': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val > args[idx+1])
    ), true

  '<=': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val <= args[idx+1])
    ), true

  '>=': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val >= args[idx+1])
    ), true

  'identical?': (x, y) ->
    assert.arity 2, 2, arguments
    x is y

  'true?': (arg) ->
    assert.arity 1, 1, arguments
    arg is true

  'false?': (arg) ->
    assert.arity 1, 1, arguments
    arg is false

  'nil?': (arg) ->
    assert.arity 1, 1, arguments
    arg is null

  'some?': (arg) ->
    assert.arity 1, 1, arguments
    arg isnt null

  'number?': (x) ->
    assert.arity 1, 1, arguments
    typeof x is 'number'

  'integer?': (x) ->
    assert.arity 1, 1, arguments
    typeof x is 'number' and x % 1 is 0

  'float?': (x) ->
    assert.arity 1, 1, arguments
    typeof x is 'number' and x % 1 isnt 0

  'zero?': (x) ->
    assert.arity 1, 1, arguments
    core['=='](x, 0)

  'pos?': (x) ->
    assert.arity 1, 1, arguments
    core['>'] x, 0

  'neg?': (x) ->
    assert.arity 1, 1, arguments
    core['<'] x, 0

  'even?': (x) ->
    assert.arity 1, 1, arguments
    assert.integers x
    core['zero?'] core['mod'] x, 2

  'odd?': (x) ->
    core['not'] core['even?'] x

  'contains?': (coll, key) ->
    assert.arity 2, 2, arguments
    assert.associative coll
    m.has_key coll, key

  'empty?': (coll) ->
    assert.arity 1, 1, arguments
    m.is_empty coll

  'vector?': (coll) ->
    assert.arity 1, 1, arguments
    m.is_vector coll

  'map?': (coll) ->
    assert.arity 1, 1, arguments
    m.is_map coll


  # logic
  'boolean': (arg) ->
    assert.arity 1, 1, arguments
    arg isnt false and arg isnt null

  'not': (arg) ->
    assert.arity 1, 1, arguments
    not core.boolean(arg)


  # string
  'str': (args...) ->
    assert.arity 0, Infinity, arguments
    _.reduce args, ((str, arg) ->
      str += if core['nil?'](arg) then '' else arg.toString()
    ), ''


  # collections
  'count': (coll) ->
    assert.arity 1, 1, arguments
    assert.seqable coll
    m.count coll

  'empty': (coll) ->
    assert.arity 1, 1, arguments
    try m.empty coll
    catch error
      null

  'not-empty': (coll) ->
    assert.arity 1, 1, arguments
    if core.count(coll) is 0 then null else coll

  'get': (coll, key, notFound = null) ->
    assert.arity 2, 3, arguments
    m.get coll, key, notFound

  'seq': (coll) ->
    assert.arity 1, 1, arguments
    assert.seqable coll
    m.seq coll

  'first': (coll) ->
    assert.arity 1, 1, arguments
    m.first coll

  'rest': (coll) ->
    assert.arity 1, 1, arguments
    m.rest coll

  'next': (coll) ->
    assert.arity 1, 1, arguments
    rest = core.rest coll
    if core['empty?'](rest) then null else rest

  'cons': (x, seq) ->
    assert.arity 2, 2, arguments
    m.cons x, seq

  'conj': (coll, xs...) ->
    assert.arity 2, Infinity, arguments
    if core['map?'](coll) and _.any(xs, (x) -> core['vector?'](x) and core.count(x) isnt 2)
      throw new TypeError 'vector args to conjoin to a map must be pairs'
    m.conj.apply @, _.flatten [coll, xs]

  'identity': (x) ->
    assert.arity 1, 1, arguments
    x


module.exports = core

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
m = require 'mori'
assert = require './assert'
