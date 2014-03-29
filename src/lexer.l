WHITESPACE      [\s]+
NUMBER          [0-9]+
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])+\"
IDENTIFIER      [a-zA-Z]+


%options flex

%%

{WHITESPACE}  /* whitespace */;

{NUMBER} %{
    return 'NUMBER';
%}

{STRING} %{
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
