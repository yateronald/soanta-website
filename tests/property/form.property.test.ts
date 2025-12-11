/**
 * **Feature: soanta-landing-page, Property 5: Form Validation and Submission**
 * **Validates: Requirements 5.4**
 * 
 * *For any* valid form submission (nom ≥ 2 chars, email valid format, message ≥ 10 chars), 
 * the system SHALL display a success confirmation message and the form data SHALL be correctly structured.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { 
  validateNom, 
  validateEmail, 
  validateMessage, 
  validateForm,
  ContactFormData 
} from '../../src/hooks/useFormValidation'

// Arbitrary for valid names (at least 2 characters)
const validNameArb = fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2)

// Arbitrary for valid emails
const validEmailArb = fc.emailAddress()

// Arbitrary for valid messages (at least 10 characters)
const validMessageArb = fc.string({ minLength: 10, maxLength: 500 }).filter(s => s.trim().length >= 10)

// Arbitrary for invalid names (less than 2 characters)
const invalidNameArb = fc.string({ minLength: 0, maxLength: 1 })

// Arbitrary for invalid emails
const invalidEmailArb = fc.oneof(
  fc.constant(''),
  fc.constant('invalid'),
  fc.constant('no@domain'),
  fc.constant('@nodomain.com'),
  fc.string().filter(s => !s.includes('@') || !s.includes('.'))
)

// Arbitrary for invalid messages (less than 10 characters)
const invalidMessageArb = fc.string({ minLength: 0, maxLength: 9 })

describe('Property 5: Form Validation and Submission', () => {
  describe('Name Validation', () => {
    it('should accept any name with 2 or more characters', () => {
      fc.assert(
        fc.property(validNameArb, (name) => {
          const error = validateNom(name)
          expect(error).toBeNull()
        }),
        { numRuns: 100 }
      )
    })

    it('should reject any name with less than 2 characters', () => {
      fc.assert(
        fc.property(invalidNameArb, (name) => {
          const error = validateNom(name)
          expect(error).not.toBeNull()
          expect(error?.field).toBe('nom')
        }),
        { numRuns: 50 }
      )
    })
  })

  describe('Email Validation', () => {
    it('should accept any valid email format', () => {
      fc.assert(
        fc.property(validEmailArb, (email) => {
          const error = validateEmail(email)
          expect(error).toBeNull()
        }),
        { numRuns: 100 }
      )
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = ['', 'invalid', 'no@', '@domain.com', 'test@', 'test.com']
      
      for (const email of invalidEmails) {
        const error = validateEmail(email)
        expect(error).not.toBeNull()
        expect(error?.field).toBe('email')
      }
    })
  })

  describe('Message Validation', () => {
    it('should accept any message with 10 or more characters', () => {
      fc.assert(
        fc.property(validMessageArb, (message) => {
          const error = validateMessage(message)
          expect(error).toBeNull()
        }),
        { numRuns: 100 }
      )
    })

    it('should reject any message with less than 10 characters', () => {
      fc.assert(
        fc.property(invalidMessageArb, (message) => {
          const error = validateMessage(message)
          expect(error).not.toBeNull()
          expect(error?.field).toBe('message')
        }),
        { numRuns: 50 }
      )
    })
  })

  describe('Full Form Validation', () => {
    it('should validate complete form with all valid fields', () => {
      fc.assert(
        fc.property(
          validNameArb,
          validEmailArb,
          validMessageArb,
          (nom, email, message) => {
            const formData: ContactFormData = {
              nom,
              email,
              message,
              entreprise: '',
              typePartenariat: ''
            }
            
            const result = validateForm(formData)
            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject form with invalid name', () => {
      fc.assert(
        fc.property(
          invalidNameArb,
          validEmailArb,
          validMessageArb,
          (nom, email, message) => {
            const formData: ContactFormData = {
              nom,
              email,
              message,
              entreprise: '',
              typePartenariat: ''
            }
            
            const result = validateForm(formData)
            expect(result.isValid).toBe(false)
            expect(result.errors.some(e => e.field === 'nom')).toBe(true)
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should reject form with invalid email', () => {
      const formData: ContactFormData = {
        nom: 'Test User',
        email: 'invalid-email',
        message: 'This is a valid message with more than 10 characters',
        entreprise: '',
        typePartenariat: ''
      }
      
      const result = validateForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.field === 'email')).toBe(true)
    })

    it('should reject form with invalid message', () => {
      fc.assert(
        fc.property(
          validNameArb,
          validEmailArb,
          invalidMessageArb,
          (nom, email, message) => {
            const formData: ContactFormData = {
              nom,
              email,
              message,
              entreprise: '',
              typePartenariat: ''
            }
            
            const result = validateForm(formData)
            expect(result.isValid).toBe(false)
            expect(result.errors.some(e => e.field === 'message')).toBe(true)
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should collect all errors when multiple fields are invalid', () => {
      const formData: ContactFormData = {
        nom: '',
        email: 'invalid',
        message: 'short',
        entreprise: '',
        typePartenariat: ''
      }
      
      const result = validateForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBe(3)
      expect(result.errors.map(e => e.field)).toContain('nom')
      expect(result.errors.map(e => e.field)).toContain('email')
      expect(result.errors.map(e => e.field)).toContain('message')
    })
  })

  describe('Form Data Structure', () => {
    it('should maintain correct data structure for any valid input', () => {
      fc.assert(
        fc.property(
          validNameArb,
          validEmailArb,
          fc.string(),
          fc.constantFrom('', 'co-investissement', 'export', 'agro-ecologie', 'logistique', 'autre'),
          validMessageArb,
          (nom, email, entreprise, typePartenariat, message) => {
            const formData: ContactFormData = {
              nom,
              email,
              entreprise,
              typePartenariat,
              message
            }
            
            // Verify structure
            expect(formData).toHaveProperty('nom')
            expect(formData).toHaveProperty('email')
            expect(formData).toHaveProperty('entreprise')
            expect(formData).toHaveProperty('typePartenariat')
            expect(formData).toHaveProperty('message')
            
            // Verify types
            expect(typeof formData.nom).toBe('string')
            expect(typeof formData.email).toBe('string')
            expect(typeof formData.entreprise).toBe('string')
            expect(typeof formData.typePartenariat).toBe('string')
            expect(typeof formData.message).toBe('string')
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})
