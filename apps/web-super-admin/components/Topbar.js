'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, UserCircle, AlertTriangle, Building2, Wallet } from 'lucide-react';

export default function Topbar() {
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/kopdes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/kopdes');
    }
  };

  const notifs = [
    { id: 1, title: 'Setoran Harian Baru', desc: 'Kopdes Merah Putih Bandung menyetor Rp 1.500.000', time: '2m lalu', icon: Wallet, color: 'var(--success)' },
    { id: 2, title: 'Peringatan Stok Kritis', desc: 'Gudang Kopdes Sukamaju: Beras 5kg sisa 5 karung', time: '10m lalu', icon: AlertTriangle, color: 'var(--danger)' },
    { id: 3, title: 'Cabang Baru Terdaftar', desc: 'Kopdes Harapan Jaya (Merauke) diaktifkan', time: '1j lalu', icon: Building2, color: 'var(--primary-600)' },
  ];

  return (
    <div className="glass-panel" style={{ height: '80px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--neutral-200)' }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '320px' }}>
        <Search size={18} color="var(--neutral-400)" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Kopdes, ID Transaksi, User..." 
          style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} 
        />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotif(!showNotif)}>
          <Bell size={24} color="var(--neutral-600)" />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
        </div>

        {showNotif && (
          <div style={{
            position: 'absolute', top: '45px', right: '140px', width: '340px', background: 'white',
            borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid var(--neutral-200)',
            zIndex: 100, padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-100)' }}>
              <span style={{ fontWeight: '800', fontSize: '14px' }}>Notifikasi Nasional</span>
              <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '600', cursor: 'pointer' }}>Tandai Semua Dibaca</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifs.map(n => {
                const IconComp = n.icon;
                return (
                  <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '10px', background: 'var(--primary-50)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                      <IconComp size={18} color={n.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--neutral-600)', lineHeight: '1.4' }}>{n.desc}</div>
                      <div style={{ fontSize: '10px', color: 'var(--neutral-400)', marginTop: '4px' }}>{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--neutral-200)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--neutral-900)' }}>Super Admin</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Pusat Induk</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCircle size={24} color="var(--primary-600)" />
          </div>
        </div>
      </div>
    </div>
  );
}
