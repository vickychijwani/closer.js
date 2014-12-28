WHITESPACE      [\s,]+
INTEGER         [-+]?([1-9][0-9]+|[0-9])
FLOAT           [-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])*\"
IDENTIFIER      [a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*
COMMENT         \;[^\r\n]*
ANON_ARG        \%(\&|[1-9]|1[0-9]|20)?

%s regex fnpos

%options flex

%%

/* %options flex = match *longest* token instead of using the first matching rule */

{WHITESPACE}  /* whitespace */;
{COMMENT} %{ /* ignore */ %};

{INTEGER} %{
    this.begin('INITIAL');
    return 'INTEGER';
%}

{FLOAT} %{
    this.begin('INITIAL');
    return 'FLOAT';
%}

{STRING} %{
    this.begin('INITIAL');
    yytext = yytext.substr(1, yyleng-2);
    return 'STRING';
%}

{ANON_ARG} %{
    this.begin('INITIAL');
    return 'ANON_ARG';
%}

'&'             { this.begin('INITIAL'); return '&'; }
'('             { this.begin('fnpos'); return '('; }
')'             { this.begin('INITIAL'); return ')'; }
'['             { this.begin('INITIAL'); return '['; }
']'             { this.begin('INITIAL'); return ']'; }
'{'             { this.begin('INITIAL'); return '{'; }
'}'             { this.begin('INITIAL'); return '}'; }
'#'             { this.begin('INITIAL'); return 'SHARP'; }
'\''            { this.begin('INITIAL'); return 'QUOTE'; }
':'             { this.begin('INITIAL'); return 'COLON'; }
'.'             { this.begin('INITIAL'); return 'DOT'; }

/* these tokens are treated specially only when they are in function position */
<fnpos>'def'        { this.begin('INITIAL'); return 'DEF'; }
<fnpos>'fn'         { this.begin('INITIAL'); return 'FN'; }
<fnpos>'defn'       { this.begin('INITIAL'); return 'DEFN'; }
<fnpos>'if'         { this.begin('INITIAL'); return 'IF'; }
<fnpos>'if-not'     { this.begin('INITIAL'); return 'IF_NOT'; }
<fnpos>'when'       { this.begin('INITIAL'); return 'WHEN'; }
<fnpos>'when-not'   { this.begin('INITIAL'); return 'WHEN_NOT'; }
<fnpos>'do'         { this.begin('INITIAL'); return 'DO'; }
<fnpos>'let'        { this.begin('INITIAL'); return 'LET'; }
<fnpos>'loop'       { this.begin('INITIAL'); return 'LOOP'; }
<fnpos>'recur'      { this.begin('INITIAL'); return 'RECUR'; }
<fnpos>'and'        { this.begin('INITIAL'); return 'AND'; }
<fnpos>'or'         { this.begin('INITIAL'); return 'OR'; }
<fnpos>'set!'       { this.begin('INITIAL'); return 'SETVAL'; }
<fnpos>'dotimes'    { this.begin('INITIAL'); return 'DOTIMES'; }
<fnpos>'doseq'      { this.begin('INITIAL'); return 'DOSEQ'; }
<fnpos>'while'      { this.begin('INITIAL'); return 'WHILE'; }
<fnpos>'new'        { this.begin('INITIAL'); return 'NEW'; }

/* destructuring forms */
':as'           { this.begin('INITIAL'); return 'AS'; }
':keys'         { this.begin('INITIAL'); return 'KEYS'; }
':strs'         { this.begin('INITIAL'); return 'STRS'; }

/* language constants */
'true'          { this.begin('INITIAL'); return 'true'; }
'false'         { this.begin('INITIAL'); return 'false'; }
'nil'           { this.begin('INITIAL'); return 'nil'; }

{IDENTIFIER} %{
    this.begin('INITIAL');
    return 'IDENTIFIER';
%}

.       return 'ILLEGAL-TOKEN';
<<EOF>> %{ return 'END-OF-FILE'; %}
