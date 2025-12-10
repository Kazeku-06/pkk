import { apiClient } from './client';
import type { User, CreateUserRequest } from '../types';

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data.users;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/admin/users', data);
    return response.data.user;
  },

  updateUser: async (id: number, data: Partial<CreateUserRequest>): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data.user;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },
};