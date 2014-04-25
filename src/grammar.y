%start Program
%ebnf

%%

Identifier
  : IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  ;

Keyword
  : COLON IDENTIFIER { $$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(@2)), [yy.Node('Literal', String($2), yy.loc(@2))], yy.loc(@2)); }
  ;

AnonArg
  : ANON_ARG {
        var name = String($1).slice(1);
        if (name === '') name = '1';
        if (name === '&') name = 'rest';
        var anonArgNum = (name === 'rest') ? 0 : Number(name);
        name = '__$' + name;
        $$ = yy.Node('Identifier', name, yy.loc(@1));
        $$.anonArg = true;
        $$.anonArgNum = anonArgNum;
    }
  ;

IdentifierList
  : { $$ = []; }
  | IdentifierList Identifier {
        yy.locComb(@$, @Identifier);
        $$ = $IdentifierList;
        $IdentifierList.push($Identifier);
  }
;

Atom
  : INTEGER { $$ = parseNumLiteral('Integer', $1, @1, yy, yytext); }
  | FLOAT { $$ = parseNumLiteral('Float', $1, @1, yy, yytext); }
  | STRING { $$ = parseLiteral('String', parseString($1), @1, yy.raw[yy.raw.length-1], yy); }
  | 'true' { $$ = parseLiteral('Boolean', true, @1, yytext, yy); }
  | 'false' { $$ = parseLiteral('Boolean', false, @1, yytext, yy); }
  | 'nil' { $$ = parseLiteral('Nil', null, @1, yytext, yy); }
  | Keyword
  | Identifier
  | AnonArg
  ;

CollectionLiteral
  : '[' SExprs?[items] ']' { $$ = parseCollectionLiteral('vector', getValueIfUndefined($items, []), @items, yy); }
  | QUOTE '(' SExprs?[items] ')' { $$ = parseCollectionLiteral('list', getValueIfUndefined($items, []), @items, yy); }
  | '{' SExprPairs[items] '}' { $$ = parseCollectionLiteral('hash_map', getValueIfUndefined($items, []), @items, yy); }
  | SHARP '{' SExprs?[items] '}' { $$ = parseCollectionLiteral('set', getValueIfUndefined($items, []), @items, yy); }
  ;

RestArgs
  : '&' Identifier { $$ = $Identifier; }
  | { $$ = null; }
  ;

Fn
  : IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  | CollectionLiteral
  | Keyword
  | '(' List ')' { $$ = $List; }
  | AnonFnLiteral
  | AnonArg
  ;

FnParamsAndBody
  : '[' IdentifierList RestArgs ']' BlockStatementWithReturn {
        $$ = yy.Node('FunctionExpression', null, $IdentifierList, $RestArgs,
            $BlockStatementWithReturn, false, false, yy.loc(@BlockStatementWithReturn));
    }
  ;

FnDefinition
  : FN FnParamsAndBody { $$ = $FnParamsAndBody; }
  | DEFN Identifier FnParamsAndBody {
        $FnParamsAndBody.type = 'FunctionDeclaration';
        $FnParamsAndBody.id = $Identifier;
        $$ = $FnParamsAndBody;
    }
  ;

