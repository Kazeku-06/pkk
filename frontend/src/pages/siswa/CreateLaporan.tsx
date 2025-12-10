import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { laporanApi } from '../../api/laporan';
import { ruangApi } from '../../api/ruang';
import { fasilitasApi } from '../../api/fasilitas';
import type { CreateLaporanRequest } from '../../types';

interface FormData {
  ruang_id: number;
  foto_kegiatan: FileList;
  foto_kunci?: FileList;
  jam_pelajaran: number;
  fasilitas_digunakan: string[];
  keterangan: string;
}

export const CreateLaporan = () => {
  const navigate = useNavigate();
  const [selectedRuangId, setSelectedRuangId] = useState<number | null>(null);
  const [previewKegiatan, setPreviewKegiatan] = useState<string>('');
  const [previewKunci, setPreviewKunci] = useState<string>('');
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();

  const { data: ruangList = [] } = useQuery({
    queryKey: ['ruang'],
    queryFn: ruangApi.getRuang,
  });

  const { data: fasilitasList = [] } = useQuery({
    queryKey: ['fasilitas', selectedRuangId],
    queryFn: () => fasilitasApi.getFasilitas(selectedRuangId || undefined),
    enabled: !!selectedRuangId,
  });

  const createMutation = useMutation({
    mutationFn: laporanApi.createLaporan,
    onSuccess: () => {
      navigate('/siswa/laporan');
    },
  });

  const watchedRuangId = watch('ruang_id');
  const selectedRuang = ruangList.find(r => r.id === Number(watchedRuangId));

  React.useEffect(() => {
    if (watchedRuangId) {
      setSelectedRuangId(Number(watchedRuangId));
    }
  }, [watchedRuangId]);

  const onSubmit = (data: FormData) => {
    const requestData: CreateLaporanRequest = {
      ruang_id: Number(data.ruang_id),
      foto_kegiatan: data.foto_kegiatan[0],
      foto_kunci: data.foto_kunci?.[0],
      jam_pelajaran: Number(data.jam_pelajaran),
      fasilitas_digunakan: data.fasilitas_digunakan,
      keterangan: data.keterangan,
    };

    createMutation.mutate(requestData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'kegiatan' | 'kunci') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'kegiatan') {
          setPreviewKegiatan(result);
        } else {
          setPreviewKunci(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Buat Laporan Baru</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Informasi Ruang</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pilih Ruang *</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.ruang_id ? 'select-error' : ''}`}
                    {...register('ruang_id', { 
                      required: 'Ruang harus dipilih',
                      valueAsNumber: true 
                    })}
                  >
                    <option value="">Pilih ruang yang digunakan</option>
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
                    <span className="label-text">Jam Pelajaran *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Contoh: 2"
                    className={`input input-bordered ${errors.jam_pelajaran ? 'input-error' : ''}`}
                    {...register('jam_pelajaran', { 
                      required: 'Jam pelajaran harus diisi',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Minimal 1 jam' },
                      max: { value: 12, message: 'Maksimal 12 jam' }
                    })}
                  />
                  {errors.jam_pelajaran && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.jam_pelajaran.message}</span>
                    </label>
                  )}
                </div>
              </div>

              {selectedRuang && (
                <div className="alert alert-info">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    Ruang ini {selectedRuang.menggunakan_kunci ? 'menggunakan kunci' : 'tidak menggunakan kunci'}.
                    {selectedRuang.menggunakan_kunci && ' Foto kunci wajib diupload.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fasilitas */}
          {fasilitasList.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Fasilitas yang Digunakan</h2>
                <p className="text-sm opacity-70 mb-4">Pilih fasilitas yang digunakan selama kegiatan</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {fasilitasList.map((fasilitas) => (
                    <label key={fasilitas.id} className="cursor-pointer label">
                      <input
                        type="checkbox"
                        value={fasilitas.nama_fasilitas}
                        className="checkbox checkbox-primary"
                        {...register('fasilitas_digunakan')}
                      />
                      <span className="label-text ml-2">{fasilitas.nama_fasilitas}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload Photos */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Upload Foto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foto Kegiatan */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Foto Kegiatan *</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={`file-input file-input-bordered ${errors.foto_kegiatan ? 'file-input-error' : ''}`}
                    {...register('foto_kegiatan', { 
                      required: 'Foto kegiatan harus diupload',
                      onChange: (e) => handleFileChange(e, 'kegiatan')
                    })}
                  />
                  {errors.foto_kegiatan && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.foto_kegiatan.message}</span>
                    </label>
                  )}
                  {previewKegiatan && (
                    <div className="mt-2">
                      <img src={previewKegiatan} alt="Preview Kegiatan" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Foto Kunci */}
                {selectedRuang?.menggunakan_kunci && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Foto Kunci *</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`file-input file-input-bordered ${errors.foto_kunci ? 'file-input-error' : ''}`}
                      {...register('foto_kunci', { 
                        required: selectedRuang?.menggunakan_kunci ? 'Foto kunci harus diupload' : false,
                        onChange: (e) => handleFileChange(e, 'kunci')
                      })}
                    />
                    {errors.foto_kunci && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.foto_kunci.message}</span>
                      </label>
                    )}
                    {previewKunci && (
                      <div className="mt-2">
                        <img src={previewKunci} alt="Preview Kunci" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Keterangan</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Deskripsi Kegiatan *</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-32 ${errors.keterangan ? 'textarea-error' : ''}`}
                  placeholder="Jelaskan kegiatan yang dilakukan di ruang ini..."
                  {...register('keterangan', { required: 'Keterangan harus diisi' })}
                ></textarea>
                {errors.keterangan && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.keterangan.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate('/siswa/dashboard')}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${createMutation.isPending ? 'loading' : ''}`}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Menyimpan...' : 'Kirim Laporan'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {createMutation.error && (
          <div className="alert alert-error">
            <span>{(createMutation.error as any)?.response?.data?.error || 'Terjadi kesalahan'}</span>
          </div>
        )}
      </div>
    </Layout>
  );
};