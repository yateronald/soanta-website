import { useState } from 'react'
import type { FormEvent } from 'react'
import SectionTitle from '../shared/SectionTitle'
import Button from '../shared/Button'
import useFormValidation from '../../hooks/useFormValidation'
import type { ContactFormData } from '../../hooks/useFormValidation'
import './ContactForm.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://soanta-api.onrender.com/api'

const partnershipTypes = [
  { value: '', label: 'Sélectionnez un type de partenariat' },
  { value: 'co-investissement', label: 'Co-investissement' },
  { value: 'export', label: 'Accords Export' },
  { value: 'agro-ecologie', label: 'Projets Agro-écologiques' },
  { value: 'logistique', label: 'Logistique' },
  { value: 'autre', label: 'Autre' }
]

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    typePartenariat: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const { validate, getFieldError, clearErrors } = useFormValidation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    const result = validate(formData)
    
    if (result.isValid) {
      setIsSubmitting(true)
      
      try {
        const response = await fetch(`${API_BASE_URL}/demandes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Show loading for 3 seconds before displaying success modal
          await new Promise(resolve => setTimeout(resolve, 3000))
          setIsSubmitting(false)
          setShowSuccessModal(true)
          setFormData({
            nom: '',
            email: '',
            telephone: '',
            entreprise: '',
            typePartenariat: '',
            message: ''
          })
          clearErrors()
        } else {
          setIsSubmitting(false)
          setSubmitError(data.error?.message || 'Une erreur est survenue. Veuillez réessayer.')
        }
      } catch {
        setIsSubmitting(false)
        setSubmitError('Impossible de contacter le serveur. Veuillez réessayer plus tard.')
      }
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <section id="contact" className="contact-form">
      <div className="contact-form__container">
        <SectionTitle 
          title="Contactez-nous" 
          subtitle="Vous souhaitez devenir partenaire ? Remplissez le formulaire ci-dessous"
        />
        
        <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div className="contact-form__submit-error" role="alert">
              {submitError}
            </div>
          )}
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="nom" className="contact-form__label">
                Nom <span className="contact-form__required">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`contact-form__input ${getFieldError('nom') ? 'contact-form__input--error' : ''}`}
                aria-label="Votre nom"
                aria-describedby={getFieldError('nom') ? 'nom-error' : undefined}
                aria-invalid={!!getFieldError('nom')}
                disabled={isSubmitting}
              />
              {getFieldError('nom') && (
                <span id="nom-error" className="contact-form__error" role="alert">
                  {getFieldError('nom')}
                </span>
              )}
            </div>

            <div className="contact-form__field">
              <label htmlFor="email" className="contact-form__label">
                Email <span className="contact-form__required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`contact-form__input ${getFieldError('email') ? 'contact-form__input--error' : ''}`}
                aria-label="Votre adresse email"
                aria-describedby={getFieldError('email') ? 'email-error' : undefined}
                aria-invalid={!!getFieldError('email')}
                disabled={isSubmitting}
              />
              {getFieldError('email') && (
                <span id="email-error" className="contact-form__error" role="alert">
                  {getFieldError('email')}
                </span>
              )}
            </div>
          </div>

          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="telephone" className="contact-form__label">
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="contact-form__input"
                aria-label="Votre numéro de téléphone"
                placeholder="+33 6 12 34 56 78"
                disabled={isSubmitting}
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="entreprise" className="contact-form__label">
                Entreprise
              </label>
              <input
                type="text"
                id="entreprise"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                className="contact-form__input"
                aria-label="Nom de votre entreprise"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="typePartenariat" className="contact-form__label">
                Type de partenariat
              </label>
              <select
                id="typePartenariat"
                name="typePartenariat"
                value={formData.typePartenariat}
                onChange={handleChange}
                className="contact-form__select"
                aria-label="Type de partenariat souhaité"
                disabled={isSubmitting}
              >
                {partnershipTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="contact-form__field contact-form__field--full">
            <label htmlFor="message" className="contact-form__label">
              Message <span className="contact-form__required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`contact-form__textarea ${getFieldError('message') ? 'contact-form__input--error' : ''}`}
              aria-label="Votre message"
              aria-describedby={getFieldError('message') ? 'message-error' : undefined}
              aria-invalid={!!getFieldError('message')}
              disabled={isSubmitting}
            />
            {getFieldError('message') && (
              <span id="message-error" className="contact-form__error" role="alert">
                {getFieldError('message')}
              </span>
            )}
          </div>

          <div className="contact-form__submit">
            <Button 
              type="submit" 
              size="large"
              disabled={isSubmitting}
              aria-label="Envoyer le formulaire de contact"
            >
              {isSubmitting ? (
                <span className="contact-form__button-loading">
                  <span className="contact-form__spinner"></span>
                  Envoi en cours...
                </span>
              ) : 'Envoyer'}
            </Button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="contact-form__loading-overlay">
            <div className="contact-form__loading-content">
              <div className="contact-form__loading-spinner"></div>
              <p>Envoi de votre message...</p>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="contact-form__modal-overlay" onClick={closeSuccessModal}>
            <div className="contact-form__modal" onClick={(e) => e.stopPropagation()}>
              <div className="contact-form__modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,4 12,14.01 9,11.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="contact-form__modal-title">Message envoyé avec succès !</h3>
              <p className="contact-form__modal-text">
                Merci pour votre message. Un membre de notre équipe vous contactera dans les plus brefs délais.
              </p>
              <Button onClick={closeSuccessModal} size="large">
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
