import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Pusat Kendali - MerahPutih-Mart',
  description: 'Super Admin Portal Koperasi Desa Nasional',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
