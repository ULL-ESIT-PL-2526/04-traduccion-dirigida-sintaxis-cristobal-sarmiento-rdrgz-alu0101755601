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
