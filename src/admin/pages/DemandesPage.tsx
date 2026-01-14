import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StatsCards } from '../components/Demandes/StatsCards';
import { DemandesList } from '../components/Demandes/DemandesList';
import { DemandeDetail } from '../components/Demandes/DemandeDetail';
import { useDemandes } from '../hooks/useDemandes';
import type { Demande } from '../types/admin';
import '../styles/admin.css';

export function DemandesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  
  const {
    demandes,
    stats,
    total,
    page,
    limit,
    isLoading,
    filters,
    setFilters,
    refresh,
    updateStatus,
    deleteDemande,
    getDemandeById,
  } = useDemandes();

  // Handle deep link to specific demande
  useEffect(() => {
    const demandeId = searchParams.get('demande');
    if (demandeId) {
      const id = parseInt(demandeId, 10);
      if (!isNaN(id)) {
        getDemandeById(id).then((demande) => {
          if (demande) {
            setSelectedDemande(demande);
          }
        });
      }
    }
  }, [searchParams, getDemandeById]);

  const handleView = (demande: Demande) => {
    setSelectedDemande(demande);
    setSearchParams({ demande: demande.id.toString() });
  };

  const handleCloseDetail = () => {
    setSelectedDemande(null);
    setSearchParams({});
  };

  const handleStatusChange = async (id: number, status: Demande['status']) => {
    const success = await updateStatus(id, status);
    if (success && selectedDemande?.id === id) {
      setSelectedDemande({ ...selectedDemande, status });
    }
    return success;
  };

  return (
    <div className="demandes-page">
      <div className="page-header">
        <h1>Demandes de contact</h1>
        <p>Gérez les demandes de partenariat reçues via le formulaire de contact.</p>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />

      <DemandesList
        demandes={demandes}
        total={total}
        page={page}
        limit={limit}
        filters={filters}
        isLoading={isLoading}
        onFiltersChange={setFilters}
        onStatusChange={handleStatusChange}
        onDelete={deleteDemande}
        onView={handleView}
        onRefresh={refresh}
      />

      <DemandeDetail
        demande={selectedDemande}
        isOpen={!!selectedDemande}
        onClose={handleCloseDetail}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default DemandesPage;
