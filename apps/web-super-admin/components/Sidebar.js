'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Users, FileText, Settings, LogOut, Package, CreditCard, Activity } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard Nasional', icon: Home, path: '/' },
    { name: 'Manajemen Kopdes', icon: Building2, path: '/kopdes' },
    { name: 'Setoran Harian', icon: CreditCard, path: '/setoran' },
    { name: 'Monitoring Operasional', icon: Activity, path: '/monitoring' },
    { name: 'Master Data', icon: Package, path: '/master' },
    { name: 'Manajemen Pengguna', icon: Users, path: '/users' },
    { name: 'Laporan & Audit', icon: FileText, path: '/laporan' },
    { name: 'Pengaturan Sistem', icon: Settings, path: '/pengaturan' },
  ];

  return (
    <div style={{ width: 'var(--sidebar-width)', height: '100vh', backgroundColor: 'var(--neutral-900)', color: 'white', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            MP
          </div>
          <span style={{ letterSpacing: '0.5px' }}>Pusat Kendali</span>
        </h1>
        <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '4px', paddingLeft: '44px' }}>Super Admin Portal</div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingLeft: '16px' }}>
          Main Menu
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menu.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? 'var(--primary-300)' : 'var(--neutral-400)',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s ease'
                }}>
                  <Icon size={20} color={isActive ? 'var(--primary-400)' : 'var(--neutral-500)'} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
          backgroundColor: 'transparent', color: 'var(--danger)', fontWeight: '600', border: 'none', cursor: 'pointer'
        }}>
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </div>
  );
}
