import {Ast} from "./parser/Ast";
import {CellValue, SimpleCellAddress} from "./Cell";
import {ExpressionValue} from "./interpreter/Interpreter";

export abstract class Vertex {
}

export abstract class CellVertex extends Vertex {
  abstract getCellValue(): CellValue
}

export class FormulaCellVertex extends CellVertex {
  private cachedCellValue?: CellValue;
  private formula: Ast;
  private cellAddress: SimpleCellAddress;

  constructor(formula: Ast, cellAddress: SimpleCellAddress) {
    super()
    this.formula = formula;
    this.cellAddress = cellAddress;
  }

  getFormula() : Ast {
    return this.formula
  }

  getAddress() : SimpleCellAddress {
    return this.cellAddress
  }

  setCellValue(cellValue: CellValue) {
     this.cachedCellValue = cellValue
  }

  getCellValue() {
    if (this.cachedCellValue != null) {
      return this.cachedCellValue
    } else {
      throw Error("Value of the formula cell is not computed.")
    }
  }
}

export class ValueCellVertex extends CellVertex {
  private cellValue: CellValue;

  constructor(cellValue: CellValue) {
    super()
    this.cellValue = cellValue;
  }

  getCellValue() {
    return this.cellValue
  }

  setCellValue(cellValue: CellValue) {
    this.cellValue = cellValue
  }
}

export class EmptyCellVertex extends CellVertex {
  constructor() {
    super()
  }

  getCellValue() {
    return 0
  }
}

export class RangeVertex extends Vertex {
  private valueCache: Map<string, CellValue>

  constructor(private start: SimpleCellAddress, private end: SimpleCellAddress) {
    super()
    this.valueCache = new Map()
  }

  getRangeValue(functionName: string): CellValue | null{
    return this.valueCache.get(functionName) || null
  }

  setRangeValue(functionName: string, value: CellValue) {
    this.valueCache.set(functionName, value)
  }

  clear() {
    this.valueCache.clear()
  }

  getStart(): SimpleCellAddress {
    return this.start
  }

  getEnd(): SimpleCellAddress {
    return this.end
  }
}
