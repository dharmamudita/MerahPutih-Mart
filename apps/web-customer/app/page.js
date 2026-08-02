import Link from 'next/link';
import AddToCartButton from '../components/AddToCartButton';
import WishlistButton from '../components/WishlistButton';
import { Sparkles, ShieldCheck, HeartHandshake, Wheat, ShoppingBag, ArrowRight } from 'lucide-react';

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/products?limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div style={{ paddingBottom: '80px' }} className="animate-fade-in">
      {/* 
        ========================================================
        ULTRA-PREMIUM LIQUID HERO SECTION
        ========================================================
      */}
      <section style={{ 
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        padding: '90px 0 60px',
        overflow: 'hidden'
      }}>
        {/* Liquid Ambient Background Blobs */}
        <div style={{ position: 'absolute', top: '5%', left: '-8%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.14) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(70px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          
          {/* Left Text Content */}
          <div style={{ flex: '1 1 500px', maxWidth: '660px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
              borderRadius: '999px', fontSize: '13px', fontWeight: '800', color: 'var(--primary-700)',
              marginBottom: '28px', boxShadow: '0 4px 16px rgba(225,29,72,0.12)', border: '1px solid var(--primary-200)'
            }}>
              <Sparkles size={16} color="var(--primary-600)" />
              <span>Program MBG & Sembako Murah Presidensial</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: '900', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'var(--neutral-950)' }}>
              Kebutuhan Harian Desa, <br/>
              <span className="text-gradient">Kualitas Ultra Premium.</span>
            </h1>
            
            <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--neutral-600)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '540px', fontWeight: '500' }}>
              Akses sembako murah, segar, dan langsung dari sentra produksi nasional untuk warga desa. Belanja cerdas berbasis pemberdayaan Koperasi Desa.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center' }}>
              <Link href="/belanja" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '16px' }}>
                Mulai Belanja Warga <ArrowRight size={18} />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingLeft: '12px' }}>
                <div style={{ display: 'flex' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--white)', backgroundColor: 'var(--neutral-200)', marginLeft: i > 1 ? '-16px' : '0', backgroundImage: `url('https://i.pravatar.cc/100?img=${i+10}')`, backgroundSize: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}></div>
                  ))}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--neutral-700)' }}>
                  <span style={{ color: 'var(--primary-700)', fontWeight: '900' }}>2,450+ Warga</span><br/>Telah Bergabung
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Liquid Glass Showcase Card */}
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <div className="liquid-glass-card" style={{ borderRadius: '32px', padding: '36px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '1px' }}>⭐ Komoditas Utama</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--neutral-900)' }}>Beras Premium 5kg</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)', color: 'white', padding: '8px 18px', borderRadius: '999px', fontWeight: '800', boxShadow: '0 4px 14px rgba(225,29,72,0.3)' }}>
                  Rp 68.000
                </div>
              </div>
              
              <div style={{ height: '220px', background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', borderRadius: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '90px', filter: 'drop-shadow(0 15px 15px rgba(225,29,72,0.15))', border: '1px solid var(--primary-100)' }}>
                🍚
              </div>
              
              <Link href="/belanja" className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '15px' }}>
                <ShoppingBag size={18} /> Tambah ke Keranjang Warga
              </Link>
            </div>
            
            {/* Floating Shipping Badge */}
            <div className="glass-card" style={{ position: 'absolute', top: '-18px', right: '-18px', padding: '14px 22px', borderRadius: '20px', zIndex: 3, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>🚚</span>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Pengiriman</div>
                <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '800' }}>Gratis Kurir Desa</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 
        ========================================================
        BENTO GRID - VALUE PROPOSITION
        ========================================================
      */}
      <section className="container" style={{ padding: '40px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '900', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
            Keunggulan <span className="text-gradient">MerahPutih-Mart</span>
          </h2>
          <p style={{ color: 'var(--neutral-500)', marginTop: '8px', fontSize: '15px', fontWeight: '500' }}>
            Solusi cerdas ekosistem pangan dan kebutuhan harian masyarakat desa.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px' }}>
          
          <div className="liquid-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '36px' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '18px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--primary-200)', boxShadow: '0 4px 12px rgba(225,29,72,0.1)' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: 'var(--neutral-900)' }}>Harga Grosir Langsung</h3>
            <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6', fontSize: '14px' }}>Memotong jalur distribusi panjang. Warga mendapatkan harga tangan pertama langsung dari pusat dan produsen mitra.</p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #4c0519 100%)', borderRadius: '24px', padding: '36px', boxShadow: '0 12px 36px rgba(136,19,55,0.3)', color: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '18px', background: 'rgba(255,255,255,0.15)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <HeartHandshake size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>Ekonomi Berputar di Desa</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', fontSize: '14px' }}>Setiap Rupiah yang Anda belanjakan akan kembali menjadi SHU Koperasi untuk kemajuan desa kita tercinta.</p>
          </div>

          <div className="liquid-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '36px' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '18px', background: 'rgba(245,158,11,0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 4px 12px rgba(245,158,11,0.1)' }}>
              <Wheat size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: 'var(--neutral-900)' }}>Kualitas Terjamin Presisi</h3>
            <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6', fontSize: '14px' }}>Komoditas pertanian dan sembako disortir dengan standar kualitas nasional untuk memastikan warga menerima yang terbaik.</p>
          </div>

        </div>
      </section>

      {/* 
        ========================================================
        PREMIUM PRODUCT GRID
        ========================================================
      */}
      <section className="container" style={{ padding: '20px 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <div style={{ color: 'var(--primary-600)', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Koleksi Utama</div>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Pilihan Spesial Sembako</h2>
          </div>
          <Link href="/belanja" className="btn btn-outline" style={{ borderRadius: '12px' }}>Lihat Semua Katalog &rarr;</Link>
        </div>

        {products.length === 0 ? (
          <div className="liquid-glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
            <span style={{ fontSize: '56px', marginBottom: '20px', display: 'block' }}>📦</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--neutral-900)', marginBottom: '8px' }}>Katalog Sedang Disiapkan</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Pengelola Koperasi Desa sedang memperbarui persediaan komoditas harian.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' }}>
            {products.map(product => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} className="product-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Image Area */}
                  <div style={{ height: '220px', borderRadius: '18px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ opacity: 0.6 }}>🌾</div>
                    )}
                    <WishlistButton productId={product.id} />
                    
                    {/* Floating Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                      {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', boxShadow: '0 4px 10px rgba(225,29,72,0.3)' }}>
                          Sisa {product.stockQuantity}!
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div style={{ padding: '20px 10px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category?.name || 'Sembako Desa'}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '12px', color: 'var(--neutral-900)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Harga Warga</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>
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
      </section>

    </div>
  );
}
