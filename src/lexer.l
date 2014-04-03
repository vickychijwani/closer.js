WHITESPACE      [\s]+
NUMBER          [0-9]+
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])+\"
IDENTIFIER      [0-9a-zA-Z*+!\-_=<>?/.:]+
COMMENT         \;[^\r\n]*

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

{COMMENT} %{ /* ignore */ %};
'&' return '&';
'(' return '(';
')' return ')';
'[' return '[';
']' return ']';

'def'   return 'DEF';
'fn'    return 'FN';
'defn'  return 'DEFN';
'if'    return 'IF';
'when'  return 'WHEN';
'do'    return 'DO';

'true'  return 'true';
'false' return 'false';
'nil'   return 'nil';

{IDENTIFIER} %{
    return 'IDENTIFIER';
%}
