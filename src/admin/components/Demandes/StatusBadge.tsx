import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { DemandeStatus } from '../../types/admin';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: DemandeStatus;
  onChange?: (status: DemandeStatus) => void;
  editable?: boolean;
}

const STATUS_OPTIONS: DemandeStatus[] = ['Nouveau', 'En attente', 'Traité'];

export function StatusBadge({ status, onChange, editable = false }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusClass = (s: DemandeStatus) => {
    switch (s) {
      case 'Nouveau': return 'status--nouveau';
      case 'En attente': return 'status--en-attente';
      case 'Traité': return 'status--traite';
      default: return '';
    }
  };

  const handleSelect = (newStatus: DemandeStatus) => {
    if (newStatus !== status && onChange) {
      onChange(newStatus);
    }
    setIsOpen(false);
  };

  if (!editable) {
    return (
      <span className={`status-badge ${getStatusClass(status)}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="status-badge-dropdown" ref={dropdownRef}>
      <button
        className={`status-badge status-badge--editable ${getStatusClass(status)}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {status}
        <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="status-dropdown">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              className={`status-option ${getStatusClass(option)} ${option === status ? 'active' : ''}`}
              onClick={() => handleSelect(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusBadge;
