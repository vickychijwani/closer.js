(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Closer, Parser, builder, closer, con, nodes, oldParse, parser;

  parser = require('./parser').parser;

  nodes = require('./nodes');

  builder = {};

  nodes.defineNodes(builder);

  for (con in builder) {
    parser.yy[con] = function(a, b, c, d, e, f, g, h) {
      return builder[con](a, b, c, d, e, f, g, h);
    };
  }

  parser.yy.Node = function(type, a, b, c, d, e, f, g, h) {
    var buildName;
    buildName = type[0].toLowerCase() + type.slice(1);
    if (builder && buildName in builder) {
      return builder[buildName](a, b, c, d, e, f, g, h);
    } else {
      throw new ReferenceError("no such node type: " + type);
    }
  };

  parser.yy.locComb = function(start, end) {
    start.last_line = end.last_line;
    start.last_column = end.last_column;
    start.range = [start.range[0], end.range[1]];
    return start;
  };

  parser.yy.loc = function(loc) {
    if (!this.locations) {
      return null;
    }
    if ('length' in loc) {
      loc = this.locComb(loc[0], loc[1]);
    }
    return {
      start: {
        line: this.startLine + loc.first_line - 1,
        column: loc.first_column
      },
      end: {
        line: this.startLine + loc.last_line - 1,
        column: loc.last_column
      },
      range: loc.range
    };
  };

  parser.lexer.options.ranges = true;

  oldParse = parser.parse;

  parser.parse = function(source, options) {
    this.yy.raw = [];
    this.yy.options = options || {};
    return oldParse.call(this, source);
  };

  Parser = (function() {
    function Parser(options) {
      this.yy.locs = options.loc !== false;
      this.yy.ranges = options.range === true;
      this.yy.locations = this.yy.locs || this.yy.ranges;
      this.yy.source = options.source || null;
      this.yy.startLine = options.line || 1;
      nodes.forceNoLoc = options.forceNoLoc;
    }

    return Parser;

  })();

  Parser.prototype = parser;

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options || {});
    }

    Closer.prototype.parse = function(source, options) {
      return this.parser.parse(source, options);
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
      return new Closer(options).parse(src, options);
    },
    node: parser.yy.Node
  };

  module.exports = closer;

  if (typeof self !== "undefined" && self !== null) {
    self.closer = closer;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closer = closer;
  }

}).call(this);

},{"./nodes":2,"./parser":3}],2:[function(require,module,exports){
(function() {
  exports.forceNoLoc = false;

  exports.defineNodes = function(builder) {
    var convertExprToPattern, def, defaultIni, funIni;
    defaultIni = function(loc) {
      this.loc = loc;
      return this;
    };
    def = function(name, ini) {
      return builder[name[0].toLowerCase() + name.slice(1)] = function(a, b, c, d, e, f, g, h) {
        var obj;
        obj = {};
        obj.type = name;
        ini.call(obj, a, b, c, d, e, f, g, h);
        if (exports.forceNoLoc === true) {
          delete obj.loc;
        }
        return obj;
      };
    };
    convertExprToPattern = function(expr) {
      if (expr.type === 'ObjectExpression') {
        expr.type = 'ObjectPattern';
      }
      if (expr.type === 'ArrayExpression') {
        return expr.type = 'ArrayPattern';
      }
    };
    def('Program', function(elements, loc) {
      this.body = elements;
      return this.loc = loc;
    });
    def('ExpressionStatement', function(expression, loc) {
      this.expression = expression;
      return this.loc = loc;
    });
    def('BlockStatement', function(body, loc) {
      this.body = body;
      return this.loc = loc;
    });
    def('EmptyStatement', defaultIni);
    def('Identifier', function(name, loc) {
      this.name = name;
      return this.loc = loc;
    });
    def('Literal', function(value, loc, raw) {
      this.value = value;
      return this.loc = loc;
    });
    def('ThisExpression', defaultIni);
    def('VariableDeclaration', function(kind, declarations, loc) {
      this.declarations = declarations;
      this.kind = kind;
      return this.loc = loc;
    });
    def('VariableDeclarator', function(id, init, loc) {
      this.id = id;
      this.init = init;
      return this.loc = loc;
    });
    def('ArrayExpression', function(elements, loc) {
      this.elements = elements;
      return this.loc = loc;
    });
    def('ObjectExpression', function(properties, loc) {
      this.properties = properties;
      return this.loc = loc;
    });
    def('Property', function(key, value, kind, loc) {
      this.key = key;
      this.value = value;
      this.kind = kind;
      return this.loc = loc;
    });
    funIni = function(ident, params, rest, body, isGen, isExp, loc) {
      this.id = ident;
      this.params = params;
      this.defaults = [];
      this.rest = rest;
      this.body = body;
      this.loc = loc;
      this.generator = isGen;
      return this.expression = isExp;
    };
    def('FunctionDeclaration', funIni);
    def('FunctionExpression', funIni);
    def('ReturnStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('TryStatement', function(block, handlers, finalizer, loc) {
      this.block = block;
      this.handlers = handlers || [];
      this.finalizer = finalizer;
      return this.loc = loc;
    });
    def('CatchClause', function(param, guard, body, loc) {
      this.param = param;
      this.guard = guard;
      this.body = body;
      return this.loc = loc;
    });
    def('ThrowStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('LabeledStatement', function(label, body, loc) {
      this.label = label;
      this.body = body;
      return this.loc = loc;
    });
    def('BreakStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('ContinueStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('SwitchStatement', function(discriminant, cases, lexical, loc) {
      this.discriminant = discriminant;
      if (cases.length) {
        this.cases = cases;
      }
      return this.loc = loc;
    });
    def('SwitchCase', function(test, consequent, loc) {
      this.test = test;
      this.consequent = consequent;
      return this.loc = loc;
    });
    def('WithStatement', function(object, body, loc) {
      this.object = object;
      this.body = body;
      return this.loc = loc;
    });
    def('ConditionalExpression', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    def('SequenceExpression', function(expressions, loc) {
      this.expressions = expressions;
      return this.loc = loc;
    });
    def('BinaryExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('AssignmentExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      this.loc = loc;
      return convertExprToPattern(left);
    });
    def('LogicalExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('UnaryExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('UpdateExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('CallExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('NewExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('MemberExpression', function(object, property, computed, loc) {
      this.object = object;
      this.property = property;
      this.computed = computed;
      return this.loc = loc;
    });
    def('DebuggerStatement', defaultIni);
    def('Empty', defaultIni);
    def('WhileStatement', function(test, body, loc) {
      this.test = test;
      this.body = body;
      return this.loc = loc;
    });
    def('DoWhileStatement', function(body, test, loc) {
      this.body = body;
      this.test = test;
      return this.loc = loc;
    });
    def('ForStatement', function(init, test, update, body, loc) {
      this.init = init;
      this.test = test;
      this.update = update;
      this.body = body;
      this.loc = loc;
      if (init) {
        return convertExprToPattern(init);
      }
    });
    def('ForInStatement', function(left, right, body, each, loc) {
      this.left = left;
      this.right = right;
      this.body = body;
      this.each = !!each;
      this.loc = loc;
      return convertExprToPattern(left);
    });
    def('IfStatement', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    def('ObjectPattern', function(properties, loc) {
      this.properties = properties;
      return this.loc = loc;
    });
    def('ArrayPattern', function(elements, loc) {
      this.elements = elements;
      return this.loc = loc;
    });
    return def;
  };

}).call(this);

},{}],3:[function(require,module,exports){
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
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"IdentifierList":5,"Keyword":6,"COLON":7,"AnonArg":8,"ANON_ARG":9,"Atom":10,"INTEGER":11,"FLOAT":12,"STRING":13,"true":14,"false":15,"nil":16,"CollectionLiteral":17,"[":18,"items":19,"]":20,"QUOTE":21,"(":22,")":23,"{":24,"SExprPairs[items]":25,"}":26,"SHARP":27,"Fn":28,"List":29,"AnonFnLiteral":30,"IdOrDestrucForm":31,"DestructuringForm":32,"IdOrDestrucList":33,"FnArgs":34,"&":35,"AsForm":36,"AS":37,"MapDestrucArgs":38,"KEYS":39,"STRS":40,"SExpr":41,"asForm":42,"FnArgsAndBody":43,"BlockStatementWithReturn":44,"FnDefinition":45,"FN":46,"DEFN":47,"ConditionalExpr":48,"IF":49,"SExpr[test]":50,"SExprStmt[consequent]":51,"alternate":52,"WHEN":53,"BlockStatement[consequent]":54,"LogicalExpr":55,"AND":56,"exprs":57,"OR":58,"VarDeclaration":59,"DEF":60,"init":61,"LetBinding":62,"LetBindings":63,"LetForm":64,"LET":65,"DoForm":66,"LoopForm":67,"LOOP":68,"BlockStatement":69,"RecurForm":70,"RECUR":71,"args":72,"DoTimesForm":73,"DOTIMES":74,"WhileForm":75,"WHILE":76,"DotForm":77,"DOT":78,"IDENTIFIER[prop]":79,"SExpr[obj]":80,"SETVAL":81,"DO":82,"SExprStmt":83,"SExprPairs":84,"SExprs":85,"NonEmptyDoForm":86,"Program":87,"END-OF-FILE":88,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",7:"COLON",9:"ANON_ARG",11:"INTEGER",12:"FLOAT",13:"STRING",14:"true",15:"false",16:"nil",18:"[",20:"]",21:"QUOTE",22:"(",23:")",24:"{",25:"SExprPairs[items]",26:"}",27:"SHARP",35:"&",37:"AS",39:"KEYS",40:"STRS",46:"FN",47:"DEFN",49:"IF",50:"SExpr[test]",51:"SExprStmt[consequent]",53:"WHEN",54:"BlockStatement[consequent]",56:"AND",58:"OR",60:"DEF",65:"LET",68:"LOOP",71:"RECUR",74:"DOTIMES",76:"WHILE",78:"DOT",79:"IDENTIFIER[prop]",80:"SExpr[obj]",81:"SETVAL",82:"DO",88:"END-OF-FILE"},
productions_: [0,[3,1],[5,0],[5,2],[6,2],[8,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[17,3],[17,4],[17,3],[17,4],[28,1],[28,1],[28,1],[28,3],[28,1],[28,1],[31,1],[31,1],[33,0],[33,2],[34,1],[34,3],[36,2],[38,0],[38,2],[38,5],[38,5],[38,3],[32,4],[32,3],[43,4],[45,2],[45,3],[30,4],[48,4],[48,3],[55,2],[55,2],[59,3],[62,2],[63,2],[63,0],[64,5],[67,5],[70,2],[73,6],[75,3],[77,4],[29,0],[29,1],[29,1],[29,1],[29,1],[29,1],[29,3],[29,1],[29,1],[29,1],[29,1],[29,1],[29,2],[29,2],[41,1],[41,1],[41,3],[41,1],[83,1],[84,0],[84,3],[85,1],[85,2],[86,1],[66,1],[66,0],[69,1],[44,1],[87,2],[87,1],[19,0],[19,1],[42,0],[42,1],[52,0],[52,1],[57,0],[57,1],[61,0],[61,1],[72,0],[72,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
        this.$ = ($$[$0] === 'this')
            ? yy.Node('ThisExpression', yy.loc(_$[$0]))
            : yy.Node('Identifier', parseIdentifierName($$[$0]), yy.loc(_$[$0]));
    
break;
case 2: this.$ = []; 
break;
case 3:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 4: this.$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(this._$)), [yy.Node('Literal', $$[$0], yy.loc(this._$))], yy.loc(this._$)); 
break;
case 5:
        var name = $$[$0].slice(1);
        if (name === '') name = '1';
        if (name === '&') name = 'rest';
        var anonArgNum = (name === 'rest') ? 0 : Number(name);
        name = '__$' + name;
        this.$ = yy.Node('Identifier', name, yy.loc(_$[$0]));
        this.$.anonArg = true;
        this.$.anonArgNum = anonArgNum;
    
break;
case 6: this.$ = parseNumLiteral('Integer', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 7: this.$ = parseNumLiteral('Float', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 8: this.$ = parseLiteral('String', parseString($$[$0]), yy.loc(_$[$0]), yy.raw[yy.raw.length-1], yy); 
break;
case 9: this.$ = parseLiteral('Boolean', true, yy.loc(_$[$0]), yytext, yy); 
break;
case 10: this.$ = parseLiteral('Boolean', false, yy.loc(_$[$0]), yytext, yy); 
break;
case 11: this.$ = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy); 
break;
case 15: this.$ = parseCollectionLiteral('vector', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 16: this.$ = parseCollectionLiteral('list', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 17: this.$ = parseCollectionLiteral('hash-map', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 18: this.$ = parseCollectionLiteral('hash-set', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 22: this.$ = $$[$0-1]; 
break;
case 27: this.$ = []; 
break;
case 28:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 29: this.$ = { fixed: $$[$0], rest: null }; 
break;
case 30:
        if ($$[$0].keys && $$[$0].ids) {
            throw new Error('Rest args cannot be destructured by a hash map');
        }
        this.$ = { fixed: $$[$0-2], rest: $$[$0] };
    
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = { keys: [], ids: [] }; 
break;
case 33:
        $$[$0-1].destrucId = $$[$0];
        this.$ = $$[$0-1];
    
break;
case 34:
        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('CallExpression',
                yy.Node('Identifier', 'keyword', id.loc),
                [yy.Node('Literal', id.name, id.loc)], id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 35:
        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('Literal', id.name, id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 36:
        $$[$0-2].ids.push($$[$0-1]);
        $$[$0-2].keys.push($$[$0]);
        this.$ = $$[$0-2];
    
break;
case 37:
        this.$ = $$[$0-2];
        this.$.destrucId = getValueIfUndefined($$[$0-1], yy.Node('Identifier', null, yy.loc(_$[$0-3])));
    
break;
case 38:
        this.$ = $$[$0-1];
        this.$.destrucId = getValueIfUndefined(this.$.destrucId, yy.Node('Identifier', null, yy.loc(_$[$0-2])));
    
break;
case 39:
        var processed = processSeqDestrucForm($$[$0-2], yy);
        var ids = processed.ids;
        $$[$0].body = processed.stmts.concat($$[$0].body);

        var hasRecurForm = processRecurFormIfAny($$[$0], ids, yy);
        if (hasRecurForm) {
            var blockLoc = $$[$0].loc;
            $$[$0] = yy.Node('BlockStatement', [
                yy.Node('WhileStatement', yy.Node('Literal', true, blockLoc),
                    $$[$0], blockLoc)], blockLoc);
        }

        var arityCheck = createArityCheckStmt(ids.length, $$[$0-2].rest, yy.loc(_$[$0-2]), yy);
        $$[$0].body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, ids, null,
            $$[$0], false, false, yy.loc(_$[$0]));
    
break;
case 40: this.$ = $$[$0]; 
break;
case 41: this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(_$[$0-2]), yy); 
break;
case 42:
        var body = $$[$0-1], bodyLoc = _$[$0-1];
        var maxArgNum = 0;
        var hasRestArg = false;
        estraverse.traverse(body, {
            enter: function (node) {
                if (node.type === 'Identifier' && node.anonArg) {
                    if (node.anonArgNum === 0)   // 0 denotes rest arg
                        hasRestArg = true;
                    else if (node.anonArgNum > maxArgNum)
                        maxArgNum = node.anonArgNum;
                    delete node.anonArg;
                    delete node.anonArgNum;
                }
            }
        });
        var args = [];
        for (var i = 1; i <= maxArgNum; ++i) {
            args.push(yy.Node('Identifier', '__$' + i, yy.loc(_$[$0-1])));
        }
        body = wrapInExpressionStatement(body, yy);
        body = yy.Node('BlockStatement', [body], yy.loc(bodyLoc));
        createReturnStatementIfPossible(body, yy);
        if (hasRestArg) {
            var restId = yy.Node('Identifier', '__$rest', yy.loc(bodyLoc));
            var restDecl = createRestArgsDecl(restId, null, maxArgNum, yy.loc(bodyLoc), yy);
            body.body.unshift(restDecl);
        }

        var arityCheck = createArityCheckStmt(maxArgNum, hasRestArg, yy.loc(_$[$0-3]), yy);
        body.body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, args, null, body,
            false, false, yy.loc(_$[$0-3]));
    
break;
case 43:
        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null));
    
break;
case 44:
        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null);
    
break;
case 45:
        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', true, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('&&', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 46:
        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', null, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('||', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 47: this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(this._$), yy); 
break;
case 48:
        var processed = processDestrucForm({ fixed: [$$[$0-1]], rest: null }, yy);
        this.$ = {
            decl: yy.Node('VariableDeclarator', processed.ids[0], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-1])),
            stmts: processed.stmts
        };
    
break;
case 49:
        var decl = yy.Node('VariableDeclaration', 'var', [$$[$0].decl], yy.loc(_$[$0]));
        $$[$0-1].push({ decl: decl, stmts: $$[$0].stmts });
        this.$ = $$[$0-1];
    
break;
case 50: this.$ = []; 
break;
case 51:
        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body = body.concat([letBinding.decl]).concat(letBinding.stmts);
        }
        body = body.concat($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);
    
break;
case 52:
        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body.push(letBinding.decl);
            $$[$0].body = letBinding.stmts.concat($$[$0].body);
        }

        body.push($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);

        var blockBody = this.$.callee.object.body.body, whileBlock, whileBlockIdx, stmt;
        for (var i = 0, len = blockBody.length; i < len; ++i) {
            stmt = blockBody[i];
            if (stmt.type === 'BlockStatement') {
                whileBlockIdx = i;
                whileBlock = stmt;
            }
        }

        var actualArgs = [];
        for (var i = 0, len = $$[$0-2].length; i < len; ++i) {
            actualArgs.push($$[$0-2][i].decl.declarations[0].id);
        }

        processRecurFormIfAny(whileBlock, actualArgs, yy);

        var whileBody = whileBlock.body;
        var lastLoc = (whileBody.length > 0) ? (whileBody[whileBody.length-1].loc) : whileBlock.loc;
        whileBody.push(yy.Node('BreakStatement', null, lastLoc));
        blockBody[whileBlockIdx] = yy.Node('WhileStatement', yy.Node('Literal', true, yy.loc(_$[$0])),
            whileBlock, yy.loc(_$[$0]));
    
break;
case 53:
        $$[$0] = getValueIfUndefined($$[$0], []);
        var body = [], id, assignment, arg;
        for (var i = 0; i < $$[$0].length; ++i) {
            arg = $$[$0][i];
            id = yy.Node('Identifier', '__$recur' + i, arg.loc);
            id.recurArg = true;
            id.recurArgIdx = i;
            assignment = yy.Node('AssignmentExpression', '=', id, arg, arg.loc);
            body.push(wrapInExpressionStatement(assignment, yy));
        }
        this.$ = yy.Node('BlockStatement', body, yy.loc(_$[$0-1]));
        this.$.recurBlock = true;
    
break;
case 54:
        var init = parseVarDecl($$[$0-3],
            parseNumLiteral('Integer', '0', yy.loc(_$[$0-3]), yy),
            yy.loc(_$[$0-3]), yy);
        var maxId = yy.Node('Identifier', '__$max', yy.loc(_$[$0-2]));
        addVarDecl(init, maxId, $$[$0-2], yy.loc(_$[$0-2]), yy);
        var test = yy.Node('BinaryExpression', '<', $$[$0-3], maxId, yy.loc(_$[$0-3]));
        var update = yy.Node('UpdateExpression', '++', $$[$0-3], true, yy.loc(_$[$0-3]));
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 55:
        var whileLoop = yy.Node('WhileStatement', $$[$0-1], $$[$0], yy.loc(_$[$0-2]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([whileLoop], yy.loc(_$[$0-2]), yy);
        this.$ = whileLoop;
    
break;
case 56:
        $$[$0] = getValueIfUndefined($$[$0], []);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Literal', $$[$0-2], yy.loc(_$[$0-2])),
            true, yy.loc(_$[$0-3]));
        var fnCall = yy.Node('CallExpression', callee, $$[$0], yy.loc(_$[$0-3]));
        if ($$[$0].length > 0) {
            this.$ = fnCall;
        } else {
            // (.prop obj) can either be a call to a 0-argument fn, or a property access.
            // if both are possible, the function call is chosen.
            // (typeof obj['prop'] === 'function' && obj['prop'].length === 0) ? obj['prop']() : obj['prop'];
            this.$ = yy.Node('ConditionalExpression',
                yy.Node('LogicalExpression', '&&',
                    yy.Node('BinaryExpression', '===',
                        yy.Node('UnaryExpression', 'typeof', callee, true, yy.loc(_$[$0-3])),
                        yy.Node('Literal', 'function', yy.loc(_$[$0-3])), yy.loc(_$[$0-3])),
                    yy.Node('BinaryExpression', '===',
                        yy.Node('MemberExpression', callee,
                            yy.Node('Identifier', 'length', yy.loc(_$[$0-3])),
                            false, yy.loc(_$[$0-3])),
                        yy.Node('Literal', 0, yy.loc(_$[$0-3])), yy.loc(_$[$0-3])),
                    yy.loc(_$[$0-3])),
                fnCall, callee, yy.loc(_$[$0-3]));
        }
    
break;
case 57: this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 63: this.$ = yy.Node('AssignmentExpression', '=', $$[$0-1], $$[$0], yy.loc(_$[$0-2])); 
break;
case 69:
        yy.locComb(this._$, _$[$0]);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Identifier', 'call', yy.loc(_$[$0-1])),
            false, yy.loc(_$[$0-1]));
        $$[$0] = getValueIfUndefined($$[$0], []);
        $$[$0].unshift(yy.Node('Literal', null, yy.loc(_$[$0-1])));   // value for "this"
        this.$ = yy.Node('CallExpression', callee, $$[$0], yy.loc(this._$));
    
break;
case 70: this.$ = wrapInIIFE($$[$0], yy.loc(_$[$0-1]), yy); 
break;
case 71: this.$ = $$[$0]; 
break;
case 72: this.$ = $$[$0]; 
break;
case 73: this.$ = $$[$0-1]; 
break;
case 75: this.$ = wrapInExpressionStatement($$[$0], yy); 
break;
case 76: this.$ = []; 
break;
case 77: this.$ = $$[$0-2]; $$[$0-2].push($$[$0-1], $$[$0]); 
break;
case 78: this.$ = [$$[$0]]; 
break;
case 79:
        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 80:
        for (var i = 0, len = $$[$0].length; i < len; ++i) {
            $$[$0][i] = wrapInExpressionStatement($$[$0][i], yy);
        }
    
break;
case 82:
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 83:
        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 84:
        this.$ = createReturnStatementIfPossible($$[$0], yy);
    
break;
case 85:
        var prog = yy.Node('Program', $$[$0-1], yy.loc(_$[$0-1]));
        destrucArgIdx = 0;
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
case 86:
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
            range: [0, 0]
        });
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
}
},
table: [{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,85:4,86:2,87:1,88:[1,3]},{1:[3]},{88:[1,26]},{1:[2,86]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,80],24:[1,21],27:[1,22],30:9,41:27,88:[2,80]},{4:[2,78],7:[2,78],9:[2,78],11:[2,78],12:[2,78],13:[2,78],14:[2,78],15:[2,78],16:[2,78],18:[2,78],20:[2,78],21:[2,78],22:[2,78],23:[2,78],24:[2,78],26:[2,78],27:[2,78],88:[2,78]},{4:[2,71],7:[2,71],9:[2,71],11:[2,71],12:[2,71],13:[2,71],14:[2,71],15:[2,71],16:[2,71],18:[2,71],20:[2,71],21:[2,71],22:[2,71],23:[2,71],24:[2,71],26:[2,71],27:[2,71],37:[2,71],39:[2,71],40:[2,71],88:[2,71]},{4:[2,72],7:[2,72],9:[2,72],11:[2,72],12:[2,72],13:[2,72],14:[2,72],15:[2,72],16:[2,72],18:[2,72],20:[2,72],21:[2,72],22:[2,72],23:[2,72],24:[2,72],26:[2,72],27:[2,72],37:[2,72],39:[2,72],40:[2,72],88:[2,72]},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:28,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,74],7:[2,74],9:[2,74],11:[2,74],12:[2,74],13:[2,74],14:[2,74],15:[2,74],16:[2,74],18:[2,74],20:[2,74],21:[2,74],22:[2,74],23:[2,74],24:[2,74],26:[2,74],27:[2,74],37:[2,74],39:[2,74],40:[2,74],88:[2,74]},{4:[2,6],7:[2,6],9:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],18:[2,6],20:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],26:[2,6],27:[2,6],37:[2,6],39:[2,6],40:[2,6],88:[2,6]},{4:[2,7],7:[2,7],9:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],18:[2,7],20:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],26:[2,7],27:[2,7],37:[2,7],39:[2,7],40:[2,7],88:[2,7]},{4:[2,8],7:[2,8],9:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],18:[2,8],20:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],26:[2,8],27:[2,8],37:[2,8],39:[2,8],40:[2,8],88:[2,8]},{4:[2,9],7:[2,9],9:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],18:[2,9],20:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],26:[2,9],27:[2,9],37:[2,9],39:[2,9],40:[2,9],88:[2,9]},{4:[2,10],7:[2,10],9:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],18:[2,10],20:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],26:[2,10],27:[2,10],37:[2,10],39:[2,10],40:[2,10],88:[2,10]},{4:[2,11],7:[2,11],9:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11],20:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],26:[2,11],27:[2,11],37:[2,11],39:[2,11],40:[2,11],88:[2,11]},{4:[2,12],7:[2,12],9:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12],20:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],26:[2,12],27:[2,12],37:[2,12],39:[2,12],40:[2,12],88:[2,12]},{4:[2,13],7:[2,13],9:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13],20:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],26:[2,13],27:[2,13],37:[2,13],39:[2,13],40:[2,13],88:[2,13]},{4:[2,14],7:[2,14],9:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14],20:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],26:[2,14],27:[2,14],37:[2,14],39:[2,14],40:[2,14],88:[2,14]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:61,20:[2,87],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:5,85:62},{22:[1,63]},{4:[2,76],7:[2,76],9:[2,76],11:[2,76],12:[2,76],13:[2,76],14:[2,76],15:[2,76],16:[2,76],18:[2,76],21:[2,76],22:[2,76],24:[2,76],26:[2,76],27:[2,76],84:64},{22:[1,66],24:[1,65]},{4:[1,67]},{4:[2,1],7:[2,1],9:[2,1],11:[2,1],12:[2,1],13:[2,1],14:[2,1],15:[2,1],16:[2,1],18:[2,1],20:[2,1],21:[2,1],22:[2,1],23:[2,1],24:[2,1],26:[2,1],27:[2,1],35:[2,1],37:[2,1],39:[2,1],40:[2,1],88:[2,1]},{4:[2,5],7:[2,5],9:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],18:[2,5],20:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],26:[2,5],27:[2,5],37:[2,5],39:[2,5],40:[2,5],88:[2,5]},{1:[2,85]},{4:[2,79],7:[2,79],9:[2,79],11:[2,79],12:[2,79],13:[2,79],14:[2,79],15:[2,79],16:[2,79],18:[2,79],20:[2,79],21:[2,79],22:[2,79],23:[2,79],24:[2,79],26:[2,79],27:[2,79],88:[2,79]},{23:[1,68]},{23:[2,58]},{23:[2,59]},{23:[2,60]},{23:[2,61]},{23:[2,62]},{3:69,4:[1,24]},{23:[2,64]},{23:[2,65]},{23:[2,66]},{23:[2,67]},{23:[2,68]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:70,85:71},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:72,85:4,86:73},{18:[1,75],43:74},{3:76,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:77},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:78},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,93],24:[1,21],27:[1,22],30:9,41:5,57:79,85:80},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,93],24:[1,21],27:[1,22],30:9,41:5,57:81,85:80},{3:82,4:[1,24]},{18:[1,83]},{18:[1,84]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:85,85:71},{18:[1,86]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:87},{4:[1,88]},{4:[2,19],7:[2,19],9:[2,19],11:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],18:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],27:[2,19]},{4:[2,20],7:[2,20],9:[2,20],11:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],18:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],27:[2,20]},{4:[2,21],7:[2,21],9:[2,21],11:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],18:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],27:[2,21]},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:89,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,23],7:[2,23],9:[2,23],11:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],18:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],27:[2,23]},{4:[2,24],7:[2,24],9:[2,24],11:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],18:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],27:[2,24]},{20:[1,90]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],20:[2,88],21:[1,20],22:[1,8],23:[2,88],24:[1,21],26:[2,88],27:[1,22],30:9,41:27},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:91,21:[1,20],22:[1,8],23:[2,87],24:[1,21],27:[1,22],30:9,41:5,85:62},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],26:[1,92],27:[1,22],30:9,41:93},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],19:94,21:[1,20],22:[1,8],24:[1,21],26:[2,87],27:[1,22],30:9,41:5,85:62},{3:55,4:[1,24],6:57,7:[1,23],8:60,9:[1,25],17:56,18:[1,19],21:[1,20],22:[1,58],23:[2,57],24:[1,21],27:[1,22],28:40,29:95,30:59,45:29,46:[1,42],47:[1,43],48:30,49:[1,44],53:[1,45],55:31,56:[1,46],58:[1,47],59:32,60:[1,48],64:33,65:[1,49],67:35,68:[1,50],70:36,71:[1,51],73:37,74:[1,52],75:38,76:[1,53],77:39,78:[1,54],81:[1,34],82:[1,41]},{4:[2,4],7:[2,4],9:[2,4],11:[2,4],12:[2,4],13:[2,4],14:[2,4],15:[2,4],16:[2,4],18:[2,4],20:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],26:[2,4],27:[2,4],37:[2,4],39:[2,4],40:[2,4],88:[2,4]},{4:[2,73],7:[2,73],9:[2,73],11:[2,73],12:[2,73],13:[2,73],14:[2,73],15:[2,73],16:[2,73],18:[2,73],20:[2,73],21:[2,73],22:[2,73],23:[2,73],24:[2,73],26:[2,73],27:[2,73],37:[2,73],39:[2,73],40:[2,73],88:[2,73]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:96},{23:[2,69]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,98],24:[1,21],27:[1,22],30:9,41:27},{23:[2,70]},{23:[2,81]},{23:[2,40]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:98,34:97,35:[2,27]},{18:[1,75],43:99},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:101,83:100},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:102,85:4,86:73},{23:[2,45]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,94],24:[1,21],27:[1,22],30:9,41:27},{23:[2,46]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,95],24:[1,21],27:[1,22],30:9,41:105,61:104},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:106},{4:[2,50],18:[2,50],20:[2,50],24:[2,50],63:107},{23:[2,53]},{3:108,4:[1,24]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:109,85:4,86:73},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:110},{23:[1,111]},{4:[2,15],7:[2,15],9:[2,15],11:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],18:[2,15],20:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],26:[2,15],27:[2,15],37:[2,15],39:[2,15],40:[2,15],88:[2,15]},{23:[1,112]},{4:[2,17],7:[2,17],9:[2,17],11:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],18:[2,17],20:[2,17],21:[2,17],22:[2,17],23:[2,17],24:[2,17],26:[2,17],27:[2,17],37:[2,17],39:[2,17],40:[2,17],88:[2,17]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:113},{26:[1,114]},{23:[1,115]},{23:[2,63]},{20:[1,116]},{3:119,4:[1,24],18:[1,121],20:[2,29],24:[1,122],31:118,32:120,35:[1,117],37:[2,29]},{23:[2,41]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,91],24:[1,21],27:[1,22],30:9,41:101,52:123,83:124},{4:[2,75],7:[2,75],9:[2,75],11:[2,75],12:[2,75],13:[2,75],14:[2,75],15:[2,75],16:[2,75],18:[2,75],21:[2,75],22:[2,75],23:[2,75],24:[2,75],27:[2,75]},{23:[2,44]},{23:[2,83]},{23:[2,47]},{23:[2,96]},{3:119,4:[1,24],18:[1,121],20:[1,125],24:[1,122],31:127,32:120,62:126},{3:119,4:[1,24],18:[1,121],20:[1,128],24:[1,122],31:127,32:120,62:126},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:129},{23:[2,55]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,97],24:[1,21],27:[1,22],30:9,41:5,72:130,85:71},{4:[2,22],7:[2,22],9:[2,22],11:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],18:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],27:[2,22]},{4:[2,16],7:[2,16],9:[2,16],11:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],18:[2,16],20:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],26:[2,16],27:[2,16],37:[2,16],39:[2,16],40:[2,16],88:[2,16]},{4:[2,77],7:[2,77],9:[2,77],11:[2,77],12:[2,77],13:[2,77],14:[2,77],15:[2,77],16:[2,77],18:[2,77],21:[2,77],22:[2,77],24:[2,77],26:[2,77],27:[2,77]},{4:[2,18],7:[2,18],9:[2,18],11:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],18:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],26:[2,18],27:[2,18],37:[2,18],39:[2,18],40:[2,18],88:[2,18]},{4:[2,42],7:[2,42],9:[2,42],11:[2,42],12:[2,42],13:[2,42],14:[2,42],15:[2,42],16:[2,42],18:[2,42],20:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],26:[2,42],27:[2,42],37:[2,42],39:[2,42],40:[2,42],88:[2,42]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,44:131,66:103,69:132,85:4,86:73},{3:119,4:[1,24],18:[1,121],24:[1,122],31:133,32:120},{4:[2,28],18:[2,28],20:[2,28],24:[2,28],35:[2,28],37:[2,28]},{4:[2,25],7:[2,25],9:[2,25],11:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],18:[2,25],20:[2,25],21:[2,25],22:[2,25],24:[2,25],27:[2,25],35:[2,25],37:[2,25]},{4:[2,26],7:[2,26],9:[2,26],11:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],18:[2,26],20:[2,26],21:[2,26],22:[2,26],24:[2,26],27:[2,26],35:[2,26],37:[2,26]},{4:[2,27],18:[2,27],20:[2,27],24:[2,27],33:98,34:134,35:[2,27],37:[2,27]},{4:[2,32],18:[2,32],24:[2,32],26:[2,32],37:[2,32],38:135,39:[2,32],40:[2,32]},{23:[2,43]},{23:[2,92]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:136,85:4,86:73},{4:[2,49],18:[2,49],20:[2,49],24:[2,49]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:137},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:138,85:4,86:73},{20:[1,139]},{23:[2,56]},{23:[2,39]},{23:[2,84]},{20:[2,30],37:[2,30]},{20:[2,89],36:141,37:[1,142],42:140},{3:119,4:[1,24],18:[1,121],24:[1,122],26:[1,143],31:147,32:120,36:144,37:[1,142],39:[1,145],40:[1,146]},{23:[2,51]},{4:[2,48],18:[2,48],20:[2,48],24:[2,48]},{23:[2,52]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],23:[2,82],24:[1,21],27:[1,22],30:9,41:5,66:103,69:148,85:4,86:73},{20:[1,149]},{20:[2,90]},{3:150,4:[1,24]},{4:[2,38],7:[2,38],9:[2,38],11:[2,38],12:[2,38],13:[2,38],14:[2,38],15:[2,38],16:[2,38],18:[2,38],20:[2,38],21:[2,38],22:[2,38],24:[2,38],27:[2,38],35:[2,38],37:[2,38]},{4:[2,33],18:[2,33],24:[2,33],26:[2,33],37:[2,33],39:[2,33],40:[2,33]},{18:[1,151]},{18:[1,152]},{3:17,4:[1,24],6:16,7:[1,23],8:18,9:[1,25],10:6,11:[1,10],12:[1,11],13:[1,12],14:[1,13],15:[1,14],16:[1,15],17:7,18:[1,19],21:[1,20],22:[1,8],24:[1,21],27:[1,22],30:9,41:153},{23:[2,54]},{4:[2,37],7:[2,37],9:[2,37],11:[2,37],12:[2,37],13:[2,37],14:[2,37],15:[2,37],16:[2,37],18:[2,37],20:[2,37],21:[2,37],22:[2,37],24:[2,37],27:[2,37],35:[2,37],37:[2,37]},{4:[2,31],18:[2,31],20:[2,31],24:[2,31],26:[2,31],37:[2,31],39:[2,31],40:[2,31]},{4:[2,2],5:154,20:[2,2]},{4:[2,2],5:155,20:[2,2]},{4:[2,36],18:[2,36],24:[2,36],26:[2,36],37:[2,36],39:[2,36],40:[2,36]},{3:157,4:[1,24],20:[1,156]},{3:157,4:[1,24],20:[1,158]},{4:[2,34],18:[2,34],24:[2,34],26:[2,34],37:[2,34],39:[2,34],40:[2,34]},{4:[2,3],20:[2,3]},{4:[2,35],18:[2,35],24:[2,35],26:[2,35],37:[2,35],39:[2,35],40:[2,35]}],
defaultActions: {3:[2,86],26:[2,85],29:[2,58],30:[2,59],31:[2,60],32:[2,61],33:[2,62],35:[2,64],36:[2,65],37:[2,66],38:[2,67],39:[2,68],70:[2,69],72:[2,70],73:[2,81],74:[2,40],79:[2,45],81:[2,46],85:[2,53],96:[2,63],99:[2,41],102:[2,44],103:[2,83],104:[2,47],105:[2,96],109:[2,55],123:[2,43],124:[2,92],130:[2,56],131:[2,39],132:[2,84],136:[2,51],138:[2,52],141:[2,90],148:[2,54]},
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


