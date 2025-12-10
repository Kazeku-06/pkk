import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/Layout';
import { laporanApi } from '../../api/laporan';
import { ruangApi } from '../../api/ruang';
import { usersApi } from '../../api/users';

interface FilterForm {
  tanggal: string;
  kelas: string;
  ruang_id: string;
  status: string;
  user_id: string;
}

export const LaporanHistory = () => {
  const [filters, setFilters] = useState<Partial<FilterForm>>({});
  const { register, handleSubmit, reset } = useForm<FilterForm>();

  const { data: laporanList = [], isLoading } = useQuery({
    queryKey: ['laporan-history', filters],
    queryFn: () => laporanApi.getLaporanHistory({
      tanggal: filters.tanggal || undefined,
      kelas: filters.kelas || undefined,
      ruang_id: filters.ruang_id ? Number(filters.ruang_id) : undefined,
      status: filters.status || undefined,
      user_id: filters.user_id ? Number(filters.user_id) : undefined,
    }),
  });

  const { data: ruangList = [] } = useQuery({
    queryKey: ['ruang'],
    queryFn: ruangApi.getRuang,
  });

  const { data: usersList = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });

  const onSubmit = (data: FilterForm) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );
    setFilters(cleanFilters);
  };

  const clearFilters = () => {
    reset();
    setFilters({});
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'disetujui':
        return <span className="badge badge-success">Disetujui</span>;
      case 'ditolak':
        return <span className="badge badge-error">Ditolak</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  // Get unique classes from users
  const uniqueClasses = [...new Set(usersList.map(user => user.kelas).filter(Boolean))];

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
          <h1 className="text-3xl font-bold">Riwayat Laporan</h1>
          <div className="badge badge-info badge-lg">
            {laporanList.length} Laporan
          </div>
        </div>

        {/* Filter Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Filter Laporan</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  {...register('tanggal')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kelas</span>
                </label>
                <select className="select select-bordered" {...register('kelas')}>
                  <option value="">Semua Kelas</option>
                  {uniqueClasses.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ruang</span>
                </label>
                <select className="select select-bordered" {...register('ruang_id')}>
                  <option value="">Semua Ruang</option>
                  {ruangList.map((ruang) => (
                    <option key={ruang.id} value={ruang.id}>
                      {ruang.nama_ruang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-bordered" {...register('status')}>
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Siswa</span>
                </label>
                <select className="select select-bordered" {...register('user_id')}>
                  <option value="">Semua Siswa</option>
                  {usersList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control flex flex-row gap-2 items-end">
                <button type="submit" className="btn btn-primary flex-1">
                  Filter
                </button>
                <button type="button" className="btn btn-ghost" onClick={clearFilters}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Hasil Filter</h2>
            
            {laporanList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60">Tidak ada laporan yang sesuai dengan filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Siswa</th>
                      <th>Kelas</th>
                      <th>Ruang</th>
                      <th>Jam Pelajaran</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporanList.map((laporan) => (
                      <tr key={laporan.id}>
                        <td>{new Date(laporan.created_at!).toLocaleDateString('id-ID')}</td>
                        <td>{laporan.user_name}</td>
                        <td>{laporan.user_kelas}</td>
                        <td>{laporan.ruang_nama}</td>
                        <td>{laporan.jam_pelajaran} jam</td>
                        <td>{getStatusBadge(laporan.status)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              // Open detail modal or navigate to detail page
                              const modal = document.getElementById(`modal_${laporan.id}`) as HTMLDialogElement;
                              modal?.showModal();
                            }}
                          >
                            Detail
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

        {/* Detail Modals */}
        {laporanList.map((laporan) => (
          <dialog key={laporan.id} id={`modal_${laporan.id}`} className="modal">
            <div className="modal-box w-11/12 max-w-4xl">
              <h3 className="font-bold text-lg">Detail Laporan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Informasi Siswa</h4>
                    <div className="bg-base-200 p-3 rounded">
                      <p><strong>Nama:</strong> {laporan.user_name}</p>
                      <p><strong>Kelas:</strong> {laporan.user_kelas}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Informasi Laporan</h4>
                    <div className="bg-base-200 p-3 rounded">
                      <p><strong>Ruang:</strong> {laporan.ruang_nama}</p>
                      <p><strong>Jam Pelajaran:</strong> {laporan.jam_pelajaran} jam</p>
                      <p><strong>Tanggal:</strong> {new Date(laporan.created_at!).toLocaleDateString('id-ID')}</p>
                      <p><strong>Status:</strong> {getStatusBadge(laporan.status)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Fasilitas Digunakan</h4>
                    <div className="bg-base-200 p-3 rounded">
                      <div className="flex flex-wrap gap-1">
                        {laporan.fasilitas_digunakan.map((fasilitas, index) => (
                          <span key={index} className="badge badge-outline">
                            {fasilitas}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Keterangan</h4>
                    <div className="bg-base-200 p-3 rounded">
                      <p>{laporan.keterangan}</p>
                    </div>
                  </div>
                  
                  {laporan.alasan_penolakan && (
                    <div>
                      <h4 className="font-semibold text-error">Alasan Penolakan</h4>
                      <div className="bg-error/10 p-3 rounded border border-error/20">
                        <p>{laporan.alasan_penolakan}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Foto Kegiatan</h4>
                    <img
                      src={`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`}
                      alt="Foto Kegiatan"
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                      onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`, '_blank')}
                    />
                  </div>
                  
                  {laporan.foto_kunci && (
                    <div>
                      <h4 className="font-semibold">Foto Kunci</h4>
                      <img
                        src={`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`}
                        alt="Foto Kunci"
                        className="w-full h-64 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`, '_blank')}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Tutup</button>
                </form>
              </div>
            </div>
          </dialog>
        ))}
      </div>
    </Layout>
  );
};