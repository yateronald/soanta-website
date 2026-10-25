import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import NotificationBell from '../Notifications/NotificationBell';
import '../../styles/admin.css';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
    >
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />

      <div className="admin-main">
        <Header
          notificationBell={<NotificationBell />}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="admin-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default Layout;
