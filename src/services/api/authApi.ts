import { User, UserRole } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';

export const authApi = {
  async login(email: string, role?: UserRole, password: string = 'password123'): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await apiClient.post<{ success: boolean; data: { user: User; token: string }; message?: string }>('/auth/login', {
        email,
        password,
        role,
      });

      if (res.data.data?.token) {
        localStorage.setItem('reversely_auth_token', res.data.data.token);
      }

      return createResponse(res.data.data, res.data.message || 'Login successful');
    } catch {
      // Fallback to demo login if backend is running in demo mode or offline
      return this.getDemoUser(role || 'customer');
    }
  },

  async register(data: { name: string; email: string; password?: string; role: UserRole; companyName?: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const res = await apiClient.post<{ success: boolean; data: { user: User; token: string }; message?: string }>('/auth/register', {
      ...data,
      password: data.password || 'password123',
    });

    if (res.data.data?.token) {
      localStorage.setItem('reversely_auth_token', res.data.data.token);
    }

    return createResponse(res.data.data, res.data.message || 'Registration successful');
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return createResponse(res.data.data);
  },

  async getDemoUser(role: UserRole): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await apiClient.post<{ success: boolean; data: { user: User; token: string }; message?: string }>('/auth/demo-login', {
        role,
      });

      if (res.data.data?.token) {
        localStorage.setItem('reversely_auth_token', res.data.data.token);
      }

      return createResponse(res.data.data, 'Logged in as demo user');
    } catch {
      // Offline fallback
      const fallbackUser: User = {
        id: role === 'vendor' ? 'usr-2' : role === 'admin' ? 'usr-4' : 'usr-1',
        name: role === 'vendor' ? 'PrintHub Solutions' : role === 'admin' ? 'Admin Supervisor' : 'Saad Ahmed',
        email: `${role}@example.com`,
        role,
        companyName: role === 'vendor' ? 'PrintHub Pvt Ltd' : 'Apex Innovations',
        verified: true,
      };
      return createResponse({ user: fallbackUser, token: 'demo-local-token' });
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    localStorage.removeItem('reversely_auth_token');
    return createResponse(null, 'Logged out');
  },
};
