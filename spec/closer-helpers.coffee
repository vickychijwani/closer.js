json_diff = require 'json-diff'
closer = require '../src/closer'

# custom matcher to deep-compare objects
exports.toDeepEqual = (expected) ->
  @message = ->
    'actual != expected, diff is:\n' + json_diff.diffString(@actual, expected)
  typeof json_diff.diff(@actual, expected) is 'undefined'

for type in ['keyword', 'vector', 'list', 'set', 'hash_map', 'seq']
  exports[type] = ((type2) ->
    (items...) ->
      items = if type2 is 'keyword' then [closer.node('Literal', items[0])] else items
      args = if type2 is 'set' then [closer.node('ArrayExpression', items)] else items
      closer.node('CallExpression', closer.node('Identifier', type2), args)
  )(type)

exports.Identifier = (name) ->
  type: 'Identifier'
  name: name

exports.Literal = (value = null) ->
  type: 'Literal'
  value: value

exports.ThisExpression = ->
  type: 'ThisExpression'

exports.UnaryExpression = (operator, argument) ->
  type: 'UnaryExpression'
  operator: operator
  argument: argument
  prefix: true

exports.BinaryExpression = (operator, left, right) ->
  type: 'BinaryExpression'
  operator: operator
  left: left
  right: right

exports.ArrayExpression = (elements) ->
  type: 'ArrayExpression'
  elements: elements

exports.AssignmentExpression = (left, right) ->
  type: 'AssignmentExpression'
  operator: '='
  left: left
  right: right

exports.CallExpression = (callee, args) ->
  type: 'CallExpression'
  callee: callee
  arguments: (if (typeof args isnt 'undefined') then args else [])

exports.MemberExpression = (obj, prop, computed = false) ->
  type: 'MemberExpression'
  object: obj
  property: prop
  computed: computed

exports.ConditionalExpression = (test, consequent, alternate) ->
  type: 'ConditionalExpression'
  test: test
  consequent: consequent
  alternate: alternate

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

exports.WhileStatement = (test, body) ->
  type: 'WhileStatement'
  test: test
  body: body

exports.IfStatement = (test, consequent, alternate) ->
  type: 'IfStatement'
  test: test
  consequent: consequent
  alternate: (if (typeof alternate isnt 'undefined') then alternate else null)

exports.BreakStatement = (label = null) ->
  type: 'BreakStatement'
  label: label

exports.ContinueStatement = (label = null) ->
  type: 'ContinueStatement'
  label: label

exports.ReturnStatement = (argument) ->
  type: 'ReturnStatement'
  argument: argument

exports.VariableDeclaration = (args...) ->
  type: 'VariableDeclaration'
  kind: 'var'
  declarations: args

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