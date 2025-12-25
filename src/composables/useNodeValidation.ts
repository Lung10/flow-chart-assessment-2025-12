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
      title: !form.title.trim() ? 'Title is required' : undefined, // set the title error if the title is empty
      description:
        form.type !== 'businessHours' && !form.description.trim() // if the type is not business hours and the description is empty
          ? 'Description is required' // set the description error if the description is empty
          : undefined,
      type: !form.type ? 'Node type is required' : undefined, // set the type error if the type is empty
    }

    return !errors.value.title && !errors.value.description && !errors.value.type // return true if the form is valid
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
