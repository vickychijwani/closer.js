%start Program
%ebnf

%%

Identifier
  : IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  ;

Atom
  : INTEGER { $$ = parseNumLiteral('Integer', $1, @1, yy, yytext); }
  | FLOAT { $$ = parseNumLiteral('Float', $1, @1, yy, yytext); }
  | STRING { $$ = yy.Node('Literal', 'String', parseString($1), yy.loc(@1), yy.raw[yy.raw.length-1]); }
  | 'true' { $$ = yy.Node('Literal', 'Boolean', true, yy.loc(@1), yytext); }
  | 'false' { $$ = yy.Node('Literal', 'Boolean', false, yy.loc(@1), yytext); }
  | 'nil' { $$ = yy.Node('Literal', 'Nil', null, yy.loc(@1), yytext); }
  | Identifier
  ;

IdentifierList
  : { $$ = []; }
  | IdentifierList Identifier {
        yy.locComb(@$, @Identifier);
        $$ = $IdentifierList;
        $IdentifierList.push($Identifier);
    }
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
        var binding = yy.Node('VariableDeclaration', 'let', [$LetBinding], yy.loc(@LetBinding));
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
  | Fn SExprs?[args] {
        $$ = yy.Node('CallExpression', $Fn, getValueIfUndefined($args, []), yy.loc(@Fn));
    }
  | DO DoForm {
        $$ = yy.Node('BlockStatement', $DoForm, yy.loc(@1));
    }
  ;

SExpr
  : Atom { $$ = $Atom; }
  | '(' List ')' { $$ = $List; }
  ;

SExprStmt
  : SExpr {
        if (ExpressionTypes.indexOf($SExpr.type) !== -1) {
            $$ = yy.Node('ExpressionStatement', $SExpr, $SExpr.loc);
        } else {
            $$ = $SExpr;
        }
    }
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
            if (ExpressionTypes.indexOf(SExpr.type) !== -1) {
                $SExprs[i] = yy.Node('ExpressionStatement', SExpr, SExpr.loc);
            }
        }
    }
  ;

DoForm
  : NonEmptyDoForm
  | {
        // do forms evaluate to nil if the body is empty
        nilNode = yy.Node('Literal', 'Nil', null, yy.loc(@1), yytext);
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

var ExpressionTypes = ['Literal', 'Identifier', 'UnaryExpression', 'CallExpression', 'FunctionExpression',
    'ObjectExpression'];

function parseNumLiteral(type, token, loc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = yy.Node('Literal', type, -parseNum(token), yy.loc(loc), yytext);
        var literal = node.properties[1].value
        node.properties[1].value = yy.Node('UnaryExpression', '-', literal, true, yy.loc(loc));
    } else {
        node = yy.Node('Literal', type, parseNum(token), yy.loc(loc), yytext);
    }
    return node;
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
