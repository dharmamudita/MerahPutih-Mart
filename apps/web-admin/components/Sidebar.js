'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Wallet,
  Settings,
  Store,
  Box,
  Truck,
  CreditCard,
  LogOut,
  ChevronRight
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Kategori Produk', path: '/kategori', icon: Tags },
  { name: 'Produk', path: '/produk', icon: Package },
  { name: 'Gudang & Stok', path: '/gudang', icon: Box },
  { name: 'Supplier', path: '/supplier', icon: Truck },
  { name: 'Kasir (POS)', path: '/pos', icon: Store },
  { name: 'Pesanan Online', path: '/pesanan', icon: ShoppingCart },
  { name: 'Pelanggan', path: '/pelanggan', icon: Users },
  { name: 'Keuangan', path: '/keuangan', icon: Wallet },
  { name: 'Laporan', path: '/laporan', icon: CreditCard },
  { name: 'Pengaturan', path: '/pengaturan', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src="/logo.png" alt="Logo Kopdes" style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '8px', background: 'white', padding: '2px' }} />
        <div className={styles.logoText}>
          <div className={styles.logoTitle}>Admin Kopdes</div>
          <div className={styles.logoSubtitle}>Merah Putih</div>
        </div>
      </div>
      
      <nav className={styles.sidebarNav}>
        <div className={styles.navGroup}>MAIN MENU</div>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <Icon size={20} className={styles.navIcon} />
              <span className={styles.navText}>{item.name}</span>
              {isActive && <ChevronRight size={16} className={styles.navArrow} />}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
