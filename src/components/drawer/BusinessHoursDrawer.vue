<template>
  <div class="flex flex-col gap-5">
    <!-- Title Field -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-400">Title</label>
      <input
        v-model="title"
        type="text"
        class="px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        placeholder="Enter title..."
        :disabled="!editable"
      />
    </div>

    <!-- Description -->
    <div class="p-3 bg-slate-700 rounded-lg">
      <p class="m-0 text-sm text-slate-400 leading-relaxed">
        Allows a branch to be created based on date & time conditions. Use it to set business hours or date range conditions.
      </p>
    </div>

    <!-- Time Slots Header -->
    <div class="flex py-2 border-b border-slate-700">
      <span class="w-14 text-xs font-medium text-slate-500">Day</span>
      <span class="flex-1 text-xs font-medium text-slate-500 text-center">Time</span>
    </div>

    <!-- Time Slots -->
    <div class="flex flex-col gap-2">
      <div v-for="day in days" :key="day.key" class="flex items-center">
        <span class="w-14 text-sm font-medium text-slate-200">{{ day.label }}</span>
        <div class="flex items-center gap-2 flex-1">
          <input
            type="time"
            class="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-slate-100 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            :value="getTimeForDay(day.key)?.startTime"
            @input="(e) => updateTime(day.key, 'startTime', (e.target as HTMLInputElement).value)"
            :disabled="!editable"
          />
          <span class="text-xs text-slate-500">to</span>
          <input
            type="time"
            class="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-slate-100 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            :value="getTimeForDay(day.key)?.endTime"
            @input="(e) => updateTime(day.key, 'endTime', (e.target as HTMLInputElement).value)"
            :disabled="!editable"
          />
        </div>
      </div>
    </div>

    <!-- Timezone -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-slate-400">Time Zone</label>
      <select 
        v-model="timezone" 
        class="px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="!editable"
      >
        <option value="UTC">(GMT+00:00) UTC</option>
        <option value="America/New_York">(GMT-05:00) Eastern Time</option>
        <option value="America/Chicago">(GMT-06:00) Central Time</option>
        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time</option>
        <option value="Europe/London">(GMT+00:00) London</option>
        <option value="Europe/Paris">(GMT+01:00) Paris</option>
        <option value="Asia/Tokyo">(GMT+09:00) Tokyo</option>
        <option value="Asia/Singapore">(GMT+08:00) Singapore</option>
      </select>
    </div>

    <!-- Save Button -->
    <button
      v-if="editable"
      class="px-6 py-3 bg-blue-500 border-none rounded-lg text-white font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      @click="handleSave"
      :disabled="isUpdating"
    >
      {{ isUpdating ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import type { FlowNode, DateTimeData, TimeSlot } from '@/types'

interface Props {
  node: FlowNode
  editable: boolean
}

const props = defineProps<Props>()
const { updateNode, isUpdating } = useFlowNodes()

const days = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
] as const

const title = ref(props.node.name || '')
const times = ref<TimeSlot[]>([])
const timezone = ref('UTC')

watch(
  () => props.node,
  (node) => {
    title.value = node.name || ''
    const data = node.data as DateTimeData
    times.value = [...data.times]
    timezone.value = data.timezone
  },
  { immediate: true }
)

function getTimeForDay(day: string): TimeSlot | undefined {
  return times.value.find((t) => t.day === day)
}

function updateTime(day: string, field: 'startTime' | 'endTime', value: string) {
  const index = times.value.findIndex((t) => t.day === day)
  if (index !== -1) {
    times.value[index][field] = value
  }
}

function handleSave() {
  const nodeData = props.node.data as DateTimeData
  updateNode({
    ...props.node,
    name: title.value,
    data: {
      ...nodeData,
      times: times.value,
      timezone: timezone.value,
    },
  })
}
</script>
