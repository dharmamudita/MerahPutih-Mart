'use client';
import { useState, useEffect } from 'react';
import styles from './Produk.module.css';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function ProdukClient() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data for UI Showcase
  useEffect(() => {
    setProducts([
      { id: 1, sku: 'BRS-001', name: 'Beras Premium 5kg', category: 'Sembako', buyPrice: 58000, sellPrice: 65000, stock: 2, minStock: 10, isActive: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100' },
      { id: 2, sku: 'MYK-002', name: 'Minyak Goreng 2L', category: 'Sembako', buyPrice: 26000, sellPrice: 30000, stock: 45, minStock: 20, isActive: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=100' },
      { id: 3, sku: 'GLA-003', name: 'Gula Pasir 1kg', category: 'Sembako', buyPrice: 12000, sellPrice: 15000, stock: 20, minStock: 25, isActive: true, image: '' },
      { id: 4, sku: 'PPK-004', name: 'Pupuk Urea 50kg', category: 'Pertanian', buyPrice: 115000, sellPrice: 125000, stock: 0, minStock: 5, isActive: false, image: '' },
    ]);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
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
              <option value="Sembako">Sembako</option>
              <option value="Pertanian">Pertanian</option>
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
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="var(--neutral-400)" />}
                    </div>
                    <div>
                      <div className={styles.productName}>{p.name}</div>
                      <div className={styles.productSku}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>{p.category}</td>
                <td className={styles.td}>Rp {p.buyPrice.toLocaleString('id-ID')}</td>
                <td className={styles.td} style={{ fontWeight: '600', color: 'var(--primary-700)' }}>Rp {p.sellPrice.toLocaleString('id-ID')}</td>
                <td className={styles.td}>{getStockBadge(p.stock, p.minStock)}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${p.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionCell}>
                    <button className={styles.iconBtn} title="Lihat QR Code"><QrCode size={16} /></button>
                    <Link href={`/produk/edit/${p.id}`} className={styles.iconBtn} title="Edit Produk"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Hapus Produk" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
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
