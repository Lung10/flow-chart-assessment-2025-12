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

    <!-- Text Messages -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-slate-400">Messages</label>
      <div v-for="(text, index) in textPayloads" :key="index" class="flex gap-2">
        <textarea
          v-model="textPayloads[index]"
          class="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm transition-colors focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
          placeholder="Enter message..."
          :disabled="!editable"
          rows="3"
        ></textarea>
        <button
          v-if="editable"
          class="flex items-center justify-center w-10 h-10 bg-slate-700 border-none rounded-lg text-red-400 cursor-pointer transition-colors hover:bg-slate-600"
          @click="removeText(index)"
          aria-label="Remove message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <button 
        v-if="editable" 
        class="px-4 py-2 bg-transparent border border-dashed border-slate-600 rounded-lg text-slate-400 text-sm cursor-pointer transition-all hover:border-blue-500 hover:text-blue-500"
        @click="addText"
      >
        + Add Message
      </button>
    </div>

    <!-- Attachments -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-slate-400">Attachments</label>
      <div class="grid grid-cols-3 gap-3">
        <div v-for="(url, index) in attachments" :key="index" class="relative aspect-square rounded-lg overflow-hidden">
          <img :src="url" :alt="`Attachment ${index + 1}`" class="w-full h-full object-cover" />
          <button
            v-if="editable"
            class="absolute top-1 right-1 flex items-center justify-center w-6 h-6 bg-red-500/90 border-none rounded-full text-white cursor-pointer"
            @click="removeAttachment(index)"
            aria-label="Remove attachment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <label v-if="editable" class="flex flex-col items-center justify-center gap-1 aspect-square bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 text-xs cursor-pointer transition-all hover:border-blue-500 hover:text-blue-500">
          <input type="file" accept="image/*" @change="handleFileUpload" hidden />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Upload</span>
        </label>
      </div>
    </div>

    <!-- Save Button -->
    <button
      v-if="editable"
      class="px-6 py-3 bg-blue-500 border-none rounded-lg text-white font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleSave"
      :disabled="isUpdating"
    >
      {{ isUpdating ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import type { FlowNode, SendMessageData, MessagePayload } from '@/types'

interface Props {
  node: FlowNode
  editable: boolean
}

const props = defineProps<Props>()
const { updateNode, isUpdating } = useFlowNodes()

const messageData = computed(() => props.node.data as SendMessageData)

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
  { immediate: true }
)

function handleSave() {
  const payload: MessagePayload[] = [
    ...textPayloads.value.map((text) => ({ type: 'text' as const, text })),
    ...attachments.value.map((attachment) => ({ type: 'attachment' as const, attachment })),
  ]

  updateNode({
    ...props.node,
    name: title.value,
    data: { payload },
  })
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
