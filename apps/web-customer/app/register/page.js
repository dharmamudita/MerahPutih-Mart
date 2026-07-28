'use client';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Phone } from 'lucide-react';
import styles from '../Auth.module.css';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Registrasi berhasil! Silakan masuk.');
        router.push('/login');
      } else {
        setError(data.message || 'Terjadi kesalahan saat registrasi.');
      }
    } catch (err) {
      console.error(err);
      setError('Koneksi ke server gagal. Pastikan server API berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard} style={{ maxWidth: '600px' }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Daftar Akun Baru</h1>
          <p className={styles.subtitle}>Bergabunglah dengan MerahPutih Mart untuk mulai belanja</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #F87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="Budi Santoso" required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nomor Telepon / WhatsApp</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={20} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} placeholder="08123456789" required />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder="budi@contoh.com" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} placeholder="••••••••" required minLength="6" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Konfirmasi Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.input} placeholder="••••••••" required minLength="6" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className={styles.footer}>
          Sudah punya akun? <Link href="/login" className={styles.link}>Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
