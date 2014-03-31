var closer = require("../src/closer");
var json_diff = require("json-diff");

var helpers = require("./closer_helpers");
var Literal = helpers.Literal;
var Identifier = helpers.Identifier;
var CallExpression = helpers.CallExpression;
var FunctionExpression = helpers.FunctionExpression;
var EmptyStatement = helpers.EmptyStatement;
var ExpressionStatement = helpers.ExpressionStatement;
var IfStatement = helpers.IfStatement;
var ReturnStatement = helpers.ReturnStatement;
var FunctionDeclaration = helpers.FunctionDeclaration;
var BlockStatement = helpers.BlockStatement;
var Program = helpers.Program;

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

    // atoms
    it("correctly parses an empty program", function () {
        expect(closer.parse("\n")).toDeepEqual(Program());
    });

    it("correctly parses an empty s-expression", function () {
        expect(closer.parse("()\n")).toDeepEqual(Program(
            EmptyStatement()
        ));
    });

    it("correctly parses comments", function () {
        expect(closer.parse("; Heading\n() ; trailing ()\r\n;\r;;;\n\r\r")).toDeepEqual(Program(
            EmptyStatement()
        ));
    });

    it("correctly parses an identifier", function () {
        expect(closer.parse("x\n")).toDeepEqual(Program(
            ExpressionStatement(Identifier("x"))
        ));
    });

    it("correctly parses integer, string, boolean, and nil literals", function () {
        expect(closer.parse("24\n\"string\"\ntrue\nfalse\nnil\n")).toDeepEqual(Program(
            ExpressionStatement(Literal(24)),
            ExpressionStatement(Literal("string")),
            ExpressionStatement(Literal(true)),
            ExpressionStatement(Literal(false)),
            ExpressionStatement(Literal(null))
        ));
    });

    // functions
    it("correctly parses a function call with 0 arguments", function () {
        expect(closer.parse("(fn-name)\n")).toDeepEqual(Program(
            ExpressionStatement(
                CallExpression(Identifier("fn-name"))
            )
        ));
    });

    it("correctly parses a function call with > 0 arguments", function () {
        expect(closer.parse("(fn-name arg1 arg2)\n")).toDeepEqual(Program(
            ExpressionStatement(
                CallExpression(
                    Identifier("fn-name"),
                    [Identifier("arg1"), Identifier("arg2")]
                )
            )
        ));
    });

    it("correctly parses an anonymous function definition", function () {
        expect(closer.parse("(fn [x] x)\n")).toDeepEqual(Program(
            ExpressionStatement(
                FunctionExpression(
                    null,
                    [Identifier("x")],
                    null,
                    BlockStatement(
                        ReturnStatement(Identifier("x"))
                    )
                )
            )
        ));
    });

    it("correctly parses an anonymous function call", function () {
        expect(closer.parse("((fn [x] x) 2)\n")).toDeepEqual(Program(
            ExpressionStatement(
                CallExpression(
                    FunctionExpression(
                        null,
                        [Identifier("x")],
                        null,
                        BlockStatement(
                            ReturnStatement(Identifier("x"))
                        )
                    ),
                    [Literal(2)]
                )
            )
        ));
    });

    it("correctly parses a named function definition", function () {
        expect(closer.parse("(defn fn-name [x] x)\n")).toDeepEqual(Program(
            FunctionDeclaration(
                Identifier("fn-name"),
                [Identifier("x")],
                null,
                BlockStatement(
                    ReturnStatement(Identifier("x"))
                )
            )
        ));
    });

    it("correctly parses rest arguments", function () {
        expect(closer.parse("(defn avg [& rest] (/ (apply + rest) (count rest)))\n")).toDeepEqual(Program(
            FunctionDeclaration(
                Identifier("avg"),
                [],
                Identifier("rest"),
                BlockStatement(ReturnStatement(
                    CallExpression(
                        Identifier("/"),
                        [
                            CallExpression(
                                Identifier("apply"),
                                [Identifier("+"), Identifier("rest")]
                            ),
                            CallExpression(
                                Identifier("count"),
                                [Identifier("rest")]
                            )
                        ]
                    ))
                )
            )
        ));
    });

    // conditional statements
    it("correctly parses an if-else statement", function () {
        expect(closer.parse("(if (>= x 0) x (- x))\n")).toDeepEqual(Program(
            IfStatement(
                CallExpression(
                    Identifier(">="),
                    [Identifier("x"), Literal(0)]
                ),
                ExpressionStatement(Identifier("x")),
                ExpressionStatement(CallExpression(
                    Identifier("-"),
                    [Identifier("x")]
                ))
            )
        ));
    });

    it("correctly parses a when form", function () {
        expect(closer.parse("(when (condition?) (println \"hello\") true)\n")).toDeepEqual(Program(
            IfStatement(
                CallExpression(Identifier("condition?")),
                BlockStatement(
                    ExpressionStatement(CallExpression(
                        Identifier("println"),
                        [Literal("hello")]
                    )),
                    ExpressionStatement(Literal(true))
                )
            )
        ));
    });

    // pending
    xit("correctly parses source locations");

});
