_ = require 'lodash-node'
types = require './closer-types'

sameSign = (num1, num2) ->
  num1.value > 0 and num2.value > 0 or num1.value < 0 and num2.value < 0

core =

  # arithmetic
  '+': (nums...) ->
    types.assertAllNumbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((sum, num) -> sum + num.value), 0

  '-': (nums...) ->
    types.assertAllNumbers nums
    nums.unshift(new types.Integer 0) if nums.length is 1
    type = types.getResultType nums
    new type _.reduce nums.slice(1), ((diff, num) -> diff - num.value), nums[0].value

  '*': (nums...) ->
    types.assertAllNumbers nums
    type = types.getResultType nums
    new type _.reduce nums, ((prod, num) -> prod * num.value), 1

  '/': (nums...) ->
    types.assertAllNumbers nums
    nums.unshift(new types.Integer 1) if nums.length is 1
    result = _.reduce nums.slice(1), ((quo, num) -> quo / num.value), nums[0].value
    # result % 1 is 0 when result is an integer
    resultIsFloat = types.getResultType(nums) is types.Float or result % 1 isnt 0
    type = if resultIsFloat then types.Float else types.Integer
    new type result

  'inc': (num) ->
    types.assertAllNumbers arguments
    type = types.getResultType arguments
    new type ++num.value

  'dec': (num) ->
    types.assertAllNumbers arguments
    type = types.getResultType arguments
    new type --num.value

  'max': (nums...) ->
    types.assertAllNumbers nums
    _.max nums, 'value'

  'min': (nums...) ->
    types.assertAllNumbers nums
    _.min nums, 'value'

  'quot': (num, div) ->
    types.assertAllNumbers arguments
    type = types.getResultType arguments
    sign = if sameSign num, div then 1 else -1
    new type sign * Math.floor Math.abs num.value / div.value

  'rem': (num, div) ->
    types.assertAllNumbers arguments
    type = types.getResultType arguments
    new type num.value % div.value

  'mod': (num, div) ->
    types.assertAllNumbers arguments
    type = types.getResultType arguments
    rem = num.value % div.value
    new type if rem is 0 or sameSign num, div then rem else rem + div.value


module.exports = core
