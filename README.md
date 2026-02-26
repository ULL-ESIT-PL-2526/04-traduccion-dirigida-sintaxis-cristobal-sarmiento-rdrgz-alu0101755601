# Práctica de Laboratorio #4
Procesadores de Lenguajes — Curso 2025/2026
Grado en Ingeniería Informática

---

## 1. Descripción

En esta práctica se parte de la siguiente gramática independiente del contexto para representar expresiones aritméticas:

    L → E
    E → E op T | T
    T → number

Se implementa una calculadora utilizando **Jison** junto con una **Definición Dirigida por la Sintaxis (SDD)** que permite calcular el valor de la expresión reconocida.

Además, se realizan las siguientes modificaciones al analizador léxico:

- Ignorar comentarios de una línea que comienzan por `//`
- Reconocer números en punto flotante
- Reconocer números en notación científica (`e` y `E`)
- Añadir pruebas automáticas con Jest

---

## 2. Estructura del proyecto

    .
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── src
    │   ├── grammar.jison
    │   ├── index.js
    │   └── parser.js        (generado con Jison)
    └── __tests__
        └── parser.test.js

---

## 3. Instalación y ejecución

### 3.1 Instalar dependencias

Desde la raíz del proyecto:

    npm install

### 3.2 Generar el parser

Cada vez que se modifique `src/grammar.jison`:

    npx jison src/grammar.jison -o src/parser.js

### 3.3 Ejecutar las pruebas

    npm test

---

## 4. Parte Teórica 

### 3.1 Diferencia entre `/* skip whitespace */` y devolver un token

Cuando el lexer encuentra una regla como:

    \s+ { /* skip whitespace */; }

consume los caracteres (espacios, tabuladores, saltos de línea) pero **no devuelve ningún token al parser**.  
Estos caracteres se ignoran y no participan en el análisis sintáctico.

En cambio, cuando una regla devuelve un token:

    return 'TOKEN';

el parser recibe ese símbolo y lo utiliza para aplicar producciones de la gramática.

---

### 3.2 Secuencia exacta de tokens para la entrada `123**45+@`

Dado el lexer del enunciado:

- `123` → `NUMBER`
- `**` → `OP`
- `45` → `NUMBER`
- `+` → `OP`
- `@` → `INVALID`
- fin de entrada → `EOF`

Secuencia exacta:

    NUMBER OP NUMBER OP INVALID EOF

---

### 3.3 Por qué `**` debe aparecer antes que `[-+*/]`

El lexer aplica las reglas en el orden en que están definidas.  
Si `[-+*/]` apareciera antes que `"**"`, la entrada `**` se dividiría en dos coincidencias `*` y `*`, generando dos tokens `OP` en lugar de uno solo.

Por ello, las reglas más específicas deben colocarse antes que las más generales.

---

### 3.4 Cuándo se devuelve `EOF`

El token `EOF` se devuelve cuando se alcanza el final de la entrada, es decir, cuando no quedan más caracteres por analizar.  
Permite al parser saber que la expresión ha terminado correctamente.

---

### 3.5 Por qué existe la regla `.` que devuelve `INVALID`

La regla `.` coincide con cualquier carácter no reconocido por reglas anteriores.  
Sirve para detectar símbolos inválidos y generar un error controlado, evitando bloqueos del lexer y facilitando diagnósticos.

---

## 4. Modificaciones realizadas en el lexer (`src/grammar.jison`)

### 4.1 Ignorar comentarios de una línea `// ...`

Se añadió una regla al bloque `%lex` para consumir comentarios de una línea que empiezan por `//` hasta el fin de línea y no devolver tokens.

Regla añadida (una forma válida):

    "//"[^\n]*   { /* skip single-line comment */ }

(Alternativa equivalente):

    "//".*     { /* skip single-line comment */ }

---

### 4.2 Reconocer números flotantes y notación científica

Se modificó la regla `NUMBER` para aceptar:

- Enteros: `23`
- Flotantes: `2.35`
- Notación científica: `2.35e-3`, `2.35e+3`, `2.35E-3`