var estraverse = require('estraverse');

var expressionTypes = ['ThisExpression', 'ArrayExpression', 'ObjectExpression',
    'FunctionExpression', 'ArrowExpression', 'SequenceExpression', 'Identifier',
    'UnaryExpression', 'BinaryExpression', 'AssignmentExpression', 'Literal',
    'UpdateExpression', 'LogicalExpression', 'ConditionalExpression',
    'NewExpression', 'CallExpression', 'MemberExpression'];

var destrucArgIdx = 0;
function processSeqDestrucForm(args, yy) {
    var i, len, arg;
    var fixed = args.fixed, rest = args.rest;
    var ids = [], stmts = [];
    for (i = 0, len = fixed.length; i < len; ++i) {
        arg = fixed[i];
        if (arg.type && arg.type === 'Identifier') {
            ids.push(arg);
        } else if (! arg.type) {
            arg.destrucId.name = arg.destrucId.name || '__$destruc' + destrucArgIdx++;
            ids.push(arg.destrucId);
            stmts = processChildDestrucForm(arg, stmts, yy);
        }
    }

    if (rest) {
        if (rest.type && rest.type === 'Identifier') {
            decl = createRestArgsDecl(rest, args.destrucId, fixed.length, rest.loc, yy);
            stmts.push(decl);
        } else if (! rest.type) {
            rest.destrucId.name = rest.destrucId.name || '__$destruc' + destrucArgIdx++;
            decl = createRestArgsDecl(rest.destrucId, args.destrucId, fixed.length, rest.destrucId.loc, yy);
            stmts.push(decl);
            stmts = processChildDestrucForm(rest, stmts, yy);
        }
    }

    return { ids: ids, pairs: [], stmts: stmts };
}

