import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FlowNode, VueFlowNode, VueFlowEdge } from '@/types'

export const useFlowChartStore = defineStore('flowChart', () => {
  // State
  const nodes = ref<FlowNode[]>([])
  const selectedNodeId = ref<string | null>(null)
  const isDrawerOpen = ref(false)

  // Getters
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null
    return nodes.value.find((node) => String(node.id) === selectedNodeId.value) || null
  })

  // Convert raw nodes to Vue Flow format
  const vueFlowNodes = computed<VueFlowNode[]>(() => {
    return nodes.value.map((node, index) => {
      // Calculate position based on hierarchy (can be improved later)
      const position = calculateNodePosition(node, index)

      return {
        id: String(node.id),
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
        edges.push({
          id: `e-${node.parentId}-${node.id}`,
          source: String(node.parentId),
          target: String(node.id),
        })
      }
    })

    return edges
  })

  // Actions
  function setNodes(newNodes: FlowNode[]) {
    nodes.value = newNodes
  }

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
    isDrawerOpen.value = nodeId !== null
  }

  function closeDrawer() {
    isDrawerOpen.value = false
    selectedNodeId.value = null
  }

  function updateNode(nodeId: string, updates: Partial<FlowNode>) {
    const index = nodes.value.findIndex((node) => String(node.id) === nodeId)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
    }
  }

  function deleteNode(nodeId: string) {
    nodes.value = nodes.value.filter((node) => String(node.id) !== nodeId)
    if (selectedNodeId.value === nodeId) {
      closeDrawer()
    }
  }

  function addNode(node: FlowNode) {
    nodes.value.push(node)
  }

  function updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    // This can be used to persist node positions if needed
    console.log(`Node ${nodeId} moved to`, position)
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
    updateNodePosition,
  }
})

