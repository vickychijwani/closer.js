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

    if _.every(args, (arg) -> arg instanceof types.Primitive) and allOfSameType args
      return new types.Boolean allEqual args

    if _.every(args, (arg) -> types.implements arg, types.Map)
      # maps can't be equal unless they are of equal size
      return types.Boolean.false unless _.uniq(_.map args, (arg) -> arg.keys().length).length is 1
      map1 = _.first args
      return new types.Boolean _.reduce _.rest(args), ((result, map2) ->
        result and
        _.every map1.keys(), (key1) -> core['contains?'](map2, key1).isTrue() and
        _.every map2.keys(), (key2) -> core['contains?'](map1, key2).isTrue() and
        _.every map1.keys(), (key) -> core['='](core.get(map1, key), core.get(map2, key)).isTrue()
      ), true

    if _.every(args, (arg) -> types.implements arg, types.Sequence)
      itemsArray = _.invoke args, 'items'
      return new types.Boolean _.reduce _.zip(itemsArray), ((result, items) ->
        # if values contains arrays of unequal length, items can contain undefined
        return false if 'undefined' in _.map items, (item) -> typeof item
        result and core['='].apply(@, items).isTrue()
      ), true

    types.Boolean.false

  'not=': (args...) ->
    assert.arity 1, Infinity, arguments
    core.not core['='].apply @, args

  '==': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean allEqual _.uniq args

  '<': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean _.reduce getValues(args), ((result, val, idx, values) ->
      result and (idx+1 is values.length or val < values[idx+1])
    ), true

  '>': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean _.reduce getValues(args), ((result, val, idx, values) ->
      result and (idx+1 is values.length or val > values[idx+1])
    ), true

  '<=': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean _.reduce getValues(args), ((result, val, idx, values) ->
      result and (idx+1 is values.length or val <= values[idx+1])
    ), true

  '>=': (args...) ->
    assert.arity 1, Infinity, arguments
    return types.Boolean.true if args.length is 1
    assert.numbers args
    new types.Boolean _.reduce getValues(args), ((result, val, idx, values) ->
      result and (idx+1 is values.length or val >= values[idx+1])
    ), true

  'identical?': (x, y) ->
    assert.arity 2, 2, arguments
    return core['='](x, y) if _.every [x, y], (arg) -> arg.type in ['Integer', 'Boolean', 'Nil', 'Keyword']
    new types.Boolean(x is y)

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

  'number?': (x) ->
    assert.arity 1, 1, arguments
    new types.Boolean x instanceof types.Number

  'integer?': (x) ->
    assert.arity 1, 1, arguments
    new types.Boolean x instanceof types.Integer

  'float?': (x) ->
    assert.arity 1, 1, arguments
    new types.Boolean x instanceof types.Float

  'zero?': (x) ->
    assert.arity 1, 1, arguments
    core['=='](x, new types.Integer(0))

  'pos?': (x) ->
    assert.arity 1, 1, arguments
    core['>'] x, new types.Integer(0)

  'neg?': (x) ->
    assert.arity 1, 1, arguments
    core['<'] x, new types.Integer(0)

  'even?': (x) ->
    assert.arity 1, 1, arguments
    assert.types [x], [types.Integer]
    core['zero?'] core['mod'] x, new types.Integer(2)

  'odd?': (x) ->
    core['not'] core['even?'] x

  'contains?': (coll, key) ->
    assert.arity 2, 2, arguments
    assert.collections coll
    assert.notTypes [coll], [types.List]
    new types.Boolean _.any coll.keys(), (item) -> core['='](key, item).isTrue()


  # logic
  'boolean': (arg) ->
    assert.arity 1, 1, arguments
    return types.Boolean.true unless arg instanceof types.BaseType
    new types.Boolean(not arg.isFalse() and not arg.isNil())

  'not': (arg) ->
    assert.arity 1, 1, arguments
    core.boolean(arg).complement()


  # string
  'str': (args...) ->
    assert.arity 0, Infinity, arguments
    assert.types args, [types.BaseType]
    return new types.String '' if args.length is 0
    str = ''
    for arg in args
      str += switch
        when arg instanceof types.Nil then ''
        when arg instanceof types.Keyword then ":#{arg.value}"
        when arg instanceof types.HashMap
          type = types[arg.type]
          collStr = _.map(_.zip(arg.keys(), arg.values()), (pair) ->
            core['str'](pair[0]).value + ' ' + core['str'](pair[1]).value).join ', '
          type.startDelimiter + collStr + type.endDelimiter
        when arg instanceof types.Collection
          type = types[arg.type]
          collStr = _.map(arg.value, (item) -> core['str'](item).value).join ' '
          type.startDelimiter + collStr + type.endDelimiter
        else arg.value.toString()
    new types.String str


  # collections
  'count': (coll) ->
    assert.arity 1, 1, arguments
    assert.types [coll], [types.Nil, types.String, types.Collection]
    new types.Integer switch
      when coll instanceof types.Nil then 0
      when types.implements(coll, types.Map) then coll.keys().length
      else coll.value.length

  'empty': (coll) ->
    assert.arity 1, 1, arguments
    assert.types [coll], [types.BaseType]
    if coll instanceof types.Collection then new types[coll.type]([]) else types.Nil.nil

  'not-empty': (coll) ->
    assert.arity 1, 1, arguments
    assert.types [coll], [types.Nil, types.String, types.Collection]
    if core['count'](coll).value is 0 then types.Nil.nil else coll

  'get': (coll, key, notFound = types.Nil.nil) ->
    assert.arity 2, 3, arguments
    assert.types [coll, key, notFound], [types.BaseType]
    return notFound unless types.implements coll, types.Map
    index = _.findIndex coll.keys(), (key2) ->
      core['='](key, key2).isTrue()
    if index is -1 then notFound else coll.values()[index]

  'seq': (coll) ->
    assert.arity 1, 1, arguments
    assert.types [coll], [types.Nil, types.String, types.Collection]
    return types.Nil.nil if core['count'](coll).value is 0
    new types.Seq coll.items()

  'identity': (x) ->
    assert.arity 1, 1, arguments
    assert.types [x], [types.BaseType]
    x


module.exports = core

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
types = require './closer-types'
assert = require './assert'
