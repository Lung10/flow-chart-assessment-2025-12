import { useQuery, useMutation } from '@tanstack/vue-query'
import { useFlowChartStore } from '@/stores/flowChart'
import type { FlowNode } from '@/types'

// Simulated API for fetching nodes using TanStack Query
const fetchNodes = async (): Promise<FlowNode[]> => {
  const response = await import('@/../query.json') // import the nodes from the JSON file
  return response.default as FlowNode[] // return the nodes as an array of FlowNode objects
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
  // use the flow chart store to manage the nodes
  const store = useFlowChartStore()

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
      // Don't invalidate - we're using static JSON, refetch would overwrite local changes
    },
  })

  // Mutation for deleting a node
  const deleteNodeMutation = useMutation({
    mutationFn: deleteNodeApi,
    onSuccess: (_, nodeId) => {
      store.deleteNode(nodeId)
      // Don't invalidate - we're using static JSON, refetch would overwrite local changes
    },
  })

  // Mutation for creating a node
  const createNodeMutation = useMutation({
    mutationFn: createNodeApi,
    onSuccess: (newNode) => {
      store.addNode(newNode)
      // Don't invalidate - we're using static JSON, refetch would overwrite newly added nodes
    },
  })

  return {
    // Query
    nodesQuery,
    initializeNodes,
    // Mutations
    updateNode: updateNodeMutation.mutate,
    deleteNode: deleteNodeMutation.mutate,
    createNode: createNodeMutation.mutate,
    isUpdating: updateNodeMutation.isPending,
    isDeleting: deleteNodeMutation.isPending,
    isCreating: createNodeMutation.isPending,
  }
}
