_ = require 'lodash-node'

makeType = (typeName) ->
  type = (value) ->
    @type = typeName
    @value = value
  type.typeName = typeName
  # utilities
  type.isTypeOf = (literal) ->
    literal instanceof type or literal.type is type.typeName
  type::isTrue = -> @type is 'Boolean' and @value is true
  type::isFalse = -> @type is 'Boolean' and @value is false
  type::isNil = -> @type is 'Nil'
  type

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

# nil constant
exports.Nil.nil = new exports.Nil()

# collection types
exports.collectionTypes = []
makeCollectionType = (typeName) ->
  exports.collectionTypes.push typeName
  makeType typeName

exports.Vector = makeCollectionType 'Vector'

# utilities
# throws TypeError if any of the given literals is not of one of the given types
exports.assertAll = (literals, types) ->
  for lit in literals
    unless _.some(types, (type) -> type.isTypeOf lit)
      values = (lit.value for lit in literals)
      typeNames = (type.typeName for type in types)
      throw new TypeError "Expected #{values} to be of type #{typeNames.join(" or ")}"

exports.assertAllNumbers = (literals) ->
  exports.assertAll literals, [exports.Integer, exports.Float]

exports.getResultType = (numbers) ->
  if _.some(numbers, (num) -> exports.Float.isTypeOf num)
  then exports.Float
  else exports.Integer
