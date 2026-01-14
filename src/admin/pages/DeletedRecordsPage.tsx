import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import api from '../services/api';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import type { Demande } from '../types/admin';
import '../styles/admin.css';
import './DeletedRecordsPage.css';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="deleted-records-page">
      <div className="page-header">
        <h1>Corbeille</h1>
        <p>Consultez et restaurez les demandes supprimées.</p>
      </div>

      <div className="deleted-list">
        <div className="deleted-toolbar">
          <div className="toolbar-info">
            <Trash2 size={18} />
            <span>{deletedDemandes.length} élément(s) supprimé(s)</span>
          </div>
          <button className="toolbar-btn" onClick={fetchDeletedDemandes} title="Actualiser">
            <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>

        <div className="table-container">
          <table className="deleted-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Date de suppression</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="skeleton-cell" /></td>
                    ))}
                  </tr>
                ))
              ) : deletedDemandes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <Trash2 size={48} className="empty-icon" />
                    <p>La corbeille est vide</p>
                  </td>
                </tr>
              ) : (
                deletedDemandes.map((demande) => (
                  <tr key={demande.id}>
                    <td className="cell-name">{demande.nom}</td>
                    <td className="cell-email">{demande.email}</td>
                    <td className="cell-phone">{demande.telephone || '-'}</td>
                    <td>{demande.entreprise || '-'}</td>
                    <td className="cell-date">{formatDate(demande.updatedAt)}</td>
                    <td className="cell-actions">
                      <button
                        className="action-btn action-btn--restore"
                        onClick={() => setRestoreTarget(demande)}
                        title="Restaurer"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => setDeleteTarget(demande)}
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={16} />
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
