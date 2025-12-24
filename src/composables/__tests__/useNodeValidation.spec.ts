import { describe, it, expect, beforeEach } from 'vitest'
import { useNodeValidation } from '../useNodeValidation'

// Test suite for useNodeValidation composable
describe('useNodeValidation', () => {
  // Variables to hold the composable's return values
  let errors: ReturnType<typeof useNodeValidation>['errors']
  let validateForm: ReturnType<typeof useNodeValidation>['validateForm']
  let clearErrors: ReturnType<typeof useNodeValidation>['clearErrors']

  // Run before each test - get fresh instance of the composable
  beforeEach(() => {
    const validation = useNodeValidation()
    errors = validation.errors
    validateForm = validation.validateForm
    clearErrors = validation.clearErrors
  })

  // Test: Valid form should pass validation
  it('should return true for valid form', () => {
    const validForm = {
      title: 'My Node',
      description: 'This is a description',
      type: 'sendMessage' as const,
    }

    const result = validateForm(validForm)

    expect(result).toBe(true)
    expect(errors.value.title).toBeUndefined()
    expect(errors.value.description).toBeUndefined()
    expect(errors.value.type).toBeUndefined()
  })

  // Test: Empty title should fail validation
  it('should return error for empty title', () => {
    const invalidForm = {
      title: '',
      description: 'Some description',
      type: 'sendMessage' as const,
    }

    const result = validateForm(invalidForm)

    expect(result).toBe(false)
    expect(errors.value.title).toBe('Title is required')
  })

  // Test: Empty description should fail validation
  it('should return error for empty description', () => {
    const invalidForm = {
      title: 'My Node',
      description: '',
      type: 'sendMessage' as const,
    }

    const result = validateForm(invalidForm)

    expect(result).toBe(false)
    expect(errors.value.description).toBe('Description is required')
  })

  // Test: Whitespace-only values should fail validation
  it('should return error for whitespace-only values', () => {
    const invalidForm = {
      title: '   ',
      description: '   ',
      type: 'sendMessage' as const,
    }

    const result = validateForm(invalidForm)

    expect(result).toBe(false)
    expect(errors.value.title).toBe('Title is required')
    expect(errors.value.description).toBe('Description is required')
  })

  // Test: clearErrors should reset all errors
  it('should clear all errors', () => {
    // First, create some errors
    validateForm({ title: '', description: '', type: 'sendMessage' as const })

    // Then clear them
    clearErrors()

    expect(errors.value.title).toBeUndefined()
    expect(errors.value.description).toBeUndefined()
    expect(errors.value.type).toBeUndefined()
  })
})
