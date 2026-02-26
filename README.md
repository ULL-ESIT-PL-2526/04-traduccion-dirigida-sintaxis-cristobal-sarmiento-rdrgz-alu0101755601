# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```

## Why is failing our calculator?

```js
> p.parse('4-2*3')
6
> 4-2*3
-2
> p.parse('2**3**2')
64
> 2**3**2
512
> p.parse('7-4/2')
1.5
> 7-4/2
5
```

1. What parse tree is being built for each of the above expressions?
2. In what order are the operations being evaluated?
3. Modify the Jison program so that mathematical operator precedences are respected.
4. In the [__tests__](__tests__/parser.test.js) folder there is a set of tests that can be run with the `npm test` command to verify that the parser behaves correctly. Fix the ones that fail and add additional tests to verify that all precedences and associativities of mathematical operators are respected.
5. Modify the grammar to support parentheses and add the corresponding tests. 


