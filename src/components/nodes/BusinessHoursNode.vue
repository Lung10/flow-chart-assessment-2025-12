<template>
  <div class="node node-business-hours">
    <!-- Input Handle -->
    <Handle type="target" :position="Position.Top" class="node-handle node-handle-business" />

    <div class="node-icon">
      <Icon name="clock" :size="20" />
    </div>
    <div class="node-content">
      <span class="node-title">{{ props.data.name || 'Business Hours' }}</span>
      <span class="node-subtitle">{{ dateTimeData.timezone }}</span>
    </div>

    <!-- Output Handles for Success and Failure -->
    <Handle
      id="success"
      type="source"
      :position="Position.Bottom"
      :style="{ left: '30%' }"
      class="node-handle node-handle-success"
    />
    <Handle
      id="failure"
      type="source"
      :position="Position.Bottom"
      :style="{ left: '70%' }"
      class="node-handle node-handle-failure"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue'
import type { FlowNode, DateTimeData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const dateTimeData = computed(() => props.data.data as DateTimeData)
</script>
