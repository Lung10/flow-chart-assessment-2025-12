<template>
  <div class="flex flex-col gap-5 h-full">
    <!-- Title Field -->
    <div class="form-field">
      <h3>Title</h3>
      <!-- Title input field -->
      <input v-model="title" type="text" placeholder="Enter title..." />
    </div>

    <!-- Comment Field -->
    <div class="form-field">
      <h3>Comment</h3>
      <!-- Comment textarea field -->
      <textarea
        v-model="comment"
        class="resize-none"
        placeholder="Enter comment..."
        rows="5"
      ></textarea>
    </div>

    <!-- Save Button -->
    <button class="btn-save" @click="handleSave" :disabled="isUpdating">
      {{ isUpdating ? 'Saving...' : 'Save Changes' }}
    </button>

    <!-- Spacer for scroll padding -->
    <div class="shrink-0 h-1"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import type { FlowNode, AddCommentData } from '@/types'

interface Props {
  node: FlowNode
}
// declare props to receive the node data
const props = defineProps<Props>()
// declare emit to send the saved event to the parent component
const emit = defineEmits<{ saved: [] }>()
// use the flow nodes composable to update the node data
const { updateNode, isUpdating } = useFlowNodes()

const title = ref(props.node.name || '')
const comment = ref('')

// watch for changes to the node data
watch(
  () => props.node,
  (node) => {
    title.value = node.name || ''
    comment.value = (node.data as AddCommentData).comment
  },
  { immediate: true },
)

// handle the save event
function handleSave() {
  // update the node data
  updateNode({
    ...props.node,
    name: title.value,
    data: { comment: comment.value },
  })
  // send the saved event to the node drawer component
  emit('saved')
}
</script>
