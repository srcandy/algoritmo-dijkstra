"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { Node, Edge } from "@/lib/dijkstra"
import { colors } from "./canvas_config"
import { label_style } from "./canvas_config"

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
      ctx.strokeStyle = isInPath ? colors.colorpath : colors.coloredge
      ctx.lineWidth = isInPath ? 4 : 2
      ctx.stroke()

      // Draw weight label
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2

      ctx.fillStyle = colors.edge
      ctx.fillRect(midX - 15, midY - 12, 30, 24)

      ctx.fillStyle = label_style.colorfont
      ctx.font = label_style.fontSize + "px " + label_style.fontFamily
      ctx.textAlign = label_style.textAlign
      ctx.textBaseline = label_style.textBaseline 
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
        ctx.fillStyle = colors.nodeStart
      } else if (isEnd) {
        ctx.fillStyle = colors.nodeEnd
      } else if (isInPath) {
        ctx.fillStyle = colors.edgeinpath
      } else {
        ctx.fillStyle = colors.node 
      }

      ctx.fill()

      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? colors.nodeSelected : colors.edge
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw label
      ctx.fillStyle = label_style.colorfont
      ctx.font = label_style.fontSize + "px " + label_style.fontFamily
      ctx.textAlign = label_style.textAlign
      ctx.textBaseline = label_style.textBaseline
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
      width={1200}
      height={800}
      style={{ width: 1200, height: 800, display: "block" }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      tabIndex={-1} // no se puede enfocar → no hace scroll
      className="border-2 border-border rounded-lg bg-card cursor-crosshair"
    />
  )
}
