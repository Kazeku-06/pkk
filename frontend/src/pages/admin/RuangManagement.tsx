import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/Layout';
import { ruangApi } from '../../api/ruang';
import type { CreateRuangRequest, Ruang } from '../../types';

export const RuangManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRuang, setEditingRuang] = useState<Ruang | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateRuangRequest>();

  const { data: ruangList = [], isLoading } = useQuery({
    queryKey: ['ruang'],
    queryFn: ruangApi.getRuang,
  });

  const createMutation = useMutation({
    mutationFn: ruangApi.createRuang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruang'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateRuangRequest> }) =>
      ruangApi.updateRuang(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruang'] });
      setIsModalOpen(false);
      setEditingRuang(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ruangApi.deleteRuang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruang'] });
    },
  });

  const onSubmit = (data: CreateRuangRequest) => {
    if (editingRuang) {
      updateMutation.mutate({ id: editingRuang.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (ruang: Ruang) => {
    setEditingRuang(ruang);
    reset({
      nama_ruang: ruang.nama_ruang,
      jenis: ruang.jenis,
      menggunakan_kunci: ruang.menggunakan_kunci,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (ruang: Ruang) => {
    if (confirm(`Yakin ingin menghapus ruang ${ruang.nama_ruang}?`)) {
      deleteMutation.mutate(ruang.id);
    }
  };

  const openCreateModal = () => {
    setEditingRuang(null);
    reset();
    setIsModalOpen(true);
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
          <h1 className="text-3xl font-bold">Manajemen Ruang</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Tambah Ruang
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ruangList.map((ruang) => (
            <div key={ruang.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {ruang.nama_ruang}
                  <div className={`badge ${ruang.jenis === 'lab' ? 'badge-primary' : 'badge-secondary'}`}>
                    {ruang.jenis.toUpperCase()}
                  </div>
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-70">Menggunakan Kunci:</span>
                    <span className={`badge badge-sm ${ruang.menggunakan_kunci ? 'badge-success' : 'badge-ghost'}`}>
                      {ruang.menggunakan_kunci ? 'Ya' : 'Tidak'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm opacity-70">Fasilitas: </span>
                    <span className="text-sm">{ruang.fasilitas.length} item</span>
                  </div>
                  
                  {ruang.fasilitas.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs opacity-60 mb-1">Daftar Fasilitas:</div>
                      <div className="flex flex-wrap gap-1">
                        {ruang.fasilitas.slice(0, 3).map((fasilitas) => (
                          <span key={fasilitas.id} className="badge badge-outline badge-xs">
                            {fasilitas.nama_fasilitas}
                          </span>
                        ))}
                        {ruang.fasilitas.length > 3 && (
                          <span className="badge badge-outline badge-xs">
                            +{ruang.fasilitas.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(ruang)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(ruang)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ruangList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/60">Belum ada ruang yang terdaftar</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {editingRuang ? 'Edit Ruang' : 'Tambah Ruang Baru'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nama Ruang</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lab Komputer 1"
                    className={`input input-bordered ${errors.nama_ruang ? 'input-error' : ''}`}
                    {...register('nama_ruang', { required: 'Nama ruang harus diisi' })}
                  />
                  {errors.nama_ruang && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.nama_ruang.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Jenis Ruang</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.jenis ? 'select-error' : ''}`}
                    {...register('jenis', { required: 'Jenis ruang harus dipilih' })}
                  >
                    <option value="">Pilih jenis ruang</option>
                    <option value="lab">Laboratorium</option>
                    <option value="bengkel">Bengkel</option>
                  </select>
                  {errors.jenis && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.jenis.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">Menggunakan Kunci</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      {...register('menggunakan_kunci')}
                    />
                  </label>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingRuang(null);
                      reset();
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${
                      (createMutation.isPending || updateMutation.isPending) ? 'loading' : ''
                    }`}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingRuang ? 'Update' : 'Simpan'}
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