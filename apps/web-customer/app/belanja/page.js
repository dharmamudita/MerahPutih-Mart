import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import AddToCartButton from '../../components/AddToCartButton';

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error);
    return [];
  }
}

export default async function BelanjaPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="container" style={{ padding: '40px 16px', display: 'flex', gap: '32px', minHeight: '80vh' }}>
      
      {/* Sidebar Kategori */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ backgroundColor: 'white', border: '1px solid var(--neutral-200)', borderRadius: '12px', padding: '24px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--neutral-900)' }}>Kategori</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '12px' }}>
              <Link href="/belanja" style={{ color: 'var(--primary-600)', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                <span>Semua Produk</span>
                <span style={{ backgroundColor: 'var(--neutral-100)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: 'var(--neutral-600)' }}>{products.length}</span>
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} style={{ marginBottom: '12px' }}>
                <Link href={`/belanja?category=${cat.id}`} style={{ color: 'var(--neutral-600)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{cat.name}</span>
                  <span style={{ backgroundColor: 'var(--neutral-100)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: 'var(--neutral-500)' }}>
                    {cat._count?.products || 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>Katalog Produk</h1>
          
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-400)' }} />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--neutral-300)', fontSize: '14px' }}
              />
            </div>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', backgroundColor: 'var(--neutral-50)', borderRadius: '12px', border: '1px dashed var(--neutral-300)' }}>
            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>📦</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--neutral-700)' }}>Produk tidak ditemukan</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {products.map(product => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ height: '180px', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '🌾'
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                      {product.category?.name || 'Lainnya'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--neutral-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--danger)' }}>
                      Rp {product.sellPrice.toLocaleString('id-ID')}
                      {product.unit && <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 'normal' }}> /{product.unit.symbol}</span>}
                    </p>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
