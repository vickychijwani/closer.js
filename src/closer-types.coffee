types = {}

types.BaseType = class
  constructor: (value, type = @constructor.typeName) ->
    @type = type
    @value = value
  isTrue: -> @ instanceof types.Boolean and @value is true
  isFalse: -> @ instanceof types.Boolean and @value is false
  isNil: -> @ instanceof types.Nil

# primitive types
types.Primitive = class extends types.BaseType
types.Number = class extends types.Primitive

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
types.Sequential = class extends types.Collection

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
# throws TypeError if any of the given literals is not of one of the given types
types.assertTypes = (literals, expectedTypes) ->
  for lit in literals
    unless _.some(expectedTypes, (type) -> lit instanceof type)
      actual = _.pluck literals, 'type'
      expected = _.pluck expectedTypes, 'typeName'
      throw new TypeError "Expected #{expected.join(' or ')}, got [#{actual.join(', ')}]"

types.assertNumbers = (literals) ->
  types.assertTypes literals, [types.Number]

types.getResultType = (nums) ->
  if _.some(nums, (n) -> n instanceof types.Float) then types.Float else types.Integer


module.exports = types

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
core = require './closer-core'
