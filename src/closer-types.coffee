_ = require 'lodash-node'

exports.typeNames = []

makeType = (typeName) ->
  exports.typeNames.push(typeName)
  type = (value) ->
    @type = typeName
    @value = value

  type.typeName = typeName
  type.isTypeOf = (literal) ->
    literal instanceof type or literal.type is type.typeName
  type

exports.Integer = makeType 'Integer'
exports.Float = makeType 'Float'
exports.String = makeType 'String'
exports.Boolean = makeType 'Boolean'
exports.Nil = makeType 'Nil'

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
