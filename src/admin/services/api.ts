import type {
  LoginResponse,
  ApiResponse,
  User,
  Demande,
  DemandesListResponse,
  DemandesFilters,
  CreateUserRequest,
  DemandeStatus
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://soanta-api.onrender.com/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<ApiResponse<{ user: User }>>('/auth/me');
  }

  // Demandes endpoints
  async getDemandes(filters: DemandesFilters = {}): Promise<DemandesListResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    return this.request<DemandesListResponse>(
      `/demandes${queryString ? `?${queryString}` : ''}`
    );
  }

  async getDemandeById(id: number): Promise<ApiResponse<Demande>> {
    return this.request<ApiResponse<Demande>>(`/demandes/${id}`);
  }

  async updateDemandeStatus(
    id: number,
    status: DemandeStatus
  ): Promise<ApiResponse<Demande>> {
    return this.request<ApiResponse<Demande>>(`/demandes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteDemande(id: number): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/demandes/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreDemande(id: number): Promise<ApiResponse<Demande>> {
    return this.request<ApiResponse<Demande>>(`/demandes/${id}/restore`, {
      method: 'POST',
    });
  }

  async permanentDeleteDemande(id: number): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/demandes/${id}/permanent`, {
      method: 'DELETE',
    });
  }

  async getDeletedDemandes(): Promise<DemandesListResponse> {
    return this.request<DemandesListResponse>('/demandes?includeDeleted=true');
  }

  // Users endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/users');
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: number,
    userData: Partial<CreateUserRequest>
  ): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
