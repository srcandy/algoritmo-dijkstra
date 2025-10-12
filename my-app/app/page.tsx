"use client"

import { useState } from "react"
import { GraphCanvas } from "@/components/graph-canvas"
import { Controls } from "@/components/controls"
import { AlgorithmSteps } from "@/components/algorithm-steps"
import { type Node, type Edge, type AlgorithmStep, dijkstra } from "@/lib/dijkstra"

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [previousSelectedNode, setPreviousSelectedNode] = useState<string | null>(null)
  const [startNode, setStartNode] = useState<string | null>(null)
  const [endNode, setEndNode] = useState<string | null>(null)
  const [edgeWeight, setEdgeWeight] = useState(1)
  const [shortestPath, setShortestPath] = useState<string[]>([])
  const [pathDistance, setPathDistance] = useState<number | null>(null)
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  const handleAddNode = (x: number, y: number) => {
    const newNode: Node = {
      id: `node-${nodes.length}`,
      x,
      y,
      label: String.fromCharCode(65 + nodes.length), // A, B, C, ...
    }
    setNodes([...nodes, newNode])
  }

  const handleSelectNode = (nodeId: string | null) => {
    if (nodeId === null) {
      setSelectedNode(null)
      setPreviousSelectedNode(null)
      return
    }

    if (selectedNode === null) {
      setSelectedNode(nodeId)
    } else if (selectedNode === nodeId) {
      setSelectedNode(null)
      setPreviousSelectedNode(null)
    } else {
      setPreviousSelectedNode(selectedNode)
      setSelectedNode(nodeId)
    }
  }

  const handleAddEdge = () => {
    if (selectedNode && previousSelectedNode) {
      // Check if edge already exists
      const edgeExists = edges.some(
        (edge) =>
          (edge.from === selectedNode && edge.to === previousSelectedNode) ||
          (edge.from === previousSelectedNode && edge.to === selectedNode),
      )

      if (!edgeExists) {
        const newEdge: Edge = {
          from: previousSelectedNode,
          to: selectedNode,
          weight: edgeWeight,
        }
        setEdges([...edges, newEdge])
      }

      setSelectedNode(null)
      setPreviousSelectedNode(null)
    }
  }

  const handleRunAlgorithm = () => {
    if (startNode && endNode) {
      const result = dijkstra(nodes, edges, startNode, endNode)
      if (result) {
        setShortestPath(result.path)
        setPathDistance(result.distance)
        setAlgorithmSteps(result.steps)
          setCurrentStepIndex(result.steps.length > 2 ? 2 : 1)
      } else {
        setShortestPath([])
        setPathDistance(Number.POSITIVE_INFINITY)
        setAlgorithmSteps([])
          setCurrentStepIndex(0)
      }
    }
  }

  const handleClear = () => {
  setNodes([])
  setEdges([])
  setSelectedNode(null)
  setPreviousSelectedNode(null)
  setStartNode(null)
  setEndNode(null)
  setShortestPath([])
  setPathDistance(null)
  setAlgorithmSteps([])
  setCurrentStepIndex(0)
  }

  const handleNextStep = () => {
    if (currentStepIndex < algorithmSteps.length) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 2) {
    setCurrentStepIndex(currentStepIndex - 1)
    }
  }
  const canAddEdge = selectedNode !== null && previousSelectedNode !== null

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId))
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId))
    if (selectedNode === nodeId) setSelectedNode(null)
    if (previousSelectedNode === nodeId) setPreviousSelectedNode(null)
    if (startNode === nodeId) setStartNode(null)
    if (endNode === nodeId) setEndNode(null)
    setShortestPath([])
    setPathDistance(null)
    setAlgorithmSteps([])
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-sans text-balance">Dijkstra's Algorithm Visualizer</h1>
          <p className="text-muted-foreground font-sans text-pretty">
            Interactive graph pathfinding with visual shortest path calculation
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          <div className="flex justify-center">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              onAddNode={handleAddNode}
              onSelectNode={handleSelectNode}
              onDeleteNode={handleDeleteNode}
              selectedNode={selectedNode}
              previousSelectedNode={previousSelectedNode}
              startNode={startNode}
              endNode={endNode}
              shortestPath={shortestPath}
            />
          </div>

          <Controls
            nodes={nodes}
            selectedNode={selectedNode}
            startNode={startNode}
            endNode={endNode}
            edgeWeight={edgeWeight}
            onSetEdgeWeight={setEdgeWeight}
            onSetStartNode={setStartNode}
            onSetEndNode={setEndNode}
            onAddEdge={handleAddEdge}
            onRunAlgorithm={handleRunAlgorithm}
            onClear={handleClear}
            canAddEdge={canAddEdge}
            pathDistance={pathDistance}
          />
        </div>

        <AlgorithmSteps
          steps={algorithmSteps}
          nodes={nodes}
          currentStepIndex={currentStepIndex}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
        />
      </div>
    </main>
  )
}
