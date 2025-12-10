import { apiClient } from './client';
import type { Laporan, CreateLaporanRequest, RejectLaporanRequest } from '../types';

export const laporanApi = {
  // Siswa endpoints
  createLaporan: async (data: CreateLaporanRequest): Promise<Laporan> => {
    const formData = new FormData();
    formData.append('ruang_id', data.ruang_id.toString());
    formData.append('foto_kegiatan', data.foto_kegiatan);
    if (data.foto_kunci) {
      formData.append('foto_kunci', data.foto_kunci);
    }
    formData.append('jam_pelajaran', data.jam_pelajaran.toString());
    formData.append('fasilitas_digunakan', JSON.stringify(data.fasilitas_digunakan));
    formData.append('keterangan', data.keterangan);

    const response = await apiClient.post('/laporan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.laporan;
  },

  getMyLaporan: async (): Promise<Laporan[]> => {
    const response = await apiClient.get('/laporan/me');
    return response.data.laporan;
  },

  // Admin endpoints
  getAdminLaporan: async (status: string = 'pending'): Promise<Laporan[]> => {
    const response = await apiClient.get('/admin/laporan', {
      params: { status },
    });
    return response.data.laporan;
  },

  getLaporanDetail: async (id: number): Promise<Laporan> => {
    const response = await apiClient.get(`/admin/laporan/${id}`);
    return response.data.laporan;
  },

  approveLaporan: async (id: number): Promise<Laporan> => {
    const response = await apiClient.put(`/admin/laporan/${id}/approve`);
    return response.data.laporan;
  },

  rejectLaporan: async (id: number, data: RejectLaporanRequest): Promise<Laporan> => {
    const response = await apiClient.put(`/admin/laporan/${id}/reject`, data);
    return response.data.laporan;
  },

  getLaporanHistory: async (filters?: {
    tanggal?: string;
    kelas?: string;
    ruang_id?: number;
    status?: string;
    user_id?: number;
  }): Promise<Laporan[]> => {
    const response = await apiClient.get('/admin/laporan/history', {
      params: filters,
    });
    return response.data.laporan;
  },
};