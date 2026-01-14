import { useState } from 'react';
import { UsersList } from '../components/Users/UsersList';
import { UserForm } from '../components/Users/UserForm';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import type { User, CreateUserRequest } from '../types/admin';
import '../styles/admin.css';

export function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { user: currentUser } = useAuth();
  const { users, isLoading, refresh, createUser, updateUser, deleteUser } = useUsers();

  const handleAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (userData: CreateUserRequest): Promise<boolean> => {
    if (editingUser) {
      return updateUser(editingUser.id, userData);
    }
    return createUser(userData);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gestion des utilisateurs</h1>
        <p>Gérez les comptes utilisateurs ayant accès au panneau d'administration.</p>
      </div>

      <UsersList
        users={users}
        isLoading={isLoading}
        currentUserId={currentUser?.id}
        onEdit={handleEdit}
        onDelete={deleteUser}
        onAdd={handleAdd}
        onRefresh={refresh}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        user={editingUser}
      />
    </div>
  );
}

export default UsersPage;
