import { apiClient } from './client';
import type { Ruang, CreateRuangRequest } from '../types';

export const ruangApi = {
  getRuang: async (): Promise<Ruang[]> => {
    const response = await apiClient.get('/admin/ruang');
    return response.data.ruang;
  },

  createRuang: async (data: CreateRuangRequest): Promise<Ruang> => {
    const response = await apiClient.post('/admin/ruang', data);
    return response.data.ruang;
  },

  updateRuang: async (id: number, data: Partial<CreateRuangRequest>): Promise<Ruang> => {
    const response = await apiClient.put(`/admin/ruang/${id}`, data);
    return response.data.ruang;
  },

  deleteRuang: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/ruang/${id}`);
  },
};