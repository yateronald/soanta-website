import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Demande } from '../../types/admin';
import './NotificationBell.css';

// Custom event name for notification refresh
export const NOTIFICATION_REFRESH_EVENT = 'notification-refresh';

// Helper function to trigger notification refresh from anywhere
export function triggerNotificationRefresh() {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_REFRESH_EVENT));
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [recentDemandes, setRecentDemandes] = useState<Demande[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.getDemandes({ status: 'Nouveau', limit: 5 });
      if (response.success && response.data) {
        setNewCount(response.data.stats.nouveau);
        setRecentDemandes(response.data.demandes);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s

    // Listen for manual refresh events (when status changes)
    const handleRefresh = () => {
      fetchNotifications();
    };
    window.addEventListener(NOTIFICATION_REFRESH_EVENT, handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATION_REFRESH_EVENT, handleRefresh);
    };
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemandeClick = (id: number) => {
    setIsOpen(false);
    navigate(`/admin?demande=${id}`);
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="bell-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {newCount > 0 && (
          <span className="notification-badge">{newCount > 9 ? '9+' : newCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Nouvelles demandes</h4>
            {newCount > 0 && <span className="count-badge">{newCount}</span>}
          </div>

          <div className="notification-list">
            {recentDemandes.length === 0 ? (
              <div className="notification-empty">
                Aucune nouvelle demande
              </div>
            ) : (
              recentDemandes.map((demande) => (
                <button
                  key={demande.id}
                  className="notification-item"
                  onClick={() => handleDemandeClick(demande.id)}
                >
                  <div className="notification-content">
                    <span className="notification-name">{demande.nom}</span>
                    <span className="notification-email">{demande.email}</span>
                  </div>
                  <span className="notification-time">
                    {formatTimeAgo(demande.createdAt)}
                  </span>
                </button>
              ))
            )}
          </div>

          {recentDemandes.length > 0 && (
            <button 
              className="notification-footer"
              onClick={() => {
                setIsOpen(false);
                navigate('/admin');
              }}
            >
              Voir toutes les demandes
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}j`;
}

export default NotificationBell;
