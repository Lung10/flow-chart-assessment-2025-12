<template>
  <Transition name="drawer">
    <div
      v-if="store.isDrawerOpen && selectedNode"
      class="fixed inset-0 bg-black/50 z-50 flex justify-end"
      @click.self="handleClose"
    >
      <aside
        class="w-full max-w-[420px] h-full bg-slate-800 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.2)]"
      >
        <!-- Header -->
        <header class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 class="text-lg md:text-xl font-semibold text-slate-100 truncate pr-2">
            {{ nodeTitle }}
          </h2>
          <button
            class="flex items-center justify-center w-9 h-9 bg-transparent border-none rounded-lg text-slate-400 cursor-pointer transition-all hover:bg-slate-700 hover:text-slate-100"
            @click="handleClose"
            aria-label="Close drawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <!-- Content based on node type -->
        <div class="flex-1 p-6 overflow-y-auto">
          <template v-if="selectedNode.type === 'sendMessage'">
            <SendMessageDrawer :node="selectedNode" :editable="isEditable" />
          </template>

          <template v-else-if="selectedNode.type === 'addComment'">
            <AddCommentDrawer :node="selectedNode" :editable="isEditable" />
          </template>

          <template v-else-if="selectedNode.type === 'dateTime'">
            <BusinessHoursDrawer :node="selectedNode" :editable="isEditable" />
          </template>

          <template v-else>
            <div class="p-4 bg-slate-700 rounded-lg text-slate-400 text-center">
              <p>This node is for display only and cannot be edited.</p>
            </div>
          </template>
        </div>

        <!-- Footer with delete button -->
        <footer v-if="isEditable" class="px-6 py-4 border-t border-slate-700">
          <button
            class="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white border-none rounded-lg font-medium cursor-pointer transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleDelete"
            :disabled="isDeleting"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
            {{ isDeleting ? 'Deleting...' : 'Delete Node' }}
          </button>
        </footer>
      </aside>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFlowChartStore } from '@/stores/flowChart'
import { useFlowNodes } from '@/composables/useFlowNodes'
import SendMessageDrawer from './SendMessageDrawer.vue'
import AddCommentDrawer from './AddCommentDrawer.vue'
import BusinessHoursDrawer from './BusinessHoursDrawer.vue'

const store = useFlowChartStore()
const { deleteNode, isDeleting } = useFlowNodes()

const selectedNode = computed(() => store.selectedNode)

const nodeTitle = computed(() => {
  if (!selectedNode.value) return ''
  return selectedNode.value.name || getDefaultTitle(selectedNode.value.type)
})

function getDefaultTitle(type: string): string {
  const titles: Record<string, string> = {
    trigger: 'Trigger',
    sendMessage: 'Send Message',
    addComment: 'Add Comment',
    dateTime: 'Business Hours',
    dateTimeConnector: 'Connector',
  }
  return titles[type] || 'Node'
}

function handleClose() {
  store.closeDrawer()
}

function handleDelete() {
  if (store.selectedNodeId && confirm('Are you sure you want to delete this node?')) {
    deleteNode(store.selectedNodeId)
  }
}

const isEditable = computed(() => {
  if (!selectedNode.value) return false
  return selectedNode.value.type !== 'dateTimeConnector' && selectedNode.value.type !== 'trigger'
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active aside,
.drawer-leave-active aside {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from aside,
.drawer-leave-to aside {
  transform: translateX(100%);
}
</style>
