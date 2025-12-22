import { ref, computed } from 'vue'
import type { CreateNodeForm } from '@/types'

interface ValidationErrors {
  title?: string
  description?: string
  type?: string
}

export function useNodeValidation() {
  const errors = ref<ValidationErrors>({})

  const validateTitle = (title: string): string | undefined => {
    if (!title.trim()) {
      return 'Title is required'
    }
    return undefined
  }

  const validateDescription = (description: string): string | undefined => {
    if (!description.trim()) {
      return 'Description is required'
    }
    return undefined
  }

  const validateType = (type: string): string | undefined => {
    const validTypes = ['sendMessage', 'addComment', 'businessHours']
    if (!type) {
      return 'Node type is required'
    }
    if (!validTypes.includes(type)) {
      return 'Invalid node type'
    }
    return undefined
  }

  const validateForm = (form: CreateNodeForm): boolean => {
    errors.value = {
      title: validateTitle(form.title),
      description: validateDescription(form.description),
      type: validateType(form.type),
    }

    return !errors.value.title && !errors.value.description && !errors.value.type
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const hasErrors = computed(() => {
    return Object.values(errors.value).some((error) => error !== undefined)
  })

  return {
    errors,
    hasErrors,
    validateForm,
    validateTitle,
    validateDescription,
    validateType,
    clearErrors,
  }
}
