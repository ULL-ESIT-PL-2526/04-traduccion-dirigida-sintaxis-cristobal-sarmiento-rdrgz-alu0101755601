const parse = require("../src/parser.js").parse;

describe('Parentheses tests', () => {

  test('should evaluate parentheses changing precedence', () => {
    expect(parse("(2 + 3) * 4")).toBe(20);     // (2+3)*4
    expect(parse("2 * (3 + 5)")).toBe(16);     // 2*(3+5)
    expect(parse("(10 - 6) / 2")).toBe(2);     // (10-6)/2
  });

  test('should handle nested parentheses', () => {
    expect(parse("(2 + (3 * 4))")).toBe(14);   // 2 + (3*4)
    expect(parse("((1 + 2) * (3 + 4))")).toBe(21); // (1+2)*(3+4)
  });

  test('should handle parentheses with exponentiation', () => {
    expect(parse("(2 ** 3) ** 2")).toBe(64);   // (2^3)^2 = 8^2
    expect(parse("2 ** (3 ** 2)")).toBe(512);  // 2^(3^2) = 2^9
  });

  test('should handle parentheses with floats', () => {
    expect(parse("(2.5 + 2.5) * 2")).toBe(10); // (2.5+2.5)*2
    expect(parse("4.0 ** (1.0 / 2.0)")).toBe(2); // 4^(0.5)=2
  });

  test('should ignore whitespace inside parentheses', () => {
    expect(parse(" (  2 + 3 ) * 4 ")).toBe(20);
  });

});