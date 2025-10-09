export interface Node {
  id: string
  x: number
  y: number
  label: string
}

export interface Edge {
  from: string
  to: string
  weight: number
}

export interface PathResult {
  path: string[]
  distance: number
  distances: Map<string, number>
  previous: Map<string, string | null>
}

export function dijkstra(nodes: Node[], edges: Edge[], startId: string, endId: string): PathResult | null {
  const distances = new Map<string, number>()
  const previous = new Map<string, string | null>()
  const unvisited = new Set<string>()

  // Initialize distances
  nodes.forEach((node) => {
    distances.set(node.id, Number.POSITIVE_INFINITY)
    previous.set(node.id, null)
    unvisited.add(node.id)
  })

  distances.set(startId, 0)

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentId: string | null = null
    let minDistance = Number.POSITIVE_INFINITY

    unvisited.forEach((nodeId) => {
      const dist = distances.get(nodeId)!
      if (dist < minDistance) {
        minDistance = dist
        currentId = nodeId
      }
    })

    if (currentId === null || minDistance === Number.POSITIVE_INFINITY) {
      break
    }

    unvisited.delete(currentId)

    // If we reached the end node, we can stop
    if (currentId === endId) {
      break
    }

    // Update distances to neighbors
    const currentDistance = distances.get(currentId)!

    edges.forEach((edge) => {
      let neighborId: string | null = null

      if (edge.from === currentId) {
        neighborId = edge.to
      } else if (edge.to === currentId) {
        neighborId = edge.from
      }

      if (neighborId && unvisited.has(neighborId)) {
        const newDistance = currentDistance + edge.weight
        const oldDistance = distances.get(neighborId)!

        if (newDistance < oldDistance) {
          distances.set(neighborId, newDistance)
          previous.set(neighborId, currentId)
        }
      }
    })
  }

  // Reconstruct path
  const path: string[] = []
  let current: string | null = endId

  while (current !== null) {
    path.unshift(current)
    current = previous.get(current) || null
  }

  // Check if path is valid
  if (path[0] !== startId) {
    return null
  }

  return {
    path,
    distance: distances.get(endId)!,
    distances,
    previous,
  }
}
