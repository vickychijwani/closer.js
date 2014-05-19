exports.forceNoLoc = false

exports.defineNodes = (builder) ->

  defaultIni = (loc) ->
    @loc = loc
    @

  def = (name, ini) ->
    builder[name[0].toLowerCase() + name.slice(1)] = (a, b, c, d, e, f, g, h) ->
      obj = {}
      obj.type = name
      ini.call obj, a, b, c, d, e, f, g, h
      delete obj.loc if exports.forceNoLoc is true
      obj


  # Nodes
  def 'Program', (elements, loc) ->
    @body = elements
    @loc = loc

  def 'ExpressionStatement', (expression, loc) ->
    @expression = expression
    @loc = loc

  def 'BlockStatement', (body, loc) ->
    @body = body
    @loc = loc

  def 'EmptyStatement', defaultIni

  def 'Identifier', (name, loc) ->
    @name = name
    @loc = loc

  def 'Literal', (value, loc, raw) ->
    @value = value
    # @raw = raw if raw
    @loc = loc

  def 'ThisExpression', defaultIni

  def 'VariableDeclaration', (kind, declarations, loc) ->
    @declarations = declarations
    @kind = kind
    @loc = loc

  def 'VariableDeclarator', (id, init, loc) ->
    @id = id
    @init = init
    @loc = loc

  def 'ArrayExpression', (elements, loc) ->
    @elements = elements
    @loc = loc

  def 'ObjectExpression', (properties, loc) ->
    @properties = properties
    @loc = loc

  funIni = (ident, params, rest, body, isGen, isExp, loc) ->
    @id = ident
    @params = params
    @defaults = []
    @rest = rest
    @body = body
    @loc = loc
    @generator = isGen
    @expression = isExp

  def 'FunctionDeclaration', funIni

  def 'FunctionExpression', funIni

  def 'ReturnStatement', (argument, loc) ->
    @argument = argument
    @loc = loc

  def 'TryStatement', (block, handlers, finalizer, loc) ->
    @block = block
    @handlers = handlers or []
    @finalizer = finalizer
    @loc = loc

  def 'CatchClause', (param, guard, body, loc) ->
    @param = param
    @guard = guard
    @body = body
    @loc = loc

  def 'ThrowStatement', (argument, loc) ->
    @argument = argument
    @loc = loc

  def 'BreakStatement', (label, loc) ->
    @label = label
    @loc = loc

  def 'ContinueStatement', (label, loc) ->
    @label = label
    @loc = loc

  # operators
  def 'ConditionalExpression', (test, consequent, alternate, loc) ->
    @test = test
    @consequent = consequent
    @alternate = alternate
    @loc = loc

  def 'SequenceExpression', (expressions, loc) ->
    @expressions = expressions
    @loc = loc

  def 'BinaryExpression', (op, left, right, loc) ->
    @operator = op
    @left = left
    @right = right
    @loc = loc

  def 'AssignmentExpression', (op, left, right, loc) ->
    @operator = op
    @left = left
    @right = right
    @loc = loc

  def 'LogicalExpression', (op, left, right, loc) ->
    @operator = op
    @left = left
    @right = right
    @loc = loc

  def 'UnaryExpression', (operator, argument, prefix, loc) ->
    @operator = operator
    @argument = argument
    @prefix = prefix
    @loc = loc

  def 'UpdateExpression', (operator, argument, prefix, loc) ->
    @operator = operator
    @argument = argument
    @prefix = prefix
    @loc = loc

  def 'CallExpression', (callee, args, loc) ->
    @callee = callee
    @arguments = args
    @loc = loc

  def 'NewExpression', (callee, args, loc) ->
    @callee = callee
    @arguments = args
    @loc = loc

  def 'MemberExpression', (object, property, computed, loc) ->
    @object = object
    @property = property
    @computed = computed
    @loc = loc

  # debugger node
  def 'DebuggerStatement', defaultIni

  # empty node
  def 'Empty', defaultIni

  # control structs
  def 'WhileStatement', (test, body, loc) ->
    @test = test
    @body = body
    @loc = loc

  def 'ForStatement', (init, test, update, body, loc) ->
    @init = init
    @test = test
    @update = update
    @body = body
    @loc = loc

  def 'IfStatement', (test, consequent, alternate, loc) ->
    @test = test
    @consequent = consequent
    @alternate = alternate
    @loc = loc

  def
