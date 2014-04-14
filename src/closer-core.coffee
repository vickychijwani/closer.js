sameSign = (num1, num2) ->
  num1.value > 0 and num2.value > 0 or num1.value < 0 and num2.value < 0

getValues = (args) ->
  _.map args, 'value'

getUniqueValues = (args) ->
  _.uniq args, false, 'value'

allEqual = (args) ->
  getUniqueValues(args).length is 1

allOfSameType = (args) ->
  _.uniq(args, false, 'type').length is 1

core =

  # arithmetic
  '+': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((sum, num) -> sum + num.value), 0

  '-': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(new types.Integer 0) if nums.length is 1
    type = types.getResultType nums
    new type _.reduce nums.slice(1), ((diff, num) -> diff - num.value), nums[0].value

  '*': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((prod, num) -> prod * num.value), 1

  '/': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(new types.Integer 1) if nums.length is 1
    result = _.reduce nums.slice(1), ((quo, num) -> quo / num.value), nums[0].value
    # result % 1 is 0 when result is an integer
    resultIsFloat = types.getResultType(nums) is types.Float or result % 1 isnt 0
    type = if resultIsFloat then types.Float else types.Integer
    new type result

  'inc': (num) ->
    assert.arity 1, 1, arguments
    assert.numbers num
    type = types.getResultType arguments
    new type ++num.value

  'dec': (num) ->
    assert.arity 1, 1, arguments
    assert.numbers num
    type = types.getResultType arguments
    new type --num.value

  'max': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.max nums, 'value'

  'min': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.min nums, 'value'

  'quot': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    type = types.getResultType arguments
    sign = if sameSign num, div then 1 else -1
    new type sign * Math.floor Math.abs num.value / div.value

  'rem': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    type = types.getResultType arguments
    new type num.value % div.value

  'mod': (num, div) ->
    assert.arity 2, 2, arguments
    assert.numbers arguments
    type = types.getResultType arguments
    rem = num.value % div.value
    new type if rem is 0 or sameSign num, div then rem else rem + div.value


  # comparison / test
  '=': (args...) ->
    assert.arity 1, Infinity, arguments

    args = _.uniq args   # remove duplicates
    return types.Boolean.true if args.length is 1
    values = getValues(args)

    if _.every(args, (arg) -> arg instanceof types.Sequential)
      return new types.Boolean _.reduce _.zip(values), ((result, items) ->
        # if values contains arrays of unequal length, items can contain undefined
        return false if 'undefined' in _.map items, (item) -> typeof item
        result and core['='].apply(@, items).isTrue()
      ), true

    if _.every(args, (arg) -> arg instanceof types.HashSet)
      # sets can't be equal unless they are of equal cardinality
      return types.Boolean.false unless _.uniq(_.map values, 'length').length is 1
      return new types.Boolean _.reduce _.rest(args), ((result, set1) ->
        set2 = _.first(args)
        result and
        _.every set1.value, (item1) -> core['contains?'](set2, item1).isTrue() and
        _.every set2.value, (item2) -> core['contains?'](set1, item2).isTrue()
      ), true

    # a primitive can never equal a collection
    return types.Boolean.false if _.some(args, (arg) -> arg instanceof types.Collection)

    return types.Boolean.false unless allOfSameType args

    # at this point all the arguments are: 1) primitives, and 2) of the same type
    new types.Boolean allEqual args

  'not=': (args...) ->
    assert.arity 1, Infinity, arguments
    core.not core['='].apply @, args

  '==': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean allEqual args

  'true?': (arg) ->
    assert.arity 1, 1, arguments
    new types.Boolean arg instanceof types.BaseType and arg.isTrue()

  'false?': (arg) ->
    assert.arity 1, 1, arguments
    new types.Boolean arg instanceof types.BaseType and arg.isFalse()

  'nil?': (arg) ->
    assert.arity 1, 1, arguments
    new types.Boolean arg instanceof types.BaseType and arg.isNil()

  'some?': (arg) ->
    assert.arity 1, 1, arguments
    core['nil?'](arg).complement()

  'contains?': (coll, key) ->
    assert.arity 2, 2, arguments
    assert.collections coll
    assert.notTypes [coll], [types.List]
    if coll instanceof types.Vector
      return new types.Boolean(0 <= key.value < coll.value.length)
    new types.Boolean _.any coll.value, (item) ->
      core['='](key, item).isTrue()


  # logic
  'boolean': (arg) ->
    assert.arity 1, 1, arguments
    return types.Boolean.true unless arg instanceof types.BaseType
    new types.Boolean(not arg.isFalse() and not arg.isNil())

  'not': (arg) ->
    assert.arity 1, 1, arguments
    core.boolean(arg).complement()


module.exports = core

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
types = require './closer-types'
assert = require './assert'
