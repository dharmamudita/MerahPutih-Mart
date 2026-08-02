'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Clock, Copy, Check, ShoppingBag, Gift, Percent, ShieldCheck } from 'lucide-react';
import AddToCartButton from '../../components/AddToCartButton';
import WishlistButton from '../../components/WishlistButton';
import toast from 'react-hot-toast';

export default function PromoPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const vouchers = [
    {
      id: 1,
      code: 'MERAHPUTIH10K',
      discount: 'Potongan Rp 10.000',
      minSpend: 'Min. Belanja Rp 50.000',
      desc: 'Berlaku untuk semua komoditas Sembako Desa.',
      validUntil: '31 Agustus 2026',
      badge: 'Voucher Subsidi'
    },
    {
      id: 2,
      code: 'ONGKIRDESA',
      discount: 'Gratis Ongkir 100%',
      minSpend: 'Min. Belanja Rp 30.000',
      desc: 'Bebas biaya kirim Kurir Desa ke seluruh RT/RW.',
      validUntil: '31 Agustus 2026',
      badge: 'Bebas Ongkir'
    },
    {
      id: 3,
      code: 'MBGPANGAN',
      discount: 'Diskon 15% Sembako Utama',
      minSpend: 'Min. Belanja Rp 100.000',
      desc: 'Program Makan Bergizi Gratis & Stabilisasi Harga.',
      validUntil: '15 Agustus 2026',
      badge: 'Presidensial'
    }
  ];

  useEffect(() => {
    fetchPromoProducts();
  }, []);

  const fetchPromoProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products`);
      const json = await res.json();
      if (json.success) {
        setPromoProducts(json.data.slice(0, 4) || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Kode Voucher ${code} Berhasil Disalin!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px 80px', minHeight: '85vh' }}>
      
      {/* 
        ========================================================
        HERO PROMO BANNER
        ========================================================
      */}
      <section className="liquid-glass-card" style={{ padding: '40px', borderRadius: '32px', marginBottom: '40px', background: 'linear-gradient(135deg, rgba(225,29,72,0.06) 0%, rgba(251,191,36,0.06) 100%)', border: '1px solid rgba(225,29,72,0.2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'white', borderRadius: '999px', fontSize: '13px', fontWeight: '800', color: 'var(--primary-700)', marginBottom: '20px', boxShadow: '0 4px 14px rgba(225,29,72,0.12)', border: '1px solid var(--primary-200)' }}>
              <Tag size={16} color="var(--primary-600)" />
              <span>Promo Spesial & Subsidi Pangan Desa</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '900', color: 'var(--neutral-900)', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '16px' }}>
              Hemat Maksimal Belanja <span className="text-gradient">Sembako Warga</span>
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--neutral-600)', lineHeight: 1.6, fontWeight: '500' }}>
              Gunakan kupon voucher subsidi nasional dan nikmati harga khusus program Makan Bergizi Gratis (MBG) langsung dari Koperasi Desa.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '20px 28px', borderRadius: '24px', boxShadow: 'var(--shadow-liquid)', border: '1px solid var(--primary-100)' }}>
            <Clock size={36} color="var(--primary-600)" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Promo Berakhir Dalam</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary-700)', letterSpacing: '1px' }}>
                12d : 08h : 45m
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================
        VOUCHER KUPI KOPERASI SECTION
        ========================================================
      */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift color="var(--primary-600)" size={28} /> Voucher Subsidi Aktif
          </h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>
            Klaim kode voucher di bawah ini dan tempelkan saat checkout pesanan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {vouchers.map((v) => (
            <div key={v.id} className="liquid-glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', border: '1px solid var(--primary-200)' }}>
                  {v.badge}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: '600' }}>
                  s/d {v.validUntil}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--neutral-900)', marginBottom: '6px' }}>
                {v.discount}
              </h3>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-600)', marginBottom: '10px' }}>
                {v.minSpend}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--neutral-600)', lineHeight: '1.5', marginBottom: '24px' }}>
                {v.desc}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--neutral-100)', padding: '8px 8px 8px 16px', borderRadius: '14px', border: '1px dashed var(--neutral-300)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '800', letterSpacing: '1px', color: 'var(--neutral-900)' }}>
                  {v.code}
                </span>
                <button 
                  onClick={() => handleCopy(v.code)}
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '10px' }}
                >
                  {copiedCode === v.code ? <><Check size={16} /> Tersalin</> : <><Copy size={16} /> Salin</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================
        FLASH SALE PRODUCTS
        ========================================================
      */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <div style={{ color: 'var(--primary-600)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Flash Sale Pangan</div>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--neutral-900)' }}>Komoditas Promo Hari Ini</h2>
          </div>
          <Link href="/belanja" className="btn btn-outline" style={{ borderRadius: '12px' }}>Lihat Semua Produk &rarr;</Link>
        </div>

        {loading ? (
          <div className="liquid-glass-card" style={{ padding: '40px', textAlign: 'center' }}>Memuat Produk Promo...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '26px' }}>
            {promoProducts.map((p) => {
              const imageUrl = p.images && p.images.length > 0 ? p.images[0].url : null;
              const originalPrice = Math.round(p.sellPrice * 1.15);

              return (
                <div key={p.id} className="product-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', borderRadius: '16px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ opacity: 0.6 }}>🌾</div>
                    )}
                    <WishlistButton productId={p.id} />
                    
                    {/* Badge Diskon */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--danger)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '900', boxShadow: '0 4px 10px rgba(225,29,72,0.3)' }}>
                      -15% PROMO
                    </div>
                  </div>

                  <div style={{ padding: '16px 10px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {p.category?.name || 'Sembako'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '10px', color: 'var(--neutral-900)', lineHeight: '1.4' }}>
                      {p.name}
                    </h3>

                    <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--neutral-400)', textDecoration: 'line-through', fontWeight: '600' }}>
                          Rp {originalPrice.toLocaleString('id-ID')}
                        </div>
                        <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--primary-700)' }}>
                          Rp {p.sellPrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <AddToCartButton product={p} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
