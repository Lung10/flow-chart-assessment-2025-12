<template>
  <!-- Create Button -->
  <button @click="openModal">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Create New Node
  </button>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-1 p-4"
      >
        <!-- <div class="w-full max-w-[480px] bg-slate-800 rounded-2xl shadow-2xl"> -->
        <card>
          <header class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
            <h2>Create New Node</h2>
            <button
              class="justify-end w-fit px-1.5 py-1 rounded-full hover:bg-(--color-hover)"
              @click="closeModal"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          <form class="p-6 flex flex-col gap-5" @submit.prevent="handleSubmit">
            <!-- Title -->
            <div class="flex flex-col gap-1.5">
              <h3>Title <span class="text-red-500">*</span></h3>
              <input
                v-model="form.title"
                type="text"
                :class="{ 'input-error': errors.title }"
                placeholder="Enter node title..."
              />
              <span v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</span>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <h3>Description</h3>
              <textarea
                v-model="form.description"
                class="resize-none"
                :class="{ 'input-error': errors.description }"
                placeholder="Enter description..."
                rows="3"
              ></textarea>
              <span v-if="errors.description" class="text-xs text-red-500">{{
                errors.description
              }}</span>
            </div>

            <!-- Type -->
            <div class="flex flex-col gap-1.5">
              <h3>Type of Node</h3>
              <select v-model="form.type" :class="{ 'input-error': errors.type }">
                <option value="sendMessage">Send Message</option>
                <option value="addComment">Add Comment</option>
                <option value="businessHours">Business Hours</option>
              </select>
              <span v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</span>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-2">
              <button
                type="button"
                class="flex-1 py-2.5 bg-slate-700 text-slate-300 border-none rounded-lg font-medium cursor-pointer transition-colors hover:bg-slate-600 hover:text-slate-100"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 py-2.5 bg-blue-500 text-white border-none rounded-lg font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isCreating"
              >
                {{ isCreating ? 'Creating...' : 'Create Node' }}
              </button>
            </div>
          </form>
        </card>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import { useNodeValidation } from '@/composables/useNodeValidation'
import type {
  CreateNodeForm,
  FlowNode,
  SendMessageData,
  AddCommentData,
  DateTimeData,
} from '@/types'

const { createNode, isCreating } = useFlowNodes()
const { errors, validateForm, clearErrors } = useNodeValidation()

const isModalOpen = ref(false)
const form = ref<CreateNodeForm>({
  title: '',
  description: '',
  type: 'sendMessage',
})

function openModal() {
  isModalOpen.value = true
  clearErrors()
}

function closeModal() {
  isModalOpen.value = false
  form.value = { title: '', description: '', type: 'sendMessage' }
  clearErrors()
}

function handleSubmit() {
  if (!validateForm(form.value)) return

  const nodeId = `node-${Date.now()}`
  let nodeData: SendMessageData | AddCommentData | DateTimeData

  switch (form.value.type) {
    case 'sendMessage':
      nodeData = {
        payload: [{ type: 'text', text: form.value.description }],
      }
      break
    case 'addComment':
      nodeData = {
        comment: form.value.description,
      }
      break
    case 'businessHours':
      nodeData = {
        times: [
          { startTime: '09:00', endTime: '17:00', day: 'mon' },
          { startTime: '09:00', endTime: '17:00', day: 'tue' },
          { startTime: '09:00', endTime: '17:00', day: 'wed' },
          { startTime: '09:00', endTime: '17:00', day: 'thu' },
          { startTime: '09:00', endTime: '17:00', day: 'fri' },
        ],
        connectors: [],
        timezone: 'UTC',
        action: 'businessHours',
      }
      break
  }

  const newNode: FlowNode = {
    id: nodeId,
    parentId: -1,
    type: form.value.type === 'businessHours' ? 'dateTime' : form.value.type,
    name: form.value.title,
    data: nodeData,
  }

  createNode(newNode)
  closeModal()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
