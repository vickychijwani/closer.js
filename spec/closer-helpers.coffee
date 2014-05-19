json_diff = require 'json-diff'
closer = window?.closer ? self?.closer ? global?.closer ? require '../src/closer'

# custom matcher to deep-compare objects
exports.toDeepEqual = (expected) ->
  @message = ->
    'actual != expected, diff is:\n' + json_diff.diffString(@actual, expected)
  typeof json_diff.diff(@actual, expected) is 'undefined'

for type in ['keyword', 'vector', 'list', 'hash_$_set', 'hash_$_map']
  exports[type] = ((type2) ->
    (items...) ->
      items = if type2 is 'keyword' then [closer.node('Literal', items[0])] else items
      closer.node('CallExpression', closer.node('Identifier', type2), items)
  )(type)

# compound nodes
exports.AssertArity = (min, max = null) ->
  args = [exports.Literal(min)]
  if (max is Infinity) then args.push exports.Identifier('Infinity')
  args.push exports.MemberExpression(exports.Identifier('arguments'), exports.Identifier('length'))
  exports.ExpressionStatement(
    exports.CallExpression(
      exports.MemberExpression(
        exports.Identifier('assertions'), exports.Identifier('arity')),
      args))

exports.DestructuringVector = (id, destrucId, idx) ->
  exports.TryStatement(exports.BlockStatement(
    exports.VariableDeclaration(exports.VariableDeclarator(
      exports.Identifier(id),
      exports.CallExpression(exports.Identifier('nth'),
        [exports.Identifier(destrucId), exports.Literal(idx)])))),
    exports.CatchClause(
      exports.Identifier('__$error'),
      exports.BlockStatement(
        exports.IfStatement(
          exports.BinaryExpression('!==',
            exports.MemberExpression(exports.Identifier('__$error'), exports.Identifier('name')),
            exports.Literal('IndexOutOfBoundsError')),
          exports.ThrowStatement(exports.Identifier('__$error'))),
        exports.ExpressionStatement(exports.AssignmentExpression(
          exports.Identifier(id), exports.Literal(null))))))

exports.DestructuringVectorRest = (id, destrucId, dropCount) ->
  exports.VariableDeclaration(exports.VariableDeclarator(
    exports.Identifier(id),
    exports.CallExpression(exports.Identifier('drop'),
      [exports.Literal(dropCount), exports.Identifier(destrucId)])))


exports.DestructuringMap = (id, destrucId, key) ->
  exports.VariableDeclaration(exports.VariableDeclarator(
    exports.Identifier(id),
    exports.CallExpression(exports.Identifier('get'),
      [exports.Identifier(destrucId), key])))


# primitive nodes
def = (type, initFn) ->
  exports[type] = ->
    obj = initFn.apply(null, arguments) || {}
    obj.type = type
    obj

def 'Identifier', (name) ->
  name: name

def 'Literal', (value = null) ->
  value: value

def 'ThisExpression', (() -> )

def 'UnaryExpression', (operator, argument) ->
  operator: operator
  argument: argument
  prefix: true

def 'UpdateExpression', (operator, argument) ->
  operator: '++'
  argument: argument
  prefix: true

def 'BinaryExpression', (operator, left, right) ->
  operator: operator
  left: left
  right: right

def 'LogicalExpression', (operator, left, right) ->
  operator: operator
  left: left
  right: right

def 'SequenceExpression', (expressions...) ->
  expressions: expressions

def 'ArrayExpression', (elements) ->
  elements: elements

def 'AssignmentExpression', (left, right) ->
  operator: '='
  left: left
  right: right

def 'CallExpression', (callee, args) ->
  callee: callee
  arguments: (if (typeof args isnt 'undefined') then args else [])

def 'MemberExpression', (obj, prop, computed = false) ->
  object: obj
  property: prop
  computed: computed

def 'NewExpression', (callee, args) ->
  callee: callee
  arguments: args

def 'ConditionalExpression', (test, consequent, alternate) ->
  test: test
  consequent: consequent
  alternate: alternate

def 'FunctionExpression', (id, params, rest, body) ->
  id: id
  params: params
  defaults: []
  rest: rest
  body: body
  generator: false
  expression: false

def 'EmptyStatement', (() -> )

def 'ExpressionStatement', (expression) ->
  expression: expression

def 'ForStatement', (init, test, update, body) ->
  init: init
  test: test
  update: update
  body: body

def 'WhileStatement', (test, body) ->
  test: test
  body: body

def 'IfStatement', (test, consequent, alternate) ->
  test: test
  consequent: consequent
  alternate: (if (typeof alternate isnt 'undefined') then alternate else null)

def 'BreakStatement', (label = null) ->
  label: label

def 'ContinueStatement', (label = null) ->
  label: label

def 'ReturnStatement', (argument) ->
  argument: argument

def 'TryStatement', (block, handler) ->
  block: block
  handlers: [handler]
  finalizer: null

def 'CatchClause', (param, body) ->
  param: param
  guard: null
  body: body

def 'ThrowStatement', (argument) ->
  argument: argument

def 'VariableDeclaration', (args...) ->
  kind: 'var'
  declarations: args

def 'VariableDeclarator', (id, init) ->
  id: id
  init: init

def 'BlockStatement', (args...) ->
  body: args

def 'Program', (args...) ->
  body: args
