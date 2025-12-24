<template>
  <!-- Use Material Design Icons -->
  <svg-icon type="mdi" :path="iconPath" :size="size" />
</template>

<script setup lang="ts">
// @ts-ignore - no types available for this package
import SvgIcon from '@jamescoyle/vue-icon'
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

interface Props {
  name: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
})

const icons: Record<string, string> = {
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

const iconPath = icons[props.name] || mdiClose
</script>
