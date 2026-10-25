import { useState } from 'react';
import { Search, ListFilter, RefreshCw, Download, Eye, Trash2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatTime, initials, partnershipLabel } from '../../utils/format';
import { StatusBadge } from './StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import type { Demande, DemandeStatus, DemandesFilters } from '../../types/admin';

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

  return (
    <div className="demandes-list">
      <div className="demandes-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <Search size={15} />
            <input
              type="search"
              placeholder="Rechercher un nom, un email, une entreprise…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Rechercher une demande"
            />
          </div>

          <div className="filter-dropdown">
            <ListFilter size={15} />
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as DemandeStatus | '')}
              aria-label="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="En attente">En attente</option>
              <option value="Traité">Traité</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={onRefresh} title="Actualiser" aria-label="Actualiser">
            <RefreshCw size={15} className={isLoading ? 'spinning' : ''} />
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV} disabled={demandes.length === 0}>
            <Download size={15} />
            Exporter
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="demandes-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Téléphone</th>
              <th>Entreprise</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Reçue le</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}><div className="skeleton-cell" /></td>
                  ))}
                </tr>
              ))
            ) : demandes.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <div className="empty-state__inner">
                    <span className="empty-state__icon"><Inbox size={20} /></span>
                    <span className="empty-state__title">Aucune demande</span>
                    <span className="empty-state__text">
                      {filters.search || filters.status
                        ? 'Aucun résultat pour ces critères.'
                        : 'Les demandes envoyées depuis le site apparaîtront ici.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              demandes.map((demande) => (
                <tr key={demande.id}>
                  <td>
                    <div className="cell-person">
                      <span className="user-avatar" aria-hidden="true">{initials(demande.nom)}</span>
                      <div className="cell-person__text">
                        <span className="cell-person__name" title={demande.nom}>{demande.nom}</span>
                        <span className="cell-person__sub">{demande.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`cell-phone ${demande.telephone ? '' : 'cell-muted'}`}>
                    {demande.telephone || '—'}
                  </td>
                  <td className={`cell-truncate ${demande.entreprise ? '' : 'cell-muted'}`} title={demande.entreprise || undefined}>
                    {demande.entreprise || '—'}
                  </td>
                  <td className={demande.typePartenariat ? '' : 'cell-muted'}>
                    {partnershipLabel(demande.typePartenariat)}
                  </td>
                  <td>
                    <StatusBadge
                      status={demande.status}
                      editable
                      onChange={(status) => onStatusChange(demande.id, status)}
                    />
                  </td>
                  <td className="cell-date">
                    {formatDate(demande.createdAt)}
                    <small>{formatTime(demande.createdAt)}</small>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn action-btn--view"
                      onClick={() => onView(demande)}
                      title="Voir le détail"
                      aria-label={`Voir la demande de ${demande.nom}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteTarget(demande)}
                      title="Supprimer"
                      aria-label={`Supprimer la demande de ${demande.nom}`}
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

      <div className="pagination">
        <div className="pagination-info">
          <strong>{demandes.length > 0 ? ((page - 1) * limit) + 1 : 0}</strong>–<strong>{Math.min(page * limit, total)}</strong> sur <strong>{total}</strong> demande{total > 1 ? 's' : ''}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Page précédente"
          >
            <ChevronLeft size={15} />
            <span>Précédent</span>
          </button>

          <div className="pagination-pages">
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
              ) : (
                <button
                  key={pageNum}
                  className={`page-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum as number)}
                  aria-current={page === pageNum ? 'page' : undefined}
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
            aria-label="Page suivante"
          >
            <span>Suivant</span>
            <ChevronRight size={15} />
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
