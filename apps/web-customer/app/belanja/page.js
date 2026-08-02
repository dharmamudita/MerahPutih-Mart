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
    <div className="container animate-fade-in" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      
      {/* Main Content */}
      <main>
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
