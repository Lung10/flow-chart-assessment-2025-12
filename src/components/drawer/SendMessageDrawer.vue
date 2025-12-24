<template>
  <div class="flex flex-col gap-3 md:gap-5 h-full">
    <!-- Title Field -->
    <div class="form-field">
      <h3>Title</h3>
      <input v-model="title" type="text" placeholder="Enter title..." />
    </div>

    <!-- Text Messages -->
    <div class="form-field">
      <h3>Messages</h3>
      <!-- Show all text messages -->
      <div v-for="(text, index) in textPayloads" :key="index" class="flex gap-2">
        <!-- Text message input field -->
        <textarea v-model="textPayloads[index]" placeholder="Enter message..." rows="3"></textarea>
        <!-- Remove text message button -->
        <button class="btn-remove" @click="removeText(index)" aria-label="Remove message">
          <Icon name="close" :size="16" />
        </button>
      </div>
      <!-- Add new text message button -->
      <button class="btn-add" @click="addText">+ Add Message</button>
    </div>

    <!-- Attachments -->
    <div class="form-field">
      <h3>Attachments</h3>
      <div class="grid grid-cols-2 gap-3">
        <!-- Show all attachments -->
        <div
          v-for="(url, index) in attachments"
          :key="index"
          class="relative aspect-square rounded-lg overflow-hidden"
        >
          <!-- Attachment image -->
          <img :src="url" :alt="`Attachment ${index + 1}`" class="w-full h-full object-cover" />
          <!-- Remove attachment button -->
          <button
            class="btn-remove-attachment"
            @click="removeAttachment(index)"
            aria-label="Remove attachment"
          >
            <Icon name="close" :size="14" />
          </button>
        </div>
        <!-- Upload new attachment button -->
        <label class="btn-upload">
          <input type="file" accept="image/*" @change="handleFileUpload" hidden />
          <Icon name="plus" :size="24" />
          <span>Upload</span>
        </label>
      </div>
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
import Icon from '@/components/icons/Icon.vue'
import type { FlowNode, SendMessageData, MessagePayload } from '@/types'

interface Props {
  node: FlowNode
}
// declare props to receive the node data
const props = defineProps<Props>()
// declare emit to send the saved event to the parent component
const emit = defineEmits<{ saved: [] }>()
const { updateNode, isUpdating } = useFlowNodes()

const title = ref(props.node.name || '')
const textPayloads = ref<string[]>([])
const attachments = ref<string[]>([])

watch(
  () => props.node,
  (node) => {
    title.value = node.name || ''
    const data = node.data as SendMessageData
    textPayloads.value = data.payload
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
    attachments.value = data.payload
      .filter((p): p is { type: 'attachment'; attachment: string } => p.type === 'attachment')
      .map((p) => p.attachment)
  },
  { immediate: true },
)

function handleSave() {
  const payload: MessagePayload[] = [
    ...textPayloads.value.map((text) => ({ type: 'text' as const, text })),
    ...attachments.value.map((attachment) => ({ type: 'attachment' as const, attachment })),
  ]

  // update the node data
  updateNode({
    ...props.node,
    name: title.value,
    data: { payload },
  })
  // send the saved event to the node drawer component
  emit('saved')
}

function addText() {
  textPayloads.value.push('')
}

function removeText(index: number) {
  textPayloads.value.splice(index, 1)
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const url = URL.createObjectURL(target.files[0])
    attachments.value.push(url)
  }
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1)
}
</script>
