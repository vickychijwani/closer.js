_ = require 'lodash-node'

makeType = (typeName) ->
  type = (value) ->
    @type = typeName
    @value = value
  type.typeName = typeName
  type.isTypeOf = (literal) ->
    literal instanceof type or literal.type is type.typeName
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
