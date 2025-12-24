<template>
  <!-- Create Button -->
  <button class="btn-create-node" @click="openCard">
    <Icon name="plus" />
    Create New Node
  </button>

  <!-- Card Dialog -->
  <div v-if="isCardOpen" class="dialog-backdrop animate-fade-in">
    <div class="card animate-fade-in">
      <header class="form-header">
        <h2>Create New Node</h2>
        <button class="btn-close" @click="closeCard" aria-label="Close">
          <Icon name="close" />
        </button>
      </header>

      <!-- Form for creating a new node -->
      <form class="form-container" @submit.prevent="handleSubmit">
        <!-- Title input field -->
        <div class="form-field">
          <h3>Title <span class="text-(--color-error)">*</span></h3>
          <input
            v-model="form.title"
            type="text"
            :class="{ 'input-error': errors.title }"
            placeholder="Enter node title..."
          />
          <span v-if="errors.title" class="text-xs text-(--color-error)">{{ errors.title }}</span>
        </div>

        <!-- Description input field-->
        <div class="form-field">
          <h3>Description<span class="text-(--color-error)">*</span></h3>
          <textarea
            v-model="form.description"
            class="resize-none"
            :class="{ 'input-error': errors.description }"
            placeholder="Enter description..."
            rows="3"
          ></textarea>
          <span v-if="errors.description" class="text-xs text-(--color-error)">{{
            errors.description
          }}</span>
        </div>

        <!-- Type select field -->
        <div class="form-field">
          <h3>Type of Node</h3>
          <select v-model="form.type" :class="{ 'input-error': errors.type }">
            <option value="sendMessage">Send Message</option>
            <option value="addComment">Add Comment</option>
            <option value="businessHours">Business Hours</option>
          </select>
          <span v-if="errors.type" class="text-xs text-(--color-error)">{{ errors.type }}</span>
        </div>

        <!-- Actions buttons -->
        <div class="flex justify-around gap-3 mt-2">
          <button type="button" @click="closeCard" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-submit-node" :disabled="isCreating">
            {{ isCreating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFlowNodes } from '@/composables/useFlowNodes'
import { useNodeValidation } from '@/composables/useNodeValidation'
import { useFlowChartStore } from '@/stores/flowChart'
import Icon from '@/components/icons/Icon.vue'
import type {
  CreateNodeForm,
  FlowNode,
  SendMessageData,
  AddCommentData,
  DateTimeData,
  DateTimeConnectorData,
} from '@/types'

// Get functions from composables
const { createNode, isCreating } = useFlowNodes()
const { errors, validateForm, clearErrors } = useNodeValidation()

// Use Pinia store for flow chart data
const store = useFlowChartStore()

const isCardOpen = ref(false) // initial state of the card to be closed

const form = ref<CreateNodeForm>({
  // initial state of the form to be empty and set to sendMessage type as default
  title: '',
  description: '',
  type: 'sendMessage',
})

function openCard() {
  isCardOpen.value = true
  clearErrors() // clear any errors from the previous form submission
}

function closeCard() {
  isCardOpen.value = false
  form.value = { title: '', description: '', type: 'sendMessage' } // reset the form to initial state
  clearErrors() // clear any errors from the previous form submission
}

const maxAttempts = 100 // max attempts to generate a unique id

// Generate unique 6-char ID, checking against existing node IDs
function generateUniqueId(): string {
  const existingIds = store.nodes.map((node) => String(node.id)) // get all existing node ids

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const newId = Math.random().toString(36).substring(2, 8) // generate a random 6-char id

    if (!existingIds.includes(newId)) {
      return newId // return the unique id if it is not in the existing ids
    }
  }

  console.error('Unable to generate unique ID after', maxAttempts, 'attempts')
  return '' // return an empty string if the unique id is not found after the max attempts
}

function handleSubmit() {
  // Return if form is invalid
  if (!validateForm(form.value)) return

  const nodeId = generateUniqueId() // generate a unique id for the new node
  if (nodeId === '') {
    return // exit if the unique id is empty after the max attempts
  }

  let nodeData: SendMessageData | AddCommentData | DateTimeData

  // Assign node data based on form type
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
    case 'businessHours': {
      // Generate IDs for Success and Failure connector nodes
      const successId = generateUniqueId()
      const failureId = generateUniqueId()

      // Default time slots for business hours
      nodeData = {
        times: [
          { startTime: '09:00', endTime: '17:00', day: 'mon' },
          { startTime: '09:00', endTime: '17:00', day: 'tue' },
          { startTime: '09:00', endTime: '17:00', day: 'wed' },
          { startTime: '09:00', endTime: '17:00', day: 'thu' },
          { startTime: '09:00', endTime: '17:00', day: 'fri' },
          { startTime: '09:00', endTime: '17:00', day: 'sat' },
          { startTime: '09:00', endTime: '17:00', day: 'sun' },
        ],
        // Connectors for Success and Failure connector nodes
        connectors: [successId, failureId],
        // Default timezone for business hours
        timezone: 'UTC',
        // Action for business hours
        action: 'businessHours',
      }

      // Create the Business Hours node first
      const businessHoursNode: FlowNode = {
        id: nodeId,
        parentId: -1,
        type: 'dateTime',
        name: form.value.title,
        data: nodeData,
      }
      createNode(businessHoursNode) // create the business hours node

      // Auto-create Success connector node
      const successNode: FlowNode = {
        id: successId,
        parentId: nodeId, // Connected to Business Hours node
        type: 'dateTimeConnector',
        name: 'Success',
        data: { connectorType: 'success' } as DateTimeConnectorData,
      }
      createNode(successNode) // create the success node

      // Auto-create Failure connector node
      const failureNode: FlowNode = {
        id: failureId,
        parentId: nodeId, // Connected to Business Hours node
        type: 'dateTimeConnector',
        name: 'Failure',
        data: { connectorType: 'failure' } as DateTimeConnectorData,
      }
      createNode(failureNode) // create the failure node
      closeCard() // close the card
      return // exit after creating the nodes for businessHours
    }
  }

  // create the new node for sendMessage or addComment (businessHours returns early above)
  const newNode: FlowNode = {
    id: nodeId,
    parentId: -1, // -1 = orphan node (no parent); assigned -1 to all user-created nodes
    type: form.value.type,
    name: form.value.title,
    data: nodeData,
  }

  createNode(newNode) // create the new node
  closeCard() // close the card
}
</script>
