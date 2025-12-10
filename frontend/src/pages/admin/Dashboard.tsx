import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { usersApi } from '../../api/users';
import { ruangApi } from '../../api/ruang';
import { laporanApi } from '../../api/laporan';

export const AdminDashboard = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });

  const { data: ruang = [] } = useQuery({
    queryKey: ['ruang'],
    queryFn: ruangApi.getRuang,
  });

  const { data: pendingLaporan = [] } = useQuery({
    queryKey: ['admin-laporan', 'pending'],
    queryFn: () => laporanApi.getAdminLaporan('pending'),
  });

  const { data: allLaporan = [] } = useQuery({
    queryKey: ['laporan-history'],
    queryFn: () => laporanApi.getLaporanHistory(),
  });

  const approvedCount = allLaporan.filter(l => l.status === 'disetujui').length;
  const rejectedCount = allLaporan.filter(l => l.status === 'ditolak').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Siswa</div>
            <div className="stat-value text-primary">{users.length}</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="stat-title">Total Ruang</div>
            <div className="stat-value text-secondary">{ruang.length}</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Pending</div>
            <div className="stat-value text-warning">{pendingLaporan.length}</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-success">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Disetujui</div>
            <div className="stat-value text-success">{approvedCount}</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-error">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Laporan Ditolak</div>
            <div className="stat-value text-error">{rejectedCount}</div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Laporan Terbaru (Pending)</h2>
            {pendingLaporan.length === 0 ? (
              <p className="text-base-content/60">Tidak ada laporan pending</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Siswa</th>
                      <th>Kelas</th>
                      <th>Ruang</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingLaporan.slice(0, 5).map((laporan) => (
                      <tr key={laporan.id}>
                        <td>{new Date(laporan.created_at!).toLocaleDateString('id-ID')}</td>
                        <td>{laporan.user_name}</td>
                        <td>{laporan.user_kelas}</td>
                        <td>{laporan.ruang_nama}</td>
                        <td>
                          <span className="badge badge-warning">Pending</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};