'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '../../lib/api';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminKopdesLoginPage() {
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

      if (json.data?.role !== 'ADMIN_KOPDES' && json.data?.role !== 'SUPER_ADMIN') {
        throw new Error('Akses Ditolak: Halaman ini khusus untuk Admin Koperasi Desa.');
      }

      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.data));
      toast.success(`Selamat datang, ${json.data.name}!`);
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
    background: 'radial-gradient(at 10% 10%, rgba(225, 29, 72, 0.08) 0px, transparent 45%), radial-gradient(at 90% 90%, rgba(136, 19, 55, 0.06) 0px, transparent 45%)'
  };

  return (
    <div style={containerStyle}>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)',
        top: '-100px',
        left: '-100px',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(225, 29, 72, 0.2)',
        boxShadow: '0 20px 50px rgba(136, 19, 55, 0.12)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--primary-50)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(225, 29, 72, 0.15)',
            border: '1px solid var(--primary-200)'
          }}>
            <img src="/logo.png" alt="Logo Kopdes" style={{ height: '42px', width: '42px', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
            Portal Admin Kopdes
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Koperasi Desa Merah Putih
          </p>
        </div>

        <div style={{
          padding: '14px 16px',
          borderRadius: '14px',
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          marginBottom: '28px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: 'var(--primary-900)', lineHeight: '1.5', fontWeight: '600' }}>
            Akun Admin Kopdes dibuat & didaftarkan langsung oleh <strong>Super Admin Pusat</strong>. Tidak ada pendaftaran publik mandiri.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-700)', marginBottom: '8px' }}>
              Email Pengelola Cabang
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="budi@sukamaju.kopdes.id"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-300)',
                  outline: 'none',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-700)', marginBottom: '8px' }}>
              Password Akun
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
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-300)',
                  outline: 'none',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '15px' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Portal Admin Kopdes'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--neutral-200)', fontSize: '12px', color: 'var(--neutral-500)' }}>
          © 2026 Koperasi Desa Merah Putih — Gemastik 2026
        </div>
      </div>
    </div>
  );
}
