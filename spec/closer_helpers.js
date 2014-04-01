exports.Literal = function (value) {
    return {
        type: "Literal",
        value: value
    };
};

exports.Identifier = function (name) {
    return {
        type: "Identifier",
        name: name
    };
};

exports.CallExpression = function (callee, args) {
    return {
        type: "CallExpression",
        callee: callee,
        arguments: (args !== undefined) ? args : []
    };
};

exports.FunctionExpression = function (id, params, rest, body) {
    return {
        type: "FunctionExpression",
        id: id,
        params: params,
        defaults: [],
        rest: rest,
        body: body,
        generator: false,
        expression: false
    };
};

exports.EmptyStatement = function () {
    return {
        type: "EmptyStatement"
    };
};

exports.ExpressionStatement = function (expression) {
    return {
        type: "ExpressionStatement",
        expression: expression
    };
};

exports.IfStatement = function (test, consequent, alternate) {
    return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
        alternate: (alternate !== undefined) ? alternate : null
    };
};

exports.ReturnStatement = function (argument) {
    return {
        type: "ReturnStatement",
        argument: argument
    };
};

exports.VariableDeclaration = function () {
    var array = Array.prototype.slice.call(arguments);
    return {
        type: "VariableDeclaration",
        kind: array[0],
        declarations: array.slice(1)
    };
};

exports.VariableDeclarator = function (id, init) {
    return {
        type: "VariableDeclarator",
        id: id,
        init: init
    };
};

exports.FunctionDeclaration = function (id, params, rest, body) {
    var node = exports.FunctionExpression(id, params, rest, body);
    node.type = "FunctionDeclaration";
    return node;
};

exports.BlockStatement = function () {
    return {
        type: "BlockStatement",
        body: Array.prototype.slice.call(arguments)
    };
};

exports.Program = function () {
    return {
        type: "Program",
        body: Array.prototype.slice.call(arguments)
    };
};
