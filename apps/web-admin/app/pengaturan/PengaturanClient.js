'use client';
import { useState } from 'react';
import styles from './Pengaturan.module.css';
import { Store, Percent, Truck, CreditCard, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengaturanClient() {
  const [activeMenu, setActiveMenu] = useState('toko'); // toko, pajak, ongkir, pembayaran

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pengaturan Sistem</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>Konfigurasi utama aplikasi koperasi desa</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleSave}>
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <button className={`${styles.menuBtn} ${activeMenu === 'toko' ? styles.active : ''}`} onClick={() => setActiveMenu('toko')}>
            <Store size={18} /> Identitas Koperasi
          </button>
          <button className={`${styles.menuBtn} ${activeMenu === 'pajak' ? styles.active : ''}`} onClick={() => setActiveMenu('pajak')}>
            <Percent size={18} /> Pajak (PPN)
          </button>
          <button className={`${styles.menuBtn} ${activeMenu === 'ongkir' ? styles.active : ''}`} onClick={() => setActiveMenu('ongkir')}>
            <Truck size={18} /> Ongkos Kirim Lokal
          </button>
          <button className={`${styles.menuBtn} ${activeMenu === 'pembayaran' ? styles.active : ''}`} onClick={() => setActiveMenu('pembayaran')}>
            <CreditCard size={18} /> Metode Pembayaran
          </button>
        </div>

        <div className={styles.content}>
          {activeMenu === 'toko' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Profil Koperasi</h2>
              <form className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label className={styles.label}>Logo Koperasi</label>
                  <div className={styles.uploadArea}>
                    <ImageIcon size={32} color="var(--neutral-400)" />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Klik untuk upload logo (Max 2MB)</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Koperasi *</label>
                  <input type="text" className={styles.input} defaultValue="Koperasi Desa Merah Putih" required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nomor Telepon / WhatsApp CS *</label>
                  <input type="text" className={styles.input} defaultValue="081234567890" required />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label className={styles.label}>Alamat Lengkap Koperasi</label>
                  <textarea className={styles.textarea} defaultValue="Jl. Kebangsaan No. 17, Desa Merah Putih"></textarea>
                </div>
              </form>
            </div>
          )}

          {activeMenu === 'pajak' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Pengaturan Pajak (PPN)</h2>
              <p style={{ fontSize: '14px', color: 'var(--neutral-600)', marginBottom: '24px' }}>
                Aktifkan jika koperasi Anda merupakan Pengusaha Kena Pajak (PKP) dan wajib memungut PPN.
              </p>
              
              <div className={styles.toggleContainer}>
                <div>
                  <div style={{ fontWeight: '700' }}>Terapkan PPN pada Transaksi</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Baik di POS Kasir maupun pesanan E-Commerce</div>
                </div>
                <div className={`${styles.toggleSwitch} ${styles.active}`}>
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>

              <div className={styles.formGroup} style={{ maxWidth: '300px' }}>
                <label className={styles.label}>Besaran PPN Standar</label>
                <div className={styles.inputSuffix}>
                  <input type="number" className={styles.input} defaultValue="11" style={{ paddingRight: '40px' }} />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'ongkir' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Pengaturan Ongkos Kirim Lokal Desa</h2>
              <p style={{ fontSize: '14px', color: 'var(--neutral-600)', marginBottom: '24px' }}>
                Atur tarif flat untuk pengantaran pesanan online ke rumah warga.
              </p>
              
              <div className={styles.toggleContainer}>
                <div>
                  <div style={{ fontWeight: '700' }}>Aktifkan Fitur Pesan Antar (Delivery)</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Pelanggan bisa memilih opsi diantar oleh kurir desa</div>
                </div>
                <div className={`${styles.toggleSwitch} ${styles.active}`}>
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tarif Ongkir Flat (Radius Desa)</label>
                  <input type="number" className={styles.input} defaultValue="10000" />
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Diisi dalam Rupiah (Misal: 10000)</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Gratis Ongkir untuk Belanja di atas</label>
                  <input type="number" className={styles.input} defaultValue="250000" />
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Isi 0 jika tidak ada promo gratis ongkir</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'pembayaran' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Metode Pembayaran Online</h2>
              
              <div className={styles.toggleContainer}>
                <div>
                  <div style={{ fontWeight: '700' }}>Bayar di Tempat (COD)</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Pelanggan membayar saat kurir mengantar barang</div>
                </div>
                <div className={`${styles.toggleSwitch} ${styles.active}`}>
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>
              
              <div className={styles.toggleContainer}>
                <div>
                  <div style={{ fontWeight: '700' }}>Transfer Bank Manual</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Pelanggan harus upload bukti transfer</div>
                </div>
                <div className={`${styles.toggleSwitch} ${styles.active}`}>
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>
              
              <div className={styles.toggleContainer}>
                <div>
                  <div style={{ fontWeight: '700' }}>QRIS (Otomatis)</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Integrasi dengan Payment Gateway</div>
                </div>
                <div className={`${styles.toggleSwitch}`}>
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
