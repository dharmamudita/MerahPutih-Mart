import Link from 'next/link';
import AddToCartButton from '../../../components/AddToCartButton';

// Mapping kategori slug ke nama kategori untuk UI
const categoryNames = {
  'sembako': 'Sembako',
  'snack': 'Snack & Minuman',
  'kesehatan': 'Kesehatan',
  'kebersihan': 'Kebersihan',
  'pertanian': 'Kebutuhan Tani',
};

async function getProductsByCategory(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    // Convert slug back to format used in DB if necessary, or pass directly
    const res = await fetch(`${apiUrl}/products?category=${slug}`, { cache: 'no-store' });
    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data produk kategori:", error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const categoryName = categoryNames[slug] || 'Kategori';
  const products = await getProductsByCategory(slug);

  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '24px' }}>
          <Link href="/" style={{ color: 'var(--primary-600)' }}>Beranda</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--neutral-900)', fontWeight: '500' }}>Kategori {categoryName}</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: 'var(--neutral-900)' }}>
          Kategori: {categoryName}
        </h1>
        <p style={{ color: 'var(--neutral-500)', marginBottom: '32px' }}>
          Menampilkan produk-produk berkualitas di kategori {categoryName}.
        </p>

        {products.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--white)', borderRadius: '16px', border: '1px solid var(--neutral-200)' }}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>📭</span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--neutral-900)', marginBottom: '8px' }}>Belum ada produk</h3>
            <p style={{ color: 'var(--neutral-500)', maxWidth: '400px', margin: '0 auto' }}>
              Maaf, saat ini belum ada produk yang tersedia untuk kategori {categoryName}. Silakan cek kembali nanti atau telusuri kategori lainnya.
            </p>
            <Link href="/belanja" className="btn btn-primary" style={{ marginTop: '24px' }}>Lihat Semua Produk</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {products.map(product => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-premium)'; e.currentTarget.style.borderColor = 'var(--primary-300)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--neutral-200)'; }}>
                  <div style={{ height: '200px', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '🌾'
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--warning)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>
                        Sisa {product.stockQuantity}!
                      </div>
                    )}
                    {product.stockQuantity === 0 && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--neutral-800)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>
                        Habis
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category?.name || categoryName}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--neutral-900)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                      <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--danger)', marginBottom: '16px' }}>
                        Rp {product.sellPrice.toLocaleString('id-ID')}
                        {product.unit && <span style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '500' }}> /{product.unit.symbol}</span>}
                      </p>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
