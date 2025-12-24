<template>
  <div class="node node-message max-w-[280px]">
    <!-- Input Handle -->
    <Handle type="target" :position="Position.Top" class="node-handle node-handle-message" />

    <div class="node-icon">
      <Icon name="message" :size="20" />
    </div>
    <div class="node-content">
      <span class="node-title">{{ props.data.name || 'Send Message' }}</span>
      <span class="node-subtitle wrap-break-word">{{ previewText }}</span>
      <div v-if="hasAttachment" class="node-badge">
        <Icon name="attachment" :size="12" />
        <span>Attachment</span>
      </div>
    </div>

    <!-- Output Handle -->
    <Handle type="source" :position="Position.Bottom" class="node-handle node-handle-message" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue'
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
