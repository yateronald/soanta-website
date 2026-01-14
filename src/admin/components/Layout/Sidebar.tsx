import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Trash2, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/admin', icon: FileText, label: 'Demandes', end: true },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/admin/deleted', icon: Trash2, label: 'Supprimés' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img 
          src="/images/logo.png" 
          alt="SOANTA" 
          className="sidebar-logo"
        />
        {!isCollapsed && <span className="sidebar-brand">SOANTA</span>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
}

export default Sidebar;
