import { ref } from 'vue'
import type { CreateNodeForm } from '@/types'

interface ValidationErrors {
  title?: string
  description?: string
  type?: string
}

// Validation for the create node form
export function useNodeValidation() {
  const errors = ref<ValidationErrors>({})

  const validateForm = (form: CreateNodeForm): boolean => {
    // validate the form and set the errors
    errors.value = {
      title: !form.title.trim() ? 'Title is required' : undefined,
      description: !form.description.trim() ? 'Description is required' : undefined,
      type: !form.type ? 'Node type is required' : undefined,
    }

    return !errors.value.title && !errors.value.description && !errors.value.type // return true if the form is valid, false otherwise
  }

  const clearErrors = () => {
    errors.value = {} // clear the errors
  }

  return {
    errors,
    validateForm,
    clearErrors,
  }
}
