'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/cartStore';
import { MapPin, Truck, Store, CreditCard, UploadCloud, Ticket, Wallet, Plus, Coins, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY'); // 'DELIVERY' atau 'PICKUP'
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER'); // TRANSFER, QRIS, COD
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  
  const [usePoints, setUsePoints] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCost = deliveryMethod === 'DELIVERY' ? 10000 : 0;
  const pointDiscount = usePoints && customer ? Math.min(customer.totalPoints * 100, subtotal) : 0;
  const grandTotal = subtotal + shippingCost - discountAmount - pointDiscount;

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && mounted) {
      router.push('/cart');
      return;
    }

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      fetchAddresses(storedToken);
      fetchCustomerProfile(storedToken);
    } else {
      router.push('/login');
    }
  }, [items.length, router, mounted]);

  const fetchAddresses = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.data);
        const defaultAddr = data.data.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (data.data.length > 0) setSelectedAddressId(data.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  const fetchCustomerProfile = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      // Asumsikan ada endpoint ini dari member backend (akan kita buat di step 2)
      // Untuk mock up sekarang:
      setCustomer({
        totalPoints: 150,
        memberLevel: 'SILVER'
      });
    } catch (error) {
      console.error('Failed to fetch customer', error);
    }
  };

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'DISKONKOPDES') {
      setDiscountAmount(15000);
      toast.success('Voucher berhasil digunakan!');
    } else {
      toast.error('Voucher tidak valid');
      setDiscountAmount(0);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (deliveryMethod === 'DELIVERY' && !selectedAddressId) {
      toast.error('Silakan pilih alamat pengiriman');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const payload = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.sellPrice })),
        deliveryMethod,
        shippingAddressId: deliveryMethod === 'DELIVERY' ? selectedAddressId : null,
        paymentMethod,
        notes,
        kopdesId: items[0]?.kopdesId || null,
        pointsUsed: usePoints ? customer.totalPoints : 0,
        voucherCode: voucherCode || null
      };

      const res = await fetch(`${apiUrl}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();

      if (res.ok) {
        clearCart();
        router.push(`/checkout/success?orderId=${data.data.orderNo}`);
      } else {
        toast.error(data.message || 'Gagal melakukan checkout.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* Kolom Kiri: Form & Opsi */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px', color: 'var(--neutral-900)' }}>Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleCheckout}>
            
            {/* Opsi Pengiriman */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--primary-600)" /> Opsi Pengiriman
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <label style={{ 
                  border: `2px solid ${deliveryMethod === 'DELIVERY' ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  backgroundColor: deliveryMethod === 'DELIVERY' ? 'var(--primary-50)' : 'white'
                }}>
                  <input type="radio" value="DELIVERY" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} style={{ marginTop: '4px' }} />
                  <div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Kirim ke Rumah</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Kurir Kopdes (Rp 10.000)</div>
                  </div>
                </label>
                
                <label style={{ 
                  border: `2px solid ${deliveryMethod === 'PICKUP' ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  backgroundColor: deliveryMethod === 'PICKUP' ? 'var(--primary-50)' : 'white'
                }}>
                  <input type="radio" value="PICKUP" checked={deliveryMethod === 'PICKUP'} onChange={() => setDeliveryMethod('PICKUP')} style={{ marginTop: '4px' }} />
                  <div>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>Ambil di Koperasi</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Gratis biaya penanganan</div>
                  </div>
                </label>
              </div>
              
              {deliveryMethod === 'DELIVERY' && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--neutral-50)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Alamat Pengiriman</h3>
                    <button type="button" onClick={() => router.push('/profile')} style={{ color: 'var(--primary-600)', fontSize: '13px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>+ Tambah Alamat</button>
                  </div>
                  
                  {addresses.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed var(--neutral-300)' }}>
                      Anda belum memiliki alamat tersimpan.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {addresses.map(addr => (
                        <label key={addr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid var(--neutral-200)', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer' }}>
                          <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} style={{ marginTop: '4px' }} />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{addr.label} <span style={{ fontWeight: 'normal', color: 'var(--neutral-500)' }}>({addr.recipientName})</span></div>
                            <div style={{ fontSize: '13px', color: 'var(--neutral-600)', marginTop: '4px' }}>{addr.address}, {addr.village}, {addr.district}, {addr.city}</div>
                            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>{addr.phone}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {deliveryMethod === 'PICKUP' && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--primary-50)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                  <Store color="var(--primary-600)" />
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '14px', color: 'var(--neutral-900)' }}>Koperasi Desa Merah Putih</h4>
                    <p style={{ fontSize: '13px', color: 'var(--neutral-600)', marginTop: '4px' }}>Jl. Raya Desa No. 123, Sindangjaya. Buka 08:00 - 17:00</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Opsi Pembayaran */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={20} color="var(--primary-600)" /> Metode Pembayaran
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === 'TRANSFER' ? 'var(--primary-600)' : 'var(--neutral-200)'}`, borderRadius: '12px', cursor: 'pointer', backgroundColor: paymentMethod === 'TRANSFER' ? 'var(--primary-50)' : 'white' }}>
                  <input type="radio" value="TRANSFER" checked={paymentMethod === 'TRANSFER'} onChange={() => setPaymentMethod('TRANSFER')} />
                  <CreditCard size={18} color="var(--neutral-700)" />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Transfer Bank (BCA, Mandiri, BRI)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === 'QRIS' ? 'var(--primary-600)' : 'var(--neutral-200)'}`, borderRadius: '12px', cursor: 'pointer', backgroundColor: paymentMethod === 'QRIS' ? 'var(--primary-50)' : 'white' }}>
                  <input type="radio" value="QRIS" checked={paymentMethod === 'QRIS'} onChange={() => setPaymentMethod('QRIS')} />
                  <div style={{ fontWeight: '800', fontStyle: 'italic', color: '#1B4D89', fontSize: '14px' }}>QRIS</div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Scan QRIS (Gopay, OVO, Dana, LinkAja)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === 'COD' ? 'var(--primary-600)' : 'var(--neutral-200)'}`, borderRadius: '12px', cursor: 'pointer', backgroundColor: paymentMethod === 'COD' ? 'var(--primary-50)' : 'white' }}>
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <Wallet size={18} color="var(--neutral-700)" />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Bayar di Tempat (COD)</span>
                </label>
              </div>
            </div>
            
            {/* Catatan Pesanan */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={20} color="var(--primary-600)" /> Catatan Pesanan
              </h2>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Titip pesan ke kasir atau kurir (opsional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          </form>
        </div>
        
        {/* Kolom Kanan: Ringkasan & Total */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', position: 'sticky', top: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Ringkasan Pesanan</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--neutral-100)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '🌾'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neutral-900)', marginBottom: '4px' }}>{item.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{item.quantity} x Rp {item.sellPrice.toLocaleString('id-ID')}</span>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>Rp {(item.quantity * item.sellPrice).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Poin & Voucher */}
            <div style={{ borderTop: '1px solid var(--neutral-100)', borderBottom: '1px solid var(--neutral-100)', padding: '16px 0', marginBottom: '20px' }}>
              {/* Voucher */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Ticket size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="Kode Voucher" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid var(--neutral-200)', borderRadius: '8px', fontSize: '13px' }} />
                </div>
                <button type="button" onClick={applyVoucher} style={{ background: 'var(--neutral-900)', color: 'white', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Gunakan</button>
              </div>
              
              {/* Poin */}
              {customer && customer.totalPoints > 0 && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: 'var(--warning-50)', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                  <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '13px', color: '#854d0e' }}>
                      <Coins size={14} /> Gunakan {customer.totalPoints} Poin
                    </div>
                    <div style={{ fontSize: '11px', color: '#a16207' }}>Potongan Rp {(customer.totalPoints * 100).toLocaleString('id-ID')}</div>
                  </div>
                </label>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neutral-600)', fontSize: '14px' }}>
                <span>Subtotal Produk</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neutral-600)', fontSize: '14px' }}>
                <span>Ongkos Kirim</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontSize: '14px', fontWeight: '600' }}>
                  <span>Diskon Voucher</span>
                  <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {pointDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)', fontSize: '14px', fontWeight: '600' }}>
                  <span>Tukar Poin</span>
                  <span>- Rp {pointDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--neutral-200)', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--neutral-900)' }}>Total Pembayaran</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--danger)' }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses Pesanan...' : `Bayar Rp ${grandTotal.toLocaleString('id-ID')}`}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
