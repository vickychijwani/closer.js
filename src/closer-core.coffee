_ = require 'lodash-node'

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


module.exports = core
