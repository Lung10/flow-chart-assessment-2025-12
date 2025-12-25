<template>
  <!-- Node Drawer -->
  <div
    v-if="isVisible && selectedNode"
    :class="['drawer-backdrop', isClosing ? 'animate-fade-out' : 'animate-fade-in']"
  >
    <div :class="['drawer', isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right']">
      <!-- Header -->
      <header class="drawer-header">
        <h2>{{ nodeTitle }}</h2>
        <button class="btn-close" @click="handleClose" aria-label="Close drawer">
          <Icon name="close" :size="24" />
        </button>
      </header>

      <!-- Display content based on selected node type -->
      <div class="drawer-content">
        <!-- Send Message Drawer -->
        <SendMessageDrawer
          v-if="selectedNode.type === 'sendMessage'"
          :node="selectedNode"
          @saved="handleClose"
        />

        <!-- Add Comment Drawer -->
        <AddCommentDrawer
          v-else-if="selectedNode.type === 'addComment'"
          :node="selectedNode"
          @saved="handleClose"
        />

        <!-- Business Hours Drawer -->
        <BusinessHoursDrawer
          v-else-if="selectedNode.type === 'dateTime'"
          :node="selectedNode"
          @saved="handleClose"
        />

        <!-- Message Node Drawer for display only -->
        <div v-else class="p-4 bg-(--color-description-box) rounded-lg text-center">
          <p>This node is for display only and cannot be edited.</p>
        </div>
      </div>

      <!-- Footer with delete button -->
      <footer v-if="isEditable" class="drawer-footer">
        <button class="btn-delete" @click="handleDelete" :disabled="isDeleting">
          <Icon name="delete" :size="18" />
          {{ isDeleting ? 'Deleting...' : 'Delete Node' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFlowChartStore } from '@/stores/flowChart'
import { useFlowNodes } from '@/composables/useFlowNodes'
import Icon from '@/components/icons/Icon.vue'
import SendMessageDrawer from './SendMessageDrawer.vue'
import AddCommentDrawer from './AddCommentDrawer.vue'
import BusinessHoursDrawer from './BusinessHoursDrawer.vue'

// Use Pinia store for flow chart data
const store = useFlowChartStore()

// use the flow nodes composable to delete the node
const { deleteNode, isDeleting } = useFlowNodes()

// get the selected node from the store
const selectedNode = computed(() => store.selectedNode)

// State for closing animation and visibility
const isClosing = ref<boolean>(false)
const isVisible = ref<boolean>(false)

// Sync visibility with store, handle closing animation
watch(
  () => store.isDrawerOpen && store.selectedNode,
  (shouldOpen) => {
    if (shouldOpen) {
      isClosing.value = false
      isVisible.value = true
    }
  },
  { immediate: true },
)

// Get the title of the selected node
const nodeTitle = computed(() => {
  return selectedNode.value?.name || '' // if no selected node, return empty string
})
// Handle closing the drawer
function handleClose() {
  isClosing.value = true
  // Wait for animation to finish before actually closing
  setTimeout(() => {
    store.closeDrawer()
    isVisible.value = false
    isClosing.value = false
  }, 300) // Match animation duration
}

// Handle deleting the selected node
function handleDelete() {
  if (store.selectedNodeId && confirm('Are you sure you want to delete this node?')) {
    deleteNode(store.selectedNodeId)
  }
}

// Check if the selected node is editable
const isEditable = computed(() => {
  if (!selectedNode.value) return false // if no selected node, return false
  return selectedNode.value.type !== 'dateTimeConnector' && selectedNode.value.type !== 'trigger' // if the selected node is a dateTimeConnector or trigger, return false
})
</script>
