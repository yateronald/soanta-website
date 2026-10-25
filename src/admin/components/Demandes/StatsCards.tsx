import { Inbox, Clock, CheckCircle2, CircleDot } from 'lucide-react';
import type { DemandesStats } from '../../types/admin';

interface StatsCardsProps {
  stats: DemandesStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    { label: 'Total des demandes', value: stats.total, icon: Inbox, color: 'blue' },
    { label: 'Nouvelles', value: stats.nouveau, icon: CircleDot, color: 'orange' },
    { label: 'En attente', value: stats.enAttente, icon: Clock, color: 'yellow' },
    { label: 'Traitées', value: stats.traite, icon: CheckCircle2, color: 'green' },
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
                <card.icon size={18} strokeWidth={2} />
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
