import WishlistClient from './WishlistClient';

export const metadata = {
  title: 'Produk Favorit - Koperasi Desa Merah Putih',
  description: 'Daftar produk favorit Anda.',
};

export default function WishlistPage() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--neutral-50)' }}>
      <WishlistClient />
    </div>
  );
}
