<template>
  <div
    class="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-500 rounded-xl min-w-[200px] max-w-[280px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
  >
    <!-- Input Handle -->
    <Handle
      type="target"
      :position="Position.Top"
      class="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
    />

    <div
      class="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-lg text-white shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="flex flex-col gap-1 flex-1 min-w-0">
      <span class="text-sm font-semibold text-blue-800 truncate">{{
        props.data.name || 'Send Message'
      }}</span>
      <span class="text-xs text-blue-600 leading-tight break-words">{{ previewText }}</span>
      <div
        v-if="hasAttachment"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white rounded-full text-[10px] font-medium mt-1 w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
          ></path>
        </svg>
        <span>Attachment</span>
      </div>
    </div>

    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Bottom"
      class="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { FlowNode, SendMessageData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const messageData = computed(() => props.data.data as SendMessageData)

const previewText = computed(() => {
  const textPayload = messageData.value.payload.find((p) => p.type === 'text')
  if (textPayload && 'text' in textPayload) {
    return textPayload.text.length > 50
      ? textPayload.text.substring(0, 50) + '...'
      : textPayload.text
  }
  return 'No message'
})

const hasAttachment = computed(() => {
  return messageData.value.payload.some((p) => p.type === 'attachment')
})
</script>
