import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {isAdmin ? (
                <>
                  <li><Link to="/admin/dashboard">Dashboard</Link></li>
                  <li><Link to="/admin/users">Manajemen User</Link></li>
                  <li><Link to="/admin/ruang">Manajemen Ruang</Link></li>
                  <li><Link to="/admin/fasilitas">Manajemen Fasilitas</Link></li>
                  <li><Link to="/admin/laporan">Validasi Laporan</Link></li>
                  <li><Link to="/admin/history">Riwayat Laporan</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/siswa/dashboard">Dashboard</Link></li>
                  <li><Link to="/siswa/laporan/create">Buat Laporan</Link></li>
                  <li><Link to="/siswa/laporan">Riwayat Laporan</Link></li>
                </>
              )}
            </ul>
          </div>
          <Link to={isAdmin ? "/admin/dashboard" : "/siswa/dashboard"} className="btn btn-ghost text-xl">
            Sistem Pelaporan Ruang
          </Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {isAdmin ? (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/users">Manajemen User</Link></li>
                <li><Link to="/admin/ruang">Manajemen Ruang</Link></li>
                <li><Link to="/admin/fasilitas">Manajemen Fasilitas</Link></li>
                <li><Link to="/admin/laporan">Validasi Laporan</Link></li>
                <li><Link to="/admin/history">Riwayat Laporan</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/siswa/dashboard">Dashboard</Link></li>
                <li><Link to="/siswa/laporan/create">Buat Laporan</Link></li>
                <li><Link to="/siswa/laporan">Riwayat Laporan</Link></li>
              </>
            )}
          </ul>
        </div>
        
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user?.name}</span>
                <span className="text-xs opacity-60">{user?.role === 'admin' ? 'Administrator' : user?.kelas}</span>
              </li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};