function processMapDestrucForm(args, yy) {
    var keys = args.keys, valIds = args.ids, key, id;
    var pairs = [], stmts = [];
    var decl, init, yyloc;
    for (var i = 0, len = valIds.length; i < len; ++i) {
        id = valIds[i], key = keys[i];
        if (id.type && id.type === 'Identifier') {
            yyloc = id.loc;
            init = yy.Node('CallExpression',
                yy.Node('Identifier', 'get', yyloc),
                [args.destrucId, key], yyloc);
            decl = parseVarDecl(id, init, yyloc, yy);
            stmts.push(decl);
        } else if (! id.type) {
            id.destrucId.name = id.destrucId.name || '__$destruc' + destrucArgIdx++;
            pairs.push({ id: id.destrucId, key: key });
            stmts = processChildDestrucForm(id, stmts, yy);
        }
    }
    return { ids: [], pairs: pairs, stmts: stmts };
}

function processDestrucForm(args, yy) {
    if (args.fixed !== undefined && args.rest !== undefined) {
        return processSeqDestrucForm(args, yy);
    } else if (args.keys !== undefined && args.ids !== undefined) {
        return processMapDestrucForm(args, yy);
    }
}

function processChildDestrucForm(arg, stmts, yy) {
    var i, len, processed = processDestrucForm(arg, yy);
    var processedId, processedKey, yyloc, init, decl, nilDecl, tryStmt, catchClause, errorId;
    for (i = 0, len = processed.ids.length; i < len; ++i) {
        processedId = processed.ids[i];
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'nth', yyloc),
            [arg.destrucId, yy.Node('Literal', i, yyloc)],
            yyloc);

        decl = parseVarDecl(processedId, init, processedId.loc, yy);
        nilDecl = parseVarDecl(processedId, yy.Node('Literal', null, yyloc), processedId.loc, yy);

        errorId = yy.Node('Identifier', '__$error', yyloc);
        catchClause = yy.Node('CatchClause', errorId, null,
            yy.Node('BlockStatement', [
                yy.Node('IfStatement',
                    yy.Node('BinaryExpression', '!==',
                        yy.Node('MemberExpression', errorId,
                            yy.Node('Identifier', 'name', yyloc), false, yyloc),
                        yy.Node('Literal', 'IndexOutOfBoundsError', yyloc),
                        yyloc),
                    yy.Node('ThrowStatement', errorId, yyloc),
                    null, yyloc),
                wrapInExpressionStatement(
                    yy.Node('AssignmentExpression', '=', processedId,
                        yy.Node('Literal', null, yyloc), yyloc),
                    yy)],
                yyloc),
            yyloc);

        tryStmt = yy.Node('TryStatement',
            yy.Node('BlockStatement', [decl], yyloc),
            [catchClause], null, yyloc);

        stmts.push(tryStmt);
    }
    for (i = 0, len = processed.pairs.length; i < len; ++i) {
        processedId = processed.pairs[i].id, processedKey = processed.pairs[i].key;
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'get', yyloc),
            [arg.destrucId, processedKey], yyloc);
        decl = parseVarDecl(processedId, init, yyloc, yy);
        stmts.push(decl);
    }
    return stmts.concat(processed.stmts);
}

