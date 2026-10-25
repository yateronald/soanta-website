import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/login.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/admin');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-brand">
        <img src="/images/logo-light.png" alt="SOANTA" className="login-brand__logo" />
        <div className="login-brand__text">
          <p className="login-brand__eyebrow">Espace d'administration</p>
          <h2 className="login-brand__title">
            Racines d'Afrique,
            <br />
            <em>saveurs du monde.</em>
          </h2>
          <p className="login-brand__lead">
            Suivez les demandes de partenariat et gérez les accès de votre équipe.
          </p>
        </div>
        <p className="login-brand__footer">© {new Date().getFullYear()} SOANTA — San Pedro, Côte d'Ivoire</p>
      </aside>

      <main className="login-panel">
        <div className="login-card">
          <img src="/images/logo-mark.png" alt="" className="login-logo" aria-hidden="true" />
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Accédez au tableau de bord SOANTA.</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">Adresse email</label>
              <input
                id="login-email"
                type="email"
                placeholder="nom@soanta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                disabled={isLoading}
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Mot de passe</label>
              <div className="login-password">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="login-input"
                />
                <button
                  type="button"
                  className="login-password__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <a href="/" className="login-back">
            <ArrowLeft size={14} />
            Retour au site
          </a>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
