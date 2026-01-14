import { Modal } from '../shared/Modal';
import { StatusBadge } from './StatusBadge';
import { User, Mail, Phone, Building, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import type { Demande, DemandeStatus } from '../../types/admin';
import './DemandeDetail.css';

interface DemandeDetailProps {
  demande: Demande | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: DemandeStatus) => Promise<boolean>;
}

export function DemandeDetail({ demande, isOpen, onClose, onStatusChange }: DemandeDetailProps) {
  if (!demande) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (status: DemandeStatus) => {
    await onStatusChange(demande.id, status);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de la demande" size="md">
      <div className="demande-detail">
        <div className="detail-header">
          <div className="detail-status">
            <span className="detail-label">Statut</span>
            <StatusBadge
              status={demande.status}
              editable
              onChange={handleStatusChange}
            />
          </div>
          <div className="detail-id">#{demande.id}</div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <User size={18} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Nom</span>
              <span className="detail-value">{demande.nom}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Mail size={18} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <a href={`mailto:${demande.email}`} className="detail-value detail-link">
                {demande.email}
              </a>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Phone size={18} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Téléphone</span>
              {demande.telephone ? (
                <a href={`tel:${demande.telephone}`} className="detail-value detail-link">
                  {demande.telephone}
                </a>
              ) : (
                <span className="detail-value detail-empty">-</span>
              )}
            </div>
          </div>

          {demande.entreprise && (
            <div className="detail-item">
              <div className="detail-icon">
                <Building size={18} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Entreprise</span>
                <span className="detail-value">{demande.entreprise}</span>
              </div>
            </div>
          )}

          {demande.typePartenariat && (
            <div className="detail-item">
              <div className="detail-icon">
                <Briefcase size={18} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Type de partenariat</span>
                <span className="detail-value">{demande.typePartenariat}</span>
              </div>
            </div>
          )}

          <div className="detail-item">
            <div className="detail-icon">
              <Calendar size={18} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Date de création</span>
              <span className="detail-value">{formatDate(demande.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="detail-message">
          <div className="message-header">
            <MessageSquare size={18} />
            <span>Message</span>
          </div>
          <div className="message-content">
            {demande.message}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DemandeDetail;
