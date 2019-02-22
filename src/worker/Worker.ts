import {WorkerInitPayload} from "../Distributor";
import {SimpleArrayAddressMapping} from "../SimpleArrayAddressMapping"
import {Graph} from '../Graph'
import {Vertex, FormulaCellVertex, ValueCellVertex, RangeVertex, EmptyCellVertex, CellVertex} from '../Vertex'
import {SimpleCellAddress, CellValue} from '../Cell'
import {Ast} from '../parser/Ast'
import {RangeMapping} from "../RangeMapping";
import {MedianPlugin} from "../interpreter/plugin/MedianPlugin"
import {Interpreter} from "../interpreter/Interpreter";
import {Config} from "../Config";

const ctx: Worker = self as any;

let addressMapping: SimpleArrayAddressMapping,
    rangeMapping: RangeMapping,
    graph: Graph<Vertex>,
    nodes: Vertex[],
    interpreter: Interpreter,
    color: number,
    bc: BroadcastChannel

export interface WorkerInitializedPayload {
  type: "INITIALIZED"
}

export interface WorkerFinishedPayload {
  type: "FINISHED",
}

ctx.onmessage = (message) => {
  switch (message.data.type) {
    case "INIT":
      init(message.data)
      break
    case "START":
      console.log("start!!!")
      start()
      break
  }
}

function init(payload: WorkerInitPayload) {
  console.log("payload", payload)

  const startedAt = Date.now()
  // graph reconstruction
  graph = new Graph<Vertex>()
  rangeMapping = new RangeMapping()
  color = payload.color
  nodes = []
  let serializedNodes = payload.nodes as any[]

  bc = new BroadcastChannel("mybus")
  bc.onmessage = (e) => {
    // console.log(color, "Received message", e)
  }


  for (const node of serializedNodes) {
    let vertex;
    switch (node.kind) {
      case "formula": {
        vertex = new FormulaCellVertex(
            node.vertexId as number,
            node.formula as Ast,
            node.cellAddress as SimpleCellAddress,
            node.color
        )
        break
      }
      case "value": {
        vertex = new ValueCellVertex(
            node.vertexId as number,
            node.cellValue as CellValue,
            node.color
        )
        break
      }
      case "empty": {
        vertex = new EmptyCellVertex(node.vertexId, node.color)
        EmptyCellVertex.instance = vertex
        break
      }
      case "range": {
        // something should be done about restoring caches here
        // not sure whether Map copies correctly, it's just Object here
        vertex = new RangeVertex(
            node.vertexId as number,
            node.start as SimpleCellAddress,
            node.end as SimpleCellAddress,
            node.color
        )
        rangeMapping.setRange(vertex)
        break
      }
      default:
        throw new Error()
    }
    graph.addNode(vertex)
    nodes.push(vertex)
  }

  const numberOfEdges = payload.edges.length / 2
  for (let i = 0; i < numberOfEdges; i++) {
    graph.addEdgeByIds(payload.edges[i * 2], payload.edges[i * 2 + 1])
  }

  addressMapping = new SimpleArrayAddressMapping(
      payload.sheetWidth,
      payload.sheetHeight,
      graph,
      color,
      payload.addressMapping,
  )

  interpreter = new Interpreter(addressMapping, rangeMapping, graph, new Config())

  const response: WorkerInitializedPayload = {
    type: "INITIALIZED"
  }

  const finishedAt = Date.now()
  console.warn(`Initialization at Worker ${color} finished in ${finishedAt - startedAt}`)

  ctx.postMessage(response)
}

async function start() {
  bc.postMessage(`message from ${color}`)

  const startedAt = Date.now()

  for (const vertex of nodes) {
    if (vertex.color != color) {
      continue
    }
    if (vertex instanceof FormulaCellVertex) {
      const address = vertex.getAddress()
      const formula = vertex.getFormula()
      const cellValue = await interpreter.evaluateAst(formula, address)

      addressMapping.setCellValue(address, cellValue)
    } else if (vertex instanceof RangeVertex) {
      vertex.clear()
    }
  }
  const finishedAt = Date.now()
  console.warn(`Computing at Worker ${color} finished in ${finishedAt - startedAt}`)
  // console.warn(`Time spent at Worker ${color} on computing median: ${interpreter.timeSpentOnMedian}`)
  // console.warn(`Time spent at Worker ${color} on computing numeric list: ${MedianPlugin.timeSpentOnComputingList}`)
  // console.warn(`Time spent at Worker ${color} on AddressMapping.getCellValue: ${MedianPlugin.timeSpentOnGetCellValue}`)

  console.log(color, graph)
  ctx.postMessage({
    type: "FINISHED",
  })

  // Promise.all([
  //   addressMapping.getCellValue({ col: 0, row: 999 }),
  //   addressMapping.getCellValue({ col: 1, row: 999 }),
  //   addressMapping.getCellValue({ col: 2, row: 999 }),
  //   addressMapping.getCellValue({ col: 3, row: 999 }),
  //   addressMapping.getCellValue({ col: 4, row: 999 }),
  //   addressMapping.getCellValue({ col: 5, row: 999 }),
  // ]).then((results) => {
  //   console.warn(`Results: ${results}`)
  // })
}