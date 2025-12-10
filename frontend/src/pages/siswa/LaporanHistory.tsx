import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { laporanApi } from '../../api/laporan';

export const SiswaLaporanHistory = () => {
  const { data: laporanList = [], isLoading } = useQuery({
    queryKey: ['my-laporan'],
    queryFn: laporanApi.getMyLaporan,
  });

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

        {laporanList.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto text-base-content/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">Belum Ada Laporan</h3>
              <p className="text-base-content/60 mb-4">
                Anda belum membuat laporan penggunaan ruang produktif
              </p>
              <a href="/siswa/laporan/create" className="btn btn-primary">
                Buat Laporan Pertama
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {laporanList.map((laporan) => (
              <div key={laporan.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="card-title">
                      {laporan.ruang_nama}
                    </h2>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(laporan.status)}
                      <div className="text-sm opacity-60">
                        {new Date(laporan.created_at!).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Jam Pelajaran:</span>
                      <span>{laporan.jam_pelajaran} jam</span>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-2">Fasilitas Digunakan:</div>
                      <div className="flex flex-wrap gap-1">
                        {laporan.fasilitas_digunakan.map((fasilitas, index) => (
                          <span key={index} className="badge badge-outline badge-sm">
                            {fasilitas}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Keterangan:</div>
                      <p className="text-sm bg-base-200 p-3 rounded line-clamp-3">
                        {laporan.keterangan}
                      </p>
                    </div>

                    {laporan.alasan_penolakan && (
                      <div>
                        <div className="font-medium mb-2 text-error">Alasan Penolakan:</div>
                        <p className="text-sm bg-error/10 p-3 rounded border border-error/20">
                          {laporan.alasan_penolakan}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        const modal = document.getElementById(`modal_${laporan.id}`) as HTMLDialogElement;
                        modal?.showModal();
                      }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modals */}
        {laporanList.map((laporan) => (
          <dialog key={laporan.id} id={`modal_${laporan.id}`} className="modal">
            <div className="modal-box w-11/12 max-w-4xl">
              <h3 className="font-bold text-lg mb-4">Detail Laporan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Laporan</h4>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Ruang:</span>
                        <span className="font-medium">{laporan.ruang_nama}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jam Pelajaran:</span>
                        <span className="font-medium">{laporan.jam_pelajaran} jam</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal:</span>
                        <span className="font-medium">{new Date(laporan.created_at!).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getStatusBadge(laporan.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Fasilitas Digunakan</h4>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {laporan.fasilitas_digunakan.map((fasilitas, index) => (
                          <span key={index} className="badge badge-primary">
                            {fasilitas}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Keterangan</h4>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p className="text-sm">{laporan.keterangan}</p>
                    </div>
                  </div>
                  
                  {laporan.alasan_penolakan && (
                    <div>
                      <h4 className="font-semibold mb-2 text-error">Alasan Penolakan</h4>
                      <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                        <p className="text-sm">{laporan.alasan_penolakan}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Foto Kegiatan</h4>
                    <img
                      src={`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`}
                      alt="Foto Kegiatan"
                      className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kegiatan}`, '_blank')}
                    />
                    <p className="text-xs text-center mt-1 opacity-60">Klik untuk memperbesar</p>
                  </div>
                  
                  {laporan.foto_kunci && (
                    <div>
                      <h4 className="font-semibold mb-2">Foto Kunci</h4>
                      <img
                        src={`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`}
                        alt="Foto Kunci"
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(`http://localhost:5000/storage/uploads/${laporan.foto_kunci}`, '_blank')}
                      />
                      <p className="text-xs text-center mt-1 opacity-60">Klik untuk memperbesar</p>
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