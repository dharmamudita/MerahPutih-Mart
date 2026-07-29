'use client';
import { useState, useEffect } from 'react';
import styles from './POS.module.css';
import { ArrowLeft, Search, ScanLine, UserPlus, Trash2, Minus, Plus, CreditCard, Banknote, Printer } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function POSClient() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  
  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStrukModalOpen, setIsStrukModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Tunai'); // Tunai, QRIS
  const [cashAmount, setCashAmount] = useState('');

  // Mock Products
  const products = [
    { id: 1, name: 'Beras Premium 5kg', price: 65000, category: 'Sembako', stock: 12, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150' },
    { id: 2, name: 'Minyak Goreng 2L', price: 30000, category: 'Sembako', stock: 45, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'Gula Pasir 1kg', price: 15000, category: 'Sembako', stock: 20, image: '' },
    { id: 4, name: 'Pupuk Urea 50kg', price: 125000, category: 'Pertanian', stock: 5, image: '' },
    { id: 5, name: 'Indomie Goreng', price: 3000, category: 'Makanan', stock: 100, image: '' },
  ];

  const categories = ['Semua', 'Sembako', 'Pertanian', 'Makanan', 'Minuman'];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'Semua' ? true : p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const grandTotal = subtotal + tax;

  const changeAmount = Number(cashAmount) - grandTotal;

  const handleProcessPayment = () => {
    if (paymentMethod === 'Tunai' && Number(cashAmount) < grandTotal) {
      toast.error('Uang tunai kurang!');
      return;
    }
    
    // Save transaction for receipt
    setLastTransaction({
      date: new Date().toLocaleString('id-ID'),
      items: [...cart],
      subtotal,
      tax,
      grandTotal,
      paymentMethod,
      cashAmount: Number(cashAmount),
      change: changeAmount
    });

    toast.success('Pembayaran Berhasil!');
    setCart([]);
    setIsPaymentModalOpen(false);
    setCashAmount('');
    setIsStrukModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {/* KIRI: KATALOG */}
      <div className={styles.catalogPane}>
        <div className={styles.posHeader}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backBtn} title="Kembali ke Dashboard">
              <ArrowLeft size={20} />
            </Link>
            <div className={styles.logoText}>Kopdes POS</div>
          </div>
          <div className={styles.searchBox}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Cari produk atau scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ScanLine size={18} className={styles.barcodeBtn} title="Scan Barcode" onClick={() => toast.success('Scanner aktif')} />
          </div>
        </div>

        <div className={styles.categories}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.map(p => (
            <div key={p.id} className={styles.productCard} onClick={() => addToCart(p)}>
              <div className={styles.productImage}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{fontSize: '24px'}}>📦</span>}
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productStock}>Stok: {p.stock}</div>
                <div className={styles.productPrice}>Rp {p.price.toLocaleString('id-ID')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KANAN: KERANJANG */}
      <div className={styles.cartPane}>
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>Keranjang ({cart.length})</div>
          {cart.length > 0 && <button className={styles.clearBtn} onClick={() => setCart([])}>Kosongkan</button>}
        </div>

        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--neutral-400)', marginTop: '40px' }}>
              <ScanLine size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Belum ada produk.<br/>Silakan pilih dari katalog atau scan barcode.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemName}>{item.name}</div>
                  <div className={styles.cartItemPrice}>Rp {item.price.toLocaleString('id-ID')}</div>
                  
                  <div className={styles.cartItemActions}>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                    </div>
                    <button className={styles.clearBtn} onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '14px', alignSelf: 'flex-end', paddingBottom: '12px' }}>
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.customerSelect} onClick={() => alert('Pilih member belum tersedia')}>
            <UserPlus size={18} color="var(--primary-600)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>Pelanggan Umum</div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>Klik untuk memilih Member (Poin)</div>
            </div>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Pajak (11%)</span>
            <span>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
          </div>

          <button 
            className={styles.payBtn} 
            disabled={cart.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Pembayaran</h2>
              <button className={styles.closeBtn} onClick={() => setIsPaymentModalOpen(false)}><X size={24} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.paymentMethods}>
                <button 
                  className={`${styles.payMethodBtn} ${paymentMethod === 'Tunai' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('Tunai')}
                >
                  <Banknote size={24} />
                  Tunai
                </button>
                <button 
                  className={`${styles.payMethodBtn} ${paymentMethod === 'QRIS' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('QRIS')}
                >
                  <CreditCard size={24} />
                  QRIS / Transfer
                </button>
              </div>

              {paymentMethod === 'Tunai' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Uang Diterima (Rp)</label>
                  <input 
                    type="number" 
                    className={styles.inputLg} 
                    value={cashAmount} 
                    onChange={(e) => setCashAmount(e.target.value)} 
                    placeholder="0"
                    autoFocus
                  />
                  <div className={styles.quickCash}>
                    <button type="button" className={styles.cashBtn} onClick={() => setCashAmount(grandTotal)}>Uang Pas</button>
                    <button type="button" className={styles.cashBtn} onClick={() => setCashAmount(50000)}>50K</button>
                    <button type="button" className={styles.cashBtn} onClick={() => setCashAmount(100000)}>100K</button>
                  </div>

                  {Number(cashAmount) > 0 && (
                    <div className={styles.changeAmount}>
                      {changeAmount >= 0 ? `Kembalian: Rp ${changeAmount.toLocaleString('id-ID')}` : 'Uang Kurang!'}
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'QRIS' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <QrCode size={120} color="var(--neutral-800)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontWeight: '600' }}>Tampilkan QRIS ini ke Pelanggan</p>
                  <p style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Total tagihan: Rp {grandTotal.toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.payBtn} 
                style={{ marginTop: 0 }}
                onClick={handleProcessPayment}
                disabled={paymentMethod === 'Tunai' && Number(cashAmount) < grandTotal}
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUK (RECEIPT) MODAL */}
      {isStrukModalOpen && lastTransaction && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ width: '400px', backgroundColor: '#f3f4f6' }}>
            <div className={styles.modalHeader} style={{ background: 'white' }}>
              <h2 className={styles.modalTitle}>Cetak Struk</h2>
              <button className={styles.closeBtn} onClick={() => setIsStrukModalOpen(false)}><X size={24} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.strukContainer} id="struk-print-area">
                <div className={styles.strukHeader}>
                  <div className={styles.strukTitle}>KOPERASI DESA MERAH PUTIH</div>
                  <div>Jl. Kebangsaan No. 17, Indonesia</div>
                  <div>Telp: 0812-3456-7890</div>
                </div>
                
                <div className={styles.strukInfo}>
                  <div className={styles.strukRow}><span>Waktu:</span><span>{lastTransaction.date}</span></div>
                  <div className={styles.strukRow}><span>Kasir:</span><span>Budi Santoso</span></div>
                  <div className={styles.strukRow}><span>Struk:</span><span>INV-{Date.now().toString().slice(-6)}</span></div>
                </div>

                <div className={styles.strukItems}>
                  {lastTransaction.items.map(item => (
                    <div key={item.id} style={{ marginBottom: '8px' }}>
                      <div>{item.name}</div>
                      <div className={styles.strukRow}>
                        <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
                        <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className={styles.strukRow}><span>Subtotal</span><span>{lastTransaction.subtotal.toLocaleString('id-ID')}</span></div>
                  <div className={styles.strukRow}><span>PPN (11%)</span><span>{lastTransaction.tax.toLocaleString('id-ID')}</span></div>
                  <div className={`${styles.strukRow} ${styles.strukTotal}`}><span>TOTAL</span><span>{lastTransaction.grandTotal.toLocaleString('id-ID')}</span></div>
                  
                  <div style={{ marginTop: '12px' }}>
                    <div className={styles.strukRow}><span>Bayar ({lastTransaction.paymentMethod})</span><span>{lastTransaction.cashAmount > 0 ? lastTransaction.cashAmount.toLocaleString('id-ID') : lastTransaction.grandTotal.toLocaleString('id-ID')}</span></div>
                    {lastTransaction.paymentMethod === 'Tunai' && (
                      <div className={styles.strukRow}><span>Kembali</span><span>{lastTransaction.change.toLocaleString('id-ID')}</span></div>
                    )}
                  </div>
                </div>

                <div className={styles.strukFooter}>
                  Terima kasih atas kunjungan Anda!<br/>
                  Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter} style={{ background: 'white' }}>
              <button className={styles.cancelBtn} style={{ width: '100%', marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => alert('Fitur kirim struk ke WhatsApp pelanggan!')}>
                Kirim via WhatsApp
              </button>
              <button className={styles.payBtn} style={{ marginTop: 0, width: '100%' }} onClick={() => { toast.success('Struk dicetak!'); setIsStrukModalOpen(false); }}>
                <Printer size={18} /> Cetak Struk Fisik
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
