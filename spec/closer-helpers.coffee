json_diff = require 'json-diff'

# custom matcher to deep-compare objects
exports.toDeepEqual = (expected) ->
  @message = ->
    'actual != expected, diff is:\n' + json_diff.diffString(@actual, expected)
  typeof json_diff.diff(@actual, expected) is 'undefined'

closer = require '../closer'
types = require '../closer-types'

for type in types.allTypes
  exports[type] = ((type2) ->
    (value) ->
      value = if type2 is 'Nil' then null else value
      valueProp = if value?.type is 'UnaryExpression'
        value.argument = closer.node 'Literal', value.argument
        value
      else if type2 in types.collectionTypes
        closer.node 'ArrayExpression', value
      else
        closer.node 'Literal', value
      closer.node('NewExpression', closer.node('Identifier', type2), [valueProp])
  )(type)

exports.Identifier = (name) ->
  type: 'Identifier'
  name: name

exports.UnaryExpression = (operator, argument) ->
  type: 'UnaryExpression'
  operator: operator
  argument: argument
  prefix: true

exports.CallExpression = (callee, args) ->
  type: 'CallExpression'
  callee: callee
  arguments: (if (typeof args isnt 'undefined') then args else [])

exports.FunctionExpression = (id, params, rest, body) ->
  type: 'FunctionExpression'
  id: id
  params: params
  defaults: []
  rest: rest
  body: body
  generator: false
  expression: false

exports.EmptyStatement = ->
  type: 'EmptyStatement'

exports.ExpressionStatement = (expression) ->
  type: 'ExpressionStatement'
  expression: expression

exports.IfStatement = (test, consequent, alternate) ->
  type: 'IfStatement'
  test: test
  consequent: consequent
  alternate: (if (typeof alternate isnt 'undefined') then alternate else null)

exports.ReturnStatement = (argument) ->
  type: 'ReturnStatement'
  argument: argument

exports.VariableDeclaration = (args...) ->
  type: 'VariableDeclaration'
  kind: args[0]
  declarations: args.slice(1)

exports.VariableDeclarator = (id, init) ->
  type: 'VariableDeclarator'
  id: id
  init: init

exports.FunctionDeclaration = (id, params, rest, body) ->
  node = exports.FunctionExpression(id, params, rest, body)
  node.type = 'FunctionDeclaration'
  node

exports.BlockStatement = (args...) ->
  type: 'BlockStatement'
  body: args

exports.Program = (args...) ->
  type: 'Program'
  body: args