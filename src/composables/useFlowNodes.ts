import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useFlowChartStore } from '@/stores/flowChart'
import type { FlowNode } from '@/types'

// Simulated API - replace with actual API calls if needed
const fetchNodes = async (): Promise<FlowNode[]> => {
  // In a real app, this would be an API call
  // For now, we'll import from the JSON file
  const response = await import('@/../query.json')
  return response.default as FlowNode[]
}

const updateNodeApi = async (node: FlowNode): Promise<FlowNode> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return node
}

const deleteNodeApi = async (nodeId: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
}

const createNodeApi = async (node: FlowNode): Promise<FlowNode> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return node
}

export function useFlowNodes() {
  const store = useFlowChartStore()
  const queryClient = useQueryClient()

  // Query for fetching nodes
  const nodesQuery = useQuery({
    queryKey: ['flowNodes'],
    queryFn: fetchNodes,
  })

  // Watch for data changes and update store
  const initializeNodes = () => {
    if (nodesQuery.data.value) {
      store.setNodes(nodesQuery.data.value)
    }
  }

  // Mutation for updating a node
  const updateNodeMutation = useMutation({
    mutationFn: updateNodeApi,
    onSuccess: (updatedNode) => {
      store.updateNode(String(updatedNode.id), updatedNode)
      queryClient.invalidateQueries({ queryKey: ['flowNodes'] })
    },
  })

  // Mutation for deleting a node
  const deleteNodeMutation = useMutation({
    mutationFn: deleteNodeApi,
    onSuccess: (_, nodeId) => {
      store.deleteNode(nodeId)
      queryClient.invalidateQueries({ queryKey: ['flowNodes'] })
    },
  })

  // Mutation for creating a node
  const createNodeMutation = useMutation({
    mutationFn: createNodeApi,
    onSuccess: (newNode) => {
      store.addNode(newNode)
      queryClient.invalidateQueries({ queryKey: ['flowNodes'] })
    },
  })

  return {
    // Query
    nodesQuery,
    isLoading: nodesQuery.isLoading,
    isError: nodesQuery.isError,
    error: nodesQuery.error,
    // Mutations
    updateNode: updateNodeMutation.mutate,
    deleteNode: deleteNodeMutation.mutate,
    createNode: createNodeMutation.mutate,
    isUpdating: updateNodeMutation.isPending,
    isDeleting: deleteNodeMutation.isPending,
    isCreating: createNodeMutation.isPending,
    // Helper
    initializeNodes,
  }
}

