import {absoluteCellAddress, absoluteColCellAddress, absoluteRowCellAddress, CellReferenceType, relativeCellAddress} from '../src/Cell'
import {
  AstNodeType,
  CellRangeAst,
  CellReferenceAst,
  ErrorAst,
  MinusOpAst,
  MinusUnaryOpAst,
  NumberAst,
  PlusOpAst,
  ProcedureAst,
  StringAst,
} from '../src/parser/Ast'
import {ParserWithCaching} from '../src/parser/ParserWithCaching'

const sharedExamples = (optimizationMode: string) => {
  it('integer literal', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=42', absoluteCellAddress(0, 0)).ast as NumberAst
    expect(ast.type).toBe(AstNodeType.NUMBER)
    expect(ast.value).toBe(42)
  })

  it('negative integer literal', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=-42', absoluteCellAddress(0, 0)).ast as MinusUnaryOpAst
    expect(ast.type).toBe(AstNodeType.MINUS_UNARY_OP)
    const value = ast.value as NumberAst
    expect(value.type).toBe(AstNodeType.NUMBER)
    expect(value.value).toBe(42)
  })

  it('string literal', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('="foobar"', absoluteCellAddress(0, 0)).ast as StringAst
    expect(ast.type).toBe(AstNodeType.STRING)
    expect(ast.value).toBe('foobar')
  })

  it('plus operator on different nodes', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=1+A5', absoluteCellAddress(0, 0)).ast as PlusOpAst
    expect(ast.type).toBe(AstNodeType.PLUS_OP)
    expect(ast.left.type).toBe(AstNodeType.NUMBER)
    expect(ast.right.type).toBe(AstNodeType.CELL_REFERENCE)
  })

  it('minus operator', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=1-3', absoluteCellAddress(0, 0)).ast as MinusOpAst
    expect(ast.type).toBe(AstNodeType.MINUS_OP)
    expect(ast.left.type).toBe(AstNodeType.NUMBER)
    expect(ast.right.type).toBe(AstNodeType.NUMBER)
  })

  it('absolute cell reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=$B$3', absoluteCellAddress(1, 1)).ast as CellReferenceAst

    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(absoluteCellAddress(1, 2))
  })

  it('relative cell reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=B3', absoluteCellAddress(1, 1)).ast as CellReferenceAst

    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(relativeCellAddress(0, 1))
  })

  it('absolute column cell reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=$B3', absoluteCellAddress(1, 1)).ast as CellReferenceAst

    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(absoluteColCellAddress(1, 1))
  })

  it('absolute row cell reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=B$3', absoluteCellAddress(1, 1)).ast as CellReferenceAst

    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(absoluteRowCellAddress(0, 2))
  })

  it('it use cache for similar formulas', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast1 = parser.parse('=A1', absoluteCellAddress(0, 0)).ast
    const ast2 = parser.parse('=A2', absoluteCellAddress(0, 1)).ast

    expect(ast1).toEqual(ast2)
    expect(parser.statsCacheUsed).toBe(1)
  })

  it("doesn't count cache for different formulas", () => {
    const parser = new ParserWithCaching(optimizationMode)

    const bast1 = parser.parse('=A1', absoluteCellAddress(0, 0)).ast
    const bast2 = parser.parse('=A2+A3', absoluteCellAddress(0, 0)).ast

    expect(parser.statsCacheUsed).toBe(0)
  })

  it('SUM function without args', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const ast = parser.parse('=SUM()', absoluteCellAddress(0, 0)).ast as ProcedureAst
    expect(ast.type).toBe(AstNodeType.FUNCTION_CALL)
    expect(ast.procedureName).toBe('SUM')
    expect(ast.args.length).toBe(0)
  })

  it('SUM function with args', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const ast = parser.parse('=SUM(1; A1)', absoluteCellAddress(0, 0)).ast as ProcedureAst
    expect(ast.type).toBe(AstNodeType.FUNCTION_CALL)
    expect(ast.procedureName).toBe('SUM')
    expect(ast.args[0].type).toBe(AstNodeType.NUMBER)
    expect(ast.args[1].type).toBe(AstNodeType.CELL_REFERENCE)
  })

  it('joining nodes without braces', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const ast = parser.parse('=1 + 2 + 3', absoluteCellAddress(0, 0)).ast as PlusOpAst
    expect(ast.type).toBe(AstNodeType.PLUS_OP)
    expect(ast.left.type).toBe(AstNodeType.PLUS_OP)
    expect(ast.right.type).toBe(AstNodeType.NUMBER)
  })

  it('joining nodes with braces', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const ast = parser.parse('=1 + (2 + 3)', absoluteCellAddress(0, 0)).ast as PlusOpAst
    expect(ast.type).toBe(AstNodeType.PLUS_OP)
    expect(ast.left.type).toBe(AstNodeType.NUMBER)
    expect(ast.right.type).toBe(AstNodeType.PLUS_OP)
  })

  it('float literal', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const ast = parser.parse('=3.14', absoluteCellAddress(0, 0)).ast as NumberAst
    expect(ast.type).toBe(AstNodeType.NUMBER)
    expect(ast.value).toBe(3.14)
  })

  it('leading zeros', () => {
    const parser = new ParserWithCaching(optimizationMode)
    const int = parser.parse('=01234', absoluteCellAddress(0, 0)).ast as NumberAst
    const float = parser.parse('=03.14', absoluteCellAddress(0, 0)).ast as NumberAst
    expect(int.type).toBe(AstNodeType.NUMBER)
    expect(int.value).toBe(1234)
    expect(float.type).toBe(AstNodeType.NUMBER)
    expect(float.value).toBe(3.14)
  })

  it('simple cell range', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=A1:B2', absoluteCellAddress(0, 0)).ast as CellRangeAst
    expect(ast.type).toBe(AstNodeType.CELL_RANGE)
  })

  it('parsing error - unexpected token', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=A', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.type).toBe(AstNodeType.ERROR)
    expect(ast.args[0].name).toBe('MismatchedTokenException')
    expect(ast.args[0].message).toMatch(/Expecting token/)
  })

  it('parsing error - unexpected token', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=SUM(A)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('MismatchedTokenException')
  })

  it('parsing error - not all input parsed', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=A1B1', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('NotAllInputParsedException')
  })

  it('OFFSET parsing into cell reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 0; 0; 0; 0)', absoluteCellAddress(0, 0)).ast as CellReferenceAst
    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(relativeCellAddress(1, 1))
  })

  it('OFFSET parsing into cell reference with row shift', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 1; 0; 0; 0)', absoluteCellAddress(0, 0)).ast as CellReferenceAst
    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(relativeCellAddress(1, 2))
  })

  it('OFFSET parsing into cell reference with column shift', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 0; 1; 0; 0)', absoluteCellAddress(0, 0)).ast as CellReferenceAst
    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(relativeCellAddress(2, 1))
  })

  it('OFFSET fourth and fifth argument is optional', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 2; 3)', absoluteCellAddress(0, 0)).ast as CellReferenceAst
    expect(ast.type).toBe(AstNodeType.CELL_REFERENCE)
    expect(ast.reference).toEqual(relativeCellAddress(4, 3))
  })

  it('OFFSET first argument need to be reference', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(42; 0; 0; 0; 0)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('StaticOffsetError')
    expect(ast.args[0].message).toBe('First argument to OFFSET is not a reference')
  })

  it('OFFSET second argument need to be static number', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; C3; 0; 0; 0)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('StaticOffsetError')
    expect(ast.args[0].message).toBe('Second argument to OFFSET is not a static number')
  })

  it('OFFSET third argument need to be static number', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 0; C3; 0; 0)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('StaticOffsetError')
    expect(ast.args[0].message).toBe('Third argument to OFFSET is not a static number')
  })

  it('OFFSET fourth argument need to be static number', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 0; 0; B3; 0)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('StaticOffsetError')
    expect(ast.args[0].message).toBe('Fourth argument to OFFSET is not a static number')
  })

  it('OFFSET fifth argument need to be static number', () => {
    const parser = new ParserWithCaching(optimizationMode)

    const ast = parser.parse('=OFFSET(B2; 0; 0; 0; B3)', absoluteCellAddress(0, 0)).ast as ErrorAst
    expect(ast.args[0].name).toBe('StaticOffsetError')
    expect(ast.args[0].message).toBe('Fifth argument to OFFSET is not a static number')
  })
}

describe('ParserWithCaching - parser optimizations', () => {
  sharedExamples('parser')
})
