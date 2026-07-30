'use client';
import { Bell, Search, UserCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="glass-panel" style={{ height: '80px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid var(--neutral-200)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '320px' }}>
        <Search size={18} color="var(--neutral-400)" />
        <input type="text" placeholder="Cari Kopdes, ID Transaksi..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} color="var(--neutral-600)" />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
        </div>
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
