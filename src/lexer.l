WHITESPACE      [\s]+
NUMBER          [0-9]+
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])+\"
IDENTIFIER      [0-9a-zA-Z*+!\-_?/.:]+

%options flex

%%

{WHITESPACE}  /* whitespace */;

{NUMBER} %{
    return 'NUMBER';
%}

{STRING} %{
    yytext = yytext.substr(1, yyleng-2);
    return 'STRING';
%}

'(' return '(';
')' return ')';
'[' return '[';
']' return ']';

'fn'    return 'FN';
'defn'  return 'DEFN';

'true'  return 'true';
'false' return 'false';
'nil'   return 'nil';

{IDENTIFIER} %{
    return 'IDENTIFIER';
%}
