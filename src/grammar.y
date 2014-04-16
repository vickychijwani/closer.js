%start Program
%ebnf

%%

Identifier
  : IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
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
  | COLON IDENTIFIER { $$ = parseLiteral('Keyword', String($2), yy.loc(@2), yytext, yy); }
  | Identifier
  ;

CollectionLiteral
  : '[' SExprs?[items] ']' { $$ = parseCollectionLiteral('Vector', getValueIfUndefined($items, []), @items, yy); }
  | QUOTE '(' SExprs?[items] ')' { $$ = parseCollectionLiteral('List', getValueIfUndefined($items, []), @items, yy); }
  | '{' SExprPairs[items] '}' { $$ = parseCollectionLiteral('HashMap', getValueIfUndefined($items, []), @items, yy); }
  | SHARP '{' SExprs?[items] '}' { $$ = parseCollectionLiteral('HashSet', getValueIfUndefined($items, []), @items, yy); }
  ;

RestArgs
  : '&' Identifier { $$ = $Identifier; }
  | { $$ = null; }
  ;

Fn
  : IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  | '(' List ')' { $$ = $List; }
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
        // TODO let bindings are supposed to be local!
        var binding = yy.Node('VariableDeclaration', 'var', [$LetBinding], yy.loc(@LetBinding));
        $LetBindings.push(binding);
    }
  | { $$ = []; }
  ;

LetForm
  : LET '[' LetBindings ']' DoForm {
        var body = [].concat($LetBindings).concat($DoForm);
        $$ = yy.Node('BlockStatement', body, yy.loc(@1));
    }
  ;

List
  : { $$ = yy.Node('EmptyStatement', yy.loc(@1)); }
  | FnDefinition
  | ConditionalExpr
  | VarDeclaration
  | LetForm
  | Fn SExprs?[args] { $$ = yy.Node('CallExpression', $Fn, getValueIfUndefined($args, []), yy.loc(@Fn)); }
  | DO DoForm { $$ = yy.Node('BlockStatement', $DoForm, yy.loc(@1)); }
  ;

SExpr
  : Atom { $$ = $Atom; }
  | CollectionLiteral { $$ = $CollectionLiteral; }
  | '(' List ')' { $$ = $List; }
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
        var lastSExpr = $BlockStatement.body[$BlockStatement.body.length-1];
        lastSExpr.type = 'ReturnStatement';
        lastSExpr.argument = lastSExpr.expression;
        delete lastSExpr.expression;
        $$ = $BlockStatement;
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

var expressionTypes = ['Literal', 'Identifier', 'UnaryExpression', 'CallExpression', 'FunctionExpression',
    'ObjectExpression', 'NewExpression'];

function parseNumLiteral(type, token, loc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -parseNum(token), loc, yytext, yy);
        node.arguments[0] = yy.Node('UnaryExpression', '-', node.arguments[0], true, yy.loc(loc));
    } else {
        node = parseLiteral(type, parseNum(token), loc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, loc, raw, yy) {
    return parseLiteralCommon(type, yy.Node('Literal', value, loc, raw), loc, yy);
}

function parseCollectionLiteral(type, items, loc, yy) {
    return parseLiteralCommon(type, yy.Node('ArrayExpression', items, loc), loc, yy);
}

function parseLiteralCommon(type, value, loc, yy) {
    loc = yy.loc(loc);
    return yy.Node('NewExpression', yy.Node('Identifier', type, loc), [value], loc);
}

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
