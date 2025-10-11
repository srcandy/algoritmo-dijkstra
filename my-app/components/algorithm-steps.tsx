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

  // Get node labels for display
  const getNodeLabel = (nodeId: string) => {
    return nodes.find((n) => n.id === nodeId)?.label || nodeId
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
                <TableHead className="font-sans">Step</TableHead>
                <TableHead className="font-sans">Current Node</TableHead>
                <TableHead className="font-sans">Distances</TableHead>
                <TableHead className="font-sans">Previous</TableHead>
                <TableHead className="font-sans">Visited</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step) => (
                <TableRow key={step.stepNumber}>
                  <TableCell className="font-mono font-semibold">{step.stepNumber}</TableCell>
                  <TableCell className="font-mono font-semibold text-primary">
                    {getNodeLabel(step.currentNode)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(step.distances.entries()).map(([nodeId, distance]) => (
                        <span key={nodeId} className="whitespace-nowrap">
                          {getNodeLabel(nodeId)}: {distance === Number.POSITIVE_INFINITY ? "∞" : distance}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(step.previous.entries())
                        .filter(([, prev]) => prev !== null)
                        .map(([nodeId, prev]) => (
                          <span key={nodeId} className="whitespace-nowrap">
                            {getNodeLabel(nodeId)} ← {getNodeLabel(prev!)}
                          </span>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {Array.from(step.visited)
                      .map((nodeId) => getNodeLabel(nodeId))
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
