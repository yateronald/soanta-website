import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import type { User, CreateUserRequest } from '../types/admin';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<boolean>;
  updateUser: (id: number, userData: Partial<CreateUserRequest>) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<boolean> => {
    try {
      const response = await api.createUser(userData);
      if (response.success) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, userData: Partial<CreateUserRequest>): Promise<boolean> => {
    try {
      const response = await api.updateUser(id, userData);
      if (response.success) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await api.deleteUser(id);
      if (response.success) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

export default useUsers;
