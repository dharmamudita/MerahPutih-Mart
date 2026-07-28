import BantuanClient from './BantuanClient';

export const metadata = {
  title: 'Pusat Bantuan - Koperasi Desa Merah Putih',
  description: 'Temukan jawaban atas pertanyaan Anda dan hubungi layanan pelanggan kami.',
};

export default function BantuanPage() {
  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BantuanClient />
    </div>
  );
}
