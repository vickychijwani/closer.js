exports.locations = true

exports.defineNodes = (builder) ->

  defaultIni = (loc) ->
    @loc = loc
    @

  def = (name, ini) ->
    builder[name[0].toLowerCase() + name.slice(1)] = (a, b, c, d, e, f, g, h) ->
      obj = {}
      obj.type = name
      ini.call obj, a, b, c, d, e, f, g, h
      # if obj.loc
      # obj.range = obj.loc.range || [0, 0]
      delete obj.loc unless exports.locations
      # obj.loc = arguments_[ini.length - (if name is 'Literal' then 2 else 1)]
      # delete obj.loc.range
      obj

  # used in cases where object and array literals are valid expressions
  convertExprToPattern = (expr) ->
    expr.type = 'ObjectPattern' if expr.type is 'ObjectExpression'
    expr.type = 'ArrayPattern' if expr.type is 'ArrayExpression'


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

  def 'Property', (key, value, kind, loc) ->
    @key = key
    @value = value
    @kind = kind
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
    # if not @expression
    #   @body.body.forEach (el) ->
    #     if el.type is 'VariableDeclaration' and el.kind is 'let'
    #       el.kind = 'var'

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

  def 'LabeledStatement', (label, body, loc) ->
    @label = label
    @body = body
    @loc = loc

  def 'BreakStatement', (label, loc) ->
    @label = label
    @loc = loc

  def 'ContinueStatement', (label, loc) ->
    @label = label
    @loc = loc

  def 'SwitchStatement', (discriminant, cases, lexical, loc) ->
    @discriminant = discriminant
    @cases = cases if cases.length
    @loc = loc

  def 'SwitchCase', (test, consequent, loc) ->
    @test = test
    @consequent = consequent
    @loc = loc

  def 'WithStatement', (object, body, loc) ->
    @object = object
    @body = body
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
    convertExprToPattern left

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

  def 'DoWhileStatement', (body, test, loc) ->
    @body = body
    @test = test
    @loc = loc

  def 'ForStatement', (init, test, update, body, loc) ->
    @init = init
    @test = test
    @update = update
    @body = body
    @loc = loc
    convertExprToPattern init if init

  def 'ForInStatement', (left, right, body, each, loc) ->
    @left = left
    @right = right
    @body = body
    @each = not not each
    @loc = loc
    convertExprToPattern left

  def 'IfStatement', (test, consequent, alternate, loc) ->
    @test = test
    @consequent = consequent
    @alternate = alternate
    @loc = loc

  def 'ObjectPattern', (properties, loc) ->
    @properties = properties
    @loc = loc

  def 'ArrayPattern', (elements, loc) ->
    @elements = elements
    @loc = loc

  def
