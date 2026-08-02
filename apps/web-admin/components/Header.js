'use client';
import { useState } from 'react';
import styles from './AdminLayout.module.css';
import { Bell, Search, Menu, User, AlertTriangle, ShoppingBag, CheckCircle } from 'lucide-react';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Pesanan Online Masuk', desc: 'Warga Siti Aminah memesan 2 item sembako', time: '5m lalu', icon: ShoppingBag, color: 'var(--info)' },
    { id: 2, title: 'Peringatan Stok Kritis', desc: 'Beras Premium 5kg tersisa 2 karung', time: '15m lalu', icon: AlertTriangle, color: 'var(--danger)' },
    { id: 3, title: 'Setoran Harian Disetujui', desc: 'Pusat menyetujui setoran harian kemarin', time: '1j lalu', icon: CheckCircle, color: 'var(--success)' },
  ];

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
      
      <div className={styles.headerRight} style={{ position: 'relative' }}>
        <button className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={20} />
          <span className={styles.badge}>{notifications.length}</span>
        </button>

        {showNotifications && (
          <div style={{
            position: 'absolute', top: '50px', right: '120px', width: '320px', background: 'white',
            borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid var(--neutral-200)',
            zIndex: 100, padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-100)' }}>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>Notifikasi Terbaru</span>
              <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '600', cursor: 'pointer' }}>Tandai Dibaca</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(item => {
                const IconComp = item.icon;
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '10px', padding: '8px', borderRadius: '8px', background: 'var(--neutral-50)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={16} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>{item.desc}</div>
                      <div style={{ fontSize: '10px', color: 'var(--neutral-400)', marginTop: '2px' }}>{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
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
