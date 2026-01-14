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

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="admin-main">
        <Header notificationBell={<NotificationBell />} />
        
        <main className="admin-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default Layout;
