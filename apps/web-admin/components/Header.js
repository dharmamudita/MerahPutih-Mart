'use client';
import styles from './AdminLayout.module.css';
import { Bell, Search, Menu, User } from 'lucide-react';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.mobileMenuBtn}>
          <Menu size={24} />
        </button>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Cari transaksi, produk, atau pelanggan..." className={styles.searchInput} />
        </div>
      </div>
      
      <div className={styles.headerRight}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Budi Admin</div>
            <div className={styles.userRole}>Mitra Desa</div>
          </div>
        </div>
      </div>
    </header>
  );
}
