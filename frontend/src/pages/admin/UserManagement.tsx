import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Layout } from '../../components/Layout';
import { usersApi } from '../../api/users';
import type { CreateUserRequest, User } from '../../types';

export const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserRequest>();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserRequest> }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setEditingUser(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const onSubmit = (data: CreateUserRequest) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      kelas: user.kelas || '',
      password: '', // Don't pre-fill password
    });
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Yakin ingin menghapus user ${user.name}?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
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
          <h1 className="text-3xl font-bold">Manajemen User</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>
            Tambah User
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Kelas</th>
                    <th>Tanggal Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.kelas}</td>
                      <td>{new Date(user.created_at!).toLocaleDateString('id-ID')}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(user)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nama</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                    {...register('name', { required: 'Nama harus diisi' })}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name.message}</span>
                    </label>
                  )}
                </div>

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
                    <span className="label-text">Kelas</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XI RPL 1"
                    className={`input input-bordered ${errors.kelas ? 'input-error' : ''}`}
                    {...register('kelas', { required: 'Kelas harus diisi' })}
                  />
                  {errors.kelas && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.kelas.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Password {editingUser && '(kosongkan jika tidak ingin mengubah)'}
                    </span>
                  </label>
                  <input
                    type="password"
                    className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                    {...register('password', { 
                      required: editingUser ? false : 'Password harus diisi',
                      minLength: {
                        value: 6,
                        message: 'Password minimal 6 karakter'
                      }
                    })}
                  />
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password.message}</span>
                    </label>
                  )}
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingUser(null);
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
                    {editingUser ? 'Update' : 'Simpan'}
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