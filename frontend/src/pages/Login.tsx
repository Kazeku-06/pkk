import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../types';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.access_token, data.user);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/siswa/dashboard');
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Login gagal';
      setError(errorMessage || 'Login gagal');
    },
  });

  const onSubmit = (data: LoginRequest) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6">
            Sistem Pelaporan Ruang Produktif
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', { 
                  required: 'Email harus diisi',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Format email tidak valid'
                  }
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: 'Password harus diisi' })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loginMutation.isPending ? 'loading' : ''}`}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="divider">Demo Accounts</div>
          <div className="text-sm space-y-1">
            <p><strong>Admin:</strong> admin@admin.com / admin123</p>
            <p><strong>Siswa:</strong> Buat melalui admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};