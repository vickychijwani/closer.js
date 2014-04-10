closer = require '../closer'
json_diff = require 'json-diff'

helpers = require './closer-helpers'
Integer = helpers['Integer']
Float = helpers['Float']
String = helpers['String']
Boolean = helpers['Boolean']
Nil = helpers['Nil']
Identifier = helpers.Identifier
UnaryExpression = helpers.UnaryExpression
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
  @addMatchers toDeepEqual: helpers.toDeepEqual


describe 'Closer parser', ->

  # atoms
  it 'parses an empty program', ->
    expect(closer.parse('\n')).toDeepEqual Program()

  it 'parses an empty s-expression', ->
    expect(closer.parse('()\n')).toDeepEqual Program(
      EmptyStatement())

  it 'parses comments', ->
    expect(closer.parse('; Heading\n() ; trailing ()\r\n;\r;;;\n\r\r')).toDeepEqual Program(
      EmptyStatement())

  it 'parses an identifier', ->
    expect(closer.parse('x\n')).toDeepEqual Program(
      ExpressionStatement(Identifier('x')))

  it 'parses integer, float, string, boolean, and nil literals', ->
    expect(closer.parse('-24\n-23.67\n-22.45E-5\n\"string\"\ntrue\nfalse\nnil\n')).toDeepEqual Program(
      ExpressionStatement(Integer(UnaryExpression('-', 24))),
      ExpressionStatement(Float(UnaryExpression('-', 23.67))),
      ExpressionStatement(Float(UnaryExpression('-', 22.45e-5))),
      ExpressionStatement(String('string')),
      ExpressionStatement(Boolean(true)),
      ExpressionStatement(Boolean(false)),
      ExpressionStatement(Nil()))


  # functions
  it 'parses a function call with 0 arguments', ->
    expect(closer.parse('(fn-name)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(Identifier('fn-name'))))

  it 'parses a function call with > 0 arguments', ->
    expect(closer.parse('(fn-name arg1 arg2)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(
          Identifier('fn-name'),
          [Identifier('arg1'), Identifier('arg2')])))

  it 'parses an anonymous function definition', ->
    expect(closer.parse('(fn [x] x)\n')).toDeepEqual Program(
      ExpressionStatement(
        FunctionExpression(
          null,
          [Identifier('x')],
          null,
          BlockStatement(
            ReturnStatement(Identifier('x'))))))

  it 'parses an anonymous function call', ->
    expect(closer.parse('((fn [x] x) 2)\n')).toDeepEqual Program(
      ExpressionStatement(
        CallExpression(
          FunctionExpression(
            null,
            [Identifier('x')],
            null,
            BlockStatement(
              ReturnStatement(Identifier('x')))),
          [Integer(2)])))

  it 'parses a named function definition', ->
    expect(closer.parse('(defn fn-name [x] x)\n')).toDeepEqual Program(
      FunctionDeclaration(
        Identifier('fn-name'),
        [Identifier('x')],
        null,
        BlockStatement(
          ReturnStatement(Identifier('x')))))

  it 'parses rest arguments', ->
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
  it 'parses an if statement without else', ->
    expect(closer.parse('(if (>= x 0) x)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          Identifier('>='),
          [Identifier('x'), Integer(0)]),
        ExpressionStatement(Identifier('x')),
        null))

  it 'parses an if-else statement', ->
    expect(closer.parse('(if (>= x 0) x (- x))\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          Identifier('>='),
          [Identifier('x'), Integer(0)]),
        ExpressionStatement(Identifier('x')),
        ExpressionStatement(
          CallExpression(
            Identifier('-'),
            [Identifier('x')]))))

  it 'parses a when form', ->
    expect(closer.parse('(when (condition?) (println \"hello\") true)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(Identifier('condition?')),
        BlockStatement(
          ExpressionStatement(CallExpression(
            Identifier('println'),
            [String('hello')])),
          ExpressionStatement(Boolean(true)))))


  # variables
  it 'parses an unbound var definition', ->
    expect(closer.parse('(def var-name)')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('var-name'),
          null)))

  it 'parses a var bound to a literal', ->
    expect(closer.parse('(def greeting \"Hello\")')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('greeting'),
          String('Hello'))))

  it 'parses a var bound to the result of an expression', ->
    expect(closer.parse('(def sum (+ 3 5))')).toDeepEqual Program(
      VariableDeclaration(
        'var',
        VariableDeclarator(
          Identifier('sum'),
          CallExpression(
            Identifier('+'),
            [Integer(3), Integer(5)]))))

  it 'parses a var bound to an fn form', ->
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

  it 'parses a let form with no bindings and no body', ->
    expect(closer.parse('(let [])')).toDeepEqual Program(
      BlockStatement(ExpressionStatement(Nil())))

  it 'parses a let form with non-empty bindings and a non-empty body', ->
    expect(closer.parse('(let [x 3 y (- x)] (+ x y))')).toDeepEqual Program(
      BlockStatement(
        VariableDeclaration(
          'let',
          VariableDeclarator(
            Identifier('x'),
            Integer(3))),
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
  it 'parses an empty do form', ->
    expect(closer.parse('(do)')).toDeepEqual Program(
      BlockStatement(ExpressionStatement(Nil())))

  it 'parses a non-empty do form', ->
    expect(closer.parse('(do (+ 1 2) (+ 3 4))')).toDeepEqual Program(
      BlockStatement(
        ExpressionStatement(CallExpression(
          Identifier('+'),
          [Integer(1), Integer(2)])),
        ExpressionStatement(CallExpression(
          Identifier('+'),
          [Integer(3), Integer(4)]))))


  # pending
  xit 'parses source locations'
