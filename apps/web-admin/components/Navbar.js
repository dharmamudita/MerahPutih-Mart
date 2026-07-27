import styles from './Navbar.module.css';
import { LayoutDashboard, CheckSquare, BarChart2, MessageSquare, FileText, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className={styles.navbarWrapper}>
      <nav className={styles.navbar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <div className={styles.logoInner}>MP</div>
          </div>
          <span className={styles.logoText}>KopDes<span className={styles.textAccent}>Admin</span></span>
        </div>

        {/* Menu Section */}
        <div className={styles.menuSection}>
          <Link href="/dashboard" className={`${styles.menuItem} ${styles.active}`}>
            <LayoutDashboard size={18} />
            <span>Ringkasan</span>
          </Link>
          
          <Link href="/verification" className={styles.menuItem}>
            <CheckSquare size={18} />
            <span>Verifikasi</span>
          </Link>
          
          <Link href="/performance" className={styles.menuItem}>
            <BarChart2 size={18} />
            <span>Kinerja</span>
          </Link>
          
          <Link href="/reviews" className={styles.menuItem}>
            <MessageSquare size={18} />
            <span>Ulasan</span>
          </Link>
          
          <Link href="/reports" className={styles.menuItem}>
            <FileText size={18} />
            <span>Laporan</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className={styles.userSection}>
          <div className={styles.userDropdown}>
            <div className={styles.avatar}>
              <User size={18} />
              <div className={styles.onlineBadge}></div>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
        </div>
      </nav>
    </div>
  );
}
