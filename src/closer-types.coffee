types = {}

types.implements = (obj, methods) ->
  _.every _.flatten(methods), (m) -> typeof obj[m] is "function"


types.BaseType = class
  constructor: (value, type = @constructor.typeName) ->
    @type = type
    @value = value
  isTrue: -> @ instanceof types.Boolean and @value is true
  isFalse: -> @ instanceof types.Boolean and @value is false
  isNil: -> @ instanceof types.Nil
  @typeName: 'BaseType'

# primitive types
types.Primitive = class extends types.BaseType
  @typeName: 'Primitive'

types.Number = class extends types.Primitive
  @typeName: 'Number'

types.Integer = class extends types.Number
  @typeName: 'Integer'

types.Float = class extends types.Number
  @typeName: 'Float'

types.String = class extends types.Primitive
  items: -> _.map _.toArray(@value), (char) -> new types.String char
  keys: -> _.map _.range(@value.length), (idx) -> new types.Integer idx
  values: -> @items()
  @typeName: 'String'

types.Boolean = class extends types.Primitive
  complement: -> if @isTrue() then @constructor.false else @constructor.true
  @typeName: 'Boolean'
  @true: new @ true, 'Boolean'
  @false: new @ false, 'Boolean'

types.Nil = class extends types.Primitive
  @typeName: 'Nil'
  @nil: new @ null, 'Nil'

types.Keyword = class extends types.Primitive
  @typeName: 'Keyword'


# collection types
types.Collection = class extends types.BaseType
  @typeName: 'Collection'
  @startDelimiter: 'Collection('
  @endDelimiter: ')'

types.Sequence = ['items']

types.Map = ['keys', 'values']

types.Vector = class extends types.Collection
  items: -> @value
  keys: -> _.map _.range(@value.length), (idx) -> new types.Integer idx
  values: -> @items()
  @typeName: 'Vector'
  @startDelimiter = '['
  @endDelimiter = ']'

types.List = class extends types.Collection
  items: -> @value
  @typeName: 'List'
  @startDelimiter = '('
  @endDelimiter = ')'

types.HashSet = class extends types.Collection
  constructor: (values) ->
    # TODO HashSet isn't really a HashSet
    uniques = []
    _.each values, (val) ->
      isNew = _.every uniques, (uniq) ->
        core['not='](val, uniq).value
      uniques.push(val) if isNew
    super uniques
  items: -> @value
  keys: -> @value
  values: -> @value
  @typeName: 'HashSet'
  @startDelimiter = '#{'
  @endDelimiter = '}'

types.HashMap = class extends types.Collection
  constructor: (items) ->
    # TODO HashMap isn't really a HashMap
    keys = _.filter items, (item, index) -> index % 2 is 0
    values = _.difference items, keys
    uniques = []
    _.each @keys, (key) ->
      _.each uniques, (uniq) ->
        throw new DuplicateKeyError(key) if core['='](key, uniq).value
      uniques.push key
    super { keys: keys, values: values }
  items: -> _.zip @keys(), @values()
  keys: -> @value.keys
  values: -> @value.values
  @typeName: 'HashMap'
  @startDelimiter = '{'
  @endDelimiter = '}'

class DuplicateKeyError extends Error
  constructor: (key) ->
    Error.captureStackTrace @, @.constructor
    @name = 'DuplicateKeyError'
    @message = "Duplicate key: #{core['str'](key).value}"


# utilities
types.getResultType = (nums) ->
  if _.some(nums, (n) -> n instanceof types.Float) then types.Float else types.Integer


module.exports = types

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
core = require './closer-core'
