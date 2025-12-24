<template>
  <div class="node node-comment max-w-[250px]">
    <!-- Input Handle -->
    <Handle type="target" :position="Position.Top" class="node-handle node-handle-comment" />

    <div class="node-icon">
      <Icon name="comment" :size="20" />
    </div>
    <div class="node-content">
      <span class="node-title">{{ props.data.name || 'Add Comment' }}</span>
      <span class="node-subtitle wrap-break-word">{{ truncatedComment }}</span>
    </div>

    <!-- Output Handle -->
    <Handle type="source" :position="Position.Bottom" class="node-handle node-handle-comment" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue'
import type { FlowNode, AddCommentData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const commentData = computed(() => props.data.data as AddCommentData)

const truncatedComment = computed(() => {
  const comment = commentData.value.comment
  return comment.length > 40 ? comment.substring(0, 40) + '...' : comment
})
</script>
