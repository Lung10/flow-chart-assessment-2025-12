<template>
  <!-- Header -->
  <header class="flex justify-between items-center px-4 py-2 bg-(--color-primary)">
    <h1 class="truncate">Flow Chart Builder</h1>
    <CreateNodeButton />
  </header>

  <!-- Flow Chart Canvas -->
  <div class="w-full h-full">
    <VueFlow
      :nodes="store.vueFlowNodes"
      :edges="store.vueFlowEdges"
      :default-viewport="{ zoom: 1, x: 0, y: 0 }"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
      class="w-full h-full"
    >
      <!-- Custom Node Types -->
      <template #node-trigger="nodeProps">
        <TriggerNode v-bind="nodeProps" />
      </template>
      <template #node-sendMessage="nodeProps">
        <SendMessageNode v-bind="nodeProps" />
      </template>
      <template #node-addComment="nodeProps">
        <AddCommentNode v-bind="nodeProps" />
      </template>
      <template #node-dateTime="nodeProps">
        <DateTimeNode v-bind="nodeProps" />
      </template>
      <template #node-dateTimeConnector="nodeProps">
        <DateTimeConnectorNode v-bind="nodeProps" />
      </template>
    </VueFlow>
  </div>

  <!-- Node Details Drawer -->
  <NodeDrawer />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useFlowChartStore } from '@/stores/flowChart'
import { useFlowNodes } from '@/composables/useFlowNodes'
import NodeDrawer from '@/components/drawer/NodeDrawer.vue'
import CreateNodeButton from '@/components/button/CreateNodeButton.vue'

// Custom node components
import TriggerNode from '@/components/nodes/TriggerNode.vue'
import SendMessageNode from '@/components/nodes/SendMessageNode.vue'
import AddCommentNode from '@/components/nodes/AddCommentNode.vue'
import DateTimeNode from '@/components/nodes/DateTimeNode.vue'
import DateTimeConnectorNode from '@/components/nodes/DateTimeConnectorNode.vue'

const store = useFlowChartStore()
const route = useRoute()
const router = useRouter()
const { nodesQuery, initializeNodes } = useFlowNodes()
const { onNodeClick } = useVueFlow()

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

onMounted(() => {
  initializeNodes()
})
</script>

<style>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
