'use client';
import { useState } from 'react';
import styles from './Gudang.module.css';
import { PackagePlus, Box, FileText, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GudangClient() {
  const [activeTab, setActiveTab] = useState('riwayat'); // riwayat, masuk, opname

  const [mutasi] = useState([
    { id: 1, date: '24 Okt 2023, 10:00', type: 'IN', product: 'Beras Premium 5kg', qty: 50, note: 'Restock dari Supplier A', user: 'Budi Admin' },
    { id: 2, date: '24 Okt 2023, 11:30', type: 'OUT', product: 'Beras Premium 5kg', qty: 2, note: 'Penjualan POS (INV-001)', user: 'Sistem' },
    { id: 3, date: '23 Okt 2023, 15:00', type: 'ADJUST', product: 'Gula Pasir 1kg', qty: -1, note: 'Barang rusak (kemasan sobek)', user: 'Budi Admin' },
  ]);

  const handleStockOpname = (e) => {
    e.preventDefault();
    toast.success('Penyesuaian stok berhasil disimpan!');
    setActiveTab('riwayat');
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'IN': return '+ Masuk';
      case 'OUT': return '- Keluar';
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
                    <td className={styles.td} style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{m.date}</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles['type-' + m.type]}`}>{getTypeLabel(m.type)}</span>
                    </td>
                    <td className={styles.td} style={{ fontWeight: '600' }}>{m.product}</td>
                    <td className={styles.td} style={{ fontWeight: '800' }}>
                      {m.type === 'IN' ? `+${m.qty}` : m.qty}
                    </td>
                    <td className={styles.td}>{m.note}</td>
                    <td className={styles.td}>{m.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'masuk' && (
            <div className={styles.formCard}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Catat Barang Masuk</h2>
              <form onSubmit={handleStockOpname}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pilih Produk *</label>
                  <select className={styles.select} required>
                    <option value="">Pilih Produk...</option>
                    <option value="1">Beras Premium 5kg (Sisa: 2)</option>
                    <option value="2">Minyak Goreng 2L (Sisa: 45)</option>
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
                  <input type="number" className={styles.input} required placeholder="Contoh: 50" min="1" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Catatan Tambahan</label>
                  <textarea className={styles.textarea} placeholder="Nomor Surat Jalan, DO, dll..."></textarea>
                </div>
                <button type="submit" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
                  Simpan Barang Masuk
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
                  <select className={styles.select} required>
                    <option value="">Pilih Produk...</option>
                    <option value="1">Beras Premium 5kg (Sistem: 2)</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Tipe Penyesuaian *</label>
                    <select className={styles.select} required>
                      <option value="add">Tambah Stok (+)</option>
                      <option value="subtract">Kurangi Stok (-)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Jumlah *</label>
                    <input type="number" className={styles.input} required placeholder="0" min="1" />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alasan Penyesuaian *</label>
                  <select className={styles.select} required>
                    <option value="">Pilih Alasan...</option>
                    <option value="rusak">Barang Rusak / Cacat</option>
                    <option value="expired">Barang Kadaluarsa</option>
                    <option value="hilang">Barang Hilang</option>
                    <option value="opname">Koreksi Stock Opname</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Keterangan Detail</label>
                  <textarea className={styles.textarea} placeholder="Jelaskan secara singkat..."></textarea>
                </div>
                <button type="submit" className={styles.btnPrimary} style={{ background: 'var(--warning)', width: '100%', justifyContent: 'center' }}>
                  Konfirmasi Penyesuaian
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
