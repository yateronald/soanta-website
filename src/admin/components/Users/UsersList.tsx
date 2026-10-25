import { useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Users as UsersIcon } from 'lucide-react';
import { formatDate, initials } from '../../utils/format';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import type { User } from '../../types/admin';

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: number;
  onEdit: (user: User) => void;
  onDelete: (id: number) => Promise<boolean>;
  onAdd: () => void;
  onRefresh: () => void;
}

export function UsersList({
  users,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
}: UsersListProps) {
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await onDelete(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="users-list">
      <div className="users-toolbar">
        <div className="toolbar-info">
          <strong>{users.length}</strong> compte{users.length > 1 ? 's' : ''} avec accès à l'administration
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={onRefresh} title="Actualiser" aria-label="Actualiser">
            <RefreshCw size={15} className={isLoading ? 'spinning' : ''} />
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus size={15} />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Créé le</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="skeleton-row">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j}><div className="skeleton-cell" /></td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  <div className="empty-state__inner">
                    <span className="empty-state__icon"><UsersIcon size={20} /></span>
                    <span className="empty-state__title">Aucun utilisateur</span>
                    <span className="empty-state__text">Ajoutez un compte pour donner accès à l'administration.</span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="cell-person">
                      <span className="user-avatar" aria-hidden="true">{initials(user.username)}</span>
                      <div className="cell-person__text">
                        <span className="cell-person__name">
                          {user.username}
                          {user.id === currentUserId && <span className="current-badge">Vous</span>}
                        </span>
                        <span className="cell-person__sub">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-badge--${user.role}`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="cell-date">{formatDate(user.createdAt)}</td>
                  <td className="cell-actions">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => onEdit(user)}
                      title="Modifier"
                      aria-label={`Modifier ${user.username}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteTarget(user)}
                      title={user.id === currentUserId ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer'}
                      aria-label={`Supprimer ${user.username}`}
                      disabled={user.id === currentUserId}
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deleteTarget?.username}" ?`}
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

export default UsersList;
