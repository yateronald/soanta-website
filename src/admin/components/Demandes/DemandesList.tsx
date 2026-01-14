import { useState } from 'react';
import { Search, Filter, RefreshCw, Download, Eye, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import type { Demande, DemandeStatus, DemandesFilters } from '../../types/admin';
import './DemandesList.css';

interface DemandesListProps {
  demandes: Demande[];
  total: number;
  page: number;
  limit: number;
  filters: DemandesFilters;
  isLoading: boolean;
  onFiltersChange: (filters: DemandesFilters) => void;
  onStatusChange: (id: number, status: DemandeStatus) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onView: (demande: Demande) => void;
  onRefresh: () => void;
}

export function DemandesList({
  demandes,
  total,
  page,
  limit,
  filters,
  isLoading,
  onFiltersChange,
  onStatusChange,
  onDelete,
  onView,
  onRefresh,
}: DemandesListProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [deleteTarget, setDeleteTarget] = useState<Demande | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(total / limit);

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchValue, page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleStatusFilter = (status: DemandeStatus | '') => {
    onFiltersChange({ ...filters, status: status || undefined, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...filters, page: newPage });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await onDelete(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Type', 'Status', 'Date'];
    const rows = demandes.map(d => [
      d.id,
      d.nom,
      d.email,
      d.telephone || '',
      d.entreprise || '',
      d.typePartenariat || '',
      d.status,
      new Date(d.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demandes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="demandes-list">
      <div className="demandes-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <Search size={18} color="#6b7280" strokeWidth={2} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter size={18} color="#6b7280" strokeWidth={2} />
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as DemandeStatus | '')}
            >
              <option value="">Tous les statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="En attente">En attente</option>
              <option value="Traité">Traité</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={onRefresh} title="Actualiser" style={{ padding: 0 }}>
            <RefreshCw size={18} color="#6b7280" strokeWidth={2} className={isLoading ? 'spinning' : ''} />
          </button>
          <button className="toolbar-btn" onClick={exportToCSV} title="Exporter CSV" style={{ padding: 0 }}>
            <Download size={18} color="#6b7280" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="demandes-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Entreprise</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j}><div className="skeleton-cell" /></td>
                  ))}
                </tr>
              ))
            ) : demandes.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              demandes.map((demande) => (
                <tr key={demande.id}>
                  <td className="cell-name">{demande.nom}</td>
                  <td className="cell-email">{demande.email}</td>
                  <td className="cell-phone">{demande.telephone || '-'}</td>
                  <td>{demande.entreprise || '-'}</td>
                  <td>{demande.typePartenariat || '-'}</td>
                  <td>
                    <StatusBadge
                      status={demande.status}
                      editable
                      onChange={(status) => onStatusChange(demande.id, status)}
                    />
                  </td>
                  <td className="cell-date">{formatDate(demande.createdAt)}</td>
                  <td className="cell-actions">
                    <button
                      className="action-btn action-btn--view"
                      onClick={() => onView(demande)}
                      title="Voir détails"
                      style={{ padding: 0 }}
                    >
                      <Eye size={16} strokeWidth={2} color="#3b82f6" />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteTarget(demande)}
                      title="Supprimer"
                      style={{ padding: 0 }}
                    >
                      <Trash2 size={16} strokeWidth={2} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Always visible */}
      <div className="pagination">
        <div className="pagination-info">
          Affichage de <strong>{demandes.length > 0 ? ((page - 1) * limit) + 1 : 0}</strong> à <strong>{Math.min(page * limit, total)}</strong> sur <strong>{total}</strong> résultats
        </div>
        
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            ← Précédent
          </button>
          
          <div className="pagination-pages">
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
              ) : (
                <button
                  key={pageNum}
                  className={`page-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum as number)}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>
          
          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Suivant →
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer la demande"
        message={`Êtes-vous sûr de vouloir supprimer la demande de ${deleteTarget?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default DemandesList;
