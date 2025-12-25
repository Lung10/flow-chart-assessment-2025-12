import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FlowNode, VueFlowNode, VueFlowEdge } from '@/types'

export const useFlowChartStore = defineStore('flowChart', () => {
  // State
  const nodes = ref<FlowNode[]>([])
  const nodePositions = ref<Map<string, { x: number; y: number }>>(new Map())
  const selectedNodeId = ref<string | null>(null)
  const isDrawerOpen = ref<boolean>(false)

  // Getters for the selected node and the vue flow nodes and edges
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null
    return nodes.value.find((node) => String(node.id) === selectedNodeId.value) || null
  })

  // Convert raw nodes to Vue Flow format
  const vueFlowNodes = computed<VueFlowNode[]>(() => {
    return nodes.value.map((node, index) => {
      const nodeId = String(node.id)
      // Use stored position if available, otherwise calculate initial position
      const position = nodePositions.value.get(nodeId) ?? calculateNodePosition(node, index)

      // Store position if not already stored (for new nodes)
      if (!nodePositions.value.has(nodeId)) {
        nodePositions.value.set(nodeId, position)
      }

      return {
        id: nodeId,
        type: node.type,
        position,
        data: node,
      }
    })
  })

  // Generate edges from parent-child relationships
  const vueFlowEdges = computed<VueFlowEdge[]>(() => {
    const edges: VueFlowEdge[] = []

    nodes.value.forEach((node) => {
      if (node.parentId !== -1 && node.parentId !== null) {
        // if the node has a parent
        const edge: VueFlowEdge = {
          // create an edge object with the parent id and the node id
          id: `e-${node.parentId}-${node.id}`, // the edge id
          source: String(node.parentId), // the parent id
          target: String(node.id), // the node id
        }

        // If this is a dateTimeConnector node, connect from the correct handle on the parent
        if (node.type === 'dateTimeConnector') {
          const connectorData = node.data as { connectorType: 'success' | 'failure' }
          edge.sourceHandle = connectorData.connectorType // 'success' or 'failure'
        }

        edges.push(edge) // add the edge to the edges array
      }
    })

    return edges
  })

  // Actions
  // Set the nodes in the store
  function setNodes(newNodes: FlowNode[]) {
    // Create a mutable copy - Vue Query returns readonly arrays
    nodes.value = [...newNodes]
  }

  // Select a node and open the drawer
  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
    isDrawerOpen.value = nodeId !== null
  }

  // Close the drawer
  function closeDrawer() {
    isDrawerOpen.value = false
    selectedNodeId.value = null
  }

  // Update a node in the store
  function updateNode(nodeId: string, updates: Partial<FlowNode>) {
    const index = nodes.value.findIndex((node) => String(node.id) === nodeId)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }

  // Delete a node and its children
  function deleteNode(nodeId: string) {
    // Find child nodes (nodes with parentId === nodeId) to cascade delete
    const childNodeIds = nodes.value
      .filter((node) => String(node.parentId) === nodeId)
      .map((node) => String(node.id))

    // Delete the node and its children
    nodes.value = nodes.value.filter(
      (node) => String(node.id) !== nodeId && !childNodeIds.includes(String(node.id)),
    )

    // Also remove their stored positions
    nodePositions.value.delete(nodeId)
    childNodeIds.forEach((id) => nodePositions.value.delete(id))

    if (selectedNodeId.value === nodeId) {
      closeDrawer()
    }
  }

  // Add a node to the store
  function addNode(node: FlowNode) {
    nodes.value = [...nodes.value, node]
  }

  // Update the parent of a node
  function updateNodeParent(nodeId: string, newParentId: string | number) {
    const index = nodes.value.findIndex((node) => String(node.id) === nodeId)
    if (index !== -1) {
      nodes.value = nodes.value.map((node, i) =>
        i === index ? { ...node, parentId: newParentId } : node,
      )
    }
  }

  // Update the position of a node
  function updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    // Store the new position so it persists
    nodePositions.value.set(nodeId, position)
  }

  // Helper function to calculate node positions
  function calculateNodePosition(node: FlowNode, index: number): { x: number; y: number } {
    // Basic positioning - can be enhanced for better layout
    const baseX = 250
    const baseY = 50
    const verticalGap = 150
    const horizontalGap = 250

    // Find depth level based on parent chain
    let depth = 0
    let currentNode = node
    while (currentNode.parentId !== -1) {
      depth++
      const parent = nodes.value.find((n) => String(n.id) === String(currentNode.parentId))
      if (!parent) break
      currentNode = parent
    }

    // Find siblings (nodes with same parent)
    const siblings = nodes.value.filter((n) => String(n.parentId) === String(node.parentId))
    const siblingIndex = siblings.findIndex((n) => String(n.id) === String(node.id))

    return {
      x: baseX + siblingIndex * horizontalGap,
      y: baseY + depth * verticalGap,
    }
  }

  return {
    // State
    nodes,
    selectedNodeId,
    isDrawerOpen,
    // Getters
    selectedNode,
    vueFlowNodes,
    vueFlowEdges,
    // Actions
    setNodes,
    selectNode,
    closeDrawer,
    updateNode,
    deleteNode,
    addNode,
    updateNodeParent,
    updateNodePosition,
  }
})
