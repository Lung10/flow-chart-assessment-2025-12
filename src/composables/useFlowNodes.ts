// Documentations Links for useQuery and useMutation in TanStack Query:
// https://tanstack.com/query/latest/docs/framework/vue/guides/queries
// https://tanstack.com/query/latest/docs/framework/vue/guides/mutations

import { useQuery, useMutation } from '@tanstack/vue-query'
import { useFlowChartStore } from '@/stores/flowChart'
import type { FlowNode } from '@/types'

// Simulate API delay 300ms
function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300))
}

// Simulated API for fetching nodes from the JSON file
async function fetchNodes(): Promise<FlowNode[]> {
  const response = await import('@/../query.json') // import the nodes from the JSON file
  return response.default as FlowNode[] // return the nodes as an array of FlowNode objects
}

export function useFlowNodes() {
  // use the flow chart store to manage the nodes
  const store = useFlowChartStore()

  // Query for fetching nodes
  const nodesQuery = useQuery({
    queryKey: ['flowNodes'],
    queryFn: fetchNodes,
  })

  // Initialize the nodes when the component mounts
  const initializeNodes = () => {
    if (nodesQuery.data.value) {
      store.setNodes(nodesQuery.data.value)
    }
  }

  // Mutation for updating a node
  const updateNodeMutation = useMutation({
    mutationFn: async (node: FlowNode) => {
      await delay()
      return node
    },
    onSuccess: (updatedNode) => {
      store.updateNode(String(updatedNode.id), updatedNode)
    },
  })

  // Mutation for deleting a node
  const deleteNodeMutation = useMutation({
    mutationFn: async (nodeId: string) => {
      await delay()
      return nodeId
    },
    onSuccess: (nodeId) => {
      store.deleteNode(nodeId)
    },
  })

  // Mutation for creating a node
  const createNodeMutation = useMutation({
    mutationFn: async (node: FlowNode) => {
      await delay()
      return node
    },
    onSuccess: (newNode) => {
      store.addNode(newNode)
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
