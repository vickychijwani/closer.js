!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.closer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(_dereq_,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,_dereq_("/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":2}],4:[function(_dereq_,module,exports){
var parser = _dereq_("./parser").parser,
    nodes = _dereq_("./nodes");

function Closer(options) {
    // Create a parser constructor and an instance
    this.parser = new Parser(options || {});
}

Closer.prototype = {
    parse: function (source, options) {
        return this.parser.parse(source, options);
    }
};

var defaultBuilder = {};

// Define AST nodes
nodes.defineNodes(defaultBuilder);

function Parser(options) {
    this.yy.source = options.source || null;
    this.yy.startLine = options.line || 1;
    this.yy.locations = options.locations;
    this.yy.builder = options.builder || defaultBuilder;
}

Parser.prototype = parser;

// allow yy.NodeType calls in parser
for (var con in defaultBuilder) {
    if (defaultBuilder.hasOwnProperty(con)) {
        parser.yy[con] = (function (name) {
            var context = this;
            return function (a, b, c, d, e, f, g, h) {
                return context.builder[name](a, b, c, d, e, f, g, h);
            };
        })(con);
    }
}

// used named arguments to avoid arguments array
parser.yy.Node = function Node(type, a, b, c, d, e, f, g, h) {
    var buildName = type[0].toLowerCase() + type.slice(1);
    if (this.builder && this.builder[buildName]) {
        return this.builder[buildName](a, b, c, d, e, f, g, h);
    } else {
        throw 'no such node type: ' + type;
    }
};

parser.yy.locComb = function (start, end) {
    start.last_line = end.last_line;
    start.last_column = end.last_column;
//    start.range = [start.range[0], end.range[1]];
    return start;
};

parser.yy.loc = function (loc) {
    if (! this.locations) return null;
    if ("length" in loc) loc = this.locComb(loc[0], loc[1]);

    var newLoc = { start: { line: this.startLine + loc.first_line - 1,
        column: loc.first_column },
        end: { line: this.startLine + loc.last_line - 1,
            column: loc.last_column }
//        range: loc.range
    };

    if (this.source || this.builder !== defaultBuilder)
        newLoc.source = this.source;
    return newLoc;
};

// Handle parse errors and recover from ASI
parser.yy.parseError = function (err, hash) {
    // don't print error for missing semicolon
    if (!((!hash.expected || hash.expected.indexOf("';'") >= 0) && (hash.token === 'CLOSEBRACE' || /* parser.yy.lineBreak || parser.yy.lastLineBreak || */ hash.token === 1))) {
        throw new SyntaxError(err);
    }
};

//parser.lexer.options.ranges = true;

// used to check if last match was a line break (for ; insertion)
//var realLex = parser.lexer.lex;
//parser.lexer.lex = function () {
//    parser.yy.lastLineBreak = parser.yy.lineBreak;
//    parser.yy.lineBreak = false;
//    return realLex.call(this);
//};

//var realNext = parser.lexer.next;
//parser.lexer.next = function () {
//    var ret = realNext.call(this);
//    if (ret === 'COMMENT' || ret === 'COMMENT_BLOCK') {
//        if (this.yy.options.comment) {
//            this.yy.comments.push({range: this.yylloc.range, type: types[ret], value: this.yytext});
//        }
//        return;
//    }
//    if (ret && ret !== 1 && ret !== 199) {
//        if (this.yy.options.tokens) {
//            var tokens = this.yy.tokens;
//            var last = tokens[tokens.length - 1];
//            if (tokens.length && (last.value == '/' || last.value == '/=')) {
//                tokens[tokens.length - 1] = tokenObject(this, ret);
//                var t = tokens[tokens.length - 1];
//                t.range[0] = last.range[0];
//                t.value = last.value + t.value;
//            } else {
//                this.yy.tokens.push(tokenObject(this, ret));
//            }
//        }
//    }
//    return ret;
//};

var types = {
    "NULLTOKEN": "Null",
    "THISTOKEN": "Keyword",
    "VAR": "Keyword",
    "IDENT": "Identifier",
    "NUMBER": "Numeric",
    "STRING": "String",
    "REGEXP_BODY": "RegularExpression",
    "COMMENT": "Line",
    "COMMENT_BLOCK": "Block",
    "TRUETOKEN": "Boolean",
    "FALSETOKEN": "Boolean"
};

// Punctuator tokens
'OPENBRACE CLOSEBRACE [ ] ( ) { } . ; : , PLUSEQUAL MINUSEQUAL MULTEQUAL MODEQUAL ANDEQUAL OREQUAL XOREQUAL LSHIFTEQUAL RSHIFTEQUAL URSHIFTEQUAL DIVEQUAL LE GE STREQ STRNEQ EQEQ NE AND OR PLUSPLUS MINUSMINUS URSHIFT LSHIFT + - * % < > & | ^ ! ~ ? / ='.split(' ').forEach(function (token) {
    types[token] = 'Punctuator';
});

// Keyword tokens
'BREAK CASE CONTINUE DEBUGGER DEFAULT DELETETOKEN DO ELSE FINALLY FOR FUNCTION IF INTOKEN INSTANCEOF NEW RETURN SWITCH TRY CATCH THROW TYPEOF VAR VOIDTOKEN WHILE WITH CLASS CONSTTOKEN LET ENUM EXPORT EXTENDS IMPORT SUPERTOKEN IMPLEMENTS INTERFACE PACKAGE PRIVATE PROTECTED PUBLIC STATIC YIELD THISTOKEN EVAL ARGUMENTS'.split(' ').forEach(function (token) {
    types[token] = 'Keyword';
});

//function tokenObject(lexer, token) {
//    var symbols = lexer.yy.parser.terminals_;
//    return {
//        "type": types[symbols[token] || token],
//        "value": lexer.match,
//        "range": lexer.yylloc.range
//    };
//}

parser.yy.escapeString = function (s) {
    return s.replace(/\\\n/, '').replace(/\\([^xubfnvrt0\\])/g, '$1');
};

var oldParse = parser.parse;
parser.parse = function (source, options) {
//    this.yy.lineBreak = false;
    this.yy.inRegex = false;
//    this.yy.tokens = [];
    this.yy.raw = [];
    this.yy.comments = [];
    this.yy.options = options || {};
    return oldParse.call(this, source);
};

var closer = {
    parse: function (src, options) {
        return new Closer(options).parse(src, options);
    }
};

module.exports = closer;

},{"./nodes":5,"./parser":6}],5:[function(_dereq_,module,exports){
exports.defineNodes = function (builder) {

    var defaultIni = function (loc) {
        this.loc = loc;
        return this;
    };

    var def = function def(name, ini) {
        builder[name[0].toLowerCase() + name.slice(1)] = function (a, b, c, d, e, f, g, h) {
            var obj = {};
            obj.type = name;
            ini.call(obj, a, b, c, d, e, f, g, h);
//            if (obj.loc) {
//                obj.range = obj.loc.range || [0, 0];
                delete obj.loc;
//                obj.loc = arguments[ini.length - (name === 'Literal' ? 2 : 1)];
//                delete obj.loc.range;
//            }
            return obj;
        };
    };

    /* Nodes
     */

// used in cases where object and array literals are valid expressions
    function convertExprToPattern(expr) {
        if (expr.type === 'ObjectExpression') {
            expr.type = 'ObjectPattern';
        } else if (expr.type === 'ArrayExpression') {
            expr.type = 'ArrayPattern';
        }
    }

// Program node
    def('Program', function (elements, loc) {
        this.body = elements;
        this.loc = loc;
    });

    def('ExpressionStatement', function (expression, loc) {
        this.expression = expression;
        this.loc = loc;
    });

    def('BlockStatement', function (body, loc) {
        this.body = body;
        this.loc = loc;
    });

    def('EmptyStatement', defaultIni);


// Identifier node
    def('Identifier', function (name, loc) {
        this.name = name;
        this.loc = loc;
    });

// Literal expression node
    def('Literal', function (val, loc, raw) {
        this.value = val;
//        if (raw) this.raw = raw;
        this.loc = loc;
    });

// "this" expression node
    def('ThisExpression', defaultIni);

// Var statement node
    def('VariableDeclaration', function (kind, declarations, loc) {
        this.declarations = declarations;
        this.kind = kind;
        this.loc = loc;
    });

    def('VariableDeclarator', function (id, init, loc) {
        this.id = id;
        this.init = init;
        this.loc = loc;
    });

    def('ArrayExpression', function (elements, loc) {
        this.elements = elements;
        this.loc = loc;
    });

    def('ObjectExpression', function (properties, loc) {
        this.properties = properties;
        this.loc = loc;
    });

    def('Property', function (key, value, kind, loc) {
        this.key = key;
        this.value = value;
        this.kind = kind;
        this.loc = loc;
    });

// Function declaration node
    var funIni = function (ident, params, rest, body, isGen, isExp, loc) {
        this.id = ident;
        this.params = params;
        this.defaults = [];
        this.rest = rest;
        this.body = body;
        this.loc = loc;
        this.generator = isGen;
        this.expression = isExp;
//        if (!this.expression) {
//            this.body.body.forEach(function (el) {
//                if (el.type === "VariableDeclaration" && el.kind === "let") {
//                    el.kind = "var";
//                }
//            });
//        }
    };

    def('FunctionDeclaration', funIni);

    def('FunctionExpression', funIni);

// return statement node
    def('ReturnStatement', function (argument, loc) {
        this.argument = argument;
        this.loc = loc;
    });

    def('TryStatement', function (block, handlers, finalizer, loc) {
        this.block = block;
        this.handlers = handlers || [];
        this.finalizer = finalizer;
        this.loc = loc;
    });

    def('CatchClause', function (param, guard, body, loc) {
        this.param = param;
        this.guard = guard;
        this.body = body;
        this.loc = loc;
    });

    def('ThrowStatement', function (argument, loc) {
        this.argument = argument;
        this.loc = loc;
    });

    def('LabeledStatement', function (label, body, loc) {
        this.label = label;
        this.body = body;
        this.loc = loc;
    });

    def('BreakStatement', function (label, loc) {
        this.label = label;
        this.loc = loc;
    });

    def('ContinueStatement', function (label, loc) {
        this.label = label;
        this.loc = loc;
    });

    def('SwitchStatement', function (discriminant, cases, lexical, loc) {
        this.discriminant = discriminant;
        if (cases.length) this.cases = cases;
        this.loc = loc;
    });

    def('SwitchCase', function (test, consequent, loc) {
        this.test = test;
        this.consequent = consequent;
        this.loc = loc;
    });

    def('WithStatement', function (object, body, loc) {
        this.object = object;
        this.body = body;
        this.loc = loc;
    });


// operators
    def('ConditionalExpression', function (test, consequent, alternate, loc) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.loc = loc;
    });

    def('SequenceExpression', function (expressions, loc) {
        this.expressions = expressions;
        this.loc = loc;
    });

    def('BinaryExpression', function (op, left, right, loc) {
        this.operator = op;
        this.left = left;
        this.right = right;
        this.loc = loc;
    });

    def('AssignmentExpression', function (op, left, right, loc) {
        this.operator = op;
        this.left = left;
        this.right = right;
        this.loc = loc;
        convertExprToPattern(left);
    });

    def('LogicalExpression', function (op, left, right, loc) {
        this.operator = op;
        this.left = left;
        this.right = right;
        this.loc = loc;
    });

    def('UnaryExpression', function (operator, argument, prefix, loc) {
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.loc = loc;
    });


    def('UpdateExpression', function (operator, argument, prefix, loc) {
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.loc = loc;
    });

    def('CallExpression', function (callee, args, loc) {
        this.callee = callee;
        this["arguments"] = args;
        this.loc = loc;
    });


    def('NewExpression', function (callee, args, loc) {
        this.callee = callee;
        this["arguments"] = args;
        this.loc = loc;
    });


    def('MemberExpression', function (object, property, computed, loc) {
        this.object = object;
        this.property = property;
        this.computed = computed;
        this.loc = loc;
    });

// debugger node
    def('DebuggerStatement', defaultIni);

// empty node
    def('Empty', defaultIni);

// control structs

    def('WhileStatement', function (test, body, loc) {
        this.test = test;
        this.body = body;
        this.loc = loc;
    });

    def('DoWhileStatement', function (body, test, loc) {
        this.body = body;
        this.test = test;
        this.loc = loc;
    });

    def('ForStatement', function (init, test, update, body, loc) {
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.loc = loc;
        if (init) convertExprToPattern(init);
    });

    def('ForInStatement', function (left, right, body, each, loc) {
        this.left = left;
        this.right = right;
        this.body = body;
        this.each = !!each;
        this.loc = loc;
        convertExprToPattern(left);
    });

    def('IfStatement', function (test, consequent, alternate, loc) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.loc = loc;
    });

    def('ObjectPattern', function (properties, loc) {
        this.properties = properties;
        this.loc = loc;
    });

    def('ArrayPattern', function (elements, loc) {
        this.elements = elements;
        this.loc = loc;
    });

    return def;
};

},{}],6:[function(_dereq_,module,exports){
(function (process){
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"Atom":5,"NUMBER":6,"STRING":7,"true":8,"false":9,"nil":10,"IdentifierList":11,"RestArgs":12,"&":13,"Fn":14,"(":15,"List":16,")":17,"FnParamsAndBody":18,"[":19,"]":20,"BlockStatementWithReturn":21,"FnDefinition":22,"FN":23,"DEFN":24,"ConditionalExpr":25,"IF":26,"SExpr[test]":27,"SExprStmt[consequent]":28,"alternate":29,"WHEN":30,"BlockStatement[consequent]":31,"VarDeclaration":32,"DEF":33,"init":34,"LetBinding":35,"SExpr":36,"LetBindings":37,"LetForm":38,"LET":39,"DoForm":40,"args":41,"DO":42,"SExprStmt":43,"SExprs":44,"NonEmptyDoForm":45,"BlockStatement":46,"Program":47,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",6:"NUMBER",7:"STRING",8:"true",9:"false",10:"nil",13:"&",15:"(",17:")",19:"[",20:"]",23:"FN",24:"DEFN",26:"IF",27:"SExpr[test]",28:"SExprStmt[consequent]",30:"WHEN",31:"BlockStatement[consequent]",33:"DEF",39:"LET",42:"DO"},
productions_: [0,[3,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[11,0],[11,2],[12,2],[12,0],[14,1],[14,3],[18,5],[22,2],[22,3],[25,4],[25,3],[32,3],[35,2],[37,2],[37,0],[38,5],[16,0],[16,1],[16,1],[16,1],[16,1],[16,2],[16,2],[36,1],[36,3],[43,1],[44,1],[44,2],[45,1],[40,1],[40,0],[46,1],[21,1],[47,1],[47,0],[29,0],[29,1],[34,0],[34,1],[41,0],[41,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: this.$ = yy.Node('Identifier', String($$[$0]), yy.loc(_$[$0])); 
break;
case 2: this.$ = yy.Node('Literal', parseNum($$[$0]), yy.loc(_$[$0]), yytext); 
break;
case 3: this.$ = yy.Node('Literal', parseString($$[$0]), yy.loc(_$[$0]), yy.raw[yy.raw.length-1]); 
break;
case 5: this.$ = yy.Node('Literal', true, yy.loc(_$[$0]), yytext); 
break;
case 6: this.$ = yy.Node('Literal', false, yy.loc(_$[$0]), yytext); 
break;
case 7: this.$ = yy.Node('Literal', null, yy.loc(_$[$0]), yytext); 
break;
case 8: this.$ = []; 
break;
case 9:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 10: this.$ = $$[$0]; 
break;
case 11: this.$ = null; 
break;
case 12: this.$ = yy.Node('Identifier', String($$[$0]), yy.loc(_$[$0])); 
break;
case 13: this.$ = $$[$0-1]; 
break;
case 14:
        this.$ = yy.Node('FunctionExpression', null, $$[$0-3], $$[$0-2],
            $$[$0], false, false, yy.loc(_$[$0]));
    
break;
case 15: this.$ = $$[$0]; 
break;
case 16:
        $$[$0].type = 'FunctionDeclaration';
        $$[$0].id = $$[$0-1];
        this.$ = $$[$0];
    
break;
case 17:
        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null));
    
break;
case 18:
        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null);
    
break;
case 19:
        var decl = yy.Node('VariableDeclarator', $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-2]));
        this.$ = yy.Node('VariableDeclaration', 'var', [decl], yy.loc(_$[$0-2]));
    
break;
case 20:
        this.$ = yy.Node('VariableDeclarator', $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-1]));
    
