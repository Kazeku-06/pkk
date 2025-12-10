import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Auth
import { Login } from '../pages/Login';

// Admin Pages
import { AdminDashboard } from '../pages/admin/Dashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { RuangManagement } from '../pages/admin/RuangManagement';
import { FasilitasManagement } from '../pages/admin/FasilitasManagement';
import { LaporanValidation } from '../pages/admin/LaporanValidation';
import { LaporanHistory } from '../pages/admin/LaporanHistory';

// Siswa Pages
import { SiswaDashboard } from '../pages/siswa/Dashboard';
import { CreateLaporan } from '../pages/siswa/CreateLaporan';
import { SiswaLaporanHistory } from '../pages/siswa/LaporanHistory';

export const AppRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/siswa/dashboard'} replace /> : <Login />} 
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ruang"
          element={
            <ProtectedRoute requireAdmin>
              <RuangManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fasilitas"
          element={
            <ProtectedRoute requireAdmin>
              <FasilitasManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute requireAdmin>
              <LaporanValidation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <ProtectedRoute requireAdmin>
              <LaporanHistory />
            </ProtectedRoute>
          }
        />

        {/* Siswa Routes */}
        <Route
          path="/siswa/dashboard"
          element={
            <ProtectedRoute requireSiswa>
              <SiswaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/laporan/create"
          element={
            <ProtectedRoute requireSiswa>
              <CreateLaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/laporan"
          element={
            <ProtectedRoute requireSiswa>
              <SiswaLaporanHistory />
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/siswa/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};