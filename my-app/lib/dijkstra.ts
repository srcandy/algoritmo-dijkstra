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
  steps: AlgorithmStep[]
}

export interface AlgorithmStep {
  stepNumber: number
  currentNode: string
  distances: Map<string, number>
  previous: Map<string, string | null>
  visited: Set<string>
  unvisited: Set<string>
}

export function dijkstra(nodes: Node[], edges: Edge[], startId: string, endId: string): PathResult | null {
  const distances = new Map<string, number>()
  const previous = new Map<string, string | null>()
  const unvisited = new Set<string>()
  const steps: AlgorithmStep[] = []

  nodes.forEach((node) => {
    distances.set(node.id, Number.POSITIVE_INFINITY)
    previous.set(node.id, null)
    unvisited.add(node.id)
  })

  distances.set(startId, 0)

  steps.push({
    stepNumber: 0,
    currentNode: startId,
    distances: new Map(distances),
    previous: new Map(previous),
    visited: new Set(),
    unvisited: new Set(unvisited),
  })

  const visited = new Set<string>()
  let stepNumber = 1

  while (unvisited.size > 0) {
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
    visited.add(currentId)

    if (currentId === endId) {
      steps.push({
        stepNumber: stepNumber++,
        currentNode: currentId,
        distances: new Map(distances),
        previous: new Map(previous),
        visited: new Set(visited),
        unvisited: new Set(unvisited),
      })
      break
    }

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

    steps.push({
      stepNumber: stepNumber++,
      currentNode: currentId,
      distances: new Map(distances),
      previous: new Map(previous),
      visited: new Set(visited),
      unvisited: new Set(unvisited),
    })
  }

  const path: string[] = []
  let current: string | null = endId

  while (current !== null) {
    path.unshift(current)
    current = previous.get(current) || null
  }

  if (path[0] !== startId) {
    return null
  }
  console.log("Final distances:", distances)
  return {
    path,
    distance: distances.get(endId)!,
    distances,
    previous,
    steps,
  }
}