break;
case 21:
        this.$ = $$[$0-1];
        var binding = yy.Node('VariableDeclaration', 'let', [$$[$0]], yy.loc(_$[$0]));
        $$[$0-1].push(binding);
    
break;
case 22: this.$ = []; 
break;
case 23:
        var body = [].concat($$[$0-2]).concat($$[$0]);
        this.$ = yy.Node('BlockStatement', body, yy.loc(_$[$0-4]));
    
break;
case 24: this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 29:
        this.$ = yy.Node('CallExpression', $$[$0-1], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-1]));
    
break;
case 30:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0-1]));
    
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = $$[$0-1]; 
break;
case 33:
        if (ExpressionTypes.indexOf($$[$0].type) !== -1) {
            this.$ = yy.Node('ExpressionStatement', $$[$0], $$[$0].loc);
        } else {
            this.$ = $$[$0];
        }
    
break;
case 34: this.$ = [$$[$0]]; 
break;
case 35:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 36:
        for (var i = 0; i < $$[$0].length; ++i) {
            var SExpr = $$[$0][i];
            if (ExpressionTypes.indexOf(SExpr.type) !== -1) {
                $$[$0][i] = yy.Node('ExpressionStatement', SExpr, SExpr.loc);
            }
        }
    
break;
case 38:
        // do forms evaluate to nil if the body is empty
        nilNode = yy.Node('Literal', null, yy.loc(_$[$0]), yytext);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 39:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 40:
        var lastSExpr = $$[$0].body[$$[$0].body.length-1];
        lastSExpr.type = 'ReturnStatement';
        lastSExpr.argument = lastSExpr.expression;
        delete lastSExpr.expression;
        this.$ = $$[$0];
    
