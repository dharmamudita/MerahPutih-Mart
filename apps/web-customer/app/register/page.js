'use client';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Phone } from 'lucide-react';
import styles from '../Auth.module.css';

export default function Register() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/login'; 
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard} style={{ maxWidth: '600px' }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Daftar Akun Baru</h1>
          <p className={styles.subtitle}>Bergabunglah dengan MerahPutih Mart untuk mulai belanja</p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input type="text" className={styles.input} placeholder="Budi Santoso" required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nomor Telepon / WhatsApp</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={20} />
                <input type="tel" className={styles.input} placeholder="08123456789" required />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input type="email" className={styles.input} placeholder="budi@contoh.com" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input type="password" className={styles.input} placeholder="••••••••" required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Konfirmasi Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input type="password" className={styles.input} placeholder="••••••••" required />
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
