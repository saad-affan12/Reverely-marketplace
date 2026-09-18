import { User, UserRole } from '../../types';
import { mockUsers } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

export const authApi = {
  async login(email: string, role?: UserRole): Promise<ApiResponse<User>> {
    await delay(300);
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)
    );
    if (found) {
      return createResponse(found, 'Login successful');
    }
    // Fallback default role user if email matches demo role
    if (email === 'customer@example.com') return createResponse(mockUsers[0]);
    if (email === 'vendor@example.com') return createResponse(mockUsers[1]);
    if (email === 'admin@example.com') return createResponse(mockUsers[3]);

    throw new Error('Invalid credentials');
  },

  async getDemoUser(role: UserRole): Promise<ApiResponse<User>> {
    await delay(150);
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    return createResponse(user);
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(150);
    return createResponse(null, 'Logged out');
  },
};
