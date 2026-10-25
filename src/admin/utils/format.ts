// Display helpers shared by the admin tables and dialogs

const PARTNERSHIP_LABELS: Record<string, string> = {
  'co-investissement': 'Co-investissement',
  export: 'Accords export',
  'agro-ecologie': 'Agro-écologie',
  logistique: 'Logistique',
  autre: 'Autre',
};

export function partnershipLabel(value?: string | null): string {
  if (!value) return '—';
  return PARTNERSHIP_LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateLong(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function initials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return letters.toUpperCase();
}