AnonFnLiteral
  : SHARP '(' List ')' {
        var body = $3, bodyLoc = @3;
        var maxArgNum = 0;
        var hasRestArg = false;
        estraverse.replace(body, {
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
            args.push(yy.Node('Identifier', '__$' + i, yy.loc(@3)));
        }
        var restArg = (hasRestArg) ? yy.Node('Identifier', '__$rest', yy.loc(bodyLoc)) : null;
        if (expressionTypes.indexOf(body.type) !== -1) {
            body = yy.Node('ReturnStatement', body, yy.loc(bodyLoc));
        }
        body = yy.Node('BlockStatement', [body], yy.loc(bodyLoc));
        $$ = yy.Node('FunctionExpression', null, args, restArg, body,
            false, false, yy.loc(@1));
    }
  ;

ConditionalExpr
  : IF SExpr[test] SExprStmt[consequent] SExprStmt?[alternate] {
        $$ = yy.Node('IfStatement', $test, $consequent, getValueIfUndefined($alternate, null));
    }
  | WHEN SExpr[test] BlockStatement[consequent] {
        $$ = yy.Node('IfStatement', $test, $consequent, null);
    }
  ;

VarDeclaration
  : DEF Identifier SExpr?[init] {
        var decl = yy.Node('VariableDeclarator', $Identifier, getValueIfUndefined($init, null), yy.loc(@DEF));
        $$ = yy.Node('VariableDeclaration', 'var', [decl], yy.loc(@DEF));
    }
  ;

LetBinding
  : Identifier SExpr {
        $$ = yy.Node('VariableDeclarator', $Identifier, getValueIfUndefined($SExpr, null), yy.loc(@Identifier));
    }
  ;

LetBindings
  : LetBindings LetBinding {
        $$ = $LetBindings;
        var binding = yy.Node('VariableDeclaration', 'var', [$LetBinding], yy.loc(@LetBinding));
        $LetBindings.push(binding);
    }
  | { $$ = []; }
  ;

LetForm
  : LET '[' LetBindings ']' DoForm {
        var body = [].concat($LetBindings).concat($DoForm);
        $$ = wrapInIIFE(body, @1, yy);
    }
  ;

List
  : { $$ = yy.Node('EmptyStatement', yy.loc(@1)); }
  | FnDefinition
  | ConditionalExpr
  | VarDeclaration
  | LetForm
  | Fn SExprs?[args] {
        var callee = yy.Node('MemberExpression', $Fn,
            yy.Node('Identifier', 'call', yy.loc(@Fn)),
            false, yy.loc(@Fn));
        var args = getValueIfUndefined($args, []);
        args.unshift(yy.Node('Literal', null, yy.loc(@2)));   // value for "this"
        $$ = yy.Node('CallExpression', callee, args, yy.loc(@Fn));
    }
  | DO DoForm { $$ = wrapInIIFE($DoForm, @1, yy); }
  ;

SExpr
  : Atom { $$ = $Atom; }
  | CollectionLiteral { $$ = $CollectionLiteral; }
  | '(' List ')' { $$ = $List; }
  | AnonFnLiteral
  ;

SExprStmt
  : SExpr {
        if (expressionTypes.indexOf($SExpr.type) !== -1) {
            $$ = yy.Node('ExpressionStatement', $SExpr, $SExpr.loc);
        } else {
            $$ = $SExpr;
        }
    }
  ;

SExprPairs
  : { $$ = []; }
  | SExprPairs SExpr SExpr { $$ = $SExprPairs; $SExprPairs.push($2, $3); }
  ;

SExprs
  : SExpr { $$ = [$SExpr]; }
  | SExprs SExpr {
        yy.locComb(@$, @SExpr);
        $$ = $SExprs;
        $SExprs.push($SExpr);
    }
  ;

NonEmptyDoForm
    : SExprs {
        for (var i = 0; i < $SExprs.length; ++i) {
            var SExpr = $SExprs[i];
            if (expressionTypes.indexOf(SExpr.type) !== -1) {
                $SExprs[i] = yy.Node('ExpressionStatement', SExpr, SExpr.loc);
            }
        }
    }
  ;

DoForm
  : NonEmptyDoForm
  | {
        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, @1, yytext, yy);
        $$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    }
  ;

BlockStatement
  : DoForm {
        $$ = yy.Node('BlockStatement', $DoForm, yy.loc(@DoForm));
    }
  ;

BlockStatementWithReturn
  : BlockStatement {
        $$ = createReturnStatementIfPossible($BlockStatement);
    }
  ;

Program
  : NonEmptyDoForm {
        var prog = yy.Node('Program', $NonEmptyDoForm, yy.loc(@NonEmptyDoForm));
//        if (yy.tokens.length) prog.tokens = yy.tokens;
        if (yy.comments.length) prog.comments = yy.comments;
//        if (prog.loc) prog.range = rangeBlock($1);
        return prog;
    }
  | {
        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
        });
    //        prog.tokens = yy.tokens;
    //        prog.range = [0, 0];
        return prog;
    }
  ;

%%

var estraverse = require('estraverse');

var expressionTypes = ['Literal', 'Identifier', 'UnaryExpression', 'CallExpression', 'FunctionExpression',
    'ObjectExpression', 'NewExpression'];

// wrap the given array of statements in an IIFE (Immediately-Invoked Function Expression)
function wrapInIIFE(body, loc, yy) {
    yyloc = yy.loc(loc);
    return yy.Node('CallExpression',
        yy.Node('FunctionExpression',
            null, [], null,
            createReturnStatementIfPossible(yy.Node('BlockStatement', body, yyloc)),
            false, false, yyloc
        ), [], yyloc);
}

function createReturnStatementIfPossible(stmt) {
    if (stmt === undefined || stmt === null || ! stmt.type)
        return stmt;
    var lastStmts = [], lastStmt;
    if (stmt.type === 'BlockStatement') {
        lastStmts.push(stmt.body[stmt.body.length - 1]);
    } else if (stmt.type === 'IfStatement') {
        lastStmts.push(stmt.consequent);
        lastStmts.push(stmt.alternate);
    } else {
        return stmt;
    }
    for (var i = 0; i < lastStmts.length; ++i) {
        lastStmt = lastStmts[i];
        if (lastStmt === null) continue;
        if (lastStmt.type === 'ExpressionStatement') {
            lastStmt.type = 'ReturnStatement';
            lastStmt.argument = lastStmt.expression;
            delete lastStmt.expression;
        } else {
            createReturnStatementIfPossible(lastStmt);
        }
    }
    return stmt;
}

function parseNumLiteral(type, token, loc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), loc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yy.loc(loc));
    } else {
        node = parseLiteral(type, Number(token), loc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, rawloc, raw, yy) {
    var loc = yy.loc(rawloc);
    return yy.Node('Literal', value, loc, raw);
//    return yy.Node('NewExpression', yy.Node('Identifier', type, loc), [lit], loc);
}

function parseCollectionLiteral(type, items, rawloc, yy) {
    var loc = yy.loc(rawloc);
    var value = type === 'set' ? [yy.Node('ArrayExpression', items, loc)] : items;
    return yy.Node('CallExpression', yy.Node('Identifier', type, loc), value, loc);
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
