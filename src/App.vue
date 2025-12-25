<template>
  <!-- Header -->
  <header class="flex justify-between items-center px-4 py-2 bg-(--color-primary) shrink-0">
    <!-- Header Title -->
    <h1>Flow Chart Builder</h1>
    <!-- Create Node Button -->
    <CreateNodeButton />
  </header>

  <!-- Flow Chart Canvas using Vue Flow -->
  <VueFlow
    :nodes="store.vueFlowNodes"
    :edges="store.vueFlowEdges"
    :edges-updatable="true"
    :pan-on-drag="true"
    :zoom-on-pinch="true"
    fit-view-on-init
  >
    <!-- Custom Node Types -->
    <template #node-trigger="nodeProps">
      <!-- Trigger Node -->
      <TriggerNode v-bind="nodeProps" />
    </template>
    <template #node-sendMessage="nodeProps">
      <!-- Send Message Node -->
      <SendMessageNode v-bind="nodeProps" />
    </template>
    <template #node-addComment="nodeProps">
      <!-- Add Comment Node -->
      <AddCommentNode v-bind="nodeProps" />
    </template>
    <template #node-dateTime="nodeProps">
      <!-- Business Hours Node -->
      <BusinessHoursNode v-bind="nodeProps" />
    </template>
    <template #node-dateTimeConnector="nodeProps">
      <!-- Status Node (Success/Failure) -->
      <StatusNode v-bind="nodeProps" />
    </template>
  </VueFlow>

  <!-- Node Details Drawer -->
  <NodeDrawer />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow, type Connection } from '@vue-flow/core'
import { useFlowChartStore } from '@/stores/flowChart'
import { useFlowNodes } from '@/composables/useFlowNodes'
import NodeDrawer from '@/components/drawer/NodeDrawer.vue'
import CreateNodeButton from '@/components/button/CreateNodeButton.vue'

// Custom node components
import TriggerNode from '@/components/nodes/TriggerNode.vue'
import SendMessageNode from '@/components/nodes/SendMessageNode.vue'
import AddCommentNode from '@/components/nodes/AddCommentNode.vue'
import BusinessHoursNode from '@/components/nodes/BusinessHoursNode.vue'
import StatusNode from '@/components/nodes/StatusNode.vue'

const store = useFlowChartStore() // use the flow chart store to get the nodes and edges
const route = useRoute() // use the route to get the node id
const router = useRouter() // use the router to navigate to the node id
const { nodesQuery, initializeNodes } = useFlowNodes() // use the flow nodes composable to get the nodes and edges
const { onNodeClick, onConnect, onEdgesChange, onEdgeUpdate, onNodeDragStop } = useVueFlow() // use the vue flow composable to get the nodes and edges

// Sync URL with drawer state
watch(
  () => route.query.nodeId,
  (nodeId) => {
    if (nodeId && typeof nodeId === 'string') {
      store.selectNode(nodeId)
    }
  },
  { immediate: true },
)

// Update URL when node is selected
watch(
  () => store.selectedNodeId,
  (nodeId) => {
    if (nodeId) {
      router.push({ query: { nodeId } })
    } else {
      router.push({ query: {} })
    }
  },
)

// Watch for data and initialize store
watch(
  () => nodesQuery.data.value,
  (data) => {
    if (data) {
      store.setNodes(data)
    }
  },
  { immediate: true },
)

// Handle node click
onNodeClick(({ node }) => {
  store.selectNode(node.id)
})

// Save node position after dragging
onNodeDragStop(({ node }) => {
  store.updateNodePosition(node.id, node.position)
})

// Handle edge connection (dragging from one node to another)
onConnect((connection: Connection) => {
  if (connection.source && connection.target) {
    // Don't allow connecting to trigger node (it's always root)
    const targetNode = store.nodes.find((n) => String(n.id) === connection.target)
    if (targetNode?.type === 'trigger') return

    // Update the target node's parentId to the source node
    store.updateNodeParent(connection.target, connection.source)
  }
})

// Handle edge removal
onEdgesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'remove') {
      // Find the edge being removed and reset the target's parentId
      const edge = store.vueFlowEdges.find((e) => e.id === change.id)
      if (edge) {
        store.updateNodeParent(edge.target, -1)
      }
    }
  })
})

// Handle edge update (dragging existing edge to a new node)
onEdgeUpdate(({ edge, connection }) => {
  if (connection.source && connection.target) {
    // Don't allow connecting to trigger node
    const targetNode = store.nodes.find((n) => String(n.id) === connection.target)
    if (targetNode?.type === 'trigger') return

    // Reset old target's parent (disconnect)
    store.updateNodeParent(edge.target, -1)

    // Set new target's parent (reconnect)
    store.updateNodeParent(connection.target, connection.source)
  }
})

// Initialize nodes when the component mounts
onMounted(() => {
  initializeNodes()
})
</script>
