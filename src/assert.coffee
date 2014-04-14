assert =
  # throws TypeError if any of the given literals is not of one of the given types
  types: (literals, expectedTypes) ->
    for lit in literals
      unless _.some(expectedTypes, (type) -> lit instanceof type)
        actual = _.pluck literals, 'type'
        expected = _.pluck expectedTypes, 'typeName'
        throw new TypeError "Expected #{expected.join(' or ')}, got [#{actual.join(', ')}]"

  numbers: (literals...) ->
    literals = _.flatten literals, true
    assert.types literals, [types.Number]

  collections: (literals...) ->
    literals = _.flatten literals, true
    assert.types literals, [types.Collection]

module.exports = assert

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require 'lodash-node'
types = require './closer-types'
