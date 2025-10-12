"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Node } from "@/lib/dijkstra"
import { Play, Trash2, Plus } from "lucide-react"

interface ControlsProps {
  nodes: Node[]
  selectedNode: string | null
  startNode: string | null
  endNode: string | null
  edgeWeight: number
  onSetEdgeWeight: (weight: number) => void
  onSetStartNode: (nodeId: string) => void
  onSetEndNode: (nodeId: string) => void
  onAddEdge: () => void
  onRunAlgorithm: () => void
  onClear: () => void
  canAddEdge: boolean
  pathDistance: number | null
}

export function Controls({
  nodes,
  selectedNode,
  startNode,
  endNode,
  edgeWeight,
  onSetEdgeWeight,
  onSetStartNode,
  onSetEndNode,
  onAddEdge,
  onRunAlgorithm,
  onClear,
  canAddEdge,
  pathDistance,
}: ControlsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Graph Controls</CardTitle>
          <CardDescription className="font-sans">
            Click on the canvas to add nodes. Select two nodes to create an edge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start-node" className="font-sans">
              Start Node
            </Label>
            <Select value={startNode || ""} onValueChange={onSetStartNode}>
              <SelectTrigger id="start-node">
                <SelectValue placeholder="Select start node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-node" className="font-sans">
              End Node
            </Label>
            <Select value={endNode || ""} onValueChange={onSetEndNode}>
              <SelectTrigger id="end-node">
                <SelectValue placeholder="Select end node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edge-weight" className="font-sans">
              Edge Weight
            </Label>
            <Input
              id="edge-weight"
              type="number"
              min="1"
              value={edgeWeight}
              onChange={(e) => onSetEdgeWeight(Number(e.target.value))}
            />
          </div>

          <Button onClick={onAddEdge} disabled={!canAddEdge} className="w-full font-sans" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Edge
          </Button>

          <Button onClick={onRunAlgorithm} disabled={!startNode || !endNode} className="w-full font-sans">
            <Play className="mr-2 h-4 w-4" />
            Find Shortest Path
          </Button>
          
          <Button onClick={onClear} variant="destructive" className="w-full font-sans">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Graph
          </Button>
          
          {pathDistance !== null && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm font-sans font-semibold text-accent-foreground">
                Shortest Distance: {pathDistance === Number.POSITIVE_INFINITY ? "No path found" : pathDistance}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-sans">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2 font-sans leading-relaxed">
          <p>1. Click on the canvas to add nodes</p>
          <p>2. Click on two nodes to select them</p>
          <p>3. Set edge weight and click "Add Edge"</p>
          <p>4. Select start and end nodes</p>
          <p>5. Click "Find Shortest Path"</p>
          <p>Note: To delete a node, select it and press Backspace."</p>
        </CardContent>
      </Card>
    </div>
  )
}
