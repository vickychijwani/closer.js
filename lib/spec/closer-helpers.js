(function() {
  var closer, def, json_diff, type, _i, _len, _ref, _ref1, _ref2, _ref3,
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

  exports.DestructuringVector = function(id, destrucId, idx) {
    return exports.TryStatement(exports.BlockStatement(exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('nth'), [exports.Identifier(destrucId), exports.Literal(idx)])))), exports.CatchClause(exports.Identifier('__$error'), exports.BlockStatement(exports.IfStatement(exports.BinaryExpression('!==', exports.MemberExpression(exports.Identifier('__$error'), exports.Identifier('name')), exports.Literal('IndexOutOfBoundsError')), exports.ThrowStatement(exports.Identifier('__$error'))), exports.ExpressionStatement(exports.AssignmentExpression(exports.Identifier(id), exports.Literal(null))))));
  };

  exports.DestructuringVectorRest = function(id, destrucId, dropCount) {
    return exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('drop'), [exports.Literal(dropCount), exports.Identifier(destrucId)])));
  };

  exports.DestructuringMap = function(id, destrucId, key) {
    return exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('get'), [exports.Identifier(destrucId), key])));
  };

  def = function(type, initFn) {
    return exports[type] = function() {
      var obj;
      obj = initFn.apply(null, arguments) || {};
      obj.type = type;
      return obj;
    };
  };

  def('Identifier', function(name) {
    return {
      name: name
    };
  });

  def('Literal', function(value) {
    if (value == null) {
      value = null;
    }
    return {
      value: value
    };
  });

  def('ThisExpression', (function() {}));

  def('UnaryExpression', function(operator, argument) {
    return {
      operator: operator,
      argument: argument,
      prefix: true
    };
  });

  def('UpdateExpression', function(operator, argument) {
    return {
      operator: '++',
      argument: argument,
      prefix: true
    };
  });

  def('BinaryExpression', function(operator, left, right) {
    return {
      operator: operator,
      left: left,
      right: right
    };
  });

  def('LogicalExpression', function(operator, left, right) {
    return {
      operator: operator,
      left: left,
      right: right
    };
  });

  def('SequenceExpression', function() {
    var expressions;
    expressions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      expressions: expressions
    };
  });

  def('ArrayExpression', function(elements) {
    return {
      elements: elements
    };
  });

  def('AssignmentExpression', function(left, right) {
    return {
      operator: '=',
      left: left,
      right: right
    };
  });

  def('CallExpression', function(callee, args) {
    return {
      callee: callee,
      "arguments": (typeof args !== 'undefined' ? args : [])
    };
  });

  def('MemberExpression', function(obj, prop, computed) {
    if (computed == null) {
      computed = false;
    }
    return {
      object: obj,
      property: prop,
      computed: computed
    };
  });

  def('NewExpression', function(callee, args) {
    return {
      callee: callee,
      "arguments": args
    };
  });

  def('ConditionalExpression', function(test, consequent, alternate) {
    return {
      test: test,
      consequent: consequent,
      alternate: alternate
    };
  });

  def('FunctionExpression', function(id, params, rest, body) {
    return {
      id: id,
      params: params,
      defaults: [],
      rest: rest,
      body: body,
      generator: false,
      expression: false
    };
  });

  def('EmptyStatement', (function() {}));

  def('ExpressionStatement', function(expression) {
    return {
      expression: expression
    };
  });

  def('ForStatement', function(init, test, update, body) {
    return {
      init: init,
      test: test,
      update: update,
      body: body
    };
  });

  def('WhileStatement', function(test, body) {
    return {
      test: test,
      body: body
    };
  });

  def('IfStatement', function(test, consequent, alternate) {
    return {
      test: test,
      consequent: consequent,
      alternate: (typeof alternate !== 'undefined' ? alternate : null)
    };
  });

  def('BreakStatement', function(label) {
    if (label == null) {
      label = null;
    }
    return {
      label: label
    };
  });

  def('ContinueStatement', function(label) {
    if (label == null) {
      label = null;
    }
    return {
      label: label
    };
  });

  def('ReturnStatement', function(argument) {
    return {
      argument: argument
    };
  });

  def('TryStatement', function(block, handler) {
    return {
      block: block,
      handlers: [handler],
      finalizer: null
    };
  });

  def('CatchClause', function(param, body) {
    return {
      param: param,
      guard: null,
      body: body
    };
  });

  def('ThrowStatement', function(argument) {
    return {
      argument: argument
    };
  });

  def('VariableDeclaration', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      kind: 'var',
      declarations: args
    };
  });

  def('VariableDeclarator', function(id, init) {
    return {
      id: id,
      init: init
    };
  });

  def('BlockStatement', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      body: args
    };
  });

  def('Program', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      body: args
    };
  });

}).call(this);