function processRecurFormIfAny(rootNode, actualArgs, yy) {
    var hasRecurForm = false;
    estraverse.traverse(rootNode, {
        enter: function (node) {
            if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
                return estraverse.VisitorOption.Skip;
            } else if (node.type === 'BlockStatement' && node.recurBlock) {
                hasRecurForm = true;
                var body = node.body;

                // get rid of return statement
                var lastStmt = body.length > 0 ? body[body.length-1] : null;
                if (lastStmt && lastStmt.type === 'ReturnStatement') {
                    lastStmt.type = 'ExpressionStatement';
                    lastStmt.expression = lastStmt.argument;
                    delete lastStmt.argument;
                }

                estraverse.traverse(node, {
                    enter: function (innerNode) {
                        if (innerNode.type === 'Identifier' && innerNode.recurArg) {
                            var actualArg = actualArgs[innerNode.recurArgIdx];
                            body.push(wrapInExpressionStatement(yy.Node('AssignmentExpression', '=', actualArg, innerNode, innerNode.loc), yy));
                            delete innerNode.recurArg;
                            delete innerNode.recurArgIdx;
                        }
                    }
                });

                var lastLoc = (body.length > 0) ? (body[body.length-1].loc) : body.loc;
                body.push(yy.Node('ContinueStatement', null, lastLoc));
                delete node.recurBlock;
            }
        }
    });
    return hasRecurForm;
}

