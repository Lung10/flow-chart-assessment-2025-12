<template>
  <div class="node node-trigger">
    <div class="node-icon">
      <Icon name="flash" :size="20" />
    </div>
    <div class="node-content">
      <span class="node-subtitle uppercase tracking-wide">Trigger</span>
      <span class="node-title">
        {{ triggerData.type === 'conversationOpened' ? 'Conversation Opened' : triggerData.type }}
      </span>
    </div>

    <!-- Output Handle -->
    <Handle type="source" :position="Position.Bottom" class="node-handle node-handle-trigger" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue'
import type { FlowNode, TriggerData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const triggerData = props.data.data as TriggerData
</script>
