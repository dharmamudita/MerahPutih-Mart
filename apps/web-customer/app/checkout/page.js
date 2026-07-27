'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/cartStore';
import { MapPin, Truck, Store, CreditCard, UploadCloud } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY'); // 'DELIVERY' atau 'PICKUP'
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect ke cart jika keranjang kosong
    if (items.length === 0 && mounted) {
      router.push('/cart');
    }
  }, [items.length, router, mounted]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Di sini nanti kita panggil API POST /api/orders/checkout
      // Simulasi API Call:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      router.push('/checkout/success?orderId=INV-KOPDES-001');
    } catch (error) {
      console.error(error);
      alert('Gagal melakukan checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* Kolom Kiri: Form & Opsi */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', color: 'var(--neutral-900)' }}>Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleCheckout}>
            
            {/* Metode Pengiriman */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--primary-600)" /> Metode Pengiriman
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <label style={{ 
                  border: `2px solid ${deliveryMethod === 'DELIVERY' ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  backgroundColor: deliveryMethod === 'DELIVERY' ? 'var(--primary-50)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="DELIVERY" 
                    checked={deliveryMethod === 'DELIVERY'}
                    onChange={() => setDeliveryMethod('DELIVERY')}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Diantar ke Rumah</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Gratis ongkir oleh kurir desa.</div>
                  </div>
                </label>
                
                <label style={{ 
                  border: `2px solid ${deliveryMethod === 'PICKUP' ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  backgroundColor: deliveryMethod === 'PICKUP' ? 'var(--primary-50)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="PICKUP" 
                    checked={deliveryMethod === 'PICKUP'}
                    onChange={() => setDeliveryMethod('PICKUP')}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Ambil di Koperasi</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Ambil sendiri di KopDes Merah Putih.</div>
                  </div>
                </label>
              </div>

              {deliveryMethod === 'DELIVERY' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--neutral-700)' }}>
                    Alamat Lengkap Pengiriman
                  </label>
                  <textarea 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Mawar No. 12, RT 03/RW 01, Desa Sindangjaya. Dekat pos ronda."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', minHeight: '100px', fontFamily: 'inherit' }}
                  ></textarea>
                </div>
              )}
            </div>

            {/* Metode Pembayaran */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--primary-600)" /> Metode Pembayaran
              </h2>
              
              <div style={{ backgroundColor: 'var(--neutral-50)', padding: '16px', borderRadius: '8px', border: '1px solid var(--neutral-200)', marginBottom: '16px' }}>
                <div style={{ fontWeight: '700', marginBottom: '8px' }}>Transfer Bank Manual</div>
                <div style={{ fontSize: '14px', color: 'var(--neutral-600)' }}>
                  Silakan transfer ke rekening berikut:<br/>
                  <strong>Bank BRI: 1234-5678-9012-345</strong> a.n Koperasi Merah Putih
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--neutral-700)' }}>
                  Upload Bukti Transfer
                </label>
                <div style={{ border: '2px dashed var(--neutral-300)', padding: '32px', textAlign: 'center', borderRadius: '12px', backgroundColor: 'var(--neutral-50)' }}>
                  <UploadCloud size={32} color="var(--neutral-400)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-600)' }}>Klik untuk unggah foto</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>Format JPG atau PNG (Maks 2MB)</div>
                  <input type="file" required style={{ display: 'none' }} id="upload-bukti" accept="image/*" />
                  <label htmlFor="upload-bukti" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }}></label>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Kolom Kanan: Ringkasan Order */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', position: 'sticky', top: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: 'var(--neutral-900)' }}>Ringkasan Pesanan</h2>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', paddingRight: '8px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--neutral-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '📦'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{item.quantity} x Rp {item.sellPrice.toLocaleString('id-ID')}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', alignSelf: 'center' }}>
                    Rp {(item.quantity * item.sellPrice).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)', margin: '0 -24px 24px -24px' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--neutral-600)', fontSize: '14px' }}>
              <span>Total Harga ({items.length} Barang)</span>
              <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--neutral-600)', fontSize: '14px' }}>
              <span>Ongkos Kirim</span>
              <span style={{ color: '#166534' }}>Gratis</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontWeight: '800', fontSize: '20px', color: 'var(--neutral-900)' }}>
              <span>Total Tagihan</span>
              <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
