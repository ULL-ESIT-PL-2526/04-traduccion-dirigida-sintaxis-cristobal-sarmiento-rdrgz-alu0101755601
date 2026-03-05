const parse = require('../src/index.js');

describe('Float precedence tests', () => {

  test('should handle addition and multiplication with floats', () => {
    expect(parse("2.5 + 3.0 * 2")).toBe(8.5);     // 2.5 + (3 * 2)
    expect(parse("1.5 + 2.5 * 2")).toBe(6.5);     // 1.5 + (2.5 * 2)
  });

  test('should handle division precedence with floats', () => {
    expect(parse("10.0 - 4.0 / 2")).toBe(8);      // 10 - (4 / 2)
    expect(parse("5.5 - 3.0 / 2")).toBe(4);       // 5.5 - 1.5
  });

  test('should handle multiplication and addition with floats', () => {
    expect(parse("2.5 * 2 + 3")).toBe(8);         // (2.5 * 2) + 3
    expect(parse("1.5 * 4 + 1")).toBe(7);         // (1.5 * 4) + 1
  });

  test('should handle exponentiation with floats', () => {
    expect(parse("2.0 ** 3")).toBe(8);
    expect(parse("4.0 ** 0.5")).toBe(2);
  });

  test('should handle exponentiation precedence with floats', () => {
    expect(parse("2.0 * 3.0 ** 2")).toBe(18);     // 2 * (3²)
    expect(parse("1.5 + 2.0 ** 3")).toBe(9.5);    // 1.5 + 8
  });

  test('should handle right associativity for exponentiation with floats', () => {
    expect(parse("2.0 ** 3.0 ** 2.0")).toBe(512); // 2 ** (3 ** 2)
  });

});