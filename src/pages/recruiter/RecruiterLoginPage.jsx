import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui';
import Swal from 'sweetalert2';

export default function RecruiterLoginPage() {
  const { loginRecruiter } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const success = await loginRecruiter(form.email, form.password); // Using email as username for now
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        navigate('/recruiter/dashboard');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Username atau password salah!'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800 flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-xl mb-4">
            <BrainCircuit className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Portal Rekruter</h1>
          <p className="text-primary-200 text-sm mt-1">Masuk ke dashboard rekrutmen Anda</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang 👋</h2>
          <p className="text-gray-500 text-sm mb-8">Masukkan kredensial Anda untuk melanjutkan</p>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email / Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Username</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400 transition-shadow">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="admin"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400 transition-shadow">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              {/* <span className="font-bold">Info Login:</span> Gunakan Username: <strong>admin</strong> dan Password: <strong>password123</strong> */}
              <span className="font-bold">Info Login:</span> Gunakan Username: <strong>admin</strong>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Masuk...</>
              ) : (
                'Masuk ke Dashboard'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-primary-300 text-xs mt-6">
          © 2026 RitaScreen — Sistem Rekrutmen Berbasis AI
        </p>
      </div>
    </div>
  );
}
