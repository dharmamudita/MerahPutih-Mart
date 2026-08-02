'use client';
import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./AdminLayout.module.css";
import { Toaster } from 'react-hot-toast';

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Jika halaman adalah POS atau Login, jangan tampilkan Sidebar dan Header Admin
  if (pathname && (pathname.startsWith('/pos') || pathname.startsWith('/login'))) {
    return (
      <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh' }}>
        {children}
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
