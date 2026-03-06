const parse = require("../src/parser.js").parse;

describe('Fall tests', () => {

  test('should fail with wmpty input', () => {
    expect(parse("").toThrow());
  })

  test('should fail', () => {
    expect(parse("( ) ")).toThrow();    
    expect(parse("(*) ")).toThrow();
    expect(parse("(2 + ) ")).toThrow();  
  });

  test('should fail operand', () => {
    expect(parse(" 2 ++ 3 ")).toThrow();  
    expect(parse(" 4 // 2 ")).toThrow();  
    expect(parse(" 5 *** 4 ")).toThrow();  
  });

  test('should fail operators', () => {
    expect(parse(" + 2")).toThrow(); 
    expect(parse(" * 3 ")).toThrow();  
    expect(parse(" ** 2 ")).toThrow();  
  });

});
