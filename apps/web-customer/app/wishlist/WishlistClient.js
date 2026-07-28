'use client';

import { useState, useEffect } from 'react';
import styles from './Wishlist.module.css';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AddToCartButton from '../../components/AddToCartButton';
import WishlistButton from '../../components/WishlistButton';

export default function WishlistClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlists, setWishlists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchWishlists(storedToken);
  }, [router]);

  const fetchWishlists = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWishlists(data.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlists', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Produk Favorit Saya</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neutral-500)' }}>
          Memuat daftar favorit...
        </div>
      ) : wishlists.length === 0 ? (
        <div className={styles.emptyState}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Heart size={64} className={styles.emptyStateIcon} fill="var(--danger)" />
          </div>
          <h3>Belum Ada Produk Tersimpan</h3>
          <p>Anda belum menambahkan produk apa pun ke daftar favorit.</p>
          <Link href="/belanja" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Cari Produk
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlists.map((item) => {
            const product = item.product;
            if (!product) return null;
            const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
            
            return (
              <div key={item.id} className="product-card" style={{ backgroundColor: 'var(--white)', borderRadius: '24px', padding: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--neutral-100)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', borderRadius: '16px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ opacity: 0.5 }}>🌾</div>
                  )}
                  <WishlistButton productId={product.id} />
                </div>
                
                <div style={{ padding: '16px 8px 8px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                    {product.category?.name || 'Lainnya'}
                  </span>
                  
                  <Link href={`/produk/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--neutral-900)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--danger)', margin: 0 }}>
                        Rp {product.sellPrice?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
