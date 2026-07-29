'use client';
import { useState, useEffect } from 'react';
import styles from './Gudang.module.css';
import { PackagePlus, Box, FileText, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function GudangClient() {
  const [activeTab, setActiveTab] = useState('riwayat'); // riwayat, masuk, opname
  const [isLoading, setIsLoading] = useState(false);

  const [mutasi, setMutasi] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  
  // Opname specific
  const [adjustmentType, setAdjustmentType] = useState('subtract'); // add or subtract
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const fetchData = async () => {
    try {
      const [prodRes, mutRes] = await Promise.all([
        api.get(`/products?kopdesId=${DEV_KOPDES_ID}`),
        api.get(`/inventory/movements?kopdesId=${DEV_KOPDES_ID}`)
      ]);
      
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (mutRes.data.success) setMutasi(mutRes.data.data);
    } catch (error) {
      toast.error('Gagal memuat data gudang');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitMasuk = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        productId: selectedProductId,
        type: 'IN',
        quantity: quantity,
        reason: notes || 'Barang Masuk',
        kopdesId: DEV_KOPDES_ID
      };
      
      const res = await api.post('/inventory/mutate', payload);
      if (res.data.success) {
        toast.success('Barang masuk berhasil dicatat!');
        resetForm();
        fetchData();
        setActiveTab('riwayat');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses barang masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockOpname = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map reason to type
      let mutType = 'OUT';
      if (adjustmentType === 'add') mutType = 'IN';

      const payload = {
        productId: selectedProductId,
        type: mutType,
        quantity: quantity,
        reason: adjustmentReason || 'Koreksi Stock Opname',
        kopdesId: DEV_KOPDES_ID
      };

      const res = await api.post('/inventory/mutate', payload);
      if (res.data.success) {
        toast.success('Penyesuaian stok berhasil disimpan!');
        resetForm();
        fetchData();
        setActiveTab('riwayat');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal melakukan penyesuaian stok');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProductId('');
    setQuantity('');
    setNotes('');
    setAdjustmentReason('');
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'IN': return '+ Masuk';
      case 'OUT': return '- Keluar';
      case 'DAMAGED': return '- Rusak';
      case 'EXPIRED': return '- Kadaluarsa';
      case 'ADJUST': return 'Penyesuaian';
      default: return type;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gudang & Inventory</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>Kelola arus keluar-masuk barang dan penyesuaian stok</p>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button className={`${styles.tabBtn} ${activeTab === 'riwayat' ? styles.active : ''}`} onClick={() => setActiveTab('riwayat')}>
            <FileText size={18} /> Riwayat Mutasi Stok
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'masuk' ? styles.active : ''}`} onClick={() => setActiveTab('masuk')}>
            <PackagePlus size={18} /> Barang Masuk (Restock)
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'opname' ? styles.active : ''}`} onClick={() => setActiveTab('opname')}>
            <ArrowRightLeft size={18} /> Penyesuaian Stok (Stock Opname)
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'riwayat' && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Waktu</th>
                  <th className={styles.th}>Tipe</th>
                  <th className={styles.th}>Produk</th>
                  <th className={styles.th}>Qty</th>
                  <th className={styles.th}>Keterangan</th>
                  <th className={styles.th}>Oleh</th>
                </tr>
              </thead>
              <tbody>
                {mutasi.map(m => (
                  <tr key={m.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{new Date(m.createdAt).toLocaleString('id-ID')}</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles['type-' + (m.type === 'IN' ? 'IN' : 'OUT')]}`}>{getTypeLabel(m.type)}</span>
                    </td>
                    <td className={styles.td} style={{ fontWeight: '600' }}>{m.product?.name || m.productId}</td>
                    <td className={styles.td} style={{ fontWeight: '800' }}>
                      {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className={styles.td}>{m.notes}</td>
                    <td className={styles.td}>{m.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'masuk' && (
            <div className={styles.formCard}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Catat Barang Masuk</h2>
              <form onSubmit={handleSubmitMasuk}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pilih Produk *</label>
                  <select className={styles.select} required value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                    <option value="">Pilih Produk...</option>
                    {products.filter(p => p.isActive).map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Sisa: {p.stockQuantity})</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Supplier / Pemasok</label>
                  <select className={styles.select}>
                    <option value="">Pilih Supplier...</option>
                    <option value="1">PT Bumi Pangan</option>
                    <option value="2">Distributor Sembako Mandiri</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Jumlah Masuk (Qty) *</label>
                  <input type="number" className={styles.input} required placeholder="Contoh: 50" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Catatan Tambahan</label>
                  <textarea className={styles.textarea} placeholder="Nomor Surat Jalan, DO, dll..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>
                <button type="submit" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Barang Masuk'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'opname' && (
            <div className={styles.formCard}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Penyesuaian Stok (Stock Opname)</h2>
              <form onSubmit={handleStockOpname}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pilih Produk *</label>
                  <select className={styles.select} required value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                    <option value="">Pilih Produk...</option>
                    {products.filter(p => p.isActive).map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Sistem: {p.stockQuantity})</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Tipe Penyesuaian *</label>
                    <select className={styles.select} required value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)}>
                      <option value="add">Tambah Stok (+)</option>
                      <option value="subtract">Kurangi Stok (-)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Jumlah *</label>
                    <input type="number" className={styles.input} required placeholder="0" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alasan Penyesuaian *</label>
                  <select className={styles.select} required value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)}>
                    <option value="">Pilih Alasan...</option>
                    <option value="Barang Rusak">Barang Rusak / Cacat</option>
                    <option value="Barang Kadaluarsa">Barang Kadaluarsa</option>
                    <option value="Barang Hilang">Barang Hilang</option>
                    <option value="Koreksi Stock Opname">Koreksi Stock Opname</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Keterangan Detail</label>
                  <textarea className={styles.textarea} placeholder="Jelaskan secara singkat..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>
                <button type="submit" className={styles.btnPrimary} style={{ background: 'var(--warning)', width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Konfirmasi Penyesuaian'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
