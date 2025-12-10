import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/Layout';
import { laporanApi } from '../../api/laporan';
import type { Laporan, RejectLaporanRequest } from '../../types';

export const LaporanValidation = () => {
  const queryClient = useQueryClient();
  const [selectedLaporan, setSelectedLaporan] = useState<Laporan | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<RejectLaporanRequest>();

  const { data: laporanList = [], isLoading } = useQuery({
    queryKey: ['admin-laporan', 'pending'],
    queryFn: () => laporanApi.getAdminLaporan('pending'),
  });

  const approveMutation = useMutation({
    mutationFn: laporanApi.approveLaporan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-laporan'] });
      setSelectedLaporan(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectLaporanRequest }) =>
      laporanApi.rejectLaporan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-laporan'] });
      setSelectedLaporan(null);
      setIsRejectModalOpen(false);
      reset();
    },
  });

  const handleApprove = (laporan: Laporan) => {
    if (confirm(`Yakin ingin menyetujui laporan dari ${laporan.user_name}?`)) {
      approveMutation.mutate(laporan.id);
    }
  };

  const handleRejectSubmit = (data: RejectLaporanRequest) => {
    if (selectedLaporan) {
      rejectMutation.mutate({ id: selectedLaporan.id, data });
    }
  };

  const openRejectModal = (laporan: Laporan) => {
    setSelectedLaporan(laporan);
    setIsRejectModalOpen(true);
    reset();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Validasi Laporan</h1>
          <div className="badge badge-warning badge-lg">
            {laporanList.length} Laporan Pending
          </div>
        </div>

        {laporanList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/60">Tidak ada laporan yang perlu divalidasi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {laporanList.map((laporan) => (
              <div key={laporan.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">
                      {laporan.user_name}
                      <div className="badge badge-warning">Pending</div>
                    </h2>
                    <div className="text-sm opacity-60">
                      {new Date(laporan.created_at!).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Kelas:</span>
                      <span>{laporan.user_kelas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ruang:</span>
                      <span>{laporan.ruang_nama}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Jam Pelajaran:</span>
                      <span>{laporan.jam_pelajaran} jam</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="font-medium mb-2">Fasilitas Digunakan:</div>
                    <div className="flex flex-wrap gap-1">
                      {laporan.fasilitas_digunakan.map((fasilitas, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {fasilitas}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="font-medium mb-2">Keterangan:</div>
                    <p className="text-sm bg-base-200 p-3 rounded">
                      {laporan.keterangan}
                    </p>
                  </div>

                  {/* Images */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="font-medium mb-2">Foto Kegiatan:</div>
                      <img
                        src={`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`}
                        alt="Foto Kegiatan"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`, '_blank')}
                      />
                    </div>
                    
                    {laporan.foto_kunci && (
                      <div>
                        <div className="font-medium mb-2">Foto Kunci:</div>
                        <img
                          src={`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`}
                          alt="Foto Kunci"
                          className="w-full h-48 object-cover rounded-lg cursor-pointer"
                          onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`, '_blank')}
                        />
                      </div>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button
                      className="btn btn-error"
                      onClick={() => openRejectModal(laporan)}
                    >
                      Tolak
                    </button>
                    <button
                      className={`btn btn-success ${approveMutation.isPending ? 'loading' : ''}`}
                      onClick={() => handleApprove(laporan)}
                      disabled={approveMutation.isPending}
                    >
                      Setujui
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {isRejectModalOpen && selectedLaporan && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Tolak Laporan</h3>
              <p className="py-4">
                Laporan dari <strong>{selectedLaporan.user_name}</strong> akan ditolak.
                Berikan alasan penolakan:
              </p>
              
              <form onSubmit={handleSubmit(handleRejectSubmit)} className="space-y-4">
                <div className="form-control">
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Masukkan alasan penolakan..."
                    {...register('alasan_penolakan', { required: true })}
                  ></textarea>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsRejectModalOpen(false);
                      setSelectedLaporan(null);
                      reset();
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-error ${rejectMutation.isPending ? 'loading' : ''}`}
                    disabled={rejectMutation.isPending}
                  >
                    Tolak Laporan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};