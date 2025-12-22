<template>
  <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-500 rounded-xl min-w-[180px] max-w-[250px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
    <!-- Input Handle -->
    <Handle type="target" :position="Position.Top" class="!w-3 !h-3 !bg-purple-500 !border-2 !border-white" />
    
    <div class="flex items-center justify-center w-9 h-9 bg-purple-500 rounded-lg text-white shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </div>
    <div class="flex flex-col gap-1 flex-1 min-w-0">
      <span class="text-sm font-semibold text-purple-700 truncate">{{ props.data.name || 'Add Comment' }}</span>
      <span class="text-xs text-purple-600 leading-tight break-words">{{ truncatedComment }}</span>
    </div>
    
    <!-- Output Handle -->
    <Handle type="source" :position="Position.Bottom" class="!w-3 !h-3 !bg-purple-500 !border-2 !border-white" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
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
