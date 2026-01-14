import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { DemandesStats } from '../../types/admin';
import './StatsCards.css';

interface StatsCardsProps {
  stats: DemandesStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    { label: 'Total', value: stats.total, icon: FileText, color: 'blue' },
    { label: 'Nouveau', value: stats.nouveau, icon: AlertCircle, color: 'orange' },
    { label: 'En attente', value: stats.enAttente, icon: Clock, color: 'yellow' },
    { label: 'Traité', value: stats.traite, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-card--${card.color}`}>
          {isLoading ? (
            <div className="stat-card__skeleton">
              <div className="skeleton-icon" />
              <div className="skeleton-text" />
            </div>
          ) : (
            <>
              <div className="stat-card__icon">
                <card.icon size={24} />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value">{card.value}</span>
                <span className="stat-card__label">{card.label}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
