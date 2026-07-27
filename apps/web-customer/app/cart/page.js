'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useCartStore from '../../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="container" style={{ padding: '60px 16px', minHeight: '60vh' }}>Memuat keranjang...</div>;

  return (
    <div className="container" style={{ padding: '60px 16px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', color: 'var(--neutral-900)' }}>Keranjang Belanja</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--neutral-50)', borderRadius: '16px', border: '1px dashed var(--neutral-300)' }}>
          <span style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}>🛒</span>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--neutral-800)' }}>Keranjang Anda masih kosong</h2>
          <p style={{ color: 'var(--neutral-500)', marginBottom: '24px' }}>Yuk, temukan kebutuhan harian Anda di Koperasi Desa Merah Putih.</p>
          <Link href="/belanja" className="btn btn-primary">Mulai Belanja</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Cart Items List */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', fontWeight: '600', color: 'var(--neutral-600)', fontSize: '14px' }}>
                <div>Produk</div>
                <div style={{ textAlign: 'center' }}>Kuantitas</div>
                <div style={{ textAlign: 'right' }}>Total Harga</div>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map(item => (
                  <li key={item.id} style={{ padding: '24px', borderBottom: '1px solid var(--neutral-100)', display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--neutral-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, overflow: 'hidden' }}>
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : '📦'}
                      </div>
                      <div>
                        <Link href={`/produk/${item.slug || item.id}`} style={{ fontWeight: '600', color: 'var(--neutral-900)', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                          {item.name}
                        </Link>
                        <p style={{ fontSize: '14px', color: 'var(--danger)', fontWeight: '600' }}>
                          Rp {item.sellPrice.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                      >
                        <Minus size={14} color="var(--neutral-600)" />
                      </button>
                      <span style={{ fontWeight: '600', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                      >
                        <Plus size={14} color="var(--neutral-600)" />
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>
                        Rp {(item.sellPrice * item.quantity).toLocaleString('id-ID')}
                      </span>
                      <button onClick={() => removeItem(item.id)} style={{ color: 'var(--neutral-400)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--neutral-400)'}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--neutral-900)' }}>Ringkasan Belanja</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--neutral-600)' }}>
                <span>Total Harga ({items.length} Barang)</span>
                <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--neutral-600)' }}>
                <span>Diskon Koperasi</span>
                <span style={{ color: '#166534' }}>- Rp 0</span>
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)', margin: '0 -24px 24px -24px' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: '800', fontSize: '18px', color: 'var(--neutral-900)' }}>
                <span>Total Tagihan</span>
                <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              
              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}>
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
