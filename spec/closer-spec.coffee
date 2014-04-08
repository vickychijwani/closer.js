closer = require '../closer'
json_diff = require 'json-diff'

helpers = require './closer-helpers'
Literal = helpers.Literal
Identifier = helpers.Identifier
CallExpression = helpers.CallExpression
FunctionExpression = helpers.FunctionExpression
EmptyStatement = helpers.EmptyStatement
ExpressionStatement = helpers.ExpressionStatement
IfStatement = helpers.IfStatement
ReturnStatement = helpers.ReturnStatement
VariableDeclaration = helpers.VariableDeclaration
VariableDeclarator = helpers.VariableDeclarator
FunctionDeclaration = helpers.FunctionDeclaration
BlockStatement = helpers.BlockStatement
Program = helpers.Program

beforeEach ->
  @addMatchers toDeepEqual: (expected) ->
    @message = ->
      'actual != expected, diff is:\n' + json_diff.diffString(@actual, expected)
    typeof json_diff.diff(@actual, expected) is 'undefined'


describe 'Closer.js', ->

  # atoms
  it 'correctly parses an empty program', ->
    expect(closer.parse('\n')).toDeepEqual Program()

  it 'correctly parses an empty s-expression', ->
    expect(closer.parse('()\n')).toDeepEqual Program(
      EmptyStatement())

  it 'correctly parses comments', ->
    expect(closer.parse('; Heading\n() ; trailing ()\r\n;\r;;;\n\r\r')).toDeepEqual Program(
      EmptyStatement())

  it 'correctly parses an identifier', ->
    expect(closer.parse('x\n')).toDeepEqual Program(
      ExpressionStatement(Identifier('x')))

  it 'correctly parses integer, string, boolean, and nil literals', ->
    expect(closer.parse('24\n\"string\"\ntrue\nfalse\nnil\n')).toDeepEqual Program(
      ExpressionStatement(Literal(24)),
      ExpressionStatement(Literal('string')),
      ExpressionStatement(Literal(true)),
      ExpressionStatement(Literal(false)),
      ExpressionStatement(Literal(null)))


  # functions
  it 'correctly parses a function call with 0 arguments', ->
    expect(closer.parse('(fn-name)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(Identifier('fn-name'))))

  it 'correctly parses a function call with > 0 arguments', ->
    expect(closer.parse('(fn-name arg1 arg2)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(
          Identifier('fn-name'),
          [Identifier('arg1'), Identifier('arg2')])))

  it 'correctly parses an anonymous function definition', ->
    expect(closer.parse('(fn [x] x)\n')).toDeepEqual Program(
      ExpressionStatement(
        FunctionExpression(
          null,
          [Identifier('x')],
          null,
          BlockStatement(
            ReturnStatement(Identifier('x'))))))

  it 'correctly parses an anonymous function call', ->
    expect(closer.parse('((fn [x] x) 2)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(
          FunctionExpression(
            null,
            [Identifier('x')],
            null,
            BlockStatement(
              ReturnStatement(Identifier('x')))),
          [Literal(2)])))

  it 'correctly parses a named function definition', ->
    expect(closer.parse('(defn fn-name [x] x)\n')).toDeepEqual Program(
      FunctionDeclaration(
        Identifier('fn-name'),
        [Identifier('x')],
        null,
        BlockStatement(
          ReturnStatement(Identifier('x')))))

  it 'correctly parses rest arguments', ->
    expect(closer.parse('(defn avg [& rest] (/ (apply + rest) (count rest)))\n')).toDeepEqual Program(
      FunctionDeclaration(
        Identifier('avg'),
        [], Identifier('rest'),
        BlockStatement(ReturnStatement(
          CallExpression(
            Identifier('/'), [
              CallExpression(
                Identifier('apply'),
                [Identifier('+'), Identifier('rest')])
              CallExpression(
                Identifier('count'),
                [Identifier('rest')])])))))


  # conditional statements
  it 'correctly parses an if statement without else', ->
    expect(closer.parse('(if (>= x 0) x)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          Identifier('>='),
          [Identifier('x'), Literal(0)]),
        ExpressionStatement(Identifier('x')),
        null))

  it 'correctly parses an if-else statement', ->
    expect(closer.parse('(if (>= x 0) x (- x))\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          Identifier('>='),
          [Identifier('x'), Literal(0)]),
        ExpressionStatement(Identifier('x')),
        ExpressionStatement(
          CallExpression(
            Identifier('-'),
            [Identifier('x')]))))

  it 'correctly parses a when form', ->
    expect(closer.parse('(when (condition?) (println \"hello\") true)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(Identifier('condition?')),
        BlockStatement(
          ExpressionStatement(CallExpression(
            Identifier('println'),
            [Literal('hello')])),
          ExpressionStatement(Literal(true)))))


  # variables
  it 'correctly parses an unbound var definition', ->
    expect(closer.parse('(def var-name)')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('var-name'),
          null)))

  it 'correctly parses a var bound to a literal', ->
    expect(closer.parse('(def greeting \"Hello\")')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('greeting'),
          Literal('Hello'))))

  it 'correctly parses a var bound to the result of an expression', ->
    expect(closer.parse('(def sum (+ 3 5))')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('sum'),
          CallExpression(
            Identifier('+'),
            [Literal(3), Literal(5)]))))

  it 'correctly parses a var bound to an fn form', ->
    expect(closer.parse('(def add (fn [& numbers] (apply + numbers)))')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('add'),
          FunctionExpression(
            null,
            [],
            Identifier('numbers'),
            BlockStatement(
              ReturnStatement(CallExpression(
                Identifier('apply'),
                [Identifier('+'), Identifier('numbers')])))))))

  it 'correctly parses a let form with no bindings and no body', ->
    expect(closer.parse('(let [])')).toDeepEqual Program(
      BlockStatement(ExpressionStatement(Literal(null))))

  it 'correctly parses a let form with non-empty bindings and a non-empty body', ->
    expect(closer.parse('(let [x 3 y (- x)] (+ x y))')).toDeepEqual Program(
      BlockStatement(
        VariableDeclaration(
          'let',
          VariableDeclarator(
            Identifier('x'),
            Literal(3))),
        VariableDeclaration(
          'let',
          VariableDeclarator(
            Identifier('y'),
            CallExpression(
              Identifier('-'),
              [Identifier('x')]))),
        ExpressionStatement(CallExpression(
          Identifier('+'),
          [Identifier('x'), Identifier('y')]))))


  # other special forms
  it 'correctly parses an empty do form', ->
    expect(closer.parse('(do)')).toDeepEqual Program(
      BlockStatement(ExpressionStatement(Literal(null))))

  it 'correctly parses a non-empty do form', ->
    expect(closer.parse('(do (+ 1 2) (+ 3 4))')).toDeepEqual Program(
      BlockStatement(
        ExpressionStatement(CallExpression(
          Identifier('+'),
          [Literal(1), Literal(2)])),
        ExpressionStatement(CallExpression(
          Identifier('+'),
          [Literal(3), Literal(4)]))))


  # pending
  xit 'correctly parses source locations'
