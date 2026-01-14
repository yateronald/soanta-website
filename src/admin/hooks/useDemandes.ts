import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { triggerNotificationRefresh } from '../components/Notifications/NotificationBell';
import type { Demande, DemandesStats, DemandesFilters, DemandeStatus } from '../types/admin';

interface UseDemandesReturn {
  demandes: Demande[];
  stats: DemandesStats;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  filters: DemandesFilters;
  setFilters: (filters: DemandesFilters) => void;
  refresh: () => Promise<void>;
  updateStatus: (id: number, status: DemandeStatus) => Promise<boolean>;
  deleteDemande: (id: number) => Promise<boolean>;
  getDemandeById: (id: number) => Promise<Demande | null>;
}

export function useDemandes(initialFilters: DemandesFilters = {}): UseDemandesReturn {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [stats, setStats] = useState<DemandesStats>({ total: 0, nouveau: 0, enAttente: 0, traite: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DemandesFilters>(initialFilters);

  const fetchDemandes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getDemandes(filters);
      if (response.success && response.data) {
        setDemandes(response.data.demandes);
        setStats(response.data.stats);
        setTotal(response.data.total);
        setPage(response.data.page);
        setLimit(response.data.limit);
      } else {
        setError(response.error?.message || 'Failed to fetch demandes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const updateStatus = useCallback(async (id: number, status: DemandeStatus): Promise<boolean> => {
    try {
      const response = await api.updateDemandeStatus(id, status);
      if (response.success) {
        await fetchDemandes();
        // Trigger notification refresh when status changes
        triggerNotificationRefresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchDemandes]);

  const deleteDemande = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await api.deleteDemande(id);
      if (response.success) {
        await fetchDemandes();
        // Trigger notification refresh when demande is deleted
        triggerNotificationRefresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchDemandes]);

  const getDemandeById = useCallback(async (id: number): Promise<Demande | null> => {
    try {
      const response = await api.getDemandeById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  return {
    demandes,
    stats,
    total,
    page,
    limit,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchDemandes,
    updateStatus,
    deleteDemande,
    getDemandeById,
  };
}

export default useDemandes;
