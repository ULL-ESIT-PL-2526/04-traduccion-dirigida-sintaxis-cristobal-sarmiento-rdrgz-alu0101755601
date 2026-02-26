/* Lexer */
%lex
%%
\s+                                                 { /* skip whitespace */; }
"//"[^\n]*                                          { /* skip single-line comment */ }
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?                 { return 'NUMBER';       }
"**"            { return '**'; }
"+"             { return '+'; }
"-"             { return '-'; }
"*"             { return '*'; }
"/"             { return '/'; }          
<<EOF>>                                             { return 'EOF';          }
.                                                   { return 'INVALID';      }
/lex

/* Parser */
%start expressions
%token NUMBER

%left '+' '-'
%left '*' '/'
%right '**'

%%

expressions
    : expression EOF
        { return $1; }
    ;

expression
    : expression '+' expression   { $$ = $1 + $3; }
    | expression '-' expression   { $$ = $1 - $3; }
    | expression '*' expression   { $$ = $1 * $3; }
    | expression '/' expression   { $$ = $1 / $3; }
    | expression '**' expression  { $$ = Math.pow($1, $3); }
    | NUMBER                      { $$ = Number(yytext); }
    ;
