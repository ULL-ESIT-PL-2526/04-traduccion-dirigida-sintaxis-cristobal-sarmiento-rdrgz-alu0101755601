const parse = require("../src/parser.js").parse;

describe('Float precedence tests', () => {

  test('should handle addition and multiplication with floats', () => {
    expect(parse("5!")).toBe(120);
    expect(parse("3! + 2")).toBe(8);
    expect(parse("(3 + 2)!")).toBe(120);
    expect(parse("4! / 2")).toBe(12);
    expect(parse("2 ** 3!")).toBe(64);
  });
});