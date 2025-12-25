<template>
  <!-- Use Material Design Icons -->
  <svg-icon type="mdi" :path="iconPath" :size="props.size" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
// @ts-ignore - no types available for this package
import SvgIcon from '@jamescoyle/vue-icon'
import type { IconMap } from '@/types'
import {
  mdiClose,
  mdiPlus,
  mdiCheck,
  mdiDelete,
  mdiFlash,
  mdiMessage,
  mdiCommentText,
  mdiClockOutline,
  mdiPaperclip,
} from '@mdi/js'

// Define props with default values
const props = defineProps<{
  name: string
  size: number
}>()

// Map of icon names to their SVG paths
const icons: IconMap = {
  close: mdiClose,
  plus: mdiPlus,
  check: mdiCheck,
  delete: mdiDelete,
  flash: mdiFlash,
  message: mdiMessage,
  comment: mdiCommentText,
  clock: mdiClockOutline,
  attachment: mdiPaperclip,
}

// Get the icon path based on the name prop, fallback to close icon if not found
const iconPath = computed(() => {
  return icons[props.name] || mdiClose
})
</script>
