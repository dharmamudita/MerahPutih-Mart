'use client';
import { useState, useEffect } from 'react';
import styles from './Pesanan.module.css';
import { Search, Download, Eye, Truck, Package, CheckCircle2, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function PesananClient() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/all?kopdesId=${DEV_KOPDES_ID}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const tabs = [
    { label: 'Semua', value: 'Semua' },
    { label: 'Pesanan Baru', value: 'WAITING_PAYMENT' },
    { label: 'Diproses (Packing)', value: 'PROCESSING' },
    { label: 'Dikirim', value: 'SHIPPED' },
    { label: 'Selesai', value: 'COMPLETED' },
    { label: 'Dibatalkan', value: 'CANCELLED' }
  ];

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) || (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'Semua' ? true : o.status === activeTab;
    return matchSearch && matchTab;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'WAITING_PAYMENT': return 'Pesanan Baru / Menunggu Pembayaran';
      case 'PROCESSING': return 'Diproses';
      case 'SHIPPED': return 'Dikirim';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const res = await api.put(`/orders/${selectedOrder.id}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Status pesanan diubah menjadi ${getStatusLabel(newStatus)}`);
        fetchOrders();
        setSelectedOrder(res.data.data);
      }
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
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
                  <div className={styles.invoiceText}>{o.orderNo}</div>
                  <div className={styles.dateText}>{new Date(o.createdAt).toLocaleString('id-ID')}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.customerName}>{o.user?.name || 'Pelanggan'}</div>
                  <div className={styles.addressText}>{o.type === 'DELIVERY' ? 'Pengiriman Alamat' : 'Pickup di Koperasi'}</div>
                </td>
                <td className={styles.td} style={{ fontWeight: '700' }}>
                  Rp {o.totalAmount.toLocaleString('id-ID')}
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
                <div style={{ fontSize: '13px', color: 'var(--neutral-500)', marginTop: '4px' }}>{selectedOrder.orderNo}</div>
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
                  <span style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{new Date(selectedOrder.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Informasi Pelanggan</div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Nama Lengkap</span><span className={styles.infoValue}>{selectedOrder.user?.name || 'Pelanggan'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>No. Handphone</span><span className={styles.infoValue}>{selectedOrder.user?.phone || '-'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Metode Pengiriman</span><span className={styles.infoValue}>{selectedOrder.type === 'DELIVERY' ? 'Pengiriman ke Alamat' : 'Pickup di Koperasi'}</span></div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.sectionTitle}>Daftar Produk</div>
                {selectedOrder.items && selectedOrder.items.map(item => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemImage}></div>
                    <div style={{ flex: 1 }}>
                      <div className={styles.itemName}>{item.product?.name || 'Produk'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}</div>
                    </div>
                    <div className={styles.itemPrice}>Rp {item.totalPrice.toLocaleString('id-ID')}</div>
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
                  <span className={styles.infoValue} style={{ fontSize: '18px', color: 'var(--primary-600)' }}>Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              {selectedOrder.status === 'WAITING_PAYMENT' && (
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
