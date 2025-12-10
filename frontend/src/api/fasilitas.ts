import { apiClient } from './client';
import type { Fasilitas, CreateFasilitasRequest } from '../types';

export const fasilitasApi = {
  getFasilitas: async (ruangId?: number): Promise<Fasilitas[]> => {
    const params = ruangId ? { ruang_id: ruangId } : {};
    const response = await apiClient.get('/admin/fasilitas', { params });
    return response.data.fasilitas;
  },

  createFasilitas: async (data: CreateFasilitasRequest): Promise<Fasilitas> => {
    const response = await apiClient.post('/admin/fasilitas', data);
    return response.data.fasilitas;
  },

  deleteFasilitas: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/fasilitas/${id}`);
  },
};