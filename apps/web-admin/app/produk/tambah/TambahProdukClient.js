'use client';
import { useState, useEffect } from 'react';
import styles from './TambahProduk.module.css';
import { ChevronRight, Save, UploadCloud, X, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';
import { DEV_KOPDES_ID } from '../../../lib/constants';

export default function TambahProdukClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    unitId: '',
    description: '',
    buyPrice: '',
    sellPrice: '',
    stockQuantity: '',
    minStock: '5',
    weight: '',
    isActive: true
  });

  useEffect(() => {
    api.get(`/categories?kopdesId=${DEV_KOPDES_ID}`).then(res => {
      if (res.data.success) setCategories(res.data.data);
    }).catch(err => console.error(err));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.sellPrice) {
      toast.error('Harap isi field wajib (Nama, Kategori, Harga Jual)');
      return;
    }
    
    setLoading(true);
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('sku', formData.sku);
      dataToSubmit.append('slug', formData.name.toLowerCase().replace(/ /g, '-'));
      dataToSubmit.append('categoryId', formData.categoryId);
      dataToSubmit.append('buyPrice', formData.buyPrice);
      dataToSubmit.append('sellPrice', formData.sellPrice);
      dataToSubmit.append('stockQuantity', formData.stockQuantity);
      dataToSubmit.append('minStock', formData.minStock);
      dataToSubmit.append('description', formData.description);
      dataToSubmit.append('kopdesId', DEV_KOPDES_ID);
      dataToSubmit.append('isActive', formData.isActive);

      if (imageFile) {
        dataToSubmit.append('images', imageFile);
      }

      await api.post('/products', dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Produk berhasil ditambahkan!');
      router.push('/produk');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan produk.');
    } finally {
      setLoading(false);
    }
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
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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
                <div className={styles.uploadSubtitle}>PNG, JPG, JPEG (Max. 5MB)</div>
              </div>
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Harga</div>
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
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Status Produk</div>
            <div className={styles.toggleContainer}>
              <div className={`${styles.toggleSwitch} ${formData.isActive ? styles.active : ''}`} onClick={handleToggleActive}>
                <div className={styles.toggleSlider}></div>
              </div>
              <span style={{ fontWeight: '600', color: formData.isActive ? 'var(--success)' : 'var(--neutral-500)' }}>
                {formData.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Manajemen Stok</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stok Awal *</label>
              <input type="number" name="stockQuantity" className={styles.input} required placeholder="0" value={formData.stockQuantity} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Batas Stok Minimum</label>
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
