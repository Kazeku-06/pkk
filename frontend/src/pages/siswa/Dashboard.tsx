import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { laporanApi } from '../../api/laporan';
import { useAuth } from '../../hooks/useAuth';

export const SiswaDashboard = () => {
  const { user } = useAuth();
  
  const { data: myLaporan = [] } = useQuery({
    queryKey: ['my-laporan'],
    queryFn: laporanApi.getMyLaporan,
  });

  const pendingCount = myLaporan.filter(l => l.status === 'pending').length;
  const approvedCount = myLaporan.filter(l => l.status === 'disetujui').length;
  const rejectedCount = myLaporan.filter(l => l.status === 'ditolak').length;

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Siswa</h1>
            <p className="text-base-content/60 mt-1">
              Selamat datang, {user?.name} - {user?.kelas}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/siswa/laporan/create" className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <div>
                  <h2 className="card-title">Buat Laporan Baru</h2>
                  <p>Laporkan penggunaan ruang produktif</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/siswa/laporan" className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <h2 className="card-title">Riwayat Laporan</h2>
                  <p>Lihat semua laporan yang telah dibuat</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Pending</div>
            <div className="stat-value text-warning">{pendingCount}</div>
            <div className="stat-desc">Menunggu validasi admin</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-success">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Disetujui</div>
            <div className="stat-value text-success">{approvedCount}</div>
            <div className="stat-desc">Telah divalidasi admin</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-error">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Ditolak</div>
            <div className="stat-value text-error">{rejectedCount}</div>
            <div className="stat-desc">Perlu diperbaiki</div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Laporan Terbaru</h2>
            {myLaporan.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60">Belum ada laporan yang dibuat</p>
                <Link to="/siswa/laporan/create" className="btn btn-primary mt-4">
                  Buat Laporan Pertama
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Ruang</th>
                      <th>Jam Pelajaran</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLaporan.slice(0, 5).map((laporan) => (
                      <tr key={laporan.id}>
                        <td>{new Date(laporan.created_at!).toLocaleDateString('id-ID')}</td>
                        <td>{laporan.ruang_nama}</td>
                        <td>{laporan.jam_pelajaran} jam</td>
                        <td>{getStatusBadge(laporan.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {myLaporan.length > 5 && (
              <div className="card-actions justify-end mt-4">
                <Link to="/siswa/laporan" className="btn btn-outline">
                  Lihat Semua
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};