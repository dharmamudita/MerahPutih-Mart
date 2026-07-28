import Link from 'next/link';
import AddToCartButton from '../components/AddToCartButton';
import WishlistButton from '../components/WishlistButton';

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
    <div style={{ paddingBottom: '80px' }}>
      {/* 
        ========================================================
        ULTRA-PREMIUM HERO SECTION
        ========================================================
      */}
      <section style={{ 
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 0 60px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at top center, var(--primary-50) 0%, var(--neutral-50) 100%)'
      }}>
        {/* Abstract Glowing Orbs (Mesh Gradient Vibe) */}
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          
          {/* Left Text Content */}
          <div style={{ flex: '1 1 500px', maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--white)', borderRadius: '999px', fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)', marginBottom: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--primary-100)' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-600)', boxShadow: '0 0 10px var(--primary-500)' }}></span>
              Revolusi Belanja Warga Desa
            </div>
            
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'var(--neutral-950)' }}>
              Kebutuhan Harian, <br/>
              <span className="text-gradient">Kualitas Premium.</span>
            </h1>
            
            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--neutral-600)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '540px' }}>
              Akses sembako murah, segar, dan langsung dari pusat untuk warga desa. Belanja cerdas yang membangun kemajuan ekonomi bersama.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <Link href="/belanja" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                Mulai Belanja &rarr;
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px' }}>
                <div style={{ display: 'flex' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--white)', backgroundColor: 'var(--neutral-200)', marginLeft: i > 1 ? '-16px' : '0', backgroundImage: `url('https://i.pravatar.cc/100?img=${i+10}')`, backgroundSize: 'cover' }}></div>
                  ))}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-600)' }}>
                  <span style={{ color: 'var(--neutral-900)' }}>2,000+</span> warga<br/>telah bergabung
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Hero Illustration / Glass Card */}
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <div className="glass" style={{ borderRadius: '32px', padding: '40px', position: 'relative', zIndex: 2, boxShadow: 'var(--shadow-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Produk Terlaris</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neutral-900)' }}>Beras Premium 5kg</div>
                </div>
                <div style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '8px 16px', borderRadius: '999px', fontWeight: '800' }}>
                  Rp 68.000
                </div>
              </div>
              
              <div style={{ height: '240px', background: 'var(--neutral-100)', borderRadius: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.1))' }}>
                🍚
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                + Tambah ke Keranjang
              </button>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="glass" style={{ position: 'absolute', top: '-20px', right: '-20px', padding: '16px 24px', borderRadius: '20px', zIndex: 3, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xl)' }}>
              <span style={{ fontSize: '24px' }}>🚚</span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600' }}>Pengiriman</div>
                <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: '800' }}>Gratis Ongkir</div>
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
      <section className="container" style={{ padding: '40px 16px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Mengapa <span className="text-gradient">MerahPutih?</span></h2>
          <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>Solusi cerdas untuk kebutuhan desa Anda.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: 'var(--white)', borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--neutral-100)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>💰</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: 'var(--neutral-900)' }}>Harga Grosir Langsung</h3>
            <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6' }}>Kami memotong jalur distribusi panjang. Anda mendapatkan harga tangan pertama langsung dari suplier dan produsen.</p>
          </div>
          
          <div style={{ background: 'var(--primary-900)', borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-glow-primary)', color: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>🤝</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Ekonomi Berputar di Desa</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Setiap Rupiah yang Anda belanjakan akan kembali menjadi SHU Koperasi untuk pembangunan desa kita tercinta.</p>
          </div>

          <div style={{ background: 'var(--white)', borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--neutral-100)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gold)', color: 'var(--neutral-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>🌾</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: 'var(--neutral-900)' }}>Kualitas Terjamin</h3>
            <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6' }}>Produk pertanian dan sembako disortir dengan standar kualitas ketat untuk memastikan Anda menerima yang terbaik.</p>
          </div>

        </div>
      </section>

      {/* 
        ========================================================
        PREMIUM PRODUCT GRID
        ========================================================
      */}
      <section className="container" style={{ padding: '40px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ color: 'var(--primary-600)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Koleksi Terbaru</div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Pilihan Spesial</h2>
          </div>
          <Link href="/belanja" className="btn btn-outline" style={{ borderRadius: '999px' }}>Lihat Semua Katalog</Link>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: 'var(--white)', borderRadius: '32px', border: '1px dashed var(--neutral-300)' }}>
            <span style={{ fontSize: '48px', filter: 'grayscale(1)', opacity: 0.5, marginBottom: '24px', display: 'block' }}>📦</span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--neutral-800)', marginBottom: '8px' }}>Belum Ada Produk</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Admin sedang menyiapkan katalog produk terbaik untuk Anda.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' }}>
            {products.map(product => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} className="product-card" style={{ backgroundColor: 'var(--white)', borderRadius: '24px', padding: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--neutral-100)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Image Area */}
                  <div style={{ height: '220px', borderRadius: '16px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ opacity: 0.5 }}>🌾</div>
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
                  <div style={{ padding: '20px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category?.name || 'Lainnya'}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '12px', color: 'var(--neutral-900)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600', marginBottom: '2px' }}>Harga</div>
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
