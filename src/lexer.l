WHITESPACE      [\s,]+
INTEGER         [-+]?([1-9][0-9]+|[0-9])
FLOAT           [-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])*\"
IDENTIFIER      [a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*
COMMENT         \;[^\r\n]*
ANON_ARG        \%(\&|[1-9]|1[0-9]|20)?

%s regex

%options flex

%%

/* %options flex = match *longest* token instead of using the first matching rule */

{WHITESPACE}  /* whitespace */;

{INTEGER} %{
    return 'INTEGER';
%}

{FLOAT} %{
    return 'FLOAT';
%}

{STRING} %{
    yytext = yytext.substr(1, yyleng-2);
    return 'STRING';
%}

{ANON_ARG} %{
    return 'ANON_ARG';
%}

{COMMENT} %{ /* ignore */ %};
'&' return '&';
'(' return '(';
')' return ')';
'[' return '[';
']' return ']';
'{' return '{';
'}' return '}';
'#' return 'SHARP';
'\'' return 'QUOTE';
':' return 'COLON';
'.' return 'DOT';

'def'   return 'DEF';
'fn'    return 'FN';
'defn'  return 'DEFN';
'if'    return 'IF';
'when'  return 'WHEN';
'do'    return 'DO';
'let'   return 'LET';
'loop'  return 'LOOP';
'recur' return 'RECUR';
'and'   return 'AND';
'or'    return 'OR';
'dotimes' return 'DOTIMES';

':as'   return 'AS';
':keys' return 'KEYS';
':strs' return 'STRS';

'true'  return 'true';
'false' return 'false';
'nil'   return 'nil';

{IDENTIFIER} %{
    return 'IDENTIFIER';
%}

<<EOF>> %{ return 'END-OF-FILE'; %}