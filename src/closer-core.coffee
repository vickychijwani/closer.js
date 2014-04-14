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
    types.assertNumbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((sum, num) -> sum + num.value), 0

  '-': (nums...) ->
    types.assertNumbers nums
    nums.unshift(new types.Integer 0) if nums.length is 1
    type = types.getResultType nums
    new type _.reduce nums.slice(1), ((diff, num) -> diff - num.value), nums[0].value

  '*': (nums...) ->
    types.assertNumbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((prod, num) -> prod * num.value), 1

  '/': (nums...) ->
    types.assertNumbers nums
    nums.unshift(new types.Integer 1) if nums.length is 1
    result = _.reduce nums.slice(1), ((quo, num) -> quo / num.value), nums[0].value
    # result % 1 is 0 when result is an integer
    resultIsFloat = types.getResultType(nums) is types.Float or result % 1 isnt 0
    type = if resultIsFloat then types.Float else types.Integer
    new type result

  'inc': (num) ->
    types.assertNumbers arguments
    type = types.getResultType arguments
    new type ++num.value

  'dec': (num) ->
    types.assertNumbers arguments
    type = types.getResultType arguments
    new type --num.value

  'max': (nums...) ->
    types.assertNumbers nums
    _.max nums, 'value'

  'min': (nums...) ->
    types.assertNumbers nums
    _.min nums, 'value'

  'quot': (num, div) ->
    types.assertNumbers arguments
    type = types.getResultType arguments
    sign = if sameSign num, div then 1 else -1
    new type sign * Math.floor Math.abs num.value / div.value

  'rem': (num, div) ->
    types.assertNumbers arguments
    type = types.getResultType arguments
    new type num.value % div.value

  'mod': (num, div) ->
    types.assertNumbers arguments
    type = types.getResultType arguments
    rem = num.value % div.value
    new type if rem is 0 or sameSign num, div then rem else rem + div.value


  # comparison
  '=': (args...) ->
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
    core.not core['='].apply @, args

  '==': (args...) ->
    return types.Boolean.true if args.length is 1
    types.assertNumbers args
    new types.Boolean allEqual args


  # logic
  'boolean': (arg) ->
    return types.Boolean.true unless arg instanceof types.BaseType
    new types.Boolean(not arg.isFalse() and not arg.isNil())

  'not': (arg) ->
    core.boolean(arg).complement()


  # test
  'true?': (arg) ->
    new types.Boolean arg instanceof types.BaseType and arg.isTrue()

  'false?': (arg) ->
    new types.Boolean arg instanceof types.BaseType and arg.isFalse()

  'nil?': (arg) ->
    new types.Boolean arg instanceof types.BaseType and arg.isNil()

  'some?': (arg) ->
    core['nil?'](arg).complement()

  'contains?': (coll, key) ->
    # TODO wrong result for Lists and Vectors!
    new types.Boolean _.any coll.value, (item) ->
      core['='](key, item).isTrue()


module.exports = core

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
types = require './closer-types'
