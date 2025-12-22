<template>
  <div 
    class="flex items-center justify-center px-4 py-2 rounded-full min-w-[100px] shadow-sm hover:scale-105 transition-all duration-200"
    :class="isSuccess 
      ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500' 
      : 'bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500'"
  >
    <!-- Input Handle -->
    <Handle 
      type="target" 
      :position="Position.Top" 
      class="!w-2.5 !h-2.5 !border-2 !border-white"
      :class="isSuccess ? '!bg-green-500' : '!bg-red-500'"
    />
    
    <div class="flex items-center gap-1.5 text-xs font-semibold" :class="isSuccess ? 'text-green-700' : 'text-red-700'">
      <svg v-if="isSuccess" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>{{ isSuccess ? 'Success' : 'Failure' }}</span>
    </div>
    
    <!-- Output Handle -->
    <Handle 
      type="source" 
      :position="Position.Bottom" 
      class="!w-2.5 !h-2.5 !border-2 !border-white"
      :class="isSuccess ? '!bg-green-500' : '!bg-red-500'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { FlowNode, DateTimeConnectorData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const connectorData = computed(() => props.data.data as DateTimeConnectorData)

const isSuccess = computed(() => connectorData.value.connectorType === 'success')
</script>
