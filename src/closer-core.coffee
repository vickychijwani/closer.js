_ = require 'lodash-node'

sameSign = (num1, num2) ->
  num1 > 0 and num2 > 0 or num1 < 0 and num2 < 0

core =

  # arithmetic
  '+': (nums...) ->
    _.reduce nums, ((sum, num) -> sum + num), 0

  '-': (nums...) ->
    nums.unshift(0) if nums.length is 1
    _.reduce nums.slice(1), ((diff, num) -> diff - num), nums[0]

  '*': (nums...) ->
    _.reduce nums, ((prod, num) -> prod * num), 1

  '/': (nums...) ->
    nums.unshift(1) if nums.length is 1
    _.reduce nums.slice(1), ((quo, num) -> quo / num), nums[0]

  'inc': (num) ->
    ++num

  'dec': (num) ->
    --num

  'max': (nums...) ->
    _.max(nums)

  'min': (nums...) ->
    _.min(nums)

  'quot': (num, div) ->
    sign = if sameSign num, div then 1 else -1
    sign * Math.floor(Math.abs(num / div))

  'rem': (num, div) ->
    num % div

  'mod': (num, div) ->
    rem = core.rem num, div
    if rem is 0 or sameSign num, div then rem else rem + div


module.exports = core
