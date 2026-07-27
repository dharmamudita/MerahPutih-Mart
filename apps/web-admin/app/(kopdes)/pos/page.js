'use client';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  
  // Dummy data
  useEffect(() => {
    setProducts([
      { id: 1, sku: 'BRS-001', name: 'Beras Setra Ramos 5kg', price: 65000, stock: 120, image: '🌾' },
      { id: 2, sku: 'MYK-001', name: 'Minyak Goreng Bimoli 2L', price: 34000, stock: 45, image: '🛢️' },
      { id: 3, sku: 'GLA-001', name: 'Gula Pasir Gulaku 1kg', price: 16500, stock: 80, image: '🧂' },
      { id: 4, sku: 'IDM-001', name: 'Indomie Kari Ayam', price: 3000, stock: 350, image: '🍜' },
    ]);
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== id));
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert(`Transaksi Berhasil!\nTotal Pembayaran: Rp ${total.toLocaleString('id-ID')}`);
    setCart([]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', height: 'calc(100vh - 120px)' }}>
      
      {/* Kiri: Daftar Produk */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neutral-900)' }}>Mesin Kasir (POS)</h1>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Layanan pembelian langsung di tempat (Offline).</p>
          </div>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-400)' }} />
            <input 
              type="text" 
              placeholder="Cari barcode / nama produk..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '2px solid var(--primary-600)', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--neutral-200)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-500)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--neutral-200)'}
              >
                <div style={{ height: '120px', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  {product.image}
                </div>
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-900)', marginBottom: '8px', lineHeight: 1.3 }}>{product.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-700)' }}>Rp {product.price.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>Stok: {product.stock}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanan: Struk / Keranjang POS */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--neutral-900)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingCart size={20} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Keranjang Pelanggan</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: 'var(--neutral-50)' }}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-400)' }}>
              <ShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Belum ada produk</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-200)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', color: 'var(--neutral-900)' }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--primary-700)', fontWeight: '700', fontSize: '14px' }}>
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--neutral-100)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--neutral-200)', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '20px', fontWeight: '800', color: 'var(--neutral-900)' }}>
            <span>Total:</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              disabled={cart.length === 0}
            >
              <Printer size={18} /> Cetak Struk
            </button>
            <button 
              className="btn btn-primary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#166534' }}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <CreditCard size={18} /> Bayar (Tunai)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
