'use client';
import { useState, useEffect } from 'react';
import styles from './Pesanan.module.css';
import { Search, Download, Eye, Truck, Package, CheckCircle2, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PesananClient() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock Orders Data
  const [orders, setOrders] = useState([
    {
      id: 'INV-20231024-001',
      date: '24 Okt 2023, 14:30',
      customerName: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 45, Desa Sukamaju',
      status: 'PENDING', // PENDING, PROCESSING, SHIPPED, COMPLETED, CANCELLED
      paymentMethod: 'TRANSFER',
      items: [
        { id: 1, name: 'Beras Premium 5kg', qty: 2, price: 65000 },
        { id: 2, name: 'Minyak Goreng 2L', qty: 1, price: 30000 }
      ],
      subtotal: 160000,
      shippingCost: 15000,
      grandTotal: 175000
    },
    {
      id: 'INV-20231024-002',
      date: '24 Okt 2023, 10:15',
      customerName: 'Siti Aminah',
      phone: '081987654321',
      address: 'Diambil di Koperasi (Pickup)',
      status: 'PROCESSING',
      paymentMethod: 'QRIS',
      items: [
        { id: 3, name: 'Pupuk Urea 50kg', qty: 1, price: 125000 }
      ],
      subtotal: 125000,
      shippingCost: 0,
      grandTotal: 125000
    },
    {
      id: 'INV-20231023-005',
      date: '23 Okt 2023, 16:45',
      customerName: 'Ahmad Yani',
      phone: '085211223344',
      address: 'Dusun Karangtengah RT 02/01',
      status: 'SHIPPED',
      paymentMethod: 'TRANSFER',
      items: [
        { id: 4, name: 'Gula Pasir 1kg', qty: 5, price: 15000 }
      ],
      subtotal: 75000,
      shippingCost: 10000,
      grandTotal: 85000
    }
  ]);

  const tabs = [
    { label: 'Semua', value: 'Semua' },
    { label: 'Pesanan Baru', value: 'PENDING' },
    { label: 'Diproses (Packing)', value: 'PROCESSING' },
    { label: 'Dikirim', value: 'SHIPPED' },
    { label: 'Selesai', value: 'COMPLETED' },
    { label: 'Dibatalkan', value: 'CANCELLED' }
  ];

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'Semua' ? true : o.status === activeTab;
    return matchSearch && matchTab;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pesanan Baru';
      case 'PROCESSING': return 'Diproses';
      case 'SHIPPED': return 'Dikirim';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setSelectedOrder({ ...selectedOrder, status: newStatus });
    toast.success(`Status pesanan diubah menjadi ${getStatusLabel(newStatus)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pesanan Online</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            <Download size={18} /> Export Laporan
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          {tabs.map(tab => (
            <button 
              key={tab.value}
              className={`${styles.tabBtn} ${activeTab === tab.value ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className={styles.countBadge}>
                {tab.value === 'Semua' ? orders.length : orders.filter(o => o.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              placeholder="Cari No. Invoice atau Nama Pelanggan..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Invoice & Tanggal</th>
              <th className={styles.th}>Pelanggan & Pengiriman</th>
              <th className={styles.th}>Total Belanja</th>
              <th className={styles.th}>Pembayaran</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.invoiceText}>{o.id}</div>
                  <div className={styles.dateText}>{o.date}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.customerName}>{o.customerName}</div>
                  <div className={styles.addressText}>{o.address}</div>
                </td>
                <td className={styles.td} style={{ fontWeight: '700' }}>
                  Rp {o.grandTotal.toLocaleString('id-ID')}
                </td>
                <td className={styles.td}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{o.paymentMethod}</span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles['status-' + o.status]}`}>
                    {getStatusLabel(o.status)}
                  </span>
                </td>
                <td className={styles.td}>
                  <button className={styles.btnSecondary} onClick={() => setSelectedOrder(o)}>
                    <Eye size={16} /> Detail
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                  Tidak ada pesanan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Pesanan Drawer */}
      {selectedOrder && (
        <div className={styles.drawerOverlay}>
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <div>
                <div className={styles.drawerTitle}>Detail Pesanan</div>
                <div style={{ fontSize: '13px', color: 'var(--neutral-500)', marginTop: '4px' }}>{selectedOrder.id}</div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}><X size={24} /></button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Status Pesanan Saat Ini</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`${styles.badge} ${styles['status-' + selectedOrder.status]}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{selectedOrder.date}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Informasi Pelanggan</div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Nama Lengkap</span><span className={styles.infoValue}>{selectedOrder.customerName}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>No. Handphone</span><span className={styles.infoValue}>{selectedOrder.phone}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Alamat Pengiriman</span><span className={styles.infoValue}>{selectedOrder.address}</span></div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Daftar Produk</div>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemImage}></div>
                    <div style={{ flex: 1 }}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{item.qty} x Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className={styles.itemPrice}>Rp {(item.qty * item.price).toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>

              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Rincian Pembayaran</div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Metode Pembayaran</span><span className={styles.infoValue}>{selectedOrder.paymentMethod}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Subtotal Produk</span><span className={styles.infoValue}>Rp {selectedOrder.subtotal.toLocaleString('id-ID')}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Ongkos Kirim</span><span className={styles.infoValue}>Rp {selectedOrder.shippingCost.toLocaleString('id-ID')}</span></div>
                <div className={styles.infoRow} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--neutral-200)', fontSize: '16px' }}>
                  <span className={styles.infoLabel} style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>Total Pembayaran</span>
                  <span className={styles.infoValue} style={{ fontSize: '18px', color: 'var(--primary-600)' }}>Rp {selectedOrder.grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button className={styles.btnSecondary} onClick={() => handleUpdateStatus('CANCELLED')} style={{ color: 'var(--danger)' }}>Tolak Pesanan</button>
                  <button className={styles.btnPrimary} onClick={() => handleUpdateStatus('PROCESSING')}><Package size={18} /> Proses Pesanan (Packing)</button>
                </>
              )}
              {selectedOrder.status === 'PROCESSING' && (
                <button className={styles.btnPrimary} onClick={() => handleUpdateStatus('SHIPPED')}><Truck size={18} /> Kirim Pesanan</button>
              )}
              {selectedOrder.status === 'SHIPPED' && (
                <button className={styles.btnPrimary} onClick={() => handleUpdateStatus('COMPLETED')}><CheckCircle2 size={18} /> Tandai Selesai</button>
              )}
              {(selectedOrder.status === 'COMPLETED' || selectedOrder.status === 'CANCELLED') && (
                <button className={styles.btnSecondary} onClick={() => setSelectedOrder(null)}>Tutup</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
