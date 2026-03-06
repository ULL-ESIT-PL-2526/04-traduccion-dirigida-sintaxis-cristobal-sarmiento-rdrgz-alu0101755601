/* Lexer */
%lex
%%
\s+                                                 { /* skip whitespace */; }
"//"[^\n]*                                          { /* skip single-line comment */ }
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?                 { return 'NUMBER';       }

"!"                                 { return 'FACT';  }
"**"                                { return 'OPOW'; }
[-+]                                { return 'OPAD'; }
[*/]                                { return 'OPMU'; }

"("                                 { return 'LPAREN'; }
")"                                 { return 'RPAREN'; }

<<EOF>>                                             { return 'EOF';          }
.                                                   { return 'INVALID';      }
/lex

/* Parser */
%start expressions
%token NUMBER
%token OPAD OPMU OPOW
%token FACT
%token LPAREN RPAREN

%%

expressions
    : expression EOF
        { return $expression; }
    ;

expression
    : expression OPAD term
        { $$ = operate($OPAD, $expression, $term); }
    | term
        { $$ = $term; }
    ;

term
    : term OPMU power
        { $$ = operate($OPMU, $term, $power); }
    | power
        { $$ = $power; }
    ;

power
    : factor OPOW power
        { $$ = operate($OPOW, $factor, $power); }  /* asociatividad derecha */
    | factor
        { $$ = $factor; }
    ;

factor
    : NUMBER
        { $$ = Number(yytext); }
    | LPAREN expression RPAREN
        { $$ = $expression; }
    | factor FACT
        { $$ = factorial($factor); }
    ;

%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}

function factorial(factor) {
    if (factor < 0) throw new Error('Factorial of negative number');
    if (!Number.isInteger(factor)) throw new Error('Factorial only for integers.');

    let result = 1;
    for (let i = 2; i <= factor; ++i) {
        result *= i;
    }
    return result;
}