"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { AlgorithmStep, Node } from "@/lib/dijkstra"

interface AlgorithmStepsProps {
  steps: AlgorithmStep[]
  nodes: Node[]
  currentStep: number
  onStepChange: (step: number) => void
}

export function AlgorithmSteps({ steps, nodes, currentStep, onStepChange }: AlgorithmStepsProps) {
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

  const canGoBack = currentStep > 0
  const canGoForward = currentStep < steps.length - 1
  const currentStepData = steps[currentStep]

  const getNodeLabel = (nodeId: string) => {
    return nodes.find((n) => n.id === nodeId)?.label || nodeId
  }

  const getCellContent = (nodeId: string) => {
    const distance = currentStepData.distances.get(nodeId)
    const previousNode = currentStepData.previous.get(nodeId)

    if (currentStepData.visited.has(nodeId) && currentStepData.currentNode !== nodeId) {
      return "✓"
    }

    if (distance === Number.POSITIVE_INFINITY) {
      return "∞"
    }

    const distanceStr = distance?.toString() || "0"
    const previousLabel = previousNode ? getNodeLabel(previousNode) : "-"
    return `${distanceStr} via ${previousLabel}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans flex justify-between items-center">
          <span>Algorithm Steps</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => canGoBack && onStepChange(currentStep - 1)}
              disabled={!canGoBack}
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button
              variant="outline"
              onClick={() => canGoForward && onStepChange(currentStep + 1)}
              disabled={!canGoForward}
              size="sm"
            >
              Next
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="font-sans">
          Current node: {getNodeLabel(currentStepData.currentNode)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node</TableHead>
              <TableHead>Distance & Path</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow 
                key={node.id}
                className={
                  node.id === currentStepData.currentNode
                    ? "bg-primary/10"
                    : currentStepData.visited.has(node.id)
                    ? "bg-muted"
                    : ""
                }
              >
                <TableCell>{getNodeLabel(node.id)}</TableCell>
                <TableCell>{getCellContent(node.id)}</TableCell>
                <TableCell>
                  {node.id === currentStepData.currentNode
                    ? "Current"
                    : currentStepData.visited.has(node.id)
                    ? "Visited"
                    : currentStepData.unvisited.has(node.id)
                    ? "Unvisited"
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}