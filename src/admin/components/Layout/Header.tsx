import { LogOut, Menu, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { initials } from '../../utils/format';
import { menuItems } from './navigation';

interface HeaderProps {
  notificationBell?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({ notificationBell, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const current = menuItems.find((item) =>
    item.end ? pathname === item.path || pathname === `${item.path}/` : pathname.startsWith(item.path)
  );

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="header-menu" onClick={onMenuClick} aria-label="Ouvrir le menu">
          <Menu size={18} />
        </button>
        <div className="header-breadcrumb">
          <span>Administration</span>
          <ChevronRight size={14} />
          <strong>{current?.label ?? 'Tableau de bord'}</strong>
        </div>
      </div>

      <div className="header-actions">
        {notificationBell}

        <span className="header-divider" aria-hidden="true" />

        <div className="user-info">
          <div className="user-avatar" aria-hidden="true">
            {initials(user?.username || 'Admin')}
          </div>
          <div className="user-meta">
            <span className="user-name">{user?.username || 'Admin'}</span>
            <span className="user-role">
              {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
          title="Déconnexion"
          aria-label="Déconnexion"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

export default Header;
