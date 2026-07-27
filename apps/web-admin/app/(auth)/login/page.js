'use client';
import { useState } from 'react';
import styles from './Login.module.css';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrasi dengan API login
    setTimeout(() => {
      setLoading(false);
      // Dummy redirect
      window.location.href = '/dashboard'; 
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <div className={styles.logoInner}>MP</div>
          </div>
          <h1 className={styles.title}>KopDes <span className={styles.textAccent}>Admin</span></h1>
          <p className={styles.subtitle}>Sistem Manajemen Koperasi Desa</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input 
                type="email" 
                className={styles.input} 
                placeholder="admin@kopdes.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input 
                type="password" 
                className={styles.input} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Ingat saya</span>
            </label>
            <a href="#" className={styles.forgotPassword}>Lupa Password?</a>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Koperasi Desa Merah Putih</p>
        </div>
      </div>
    </div>
  );
}
