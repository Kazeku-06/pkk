import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/Layout';
import { fasilitasApi } from '../../api/fasilitas';
import { ruangApi } from '../../api/ruang';
import type { CreateFasilitasRequest } from '../../types';

export const FasilitasManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRuangId, setSelectedRuangId] = useState<number | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFasilitasRequest>();

  const { data: ruangList = [] } = useQuery({
    queryKey: ['ruang'],
    queryFn: ruangApi.getRuang,
  });

  const { data: fasilitasList = [] } = useQuery({
    queryKey: ['fasilitas', selectedRuangId],
    queryFn: () => fasilitasApi.getFasilitas(selectedRuangId || undefined),
  });

  const createMutation = useMutation({
    mutationFn: fasilitasApi.createFasilitas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas'] });
      queryClient.invalidateQueries({ queryKey: ['ruang'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: fasilitasApi.deleteFasilitas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas'] });
      queryClient.invalidateQueries({ queryKey: ['ruang'] });
    },
  });

  const onSubmit = (data: CreateFasilitasRequest) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: number, nama: string) => {
    if (confirm(`Yakin ingin menghapus fasilitas ${nama}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    reset();
    setIsModalOpen(true);
  };

  const selectedRuang = ruangList.find(r => r.id === selectedRuangId);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manajemen Fasilitas</h1>
          <button 
            className="btn btn-primary" 
            onClick={openCreateModal}
            disabled={!selectedRuangId}
          >
            Tambah Fasilitas
          </button>
        </div>

        {/* Ruang Selector */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Pilih Ruang</h2>
            <div className="form-control">
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedRuangId || ''}
                onChange={(e) => setSelectedRuangId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Pilih ruang untuk melihat fasilitas</option>
                {ruangList.map((ruang) => (
                  <option key={ruang.id} value={ruang.id}>
                    {ruang.nama_ruang} ({ruang.jenis.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Fasilitas List */}
        {selectedRuangId && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Fasilitas - {selectedRuang?.nama_ruang}
                <div className={`badge ${selectedRuang?.jenis === 'lab' ? 'badge-primary' : 'badge-secondary'}`}>
                  {selectedRuang?.jenis.toUpperCase()}
                </div>
              </h2>
              
              {fasilitasList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-base-content/60">Belum ada fasilitas untuk ruang ini</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Fasilitas</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fasilitasList.map((fasilitas, index) => (
                        <tr key={fasilitas.id}>
                          <td>{index + 1}</td>
                          <td>{fasilitas.nama_fasilitas}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(fasilitas.id, fasilitas.nama_fasilitas)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedRuangId && (
          <div className="text-center py-12">
            <p className="text-base-content/60">Pilih ruang untuk melihat dan mengelola fasilitas</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Tambah Fasilitas Baru</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ruang</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.ruang_id ? 'select-error' : ''}`}
                    {...register('ruang_id', { 
                      required: 'Ruang harus dipilih',
                      valueAsNumber: true 
                    })}
                    defaultValue={selectedRuangId || ''}
                  >
                    <option value="">Pilih ruang</option>
                    {ruangList.map((ruang) => (
                      <option key={ruang.id} value={ruang.id}>
                        {ruang.nama_ruang} ({ruang.jenis.toUpperCase()})
                      </option>
                    ))}
                  </select>
                  {errors.ruang_id && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.ruang_id.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nama Fasilitas</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Komputer, Proyektor, Mesin Bubut"
                    className={`input input-bordered ${errors.nama_fasilitas ? 'input-error' : ''}`}
                    {...register('nama_fasilitas', { required: 'Nama fasilitas harus diisi' })}
                  />
                  {errors.nama_fasilitas && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.nama_fasilitas.message}</span>
                    </label>
                  )}
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      reset();
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${createMutation.isPending ? 'loading' : ''}`}
                    disabled={createMutation.isPending}
                  >
                    Simpan
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