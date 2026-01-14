import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../shared/Modal';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import type { User, CreateUserRequest } from '../../types/admin';
import './UserForm.css';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => Promise<boolean>;
  user?: User | null;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: '8 caractères minimum', test: (p) => p.length >= 8 },
  { label: 'Une lettre majuscule', test: (p) => /[A-Z]/.test(p) },
  { label: 'Une lettre minuscule', test: (p) => /[a-z]/.test(p) },
  { label: 'Un chiffre', test: (p) => /[0-9]/.test(p) },
  { label: 'Un caractère spécial (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function UserForm({ isOpen, onClose, onSubmit, user }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserRequest & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditing = !!user;

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const passed = passwordRequirements.filter(req => req.test(formData.password)).length;
    return {
      score: passed,
      percentage: (passed / passwordRequirements.length) * 100,
      label: passed === 0 ? '' : passed <= 2 ? 'Faible' : passed <= 4 ? 'Moyen' : 'Fort',
      color: passed <= 2 ? '#ef4444' : passed <= 4 ? '#f59e0b' : '#22c55e',
    };
  }, [formData.password]);

  // Check if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });
    }
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      setIsSubmitting(false);
      return;
    }
    
    // Password validation for new users
    if (!isEditing) {
      if (!formData.password.trim()) {
        setError('Le mot de passe est requis');
        setIsSubmitting(false);
        return;
      }
      
      // Check password strength
      if (passwordStrength.score < passwordRequirements.length) {
        setError('Le mot de passe ne respecte pas tous les critères de sécurité');
        setIsSubmitting(false);
        return;
      }
      
      // Check password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setIsSubmitting(false);
        return;
      }
    }
    
    // For editing with password change
    if (isEditing && formData.password) {
      if (passwordStrength.score < passwordRequirements.length) {
        setError('Le mot de passe ne respecte pas tous les critères de sécurité');
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setIsSubmitting(false);
        return;
      }
    }

    const dataToSubmit = isEditing && !formData.password
      ? { username: formData.username, email: formData.email, role: formData.role }
      : { username: formData.username, email: formData.email, password: formData.password, role: formData.role };

    const success = await onSubmit(dataToSubmit as CreateUserRequest);
    setIsSubmitting(false);

    if (success) {
      onClose();
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
      size="xl"
    >
      <form className="user-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Entrez le nom d'utilisateur"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez l'email"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Mot de passe {isEditing && <span className="optional">(laisser vide pour ne pas modifier)</span>}
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditing ? '••••••••' : 'Entrez le mot de passe'}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${passwordStrength.percentage}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                />
              </div>
              <span className="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </div>
          )}
          
          {/* Password requirements checklist */}
          {(formData.password || !isEditing) && (
            <div className="password-requirements">
              {passwordRequirements.map((req, index) => {
                const passed = req.test(formData.password);
                return (
                  <div 
                    key={index} 
                    className={`requirement ${passed ? 'passed' : ''}`}
                  >
                    {passed ? (
                      <Check size={14} className="requirement-icon passed" />
                    ) : (
                      <X size={14} className="requirement-icon" />
                    )}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm password field */}
        {(formData.password || !isEditing) && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                autoComplete="new-password"
                className={formData.confirmPassword ? (passwordsMatch ? 'input-valid' : 'input-invalid') : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className={`password-match ${passwordsMatch ? 'match' : 'no-match'}`}>
                {passwordsMatch ? (
                  <>
                    <Check size={14} />
                    <span>Les mots de passe correspondent</span>
                  </>
                ) : (
                  <>
                    <X size={14} />
                    <span>Les mots de passe ne correspondent pas</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="role">Rôle</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserForm;
