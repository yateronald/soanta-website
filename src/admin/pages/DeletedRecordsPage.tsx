import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import api from '../services/api';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import type { Demande } from '../types/admin';
import { formatDate, formatTime, initials } from '../utils/format';

export function DeletedRecordsPage() {
  const [deletedDemandes, setDeletedDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoreTarget, setRestoreTarget] = useState<Demande | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Demande | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDeletedDemandes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getDeletedDemandes();
      if (response.success && response.data) {
        // Filter only deleted demandes
        const deleted = response.data.demandes.filter(d => d.isDeleted === 1);
        setDeletedDemandes(deleted);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedDemandes();
  }, [fetchDeletedDemandes]);

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setIsRestoring(true);
    try {
      const response = await api.restoreDemande(restoreTarget.id);
      if (response.success) {
        await fetchDeletedDemandes();
      }
    } catch {
      // Silently fail
    } finally {
      setIsRestoring(false);
      setRestoreTarget(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await api.permanentDeleteDemande(deleteTarget.id);
      if (response.success) {
        await fetchDeletedDemandes();
      }
    } catch {
      // Silently fail
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="deleted-records-page">
      <div className="page-header">
        <div>
          <h1>Corbeille</h1>
          <p>Restaurez une demande supprimée ou effacez-la définitivement.</p>
        </div>
      </div>

      <div className="deleted-list">
        <div className="deleted-toolbar">
          <div className="toolbar-info">
            <strong>{deletedDemandes.length}</strong> demande{deletedDemandes.length > 1 ? 's' : ''} dans la corbeille
          </div>
          <button className="toolbar-btn" onClick={fetchDeletedDemandes} title="Actualiser" aria-label="Actualiser">
            <RefreshCw size={15} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>

        <div className="table-container">
          <table className="deleted-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Supprimée le</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j}><div className="skeleton-cell" /></td>
                    ))}
                  </tr>
                ))
              ) : deletedDemandes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-state__inner">
                      <span className="empty-state__icon"><Trash2 size={20} /></span>
                      <span className="empty-state__title">La corbeille est vide</span>
                      <span className="empty-state__text">Les demandes supprimées apparaîtront ici.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                deletedDemandes.map((demande) => (
                  <tr key={demande.id}>
                    <td>
                      <div className="cell-person">
                        <span className="user-avatar" aria-hidden="true">{initials(demande.nom)}</span>
                        <div className="cell-person__text">
                          <span className="cell-person__name">{demande.nom}</span>
                          <span className="cell-person__sub">{demande.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`cell-phone ${demande.telephone ? '' : 'cell-muted'}`}>
                      {demande.telephone || '—'}
                    </td>
                    <td className={demande.entreprise ? '' : 'cell-muted'}>{demande.entreprise || '—'}</td>
                    <td className="cell-date">
                      {formatDate(demande.updatedAt)}
                      <small>{formatTime(demande.updatedAt)}</small>
                    </td>
                    <td className="cell-actions">
                      <button
                        className="action-btn action-btn--restore"
                        onClick={() => setRestoreTarget(demande)}
                        title="Restaurer"
                        aria-label={`Restaurer la demande de ${demande.nom}`}
                      >
                        <RotateCcw size={15} />
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => setDeleteTarget(demande)}
                        title="Supprimer définitivement"
                        aria-label={`Supprimer définitivement la demande de ${demande.nom}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!restoreTarget}
        title="Restaurer la demande"
        message={`Êtes-vous sûr de vouloir restaurer la demande de ${restoreTarget?.nom} ?`}
        confirmText="Restaurer"
        cancelText="Annuler"
        variant="info"
        isLoading={isRestoring}
        onConfirm={handleRestore}
        onClose={() => setRestoreTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer définitivement"
        message={`Êtes-vous sûr de vouloir supprimer définitivement la demande de ${deleteTarget?.nom} ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handlePermanentDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default DeletedRecordsPage;
