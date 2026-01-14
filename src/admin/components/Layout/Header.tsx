import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  notificationBell?: React.ReactNode;
}

export function Header({ notificationBell }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="admin-header">
      <div className="header-title">
        <h1>Tableau de Bord</h1>
        <p>Gestion intelligente</p>
      </div>

      <div className="header-actions">
        {notificationBell}
        
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <span className="user-name">{user?.username || 'Admin'}</span>
        </div>

        <button className="logout-button" onClick={logout} title="Déconnexion">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
