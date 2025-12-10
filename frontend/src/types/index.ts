export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'siswa';
  kelas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ruang {
  id: number;
  nama_ruang: string;
  jenis: 'lab' | 'bengkel';
  menggunakan_kunci: boolean;
  created_at?: string;
  fasilitas: Fasilitas[];
}

export interface Fasilitas {
  id: number;
  ruang_id: number;
  nama_fasilitas: string;
}

export interface Laporan {
  id: number;
  user_id: number;
  user_name?: string;
  user_kelas?: string;
  ruang_id: number;
  ruang_nama?: string;
  foto_kegiatan: string;
  foto_kunci?: string;
  jam_pelajaran: number;
  fasilitas_digunakan: string[];
  keterangan: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  alasan_penolakan?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  kelas: string;
}

export interface CreateRuangRequest {
  nama_ruang: string;
  jenis: 'lab' | 'bengkel';
  menggunakan_kunci: boolean;
}

export interface CreateFasilitasRequest {
  ruang_id: number;
  nama_fasilitas: string;
}

export interface CreateLaporanRequest {
  ruang_id: number;
  foto_kegiatan: File;
  foto_kunci?: File;
  jam_pelajaran: number;
  fasilitas_digunakan: string[];
  keterangan: string;
}

export interface RejectLaporanRequest {
  alasan_penolakan: string;
}