import AuthGuard from '../../components/AuthGuard';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <Sidebar />
      <div style={{ marginLeft: 'var(--sidebar-width)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ flex: 1, padding: '32px' }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