// wrap the given array of statements in an IIFE (Immediately-Invoked Function Expression)
function wrapInIIFE(body, yyloc, yy) {
    var thisExp = yy.Node('ThisExpression', yyloc);
    return yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('FunctionExpression',
                null, [], null,
                createReturnStatementIfPossible(yy.Node('BlockStatement', body, yyloc), yy),
                false, false, yyloc),
            yy.Node('Identifier', 'call', yyloc), false, yyloc),
        [yy.Node('ConditionalExpression',
            yy.Node('BinaryExpression', '!==',
                yy.Node('UnaryExpression', 'typeof', thisExp, true, yyloc),
                yy.Node('Literal', 'undefined', yyloc), yyloc),
            thisExp,
            yy.Node('Literal', null, yyloc), yyloc)],
        yyloc);
}

function wrapInExpressionStatement(expr, yy) {
    if (expressionTypes.indexOf(expr.type) !== -1) {
        return yy.Node('ExpressionStatement', expr, expr.loc);
    }
    return expr;
}

function createArityCheckStmt(minArity, hasRestArgs, yyloc, yy) {
    var arityCheckArgs = [yy.Node('Literal', minArity, yyloc)];
    if (hasRestArgs) {
        arityCheckArgs.push(yy.Node('Identifier', 'Infinity', yyloc));
    }
    arityCheckArgs.push(yy.Node('MemberExpression',
        yy.Node('Identifier', 'arguments', yyloc),
        yy.Node('Identifier', 'length', yyloc), false, yyloc));
    var arityCheck = yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('Identifier', 'assertions', yyloc),
            yy.Node('Identifier', 'arity', yyloc),
            false, yyloc),
        arityCheckArgs, yyloc);
    return wrapInExpressionStatement(arityCheck, yy);
}

