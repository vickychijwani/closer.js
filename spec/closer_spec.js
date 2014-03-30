var closer = require("../src/closer");
var json_diff = require("json-diff");

beforeEach(function () {
    this.addMatchers({
        toDeepEqual: function (expected) {
            this.message = function () {
                return "actual != expected, diff is:\n"
                    + json_diff.diffString(this.actual, expected);
            };

            return json_diff.diff(this.actual, expected) === undefined;
        }
    });
});

describe("Closer.js", function () {

    it("correctly parses an empty program", function () {
        expect(closer.parse("\n")).toDeepEqual({
            type: 'Program',
            body: []
        });
    });

    it("correctly parses an empty s-expression", function () {
        expect(closer.parse("()\n")).toDeepEqual({
            type: "Program",
            body: [{
                type: "EmptyStatement"
            }]
        });
    });

    it("correctly parses an identifier", function () {
        expect(closer.parse("x\n")).toDeepEqual({
            type: 'Program',
            body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "Identifier",
                    name: "x"
                }
            }]
        });
    });

    it("correctly parses integer, string, boolean, and nil literals", function () {
        expect(closer.parse("24\n\"string\"\ntrue\nfalse\nnil\n")).toDeepEqual({
            type: 'Program',
            body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: 24
                }
            }, {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: "string"
                }
            }, {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: true
                }
            }, {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: false
                }
            }, {
                type: "ExpressionStatement",
                expression: {
                    type: "Literal",
                    value: null
                }
            }]
        });
    });

    it("correctly parses a function call with arguments", function () {
        expect(closer.parse("(fn-name arg1 arg2)\n")).toDeepEqual({
            type: "Program",
            body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    arguments: [{
                        type: "Identifier",
                        name: "arg1"
                    },
                        {
                            type: "Identifier",
                            name: "arg2"
                        }],
                    callee: {
                        type: "Identifier",
                        name: "fn-name"
                    }
                }
            }]
        });
    });

//    it("correctly parses an anonymous function definition", function () {
//        expect(closer.parse("(fn [x] x)\n")).toDeepEqual({
//            type: "Program",
//            body: [{
//                type: "ExpressionStatement",
//                expression: {
//                    type: "FunctionExpression",
//                    id: null,
//                    params: [{
//                        type: "Identifier",
//                        name: "x"
//                    }],
//                    defaults: [],
//                    rest: null,
//                    body: {
//                        type: "BlockStatement",
//                        body: [{
//                            type: "ReturnStatement",
//                            argument: {
//                                type: "Identifier",
//                                name: "x"
//                            }
//                        }]
//                    },
//                    generator: false,
//                    expression: false
//                }
//            }]
//        });
//    });
//
//    it("correctly parses an anonymous function call", function () {
//        expect(closer.parse("((fn [x] x) 2)\n")).toDeepEqual({
//            type: "Program",
//            body: [{
//                type: "ExpressionStatement",
//                expression: {
//                    type: "CallExpression",
//                    arguments: [{
//                        type: "Literal",
//                        value: "2"
//                    }],
//                    callee: {
//                        type: "FunctionExpression",
//                        id: null,
//                        params: [{
//                            type: "Identifier",
//                            name: "x"
//                        }],
//                        defaults: [],
//                        rest: null,
//                        body: {
//                            type: "BlockStatement",
//                            body: [{
//                                type: "ReturnStatement",
//                                argument: {
//                                    type: "Identifier",
//                                    name: "x"
//                                }
//                            }]
//                        },
//                        generator: false,
//                        expression: false
//                    }
//                }
//            }]
//        });
//    });

    // pending
    xit("correctly parses source locations");

});
