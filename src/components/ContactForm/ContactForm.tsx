import { useState } from 'react'
import type { FormEvent } from 'react'
import SectionTitle from '../shared/SectionTitle'
import Button from '../shared/Button'
import useFormValidation from '../../hooks/useFormValidation'
import type { ContactFormData } from '../../hooks/useFormValidation'
import './ContactForm.css'

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
    entreprise: '',
    typePartenariat: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { validate, getFieldError, clearErrors } = useFormValidation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const result = validate(formData)
    
    if (result.isValid) {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form
      setFormData({
        nom: '',
        email: '',
        entreprise: '',
        typePartenariat: '',
        message: ''
      })
      clearErrors()
    }
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="contact-form">
        <div className="contact-form__container">
          <div className="contact-form__success">
            <span className="contact-form__success-icon">✓</span>
            <h3>Message envoyé avec succès !</h3>
            <p>Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais.</p>
            <Button onClick={() => setIsSubmitted(false)}>
              Envoyer un autre message
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="contact-form">
      <div className="contact-form__container">
        <SectionTitle 
          title="Contactez-nous" 
          subtitle="Vous souhaitez devenir partenaire ? Remplissez le formulaire ci-dessous"
        />
        
        <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
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
              />
            </div>

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
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
