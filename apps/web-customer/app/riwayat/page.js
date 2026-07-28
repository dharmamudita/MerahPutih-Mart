import RiwayatClient from './RiwayatClient';

export const metadata = {
  title: 'Riwayat Belanja - Koperasi Desa Merah Putih',
  description: 'Daftar riwayat pesanan Anda.',
};

export default function RiwayatPage() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--neutral-50)' }}>
      <RiwayatClient />
    </div>
  );
}
