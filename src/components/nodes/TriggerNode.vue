<template>
  <div class="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-500 rounded-xl min-w-[180px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
    <div class="flex items-center justify-center w-9 h-9 bg-amber-500 rounded-lg text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-xs font-medium text-amber-800 uppercase tracking-wide">Trigger</span>
      <span class="text-sm font-semibold text-amber-900">
        {{ triggerData.type === 'conversationOpened' ? 'Conversation Opened' : triggerData.type }}
      </span>
    </div>
    
    <!-- Output Handle -->
    <Handle type="source" :position="Position.Bottom" class="!w-3 !h-3 !bg-amber-500 !border-2 !border-white" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { FlowNode, TriggerData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const triggerData = props.data.data as TriggerData
</script>
