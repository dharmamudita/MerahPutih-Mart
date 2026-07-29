'use client';
import { useState } from 'react';
import styles from './TambahProduk.module.css';
import { ChevronRight, Save, Image as ImageIcon, UploadCloud, X, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TambahProdukClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    description: '',
    buyPrice: '',
    sellPrice: '',
    tax: 0,
    discount: 0,
    stock: '',
    minStock: '',
    weight: '',
    isActive: true
  });
  
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleToggleActive = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.sellPrice) {
      toast.error('Harap isi field wajib (Nama, Kategori, Harga Jual)');
      return;
    }
    
    setLoading(true);
    // Mock save
    setTimeout(() => {
      toast.success('Produk berhasil ditambahkan!');
      setLoading(false);
      router.push('/produk');
    }, 1000);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.breadcrumb}>
            <Link href="/produk" className={styles.breadcrumbLink}>Produk</Link>
            <ChevronRight size={14} />
            <span>Tambah Baru</span>
          </div>
          <h1 className={styles.pageTitle}>Tambah Produk Baru</h1>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={() => router.push('/produk')}>Batal</button>
          <button type="submit" className={styles.btnSave} disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Kolom Utama */}
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Informasi Umum</div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Produk *</label>
              <input type="text" name="name" className={styles.input} placeholder="Contoh: Beras Premium Maknyus 5kg" value={formData.name} onChange={handleChange} required />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Kategori *</label>
                <select name="categoryId" className={styles.input} value={formData.categoryId} onChange={handleChange} required>
                  <option value="">-- Pilih Kategori --</option>
                  <option value="1">Sembako</option>
                  <option value="2">Pertanian</option>
                  <option value="3">Minuman</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Berat Produk (Gram)</label>
                <div className={styles.inputSuffix}>
                  <input type="number" name="weight" className={`${styles.input} ${styles.inputWithSuffix}`} placeholder="Contoh: 5000" style={{ width: '100%', paddingRight: '60px' }} value={formData.weight} onChange={handleChange} />
                  <span className={styles.suffix}>gr</span>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Deskripsi Produk</label>
              <textarea name="description" className={styles.textarea} placeholder="Tuliskan deksripsi detail tentang produk ini..." value={formData.description} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Media & Foto</div>
            <div className={styles.uploadArea}>
              <UploadCloud size={32} className={styles.uploadIcon} />
              <div>
                <div className={styles.uploadTitle}>Klik untuk upload atau drag and drop</div>
                <div className={styles.uploadSubtitle}>PNG, JPG, JPEG (Max. 5MB) - Maks 5 foto</div>
              </div>
            </div>
            
            {images.length > 0 && (
              <div className={styles.imageGrid}>
                {/* Mock Image Display */}
                <div className={styles.imagePreview}>
                  <button type="button" className={styles.removeImageBtn}><X size={14}/></button>
                  <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150" alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Harga & Pajak</div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Harga Beli (Modal)</label>
                <div className={styles.inputPrefix}>
                  <span className={styles.prefix}>Rp</span>
                  <input type="number" name="buyPrice" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0" value={formData.buyPrice} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Harga Jual *</label>
                <div className={styles.inputPrefix}>
                  <span className={styles.prefix}>Rp</span>
                  <input type="number" name="sellPrice" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0" required value={formData.sellPrice} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pajak PPN (%)</label>
                <div className={styles.inputSuffix}>
                  <input type="number" name="tax" className={styles.input} placeholder="11" style={{ width: '100%', paddingRight: '40px' }} value={formData.tax} onChange={handleChange} />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Diskon Promo (Rp)</label>
                <div className={styles.inputPrefix}>
                  <span className={styles.prefix}>Rp</span>
                  <input type="number" name="discount" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0" value={formData.discount} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Status Produk</div>
            <div className={styles.toggleContainer}>
              <div className={`${styles.toggleSwitch} ${formData.isActive ? styles.active : ''}`} onClick={handleToggleActive}>
                <div className={styles.toggleSlider}></div>
              </div>
              <span style={{ fontWeight: '600', color: formData.isActive ? 'var(--success)' : 'var(--neutral-500)' }}>
                {formData.isActive ? 'Aktif (Tampil di Web)' : 'Nonaktif (Disembunyikan)'}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Manajemen Stok</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stok Awal</label>
              <input type="number" name="stock" className={styles.input} placeholder="0" value={formData.stock} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Batas Stok Minimum (Peringatan)</label>
              <input type="number" name="minStock" className={styles.input} placeholder="5" value={formData.minStock} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Identifikasi (SKU & Barcode)</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>SKU Produk</label>
              <input type="text" name="sku" className={styles.input} placeholder="Contoh: BRS-PRM-5KG" value={formData.sku} onChange={handleChange} />
              <span style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>Kosongkan untuk di-generate otomatis</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Barcode / QR Code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" name="barcode" className={styles.input} style={{ flex: 1 }} placeholder="Scan barcode..." value={formData.barcode} onChange={handleChange} />
                <button type="button" className={styles.btnCancel} style={{ padding: '0 12px' }} title="Scan QR">
                  <QrCode size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
