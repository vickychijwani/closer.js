types = {}

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
  @typeName: 'String'

types.Boolean = class extends types.Primitive
  complement: -> if @isTrue() then @constructor.false else @constructor.true
  @typeName: 'Boolean'
  @true: new @ true, 'Boolean'
  @false: new @ false, 'Boolean'

types.Nil = class extends types.Primitive
  @typeName: 'Nil'
  @nil: new @ null, 'Nil'


# collection types
types.Collection = class extends types.BaseType
  @typeName: 'Collection'

types.Sequential = class extends types.Collection
  @typeName: 'Sequential'

types.Vector = class extends types.Sequential
  @typeName: 'Vector'

types.List = class extends types.Sequential
  @typeName: 'List'

types.HashSet = class extends types.Collection
  constructor: (values) ->
    # TODO HashSet isn't really a HashSet
    uniques = []
    _.each values, (val) ->
      isNew = _.every uniques, (uniq) ->
        core['not='](val, uniq).value
      uniques.push(val) if isNew
    super uniques
  @typeName: 'HashSet'


# utilities
types.getResultType = (nums) ->
  if _.some(nums, (n) -> n instanceof types.Float) then types.Float else types.Integer


module.exports = types

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
core = require './closer-core'
