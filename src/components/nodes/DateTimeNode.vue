<template>
  <div class="flex items-center gap-3 p-3 bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-500 rounded-xl min-w-[180px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
    <!-- Input Handle -->
    <Handle type="target" :position="Position.Top" class="!w-3 !h-3 !bg-pink-500 !border-2 !border-white" />
    
    <div class="flex items-center justify-center w-9 h-9 bg-pink-500 rounded-lg text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-sm font-semibold text-pink-700">{{ props.data.name || 'Business Hours' }}</span>
      <span class="text-xs text-pink-600">{{ dateTimeData.timezone }}</span>
    </div>
    
    <!-- Output Handles for Success and Failure -->
    <Handle id="success" type="source" :position="Position.Bottom" :style="{ left: '30%' }" class="!w-3 !h-3 !bg-green-500 !border-2 !border-white" />
    <Handle id="failure" type="source" :position="Position.Bottom" :style="{ left: '70%' }" class="!w-3 !h-3 !bg-red-500 !border-2 !border-white" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { FlowNode, DateTimeData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const dateTimeData = computed(() => props.data.data as DateTimeData)
</script>
