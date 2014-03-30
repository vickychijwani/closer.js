%start Program

%option flex

%%

Atom
  : NUMBER { $$ = yy.Node('Literal', parseNum($1), yy.loc(@1), yytext); }
  | STRING { $$ = yy.Node('Literal', parseString($1), yy.loc(@1), yy.raw[yy.raw.length-1]); }
  | IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  | 'true' { $$ = yy.Node('Literal', true, yy.loc(@1), yytext); }
  | 'false' { $$ = yy.Node('Literal', false, yy.loc(@1), yytext); }
  | 'nil' { $$ = yy.Node('Literal', null, yy.loc(@1), yytext); }
  ;

Fn
  : IDENTIFIER { console.log('Fn: IDENTIFIER'); $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  | '(' List ')' { console.log('Fn: (List)'); $$ = $List; }
  ;

List
  : { console.log('List: '); $$ = yy.Node('EmptyStatement', yy.loc(@1)); }
  | Fn SExprs { console.log('List: Fn SExprs'); $$ = yy.Node('CallExpression', $Fn, $SExprs, yy.loc(@Fn)); }
  ;

SExpr
  : Atom { console.log('SExpr: Atom'); $$ = $Atom; }
  | '(' List ')' { console.log('SExpr: (List)'); $$ = $List; }
  ;

SExprs
  : SExpr { console.log('SExprs: SExpr'); $$ = [$SExpr]; }
  | SExprs SExpr {
        console.log('SExprs: SExprs SExpr');
        yy.locComb(@$, @SExpr);
        $$ = $SExprs;
        $SExprs.push($SExpr);
    }
  ;

DoForm
  : SExprs {
        for (var i = 0; i < $SExprs.length; ++i) {
            var SExpr = $SExprs[i];
            if (SExpr.type === 'Literal' || SExpr.type === 'Identifier' || SExpr.type === 'CallExpression') {
                $SExprs[i] = yy.Node('ExpressionStatement', SExpr, SExpr.loc);
            }
        }
    }
  ;

Program
  : DoForm {
        var prog = yy.Node('Program', $DoForm, yy.loc(@DoForm));
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
