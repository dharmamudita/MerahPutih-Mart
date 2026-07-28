import Link from 'next/link';
import AddToCartButton from '../components/AddToCartButton';

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
    <div>
      {/* Hero Banner Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)', 
        color: 'var(--white)', 
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', filter: 'blur(30px)' }}></div>
        
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', fontSize: '14px', fontWeight: '600', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
              ✨ Solusi Belanja Pintar Warga Desa
            </span>
            <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-1px' }}>
              Belanja Kebutuhan Harian, <br/><span style={{ color: 'var(--gold)' }}>Harga Spesial Warga Desa.</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', lineHeight: 1.6 }}>
              Beli sembako dan kebutuhan pertanian langsung dari Koperasi Desa Merah Putih. Dijamin lebih murah, segar, dan bermanfaat untuk kemajuan desa kita bersama.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/belanja" className="btn" style={{ backgroundColor: 'var(--gold)', color: 'var(--neutral-900)', padding: '14px 28px', fontSize: '16px', borderRadius: '999px', boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)' }}>
                Mulai Belanja
              </Link>
              <Link href="/promo" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--white)', padding: '14px 28px', fontSize: '16px', borderRadius: '999px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                Lihat Promo
              </Link>
            </div>
          </div>
          {/* Hero Image / Illustration */}
          <div style={{ width: '440px', height: '340px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <span style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.2))' }}>🛍️🛒</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ padding: '60px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Produk Pilihan Hari Ini</h2>
          <Link href="/belanja" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Lihat Semua &rarr;</Link>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--neutral-50)', borderRadius: '12px' }}>
            <span style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }}>📦</span>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--neutral-700)' }}>Belum ada produk</h3>
            <p style={{ color: 'var(--neutral-500)' }}>Produk akan segera tersedia di KopDes ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {products.map(product => {
              // Mengambil image pertama jika ada, atau fallback emoji
              const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
              
              return (
                <div key={product.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-premium)'; e.currentTarget.style.borderColor = 'var(--primary-300)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--neutral-200)'; }}>
                  <div style={{ height: '200px', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '🌾' // Fallback image icon
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--warning)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>
                        Sisa {product.stockQuantity}!
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category?.name || 'Lainnya'}
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
      </section>

      {/* Value Proposition */}
      <section style={{ backgroundColor: 'var(--primary-50)', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>Mengapa Belanja di MerahPutih Mart?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>💰</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Harga Lebih Murah</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Barang disuplai langsung dari distributor pusat untuk memastikan harga terjangkau.</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🛵</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Gratis Ongkos Kirim</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Pengiriman langsung dari KopDes terdekat ke rumah Anda tanpa biaya tambahan.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🤝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Mendukung Ekonomi Desa</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Keuntungan koperasi akan dikembalikan untuk program pembangunan desa.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
