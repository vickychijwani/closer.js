%start program

%%

atom
  : NUMBER { $$ = yy.Node('Literal', parseNum($1), yy.loc(@1), yytext); }
  | STRING { $$ = yy.Node('Literal', parseString($1), yy.loc(@1), yy.raw[yy.raw.length-1]); }
  | IDENTIFIER { $$ = yy.Node('Identifier', String($1), yy.loc(@1)); }
  | 'true' { $$ = yy.Node('Literal', true, yy.loc(@1), yytext); }
  | 'false' { $$ = yy.Node('Literal', false, yy.loc(@1), yytext); }
  | 'nil' { $$ = yy.Node('Literal', null, yy.loc(@1), yytext); }
  ;

list
  : { console.log("list: "); $$ = yy.Node('EmptyStatement', yy.loc(@1)); }
  | sexpr list { $$ = cons( $sexpr, $list ); }
  | sexpr '.' sexpr { $$ = cons( $sexpr1, $sexpr2 ); }
  ;

sexpr
  : atom { console.log("sexpr: atom"); $$ = yy.Node('ExpressionStatement', $atom, yy.loc(@$)); }
  | '(' list ')' { console.log("sexpr: (list)"); $$ = $list; }
  ;

sexprs
  : sexpr { console.log("sexprs: sexpr"); $$ = [$sexpr]; }
  | sexprs sexpr {
        console.log("sexprs: sexpr");
        yy.locComb(@$, @sexpr);
        $$ = $sexprs;
        $sexprs.push($sexpr);
    }
  ;

program
  : sexprs {
        var prog = yy.Node('Program', $sexprs, yy.loc(@sexprs));
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
        .replace(/\\(.)/g, "$1");
}
