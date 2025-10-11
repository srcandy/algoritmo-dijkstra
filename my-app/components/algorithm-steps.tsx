"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AlgorithmStep, Node } from "@/lib/dijkstra"

interface AlgorithmStepsProps {
  steps: AlgorithmStep[]
  nodes: Node[]
}

export function AlgorithmSteps({ steps, nodes }: AlgorithmStepsProps) {
  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Algorithm Steps</CardTitle>
          <CardDescription className="font-sans">Run the algorithm to see step-by-step execution</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 font-sans">
            No steps to display. Set start and end nodes, then click "Find Shortest Path".
          </p>
        </CardContent>
      </Card>
    )
  }

  const getNodeLabel = (nodeId: string) => {
    return nodes.find((n) => n.id === nodeId)?.label || nodeId
  }

  const getCellContent = (step: AlgorithmStep, nodeId: string) => {
  const distance = step.distances.get(nodeId)
  const previousNode = step.previous.get(nodeId)

  // Si el nodo ya fue visitado y no es el nodo actual, mostrar "*"
  if (step.visited.has(nodeId) && step.currentNode !== nodeId) {
    return "*"
  }

  // Si la distancia es infinito, el nodo no ha sido alcanzado aún
  if (distance === Number.POSITIVE_INFINITY) {
    return "No access"
  }

  // Mostrar distancia y nodo previo
  const distanceStr = distance?.toString() || "0"
  const previousLabel = previousNode ? getNodeLabel(previousNode) : "-"

  return `${distanceStr}, ${previousLabel}`
}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Algorithm Steps</CardTitle>
        <CardDescription className="font-sans">Step-by-step execution of Dijkstra's algorithm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-sans font-semibold">Node</TableHead>
                {steps.slice(1).map((step) => (
                  <TableHead key={step.stepNumber} className="font-sans font-semibold text-center">
                    Step {step.stepNumber}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-mono font-semibold">{node.label}</TableCell>
                  {steps.slice(1).map((step) => {
                    const isCurrentNode = step.currentNode === node.id
                    const cellContent = getCellContent(step, node.id)

                    return (
                      <TableCell
                        key={step.stepNumber}
                        className={`font-mono text-sm text-center ${isCurrentNode ? "bg-primary/20 font-bold" : ""}`}
                      >
                        {cellContent}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
