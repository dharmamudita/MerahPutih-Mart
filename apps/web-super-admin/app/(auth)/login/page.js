'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '../../../lib/api';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Login gagal.');

      if (json.data?.role !== 'SUPER_ADMIN') {
        throw new Error('Akses Ditolak: Halaman ini khusus untuk Super Admin Pusat.');
      }

      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.data));
      toast.success(`Selamat datang Super Admin, ${json.data.name}!`);
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '24px' }}>
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225, 29, 72, 0.18) 0%, transparent 70%)', top: '-120px', right: '-120px', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px', borderRadius: '24px', border: '1px solid rgba(225, 29, 72, 0.3)', boxShadow: '0 20px 50px rgba(136, 19, 55, 0.18)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 24px rgba(225, 29, 72, 0.2)', border: '1px solid var(--primary-300)' }}>
            <img src="/logo.png" alt="Logo Kopdes" style={{ height: '46px', width: '46px', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
            Pusat Kendali Nasional
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '700', marginTop: '4px' }}>
            Super Admin Portal Induk
          </p>
        </div>

        <div style={{ padding: '14px 16px', borderRadius: '14px', backgroundColor: 'var(--neutral-900)', color: 'white', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ShieldCheck size={22} color="#fef08a" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px', lineHeight: '1.4', fontWeight: '600' }}>
            Otoritas Tingkat Pusat — Mengontrol 142 Cabang Koperasi Desa & Pengaturan Global.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-700)', marginBottom: '8px' }}>
              Email Otoritas Super Admin
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@merahputih.id"
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-700)', marginBottom: '8px' }}>
              Kata Sandi Otoritas
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '15px' }}
          >
            {loading ? 'Memverifikasi Otoritas...' : 'Masuk ke Pusat Kendali'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--neutral-200)', fontSize: '12px', color: 'var(--neutral-500)' }}>
          © 2026 Koperasi Desa Merah Putih — Gemastik 2026
        </div>
      </div>
    </div>
  );
}
