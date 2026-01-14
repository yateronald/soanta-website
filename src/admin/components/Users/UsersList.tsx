import { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Shield, User as UserIcon } from 'lucide-react';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import type { User } from '../../types/admin';
import './UsersList.css';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="users-list">
      <div className="users-toolbar">
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={18} />
          Nouvel utilisateur
        </button>
        <button className="toolbar-btn" onClick={onRefresh} title="Actualiser">
          <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Actions</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="cell-user">
                    <div className="user-avatar">
                      {user.role === 'admin' ? <Shield size={16} /> : <UserIcon size={16} />}
                    </div>
                    <span className="user-name">{user.username}</span>
                    {user.id === currentUserId && (
                      <span className="current-badge">Vous</span>
                    )}
                  </td>
                  <td className="cell-email">{user.email}</td>
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
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteTarget(user)}
                      title="Supprimer"
                      disabled={user.id === currentUserId}
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
