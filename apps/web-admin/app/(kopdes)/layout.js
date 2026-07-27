import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function KopdesAdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar role="ADMIN_KOPDES" />
        <main style={{ flex: 1, padding: '24px', backgroundColor: 'var(--neutral-50)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
