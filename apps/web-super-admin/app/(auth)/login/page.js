'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '../../../lib/api';

export default function LoginPage() {
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
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.data));
      toast.success('Login berhasil!');
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Pusat Kendali</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0' }}>Super Admin MerahPutih-Mart</p>
        </div>

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="admin@merahputih.id"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '24px', fontSize: '14px', boxSizing: 'border-box' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
