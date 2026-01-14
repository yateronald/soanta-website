// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  error?: ApiError;
}

// Demande types
export type DemandeStatus = 'Nouveau' | 'En attente' | 'Traité';

export interface Demande {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  typePartenariat: string | null;
  message: string;
  status: DemandeStatus;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface DemandesStats {
  total: number;
  nouveau: number;
  enAttente: number;
  traite: number;
}

export interface DemandesListResponse {
  success: boolean;
  data?: {
    demandes: Demande[];
    total: number;
    page: number;
    limit: number;
    stats: DemandesStats;
  };
  error?: ApiError;
}

// API types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create user types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

// Filter types
export interface DemandesFilters {
  status?: DemandeStatus;
  search?: string;
  page?: number;
  limit?: number;
}
