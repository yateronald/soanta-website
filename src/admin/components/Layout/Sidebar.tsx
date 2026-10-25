import { NavLink } from 'react-router-dom';
import { ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { menuItems } from './navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img
          src={isCollapsed ? '/images/logo-mark.png' : '/images/logo-light.png'}
          alt="SOANTA"
          className="sidebar-logo"
        />
      </div>

      <p className="sidebar-section">Gestion</p>
      <nav className="sidebar-nav" aria-label="Navigation administration">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={isCollapsed ? item.label : undefined}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} strokeWidth={1.75} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link sidebar-link--site"
          title={isCollapsed ? 'Voir le site' : undefined}
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          {!isCollapsed && <span>Voir le site</span>}
        </a>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
          aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={16} strokeWidth={1.75} />
          ) : (
            <>
              <PanelLeftClose size={16} strokeWidth={1.75} />
              <span>Replier</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
