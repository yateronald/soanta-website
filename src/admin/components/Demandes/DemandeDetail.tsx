import { Mail, Phone } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { StatusBadge } from './StatusBadge';
import { formatDateLong, initials, partnershipLabel } from '../../utils/format';
import type { Demande, DemandeStatus } from '../../types/admin';

interface DemandeDetailProps {
  demande: Demande | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: DemandeStatus) => Promise<boolean>;
}

export function DemandeDetail({ demande, isOpen, onClose, onStatusChange }: DemandeDetailProps) {
  if (!demande) return null;

  const handleStatusChange = async (status: DemandeStatus) => {
    await onStatusChange(demande.id, status);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Demande #${demande.id}`} size="md">
      <div className="demande-detail">
        <div className="detail-header">
          <span className="user-avatar" aria-hidden="true">{initials(demande.nom)}</span>
          <div className="detail-heading">
            <h3>{demande.nom}</h3>
            <p>Reçue le {formatDateLong(demande.createdAt)}</p>
          </div>
          <StatusBadge status={demande.status} editable onChange={handleStatusChange} />
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <a href={`mailto:${demande.email}`} className="detail-value detail-link">
              {demande.email}
            </a>
          </div>

          <div className="detail-item">
            <span className="detail-label">Téléphone</span>
            {demande.telephone ? (
              <a href={`tel:${demande.telephone}`} className="detail-value detail-link">
                {demande.telephone}
              </a>
            ) : (
              <span className="detail-value detail-empty">Non renseigné</span>
            )}
          </div>

          <div className="detail-item">
            <span className="detail-label">Entreprise</span>
            <span className={`detail-value ${demande.entreprise ? '' : 'detail-empty'}`}>
              {demande.entreprise || 'Non renseignée'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Type de partenariat</span>
            <span className={`detail-value ${demande.typePartenariat ? '' : 'detail-empty'}`}>
              {demande.typePartenariat ? partnershipLabel(demande.typePartenariat) : 'Non précisé'}
            </span>
          </div>
        </div>

        <div className="detail-message">
          <span className="detail-label">Message</span>
          <div className="message-content">{demande.message}</div>
        </div>

        <div className="detail-actions">
          {demande.telephone && (
            <a href={`tel:${demande.telephone}`} className="btn btn-secondary">
              <Phone size={15} />
              Appeler
            </a>
          )}
          <a href={`mailto:${demande.email}`} className="btn btn-primary">
            <Mail size={15} />
            Répondre par email
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default DemandeDetail;
