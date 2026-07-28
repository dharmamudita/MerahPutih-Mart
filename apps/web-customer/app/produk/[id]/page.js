import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  // Option: Fetch product name for metadata here if needed
  return {
    title: 'Detail Produk - Koperasi Desa Merah Putih',
    description: 'Beli produk unggulan dari Koperasi Desa Merah Putih',
  };
}

export default function ProductDetailPage({ params }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--neutral-50)', paddingBottom: '60px' }}>
      <ProductDetailClient productId={params.id} />
    </div>
  );
}
