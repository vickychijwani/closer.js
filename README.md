Closer.js
=========

Closer.js - Clojure parser in JavaScript, compatible with the Mozilla Parser API
(https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API).

**NOTE**: This is pre-alpha quality software, still taking its first baby
steps. You have been warned!


Usage
-----

```js
var closer = require("closer");

var ast = closer.parse("(println \"hello, world\")", { locations: true });
```

The value of `ast` is:

```js
{
    "type": "Program",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "println",
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 1
                        },
                        "end": {
                            "line": 1,
                            "column": 8
                        }
                    }
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": "hello, world",
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 9
                            },
                            "end": {
                                "line": 1,
                                "column": 23
                            }
                        }
                    }
                ],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 25
                    }
                }
            },
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 25
                }
            }
        }
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 25
        }
    }
}
```