function createReturnStatementIfPossible(stmt, yy) {
    if (stmt === undefined || stmt === null || ! stmt.type)
        return stmt;
    var lastStmts = [], lastStmt;
    if (stmt.type === 'BlockStatement') {
        lastStmts.push(stmt.body[stmt.body.length - 1]);
    } else if (stmt.type === 'IfStatement') {
        lastStmts.push(stmt.consequent);
        if (stmt.alternate === null) {
            stmt.alternate = wrapInExpressionStatement(yy.Node('Literal', null, stmt.consequent.loc), yy);
        }
        lastStmts.push(stmt.alternate);
    } else {
        return stmt;
    }
    for (var i = 0; i < lastStmts.length; ++i) {
        lastStmt = lastStmts[i];
        if (! lastStmt) continue;
        if (lastStmt.type === 'ExpressionStatement') {
            lastStmt.type = 'ReturnStatement';
            lastStmt.argument = lastStmt.expression;
            delete lastStmt.expression;
        } else {
            createReturnStatementIfPossible(lastStmt, yy);
        }
    }
    return stmt;
}

function createRestArgsDecl(id, argsId, offset, yyloc, yy) {
    var restInit;
    if (! argsId) {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'seq', yyloc),
            [yy.Node('CallExpression',
                yy.Node('MemberExpression',
                    yy.Node('MemberExpression',
                        yy.Node('MemberExpression',
                            yy.Node('Identifier', 'Array', yyloc),
                            yy.Node('Identifier', 'prototype', yyloc), false, yyloc),
                        yy.Node('Identifier', 'slice', yyloc), false, yyloc),
                    yy.Node('Identifier', 'call', yyloc), false, yyloc),
                [yy.Node('Identifier', 'arguments', yyloc),
                 yy.Node('Literal', offset, yyloc)])],
            yyloc);
    } else {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'drop', yyloc),
            [yy.Node('Literal', offset, yyloc), argsId]);
    }
    return parseVarDecl(id, restInit, yyloc, yy);
}

