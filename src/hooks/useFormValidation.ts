import { useState, useCallback } from 'react'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ContactFormData {
  nom: string
  email: string
  entreprise: string
  typePartenariat: string
  message: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateNom(nom: string): ValidationError | null {
  if (!nom || nom.trim().length < 2) {
    return {
      field: 'nom',
      message: 'Veuillez entrer votre nom (minimum 2 caractères)'
    }
  }
  return null
}

export function validateEmail(email: string): ValidationError | null {
  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      field: 'email',
      message: 'Veuillez entrer une adresse email valide'
    }
  }
  return null
}

export function validateMessage(message: string): ValidationError | null {
  if (!message || message.trim().length < 10) {
    return {
      field: 'message',
      message: 'Votre message doit contenir au moins 10 caractères'
    }
  }
  return null
}

export function validateForm(data: ContactFormData): ValidationResult {
  const errors: ValidationError[] = []
  
  const nomError = validateNom(data.nom)
  if (nomError) errors.push(nomError)
  
  const emailError = validateEmail(data.email)
  if (emailError) errors.push(emailError)
  
  const messageError = validateMessage(data.message)
  if (messageError) errors.push(messageError)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default function useFormValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState(false)

  const validate = useCallback((data: ContactFormData): ValidationResult => {
    const result = validateForm(data)
    setErrors(result.errors)
    setIsValid(result.isValid)
    return result
  }, [])

  const getFieldError = useCallback((field: string): string | undefined => {
    const error = errors.find(e => e.field === field)
    return error?.message
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors([])
    setIsValid(false)
  }, [])

  return {
    errors,
    isValid,
    validate,
    getFieldError,
    clearErrors
  }
}
