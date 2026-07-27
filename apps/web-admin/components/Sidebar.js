import styles from './Sidebar.module.css';
import Link from 'next/link';
import { 
  Home, 
  Store, 
  Users, 
  Activity, 
  Database, 
  Tag, 
  PieChart, 
  FileText, 
  Settings,
  LogOut,
  ShoppingCart
} from 'lucide-react';

export default function Sidebar({ role = 'SUPER_ADMIN' }) {
  const superAdminMenus = [
    { title: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { title: 'Manajemen Kopdes', icon: <Store size={20} />, href: '/kopdes' },
    { title: 'Manajemen Pengguna', icon: <Users size={20} />, href: '/users' },
    { title: 'Monitoring', icon: <Activity size={20} />, href: '/monitoring' },
    { title: 'Master Data', icon: <Database size={20} />, href: '/master-data' },
    { title: 'Manajemen Promo', icon: <Tag size={20} />, href: '/promo' },
    { title: 'Dashboard Analitik', icon: <PieChart size={20} />, href: '/analytics' },
    { title: 'Laporan', icon: <FileText size={20} />, href: '/reports' },
    { title: 'Pengaturan Sistem', icon: <Settings size={20} />, href: '/settings' },
  ];

  const kopdesAdminMenus = [
    { title: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { title: 'Kasir (POS)', icon: <ShoppingCart size={20} />, href: '/pos' },
    { title: 'Manajemen Produk', icon: <Tag size={20} />, href: '/products' },
    { title: 'Kategori', icon: <Database size={20} />, href: '/categories' },
    { title: 'Gudang & Stok', icon: <Store size={20} />, href: '/warehouse' },
    { title: 'Supplier', icon: <Users size={20} />, href: '/suppliers' },
    { title: 'Pesanan Online', icon: <Activity size={20} />, href: '/orders' },
    { title: 'Laporan', icon: <FileText size={20} />, href: '/reports' },
  ];

  const menus = role === 'SUPER_ADMIN' ? superAdminMenus : kopdesAdminMenus;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuContainer}>
        {menus.map((menu, index) => (
          <Link key={index} href={menu.href} className={styles.menuItem}>
            <span className={styles.icon}>{menu.icon}</span>
            <span className={styles.title}>{menu.title}</span>
          </Link>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
