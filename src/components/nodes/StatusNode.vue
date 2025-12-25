<template>
  <div :class="['node-status', isSuccess ? 'node-status-success' : 'node-status-failure']">
    <!-- Input Handle -->
    <Handle
      type="target"
      :position="Position.Top"
      :class="['node-handle', isSuccess ? 'node-handle-success' : 'node-handle-failure']"
    />

    <Icon v-if="isSuccess" name="check" :size="16" />
    <Icon v-else name="close" :size="16" />
    <span>{{ isSuccess ? 'Success' : 'Failure' }}</span>

    <!-- Output Handle -->
    <Handle
      type="source"
      :position="Position.Bottom"
      :class="['node-handle', isSuccess ? 'node-handle-success' : 'node-handle-failure']"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import Icon from '@/components/icons/Icon.vue'
import type { FlowNode, StatusData } from '@/types'

interface Props {
  data: FlowNode
}

const props = defineProps<Props>()

const connectorData = computed(() => props.data.data as StatusData)

const isSuccess = computed(() => connectorData.value.connectorType === 'success')
</script>
