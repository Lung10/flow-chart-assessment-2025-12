<template>
  <div class="flex flex-col gap-5">
    <!-- Title Field -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-400">Title</label>
      <input
        v-model="title"
        type="text"
        class="px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        placeholder="Enter title..."
        :disabled="!editable"
      />
    </div>

    <!-- Comment Field -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-400">Comment</label>
      <textarea
        v-model="comment"
        class="px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
        placeholder="Enter comment..."
        :disabled="!editable"
        rows="5"
      ></textarea>
    </div>

    <!-- Save Button -->
    <button
      v-if="editable"
      class="px-6 py-3 bg-blue-500 border-none rounded-lg text-white font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleSave"
      :disabled="isUpdating"
    >
      {{ isUpdating ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import type { FlowNode, AddCommentData } from '@/types'

interface Props {
  node: FlowNode
  editable: boolean
}

const props = defineProps<Props>()
const { updateNode, isUpdating } = useFlowNodes()

const title = ref(props.node.name || '')
const comment = ref('')

watch(
  () => props.node,
  (node) => {
    title.value = node.name || ''
    comment.value = (node.data as AddCommentData).comment
  },
  { immediate: true }
)

function handleSave() {
  updateNode({
    ...props.node,
    name: title.value,
    data: { comment: comment.value },
  })
}
</script>