function parseLogicalExpr(op, exprs, yyloc, yy) {
    var logicalExpr = exprs[0];
    for (var i = 1, len = exprs.length; i < len; ++i) {
        logicalExpr = yy.Node('LogicalExpression', op, logicalExpr, exprs[i], yyloc);
    }
    return logicalExpr;
}

function parseVarDecl(id, init, yyloc, yy) {
    var stmt = yy.Node('VariableDeclaration', 'var', [], yyloc);
    return addVarDecl(stmt, id, init, yyloc, yy);
}

function addVarDecl(stmt, id, init, yyloc, yy) {
    var decl = yy.Node('VariableDeclarator', id, getValueIfUndefined(init, null), yyloc);
    stmt.declarations.push(decl);
    return stmt;
}

function parseNumLiteral(type, token, yyloc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), yyloc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yyloc);
    } else {
        node = parseLiteral(type, Number(token), yyloc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, yyloc, raw, yy) {
    return yy.Node('Literal', value, yyloc, raw);
}

function parseCollectionLiteral(type, items, yyloc, yy) {
    return yy.Node('CallExpression', yy.Node('Identifier', parseIdentifierName(type), yyloc), items, yyloc);
}

var charMap = {
    '-': '_$_',
    '+': '_$PLUS_',
    '>': '_$GT_',
    '<': '_$LT_',
    '=': '_$EQ_',
    '!': '_$BANG_',
    '*': '_$STAR_',
    '/': '_$SLASH_',
    '?': '_$QMARK_'
};
function parseIdentifierName(name) {
    var charsToReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g');
    return name.replace(charsToReplace, function (c) { return charMap[c]; });
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

function processLocsAndRanges(prog, locs, ranges) {
    // this cannot be done 1 pass over all the nodes
    // because some of the loc / range objects point to the same instance in memory
    // so deleting one deletes the other as well
    estraverse.replace(prog, {
        leave: function (node) {
            if (ranges) node.range = node.loc.range || [0, 0];
            return node;
        }
    });

    estraverse.replace(prog, {
        leave: function (node) {
            if (node.loc && typeof node.loc.range !== 'undefined')
                delete node.loc.range;
            if (! locs && typeof node.loc !== 'undefined')
                delete node.loc;
            return node;
        }
    });
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
    return 11;

break;
case 2:
    return 12;

break;
case 3:
    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2);
    return 13;

break;
case 4:
    return 9;

break;
case 5: /* ignore */ 
break;
case 6:return 35;
break;
case 7:return 22;
break;
case 8:return 23;
break;
case 9:return 18;
break;
case 10:return 20;
break;
case 11:return 24;
break;
case 12:return 26;
break;
case 13:return 27;
break;
case 14:return 21;
break;
case 15:return 7;
break;
case 16:return 78;
break;
case 17:return 60;
break;
case 18:return 46;
break;
case 19:return 47;
break;
case 20:return 49;
break;
case 21:return 53;
break;
case 22:return 82;
break;
case 23:return 65;
break;
case 24:return 68;
break;
case 25:return 71;
break;
case 26:return 56;
break;
case 27:return 58;
break;
case 28:return 81;
break;
case 29:return 74;
break;
case 30:return 76;
break;
case 31:return 37;
break;
case 32:return 39;
break;
case 33:return 40;
break;
case 34:return 14;
break;
case 35:return 15;
break;
case 36:return 16;
break;
case 37:
    return 4;

break;
case 38: return 88; 
break;
case 39:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s,]+))/,/^(?:([-+]?([1-9][0-9]+|[0-9])))/,/^(?:([-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])*"))/,/^(?:(%(&|[1-9]|[0-9]|)?))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:#)/,/^(?:')/,/^(?::)/,/^(?:\.)/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:when)/,/^(?:do)/,/^(?:let)/,/^(?:loop)/,/^(?:recur)/,/^(?:and)/,/^(?:or)/,/^(?:set!)/,/^(?:dotimes)/,/^(?:while)/,/^(?::as)/,/^(?::keys)/,/^(?::strs)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*))/,/^(?:$)/,/^(?:.)/],
conditions: {"regex":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],"inclusive":true}}
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


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require("/home/vicky/Dropbox/Private/Documents/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/vicky/Dropbox/Private/Documents/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":5,"estraverse":7,"fs":4,"path":6}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

}).call(this,require("/home/vicky/Dropbox/Private/Documents/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/vicky/Dropbox/Private/Documents/codecombat-clojure/closer.js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":5}],7:[function(require,module,exports){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint vars:false, bitwise:true*/
/*jshint indent:4*/
/*global exports:true, define:true*/
(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // and plain browser loading,
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.estraverse = {}));
    }
}(this, function (exports) {
    'use strict';

    var Syntax,
        isArray,
        VisitorOption,
        VisitorKeys,
        BREAK,
        SKIP;

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    function ignoreJSHintError() { }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    ignoreJSHintError(shallowCopy);

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    function lowerBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            } else {
                len = diff;
            }
        }
        return i;
    }
    ignoreJSHintError(lowerBound);

    VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'body', 'superClass'],
        ClassExpression: ['id', 'body', 'superClass'],
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MethodDefinition: ['key', 'value'],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: ['key', 'value'],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id
    BREAK = {};
    SKIP = {};

    VisitorOption = {
        Break: BREAK,
        Skip: SKIP
    };

    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }

    Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
    };

    function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }

    function Controller() { }

    // API:
    // return property path array from root to current node
    Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;

        function addToPath(result, path) {
            if (isArray(path)) {
                for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                }
            } else {
                result.push(path);
            }
        }

        // root node
        if (!this.__current.path) {
            return null;
        }

        // first node is sentinel, second node is root element
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
            element = this.__leavelist[i];
            addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
    };

    // API:
    // return array of parent elements
    Controller.prototype.parents = function parents() {
        var i, iz, result;

        // first node is sentinel
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    };

    // API:
    // return current node
    Controller.prototype.current = function current() {
        return this.__current.node;
    };

    Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;

        result = undefined;

        previous  = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;

        return result;
    };

    // API:
    // notify control skip / break
    Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
    };

    // API:
    // skip child nodes of current node
    Controller.prototype.skip = function () {
        this.notify(SKIP);
    };

    // API:
    // break traversals
    Controller.prototype['break'] = function () {
        this.notify(BREAK);
    };

    Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
    };

    Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist,
            leavelist,
            element,
            node,
            nodeType,
            ret,
            key,
            current,
            current2,
            candidates,
            candidate,
            sentinel;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                ret = this.__execute(visitor.leave, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {

                ret = this.__execute(visitor.enter, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                node = element.node;
                nodeType = element.wrap || node.type;
                candidates = VisitorKeys[nodeType];

                current = candidates.length;
                while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (!isArray(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                        continue;
                    }

                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                            continue;
                        }
                        if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                            element = new Element(candidate[current2], [key, current2], 'Property', null);
                        } else {
                            element = new Element(candidate[current2], [key, current2], null, null);
                        }
                        worklist.push(element);
                    }
                }
            }
        }
    };

    Controller.prototype.replace = function replace(root, visitor) {
        var worklist,
            leavelist,
            node,
            nodeType,
            target,
            element,
            current,
            current2,
            candidates,
            candidate,
            sentinel,
            outer,
            key;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        outer = {
            root: root
        };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                target = this.__execute(visitor.leave, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP) {
                    // replace
                    element.ref.replace(target);
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }
                continue;
            }

            target = this.__execute(visitor.enter, element);

            // node may be replaced with null,
            // so distinguish between undefined and null in this place
            if (target !== undefined && target !== BREAK && target !== SKIP) {
                // replace
                element.ref.replace(target);
                element.node = target;
            }

            if (this.__state === BREAK || target === BREAK) {
                return outer.root;
            }

            // node may be null
            node = element.node;
            if (!node) {
                continue;
            }

            worklist.push(sentinel);
            leavelist.push(element);

            if (this.__state === SKIP || target === SKIP) {
                continue;
            }

            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];

            current = candidates.length;
            while ((current -= 1) >= 0) {
                key = candidates[current];
                candidate = node[key];
                if (!candidate) {
                    continue;
                }

                if (!isArray(candidate)) {
                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                    continue;
                }

                current2 = candidate.length;
                while ((current2 -= 1) >= 0) {
                    if (!candidate[current2]) {
                        continue;
                    }
                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                    } else {
                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                    }
                    worklist.push(element);
                }
            }
        }

        return outer.root;
    };

    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        var target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }

        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        var comments = [], comment, len, i, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.version = '1.3.3-dev';
    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}]},{},[1])