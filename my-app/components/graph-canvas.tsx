"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { Node, Edge } from "@/lib/dijkstra"

interface GraphCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onAddNode: (x: number, y: number) => void
  onSelectNode: (nodeId: string | null) => void
  selectedNode: string | null
  startNode: string | null
  endNode: string | null
  shortestPath: string[]
}

export function GraphCanvas({
  nodes,
  edges,
  onAddNode,
  onSelectNode,
  selectedNode,
  startNode,
  endNode,
  shortestPath,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (!fromNode || !toNode) return

      const isInPath =
        shortestPath.length > 0 &&
        shortestPath.includes(edge.from) &&
        shortestPath.includes(edge.to) &&
        Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1

      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.strokeStyle = isInPath ? "var(--color-path)" : "var(--color-edge)"
      ctx.lineWidth = isInPath ? 4 : 2
      ctx.stroke()

      // Draw weight label
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2

      ctx.fillStyle = "var(--color-background)"
      ctx.fillRect(midX - 15, midY - 12, 30, 24)

      ctx.fillStyle = "var(--color-foreground)"
      ctx.font = "14px var(--font-mono)"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(edge.weight.toString(), midX, midY)
    })

    // Draw nodes
    nodes.forEach((node) => {
      const isStart = node.id === startNode
      const isEnd = node.id === endNode
      const isSelected = node.id === selectedNode
      const isHovered = node.id === hoveredNode
      const isInPath = shortestPath.includes(node.id)

      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI)

      if (isStart) {
        ctx.fillStyle = "var(--color-accent)"
      } else if (isEnd) {
        ctx.fillStyle = "var(--color-primary)"
      } else if (isInPath) {
        ctx.fillStyle = "var(--color-node-selected)"
      } else {
        ctx.fillStyle = "var(--color-node)"
      }

      ctx.fill()

      if (isSelected || isHovered) {
        ctx.strokeStyle = "var(--color-foreground)"
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw label
      ctx.fillStyle = "var(--color-foreground)"
      ctx.font = "bold 16px var(--font-sans)"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.label, node.x, node.y)
    })
  }, [nodes, edges, selectedNode, hoveredNode, startNode, endNode, shortestPath])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on existing node
    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      return distance <= 25
    })

    if (clickedNode) {
      onSelectNode(clickedNode.id)
    } else {
      // Add new node
      onAddNode(x, y)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredNode = nodes.find((node) => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      return distance <= 25
    })

    setHoveredNode(hoveredNode ? hoveredNode.id : null)
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      className="border-2 border-border rounded-lg bg-card cursor-crosshair"
    />
  )
}
