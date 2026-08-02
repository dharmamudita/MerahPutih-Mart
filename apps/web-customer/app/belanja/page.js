'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import AddToCartButton from '../../components/AddToCartButton';
import WishlistButton from '../../components/WishlistButton';

function BelanjaContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const [resProd, resCat] = await Promise.all([
        fetch(`${apiUrl}/products`),
        fetch(`${apiUrl}/categories`)
      ]);
      const jsonProd = await resProd.json();
      const jsonCat = await resCat.json();

      setProducts(jsonProd.data || []);
      setCategories(jsonCat.data || []);
    } catch (err) {
      console.error('Failed to fetch catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search & selected category
  const filteredProducts = products.filter((p) => {
    const matchSearch = search.trim() === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = !selectedCategory || p.categoryId === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px', display: 'flex', gap: '32px', minHeight: '80vh' }}>
      
      {/* Sidebar Kategori */}
      <aside style={{ width: '260px', flexShrink: 0 }}>
        <div className="liquid-glass-card" style={{ padding: '24px', position: 'sticky', top: '110px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--primary-600)" /> Kategori Produk
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button 
                onClick={() => setSelectedCategory('')}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: '700',
                  background: selectedCategory === '' ? 'var(--primary-50)' : 'transparent',
                  color: selectedCategory === '' ? 'var(--primary-700)' : 'var(--neutral-700)',
                  border: selectedCategory === '' ? '1px solid var(--primary-200)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span>Semua Komoditas</span>
                <span style={{ backgroundColor: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', color: 'var(--primary-600)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  {products.length}
                </span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button 
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                    background: selectedCategory === cat.id ? 'var(--primary-50)' : 'transparent',
                    color: selectedCategory === cat.id ? 'var(--primary-700)' : 'var(--neutral-700)',
                    border: selectedCategory === cat.id ? '1px solid var(--primary-200)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{ backgroundColor: 'var(--neutral-100)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', color: 'var(--neutral-600)' }}>
                    {cat._count?.products || 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
              Katalog Sembako Desa
            </h1>
            {search && (
              <div style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '700', marginTop: '4px' }}>
                Hasil pencarian untuk: "{search}" ({filteredProducts.length} produk)
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="liquid-glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-600)' }}>Memuat Katalog Sembako...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="liquid-glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <span style={{ fontSize: '56px', marginBottom: '16px', display: 'block' }}>🔍</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neutral-900)', marginBottom: '8px' }}>
              Produk Tidak Ditemukan
            </h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '20px' }}>
              Tidak ada produk yang cocok dengan kata kunci "{search}".
            </p>
            <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="btn btn-outline">
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '26px' }}>
            {filteredProducts.map(product => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} className="product-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', borderRadius: '16px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ opacity: 0.6 }}>🌾</div>
                    )}
                    <WishlistButton productId={product.id} />
                  </div>

                  <div style={{ padding: '16px 10px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category?.name || 'Sembako Desa'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: 'var(--neutral-900)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: '700' }}>Harga Warga</div>
                        <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
                          Rp {product.sellPrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <AddToCartButton product={product} />
                    </div>
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

export default function BelanjaPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px', textAlign: 'center' }}>Memuat Halaman...</div>}>
      <BelanjaContent />
    </Suspense>
  );
}