Expresión regular utilizada:

    [0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?

Interpretación:

- Parte entera obligatoria: `[0-9]+`
- Parte decimal opcional: `(\.[0-9]+)?`
- Exponente opcional: `([eE][+-]?[0-9]+)?`

---

## 5. Pruebas añadidas (`__tests__/parser.test.js`)

Se añadieron pruebas Jest para verificar:

- Que los comentarios `//` se ignoran correctamente
- Que se reconocen enteros
- Que se reconocen flotantes
- Que se reconoce notación científica con `e/E`
- (Opcional) Si el proyecto implementa potencia con `**`, comprobar que `2**3 = 8`

Ejemplos de casos:

- `2+3 // comentario` → `5`
- `2.5+2.5` → `5`
- `2.35e-3` → `0.00235`
- `23` → `23`


## 6. Precedencia y asociatividad de operadores (arreglo implementado)

### 6.1 Problema detectado

En la versión inicial del parser todos los operadores se trataban como un único token genérico (OP).
Eso provocaba que las expresiones se evaluaran estrictamente de izquierda a derecha, sin respetar el orden matemático estándar.

Ejemplo del problema:

- Entrada: 2 + 3 * 4
- Evaluación incorrecta: (2 + 3) * 4 = 20
- Resultado correcto esperado: 2 + (3 * 4) = 14

También ocurría con la potencia:

- Entrada: 2 ** 3 ** 2
- Evaluación incorrecta izquierda a derecha: (2 ** 3) ** 2 = 64
- Resultado correcto: 2 ** (3 ** 2) = 512

---

### 6.2 Solución aplicada

Para solucionar el problema se realizaron dos cambios fundamentales:

1) El lexer ahora devuelve cada operador como token literal ('+', '-', '*', '/', '**') en lugar de un token genérico OP.
2) Se añadieron declaraciones de precedencia y asociatividad en el parser usando %left y %right.

---

### 6.3 Cambios en el lexer

Antes se devolvía algo como:

    return 'OP';

Ahora cada operador devuelve su propio token:

    "**"   { return '**'; }
    "+"    { return '+'; }
    "-"    { return '-'; }
    "*"    { return '*'; }
    "/"    { return '/'; }

Esto permite que el parser distinga correctamente cada operador y pueda aplicar precedencia.

---

### 6.4 Declaración de precedencia y asociatividad

Antes de las reglas del parser (antes de %%), se añadieron las siguientes declaraciones:

    %left '+' '-'
    %left '*' '/'
    %right '**'

Significado:

- Suma y resta tienen menor precedencia y son asociativas a la izquierda.
- Multiplicación y división tienen mayor precedencia que suma y resta, y son asociativas a la izquierda.
- La potencia tiene la mayor precedencia y es asociativa a la derecha.

La asociatividad derecha es necesaria para que:

    2 ** 3 ** 2

se interprete como:

    2 ** (3 ** 2)

y no como:

    (2 ** 3) ** 2

---

### 6.5 Reglas del parser con precedencia

Las producciones quedaron definidas de la siguiente forma:

    expression
      : expression '+' expression    { $$ = $1 + $3; }
      | expression '-' expression    { $$ = $1 - $3; }
      | expression '*' expression    { $$ = $1 * $3; }
      | expression '/' expression    { $$ = $1 / $3; }
      | expression '**' expression   { $$ = Math.pow($1, $3); }
      | NUMBER                       { $$ = Number(yytext); }
      ;

Gracias a las declaraciones %left y %right, Jison resuelve automáticamente los conflictos aplicando el orden correcto.

---

### 6.6 Ejemplos verificados

Con esta implementación el parser evalúa correctamente:

- 2 + 3 * 4 = 14
- 10 - 6 / 2 = 7
- 2 + 3 ** 2 = 11
- 2 * 3 ** 2 = 18
- 2 ** 3 ** 2 = 512
- 1 + 2 * 3 - 4 = 3

---

### 6.7 Conclusión

El orden correcto de evaluación se logró mediante:

- Devolver tokens específicos por operador desde el lexer.
- Declarar precedencia y asociatividad en el parser.
- Definir reglas explícitas por operador.

De esta forma el analizador sintáctico respeta el orden matemático estándar y supera los tests de precedencia y asociatividad.
