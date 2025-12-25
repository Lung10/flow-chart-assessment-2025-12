<template>
  <div class="flex flex-col gap-5 h-full">
    <!-- Title Field -->
    <div class="form-field">
      <h3>Title</h3>
      <input v-model="title" type="text" placeholder="Enter title..." />
    </div>

    <!-- Description -->
    <div class="info-box">
      <p>
        Allows a branch to be created based on date & time conditions. Use it to set business hours
        or date range conditions.
      </p>
    </div>

    <!-- Time Slots Header -->
    <div class="time-slots-header">
      <span>Day</span>
      <span>Time</span>
    </div>

    <!-- Time Slots -->
    <div class="flex flex-col gap-2">
      <!-- Show all time slots -->
      <div v-for="day in days" :key="day.key" class="time-slot-row">
        <span class="time-slot-day">{{ day.label }}</span>
        <div class="flex flex-1 items-center justify-center gap-2 md:gap-4">
          <!-- Start time input field -->
          <input
            type="time"
            :value="getTimeForDay(day.key)?.startTime"
            :class="{ 'input-error': invalidDays.has(day.key) }"
            @input="(e) => updateTime(day.key, 'startTime', (e.target as HTMLInputElement).value)"
          />
          <span class="text-xs text-(--color-description)">to</span>
          <!-- End time input field -->
          <input
            type="time"
            :value="getTimeForDay(day.key)?.endTime"
            :class="{ 'input-error': invalidDays.has(day.key) }"
            @input="(e) => updateTime(day.key, 'endTime', (e.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <!-- Timezone -->
    <div class="form-field">
      <h3>Time Zone</h3>
      <!-- Timezone select field -->
      <select v-model="timezone">
        <option value="UTC">(GMT+00:00) UTC</option>
        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time</option>
        <option value="America/Chicago">(GMT-06:00) Central Time</option>
        <option value="America/New_York">(GMT-05:00) Eastern Time</option>
        <option value="Europe/London">(GMT+00:00) London</option>
        <option value="Europe/Paris">(GMT+01:00) Paris</option>
        <option value="Asia/Malaysia">(GMT+08:00) Malaysia</option>
        <option value="Asia/Tokyo">(GMT+09:00) Tokyo</option>
      </select>
    </div>

    <!-- Save Button -->
    <button class="btn-save" @click="handleSave" :disabled="isUpdating">
      {{ isUpdating ? 'Saving...' : 'Save Changes' }}
    </button>

    <!-- Spacer for scroll padding -->
    <div class="shrink-0 h-1"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import type { FlowNode, BusinessHoursData, TimeSlot } from '@/types'

interface Props {
  node: FlowNode
}
// declare props to receive the node data
const props = defineProps<Props>()
// declare emit to send the saved event to the parent component
const emit = defineEmits<{ saved: [] }>()
// use the flow nodes composable to update the node data
const { updateNode, isUpdating } = useFlowNodes()

// define the days of the week
const days = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
] as const

const title = ref<string>(props.node.name || '')
const times = ref<TimeSlot[]>([])
const timezone = ref<string>('UTC')
const invalidDays = ref<Set<string>>(new Set())

// watch for changes to the node data
watch(
  () => props.node,
  (node) => {
    title.value = node.name || '' // set the title
    const data = node.data as BusinessHoursData
    timezone.value = data.timezone // set the timezone

    // Ensure all days have time slots (initialize missing ones)
    times.value = days.map((day) => {
      const existing = data.times.find((t) => t.day === day.key)
      return existing ? { ...existing } : { day: day.key, startTime: '', endTime: '' }
    })
  },
  { immediate: true },
)

function getTimeForDay(day: string): TimeSlot | undefined {
  return times.value.find((t) => t.day === day)
}

function updateTime(day: string, field: 'startTime' | 'endTime', value: string) {
  const index = times.value.findIndex((t) => t.day === day)
  if (index !== -1) {
    // Create new object to ensure reactivity
    times.value[index] = { ...times.value[index], [field]: value }
  }
  // Clear error for this day when user makes changes
  invalidDays.value.delete(day)
}

function validateTimes(): boolean {
  invalidDays.value = new Set()

  for (const slot of times.value) {
    // Skip empty slots
    if (!slot.startTime && !slot.endTime) continue

    // Check if start time is greater than or equal to end time
    if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
      invalidDays.value.add(slot.day)
    }
  }

  // Return false if there are invalid days
  return invalidDays.value.size === 0
}

function handleSave() {
  // Validate times before saving
  if (!validateTimes()) {
    alert('Start time must be before end time')
    return
  }

  const nodeData = props.node.data as BusinessHoursData
  // update the node data
  updateNode({
    ...props.node,
    name: title.value,
    data: {
      ...nodeData,
      times: times.value.filter((t) => t.startTime && t.endTime), // Only save configured days
      timezone: timezone.value,
    },
  })
  // send the saved event to the node drawer component
  emit('saved')
}
</script>