break;
case 41:
        var prog = yy.Node('Program', $$[$0], yy.loc(_$[$0]));
//        if (yy.tokens.length) prog.tokens = yy.tokens;
        if (yy.comments.length) prog.comments = yy.comments;
//        if (prog.loc) prog.range = rangeBlock($$[$0]);
        return prog;
    
break;
case 42:
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
        });
    //        prog.tokens = yy.tokens;
    //        prog.range = [0, 0];
        return prog;
    
break;
}
},
table: [{1:[2,42],3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],36:4,44:3,45:2,47:1},{1:[3]},{1:[2,41]},{1:[2,36],3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,36],36:14},{1:[2,34],4:[2,34],6:[2,34],7:[2,34],8:[2,34],9:[2,34],10:[2,34],15:[2,34],17:[2,34]},{1:[2,31],4:[2,31],6:[2,31],7:[2,31],8:[2,31],9:[2,31],10:[2,31],15:[2,31],17:[2,31],20:[2,31]},{4:[1,28],14:20,15:[1,29],16:15,17:[2,24],22:16,23:[1,22],24:[1,23],25:17,26:[1,24],30:[1,25],32:18,33:[1,26],38:19,39:[1,27],42:[1,21]},{1:[2,2],4:[2,2],6:[2,2],7:[2,2],8:[2,2],9:[2,2],10:[2,2],15:[2,2],17:[2,2],20:[2,2]},{1:[2,3],4:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[2,3],10:[2,3],15:[2,3],17:[2,3],20:[2,3]},{1:[2,4],4:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],15:[2,4],17:[2,4],20:[2,4]},{1:[2,5],4:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],15:[2,5],17:[2,5],20:[2,5]},{1:[2,6],4:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],15:[2,6],17:[2,6],20:[2,6]},{1:[2,7],4:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],15:[2,7],17:[2,7],20:[2,7]},{1:[2,1],4:[2,1],6:[2,1],7:[2,1],8:[2,1],9:[2,1],10:[2,1],13:[2,1],15:[2,1],17:[2,1],19:[2,1],20:[2,1]},{1:[2,35],4:[2,35],6:[2,35],7:[2,35],8:[2,35],9:[2,35],10:[2,35],15:[2,35],17:[2,35]},{17:[1,30]},{17:[2,25]},{17:[2,26]},{17:[2,27]},{17:[2,28]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,47],36:4,41:31,44:32},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,38],36:4,40:33,44:3,45:34},{18:35,19:[1,36]},{3:37,4:[1,13]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],36:38},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],36:39},{3:40,4:[1,13]},{19:[1,41]},{4:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],15:[2,12],17:[2,12]},{4:[1,28],14:20,15:[1,29],16:42,17:[2,24],22:16,23:[1,22],24:[1,23],25:17,26:[1,24],30:[1,25],32:18,33:[1,26],38:19,39:[1,27],42:[1,21]},{1:[2,32],4:[2,32],6:[2,32],7:[2,32],8:[2,32],9:[2,32],10:[2,32],15:[2,32],17:[2,32],20:[2,32]},{17:[2,29]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,48],36:14},{17:[2,30]},{17:[2,37]},{17:[2,15]},{4:[2,8],11:43,13:[2,8],20:[2,8]},{18:44,19:[1,36]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],36:46,43:45},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,38],36:4,40:48,44:3,45:34,46:47},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,45],34:49,36:50},{4:[2,22],20:[2,22],37:51},{17:[1,52]},{3:54,4:[1,13],12:53,13:[1,55],20:[2,11]},{17:[2,16]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,43],29:56,36:46,43:57},{4:[2,33],6:[2,33],7:[2,33],8:[2,33],9:[2,33],10:[2,33],15:[2,33],17:[2,33]},{17:[2,18]},{17:[2,39]},{17:[2,19]},{17:[2,46]},{3:60,4:[1,13],20:[1,58],35:59},{4:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],15:[2,13],17:[2,13]},{20:[1,61]},{4:[2,9],13:[2,9],20:[2,9]},{3:62,4:[1,13]},{17:[2,17]},{17:[2,44]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,38],36:4,40:63,44:3,45:34},{4:[2,21],20:[2,21]},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],36:64},{3:9,4:[1,13],5:5,6:[1,7],7:[1,8],8:[1,10],9:[1,11],10:[1,12],15:[1,6],17:[2,38],21:65,36:4,40:48,44:3,45:34,46:66},{20:[2,10]},{17:[2,23]},{4:[2,20],20:[2,20]},{17:[2,14]},{17:[2,40]}],
defaultActions: {2:[2,41],16:[2,25],17:[2,26],18:[2,27],19:[2,28],31:[2,29],33:[2,30],34:[2,37],35:[2,15],44:[2,16],47:[2,18],48:[2,39],49:[2,19],50:[2,46],56:[2,17],57:[2,44],62:[2,10],63:[2,23],65:[2,14],66:[2,40]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


var ExpressionTypes = ['Literal', 'Identifier', 'CallExpression', 'FunctionExpression'];

function parseNum(num) {
    if (num[0] === '0') {
        if (num[1] === 'x' || num[1] === 'X') {
            return parseInt(num, 16);
        }
        return parseInt(num, 8);
    } else {
        return Number(num);
    }
}

function parseString(str) {
    return str
        .replace(/\\(u[a-fA-F0-9]{4}|x[a-fA-F0-9]{2})/g, function (match, hex) {
            return String.fromCharCode(parseInt(hex.slice(1), 16));
        })
        .replace(/\\([0-3]?[0-7]{1,2})/g, function (match, oct) {
            return String.fromCharCode(parseInt(oct, 8));
        })
        .replace(/\\0[^0-9]?/g,'\u0000')
        .replace(/\\(?:\r\n?|\n)/g,'')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r')
        .replace(/\\t/g,'\t')
        .replace(/\\v/g,'\v')
        .replace(/\\f/g,'\f')
        .replace(/\\b/g,'\b')
        .replace(/\\(.)/g, '$1');
}

function getValueIfUndefined(variable, valueIfUndefined) {
    return (typeof variable === 'undefined') ? valueIfUndefined : variable;
}
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* whitespace */;
break;
case 1:
    return 6;

break;
case 2:
    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2);
    return 7;

break;
case 3: /* ignore */ 
break;
case 4:return 13;
break;
case 5:return 15;
break;
case 6:return 17;
break;
case 7:return 19;
break;
case 8:return 20;
break;
case 9:return 33;
break;
case 10:return 23;
break;
case 11:return 24;
break;
case 12:return 26;
break;
case 13:return 30;
break;
case 14:return 42;
break;
case 15:return 39;
break;
case 16:return 8;
break;
case 17:return 9;
break;
case 18:return 10;
break;
case 19:
    return 4;

break;
case 20:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s]+))/,/^(?:([0-9]+))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])+"))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:when)/,/^(?:do)/,/^(?:let)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([0-9a-zA-Z*+!\-_=<>?/.:]+))/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof _dereq_ !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = _dereq_('fs').readFileSync(_dereq_('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && _dereq_.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,_dereq_("/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/mnt/Windows/Users/chijwani/Downloads/Linux/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":2,"fs":1,"path":3}]},{},[4])
(4)
});