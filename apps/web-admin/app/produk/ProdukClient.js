'use client';
import { useState, useEffect } from 'react';
import styles from './Produk.module.css';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, QrCode } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function ProdukClient() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/categories?kopdesId=${DEV_KOPDES_ID}`);
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?kopdesId=${DEV_KOPDES_ID}`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data produk.');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      } catch (error) {
        toast.error('Gagal menghapus produk');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter ? p.categoryId === categoryFilter : true;
    const matchStatus = statusFilter === 'active' ? p.isActive : statusFilter === 'inactive' ? !p.isActive : true;
    return matchSearch && matchCategory && matchStatus;
  });

  const getStockBadge = (stock, minStock) => {
    if (stock === 0) return <span className={`${styles.badge} ${styles.badgeOutStock}`}>Habis</span>;
    if (stock <= minStock) return <span className={`${styles.badge} ${styles.badgeLowStock}`}>Menipis ({stock})</span>;
    return <span>{stock}</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manajemen Produk</h1>
        <Link href="/produk/tambah" className={styles.addBtn}>
          <Plus size={18} /> Tambah Produk
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={18} color="var(--neutral-400)" />
              <input 
                type="text" 
                placeholder="Cari nama atau SKU produk..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Produk</th>
              <th className={styles.th}>Kategori</th>
              <th className={styles.th}>Harga Modal</th>
              <th className={styles.th}>Harga Jual</th>
              <th className={styles.th}>Stok</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ width: '150px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      {p.images && p.images.length > 0 ? <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="var(--neutral-400)" />}
                    </div>
                    <div>
                      <div className={styles.productName}>{p.name}</div>
                      <div className={styles.productSku}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>{p.category ? p.category.name : '-'}</td>
                <td className={styles.td}>Rp {p.buyPrice.toLocaleString('id-ID')}</td>
                <td className={styles.td} style={{ fontWeight: '600', color: 'var(--primary-700)' }}>Rp {p.sellPrice.toLocaleString('id-ID')}</td>
                <td className={styles.td}>{getStockBadge(p.stockQuantity, p.minStock)}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${p.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionCell}>
                    <button className={styles.iconBtn} title="Lihat QR Code"><QrCode size={16} /></button>
                    <Link href={`/produk/edit/${p.id}`} className={styles.iconBtn} title="Edit Produk"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Hapus Produk" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                  Produk tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
