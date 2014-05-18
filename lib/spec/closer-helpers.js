(function() {
  var closer, json_diff, type, _i, _len, _ref, _ref1, _ref2, _ref3,
    __slice = [].slice;

  json_diff = require('json-diff');

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('../src/closer');

  exports.toDeepEqual = function(expected) {
    this.message = function() {
      return 'actual != expected, diff is:\n' + json_diff.diffString(this.actual, expected);
    };
    return typeof json_diff.diff(this.actual, expected) === 'undefined';
  };

  _ref3 = ['keyword', 'vector', 'list', 'hash_$_set', 'hash_$_map'];
  for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
    type = _ref3[_i];
    exports[type] = (function(type2) {
      return function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        items = type2 === 'keyword' ? [closer.node('Literal', items[0])] : items;
        return closer.node('CallExpression', closer.node('Identifier', type2), items);
      };
    })(type);
  }

  exports.AssertArity = function(min, max) {
    var args;
    if (max == null) {
      max = null;
    }
    args = [exports.Literal(min)];
    if (max === Infinity) {
      args.push(exports.Identifier('Infinity'));
    }
    args.push(exports.MemberExpression(exports.Identifier('arguments'), exports.Identifier('length')));
    return exports.ExpressionStatement(exports.CallExpression(exports.MemberExpression(exports.Identifier('assertions'), exports.Identifier('arity')), args));
  };

  exports.Identifier = function(name) {
    return {
      type: 'Identifier',
      name: name
    };
  };

  exports.Literal = function(value) {
    if (value == null) {
      value = null;
    }
    return {
      type: 'Literal',
      value: value
    };
  };

  exports.ThisExpression = function() {
    return {
      type: 'ThisExpression'
    };
  };

  exports.UnaryExpression = function(operator, argument) {
    return {
      type: 'UnaryExpression',
      operator: operator,
      argument: argument,
      prefix: true
    };
  };

  exports.UpdateExpression = function(operator, argument) {
    return {
      type: 'UpdateExpression',
      operator: '++',
      argument: argument,
      prefix: true
    };
  };

  exports.BinaryExpression = function(operator, left, right) {
    return {
      type: 'BinaryExpression',
      operator: operator,
      left: left,
      right: right
    };
  };

  exports.LogicalExpression = function(operator, left, right) {
    return {
      type: 'LogicalExpression',
      operator: operator,
      left: left,
      right: right
    };
  };

  exports.SequenceExpression = function() {
    var expressions;
    expressions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'SequenceExpression',
      expressions: expressions
    };
  };

  exports.ArrayExpression = function(elements) {
    return {
      type: 'ArrayExpression',
      elements: elements
    };
  };

  exports.AssignmentExpression = function(left, right) {
    return {
      type: 'AssignmentExpression',
      operator: '=',
      left: left,
      right: right
    };
  };

  exports.CallExpression = function(callee, args) {
    return {
      type: 'CallExpression',
      callee: callee,
      "arguments": (typeof args !== 'undefined' ? args : [])
    };
  };

  exports.MemberExpression = function(obj, prop, computed) {
    if (computed == null) {
      computed = false;
    }
    return {
      type: 'MemberExpression',
      object: obj,
      property: prop,
      computed: computed
    };
  };

  exports.NewExpression = function(callee, args) {
    return {
      type: 'NewExpression',
      callee: callee,
      "arguments": args
    };
  };

  exports.ConditionalExpression = function(test, consequent, alternate) {
    return {
      type: 'ConditionalExpression',
      test: test,
      consequent: consequent,
      alternate: alternate
    };
  };

  exports.FunctionExpression = function(id, params, rest, body) {
    return {
      type: 'FunctionExpression',
      id: id,
      params: params,
      defaults: [],
      rest: rest,
      body: body,
      generator: false,
      expression: false
    };
  };

  exports.EmptyStatement = function() {
    return {
      type: 'EmptyStatement'
    };
  };

  exports.ExpressionStatement = function(expression) {
    return {
      type: 'ExpressionStatement',
      expression: expression
    };
  };

  exports.ForStatement = function(init, test, update, body) {
    return {
      type: 'ForStatement',
      init: init,
      test: test,
      update: update,
      body: body
    };
  };

  exports.WhileStatement = function(test, body) {
    return {
      type: 'WhileStatement',
      test: test,
      body: body
    };
  };

  exports.IfStatement = function(test, consequent, alternate) {
    return {
      type: 'IfStatement',
      test: test,
      consequent: consequent,
      alternate: (typeof alternate !== 'undefined' ? alternate : null)
    };
  };

  exports.BreakStatement = function(label) {
    if (label == null) {
      label = null;
    }
    return {
      type: 'BreakStatement',
      label: label
    };
  };

  exports.ContinueStatement = function(label) {
    if (label == null) {
      label = null;
    }
    return {
      type: 'ContinueStatement',
      label: label
    };
  };

  exports.ReturnStatement = function(argument) {
    return {
      type: 'ReturnStatement',
      argument: argument
    };
  };

  exports.TryStatement = function(block, handler) {
    return {
      type: 'TryStatement',
      block: block,
      handlers: [handler],
      finalizer: null
    };
  };

  exports.CatchClause = function(param, body) {
    return {
      type: 'CatchClause',
      param: param,
      guard: null,
      body: body
    };
  };

  exports.ThrowStatement = function(argument) {
    return {
      type: 'ThrowStatement',
      argument: argument
    };
  };

  exports.VariableDeclaration = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: args
    };
  };

  exports.VariableDeclarator = function(id, init) {
    return {
      type: 'VariableDeclarator',
      id: id,
      init: init
    };
  };

  exports.FunctionDeclaration = function(id, params, rest, body) {
    var node;
    node = exports.FunctionExpression(id, params, rest, body);
    node.type = 'FunctionDeclaration';
    return node;
  };

  exports.BlockStatement = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'BlockStatement',
      body: args
    };
  };

  exports.Program = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      type: 'Program',
      body: args
    };
  };

}).call(this);
