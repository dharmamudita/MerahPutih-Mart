import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function SuperAdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar role="SUPER_ADMIN" />
        <main style={{ flex: 1, padding: '24px', backgroundColor: 'var(--neutral-50)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
