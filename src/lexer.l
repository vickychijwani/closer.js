WHITESPACE      [\s]+
NUMBER          [0-9]+
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])+\"
IDENTIFIER      [0-9a-zA-Z*+!\-_?/.:]+


%%

{WHITESPACE}  /* whitespace */;

{NUMBER} %{
    return 'NUMBER';
%}

{STRING} %{
    yytext = yytext.substr(1, yyleng-2);
    return 'STRING';
%}

{IDENTIFIER} %{
    return 'IDENTIFIER';
%}

'(' return '(';
')' return ')';

//<<EOF>> %{
//    return 'EOF';
//%}
//
