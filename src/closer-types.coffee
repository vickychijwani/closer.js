_ = require 'lodash-node'
core = require './closer-core'

exports.BaseType = class Type
  constructor: (typeName, value) ->
    @type = typeName
    @value = value
  isTrue: -> @type is 'Boolean' and @value is true
  isFalse: -> @type is 'Boolean' and @value is false
  isNil: -> @type is 'Nil'
  isPrimitive: -> @type in exports.primitiveTypes
  isCollection: -> @type in exports.collectionTypes
  isSequentialCollection: -> @type in exports.sequentialCollectionTypes

exports.allTypes = []
makeType = (typeName) ->
  exports.allTypes.push typeName
  class extends Type
    constructor: (value) ->
      super typeName, value
    @typeName: typeName


# primitive types
exports.primitiveTypes = []
makePrimitiveType = (typeName) ->
  exports.primitiveTypes.push typeName
  makeType typeName

exports.Integer = makePrimitiveType 'Integer'
exports.Float = makePrimitiveType 'Float'
exports.String = makePrimitiveType 'String'
exports.Boolean = makePrimitiveType 'Boolean'
exports.Nil = makePrimitiveType 'Nil'

# boolean constants
exports.Boolean.true = new exports.Boolean true
exports.Boolean.false = new exports.Boolean false
exports.Boolean::complement = () ->
  if @isTrue() then exports.Boolean.false else exports.Boolean.true

# nil constant
exports.Nil.nil = new exports.Nil()


# collection types
exports.collectionTypes = []
makeCollectionType = (typeName) ->
  exports.collectionTypes.push typeName
  makeType typeName

exports.sequentialCollectionTypes = []
makeSequentialCollectionType = (typeName) ->
  exports.sequentialCollectionTypes.push typeName
  makeCollectionType typeName

exports.Vector = makeSequentialCollectionType 'Vector'
exports.List = makeSequentialCollectionType 'List'
exports.HashSet = class extends makeCollectionType('HashSet')
  constructor: (values) ->
    uniques = []
    _.each values, (val) ->
      isNew = _.every uniques, (uniq) ->
        core['not='](val, uniq).value
      uniques.push(val) if isNew
    super uniques


# utilities
# throws TypeError if any of the given literals is not of one of the given types
exports.assertAll = (literals, types) ->
  for lit in literals
    unless _.some(types, (type) -> lit instanceof type)
      actual = _.pluck literals, 'type'
      expected = _.pluck types, 'typeName'
      throw new TypeError "Expected #{expected.join(' or ')}, got [#{actual.join(', ')}]"

exports.assertAllNumbers = (literals) ->
  exports.assertAll literals, [exports.Integer, exports.Float]

exports.getResultType = (numbers) ->
  if _.some(numbers, (num) -> num instanceof exports.Float)
  then exports.Float
  else exports.Integer
