import './globals.css';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export const metadata = {
  title: 'Pusat Kendali - MerahPutih-Mart',
  description: 'Super Admin Portal Koperasi Desa Nasional',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-right" />
        <Sidebar />
        <div style={{ marginLeft: 'var(--sidebar-width)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <main style={{ flex: 1, padding: '32px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
