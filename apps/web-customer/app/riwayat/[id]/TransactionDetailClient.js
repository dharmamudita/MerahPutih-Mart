'use client';
import { useState, useEffect } from 'react';
import styles from './TransactionDetail.module.css';
import { ChevronRight, Package, Truck, CheckCircle2, Download, Printer, MapPin, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TransactionDetailClient({ orderId }) {
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Di dunia nyata, ini fetch dari /api/orders/:id
    // Untuk Fase 3 UI Showcase, kita gunakan Mock Data yang sangat kaya
    setTimeout(() => {
      setOrder({
        id: orderId,
        invoiceNumber: orderId,
        status: 'COMPLETED', // WAITING_PAYMENT, PROCESSING, SHIPPING, COMPLETED
        type: 'DELIVERY',
        createdAt: '2026-07-28T14:30:00Z',
        completedAt: '2026-07-28T16:45:00Z',
        shippingAddress: {
          label: 'Rumah',
          name: 'Budi Santoso',
          phone: '081234567890',
          fullAddress: 'Jl. Merdeka No. 45, Desa Sindangjaya, Kec. Sindang'
        },
        paymentMethod: 'QRIS',
        subtotal: 125000,
        shippingCost: 10000,
        discountAmount: 15000,
        pointsUsed: 50,
        pointsDiscount: 5000,
        grandTotal: 115000,
        items: [
          { id: '1', name: 'Beras Premium 5kg', price: 65000, quantity: 1, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
          { id: '2', name: 'Minyak Goreng 2L', price: 30000, quantity: 2, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' }
        ],
        timeline: [
          { status: 'Pesanan Dibuat', time: '2026-07-28T14:30:00Z', desc: 'Pesanan berhasil dibuat dan menunggu pembayaran', active: true, icon: Clock },
          { status: 'Pembayaran Berhasil', time: '2026-07-28T14:35:00Z', desc: 'Pembayaran menggunakan QRIS berhasil diverifikasi', active: true, icon: CreditCard },
          { status: 'Diproses', time: '2026-07-28T14:50:00Z', desc: 'Pesanan sedang disiapkan oleh Koperasi', active: true, icon: Package },
          { status: 'Dalam Pengiriman', time: '2026-07-28T15:30:00Z', desc: 'Pesanan sedang dibawa oleh kurir', active: true, icon: Truck },
          { status: 'Selesai', time: '2026-07-28T16:45:00Z', desc: 'Pesanan telah diterima', active: true, icon: CheckCircle2 }
        ]
      });
    }, 500);
  }, [orderId]);

  if (!mounted || !order) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Memuat detail pesanan...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Beranda</Link>
        <ChevronRight size={14} />
        <Link href="/riwayat" className={styles.breadcrumbLink}>Riwayat Belanja</Link>
        <ChevronRight size={14} />
        <span>{order.invoiceNumber}</span>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Detail Pesanan</h1>
          <div className={styles.invoiceInfo}>
            <span>{order.invoiceNumber}</span>
            <span>•</span>
            <span>{new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className={`${styles.statusBadge} ${styles[order.status]}`}>
          {order.status === 'COMPLETED' ? <CheckCircle2 size={18} /> : <Package size={18} />}
          {order.status === 'COMPLETED' ? 'Selesai' : 'Diproses'}
        </div>
      </div>

      <div className={styles.layout}>
        {/* Kiri: Daftar Produk & Timeline */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Package size={20} color="var(--primary-600)" /> Produk yang Dibeli
            </div>
            <div className={styles.productList}>
              {order.items.map(item => (
                <div key={item.id} className={styles.productItem}>
                  <div className={styles.productImage}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : '📦'}
                  </div>
                  <div className={styles.productDetails}>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productPrice}>
                      <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                      <span className={styles.productTotal}>Rp {(item.quantity * item.price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Truck size={20} color="var(--primary-600)" /> Lacak Pesanan
            </div>
            <div className={styles.timeline}>
              {order.timeline.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <div key={idx} className={`${styles.timelineItem} ${event.active ? styles.active : ''}`}>
                    <div className={styles.timelineIcon}>
                      {event.active ? <CheckCircle2 size={14} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }} />}
                    </div>
                    <div className={styles.timelineContent}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div className={styles.timelineTitle}>{event.status}</div>
                          <div className={styles.timelineDesc}>{event.desc}</div>
                        </div>
                        <div className={styles.timelineDate}>
                          {new Date(event.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          <br />
                          {new Date(event.time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kanan: Info Pengiriman & Pembayaran */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <MapPin size={20} color="var(--primary-600)" /> Info Pengiriman
            </div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{order.shippingAddress.label}</div>
            <div style={{ fontSize: '14px', color: 'var(--neutral-600)', marginBottom: '8px' }}>
              {order.shippingAddress.name} ({order.shippingAddress.phone})
            </div>
            <div style={{ fontSize: '14px', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
              {order.shippingAddress.fullAddress}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <CreditCard size={20} color="var(--primary-600)" /> Rincian Pembayaran
            </div>
            <div className={styles.summaryRow}>
              <span>Metode Pembayaran</span>
              <span style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--neutral-100)', margin: '16px 0' }}></div>
            <div className={styles.summaryRow}>
              <span>Total Harga ({order.items.reduce((acc, i) => acc + i.quantity, 0)} barang)</span>
              <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Ongkos Kirim</span>
              <span>Rp {order.shippingCost.toLocaleString('id-ID')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className={styles.summaryRow} style={{ color: 'var(--success)', fontWeight: '600' }}>
                <span>Diskon Voucher</span>
                <span>- Rp {order.discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {order.pointsDiscount > 0 && (
              <div className={styles.summaryRow} style={{ color: 'var(--warning)', fontWeight: '600' }}>
                <span>Tukar Poin ({order.pointsUsed} Poin)</span>
                <span>- Rp {order.pointsDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className={styles.summaryTotal}>
              <span>Total Bayar</span>
              <span>Rp {order.grandTotal.toLocaleString('id-ID')}</span>
            </div>
            
            <button className={styles.actionBtn} onClick={() => window.print()}>
              <Download size={18} /> Unduh Struk Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
