'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Minus, FileText, ArrowRightLeft } from 'lucide-react';

export default function WarehousePage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dummy data
  useEffect(() => {
    setTimeout(() => {
      setInventory([
        { id: 1, sku: 'BRS-001', name: 'Beras Setra Ramos 5kg', stock: 120, minStock: 20, unit: 'sak' },
        { id: 2, sku: 'MYK-001', name: 'Minyak Goreng Bimoli 2L', stock: 45, minStock: 50, unit: 'pouch' },
        { id: 3, sku: 'GLA-001', name: 'Gula Pasir Gulaku 1kg', stock: 80, minStock: 50, unit: 'kg' },
        { id: 4, sku: 'IDM-001', name: 'Indomie Kari Ayam', stock: 350, minStock: 100, unit: 'pcs' },
        { id: 5, sku: 'TLR-001', name: 'Telur Ayam Negeri 1kg', stock: 15, minStock: 30, unit: 'kg' },
        { id: 6, sku: 'PUP-001', name: 'Pupuk Urea 50kg', stock: 0, minStock: 10, unit: 'sak' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = inventory.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const getStockStatus = (stock, min) => {
    if (stock === 0) return <span style={{ color: 'var(--danger)', fontWeight: '700' }}>Habis (0)</span>;
    if (stock <= min) return <span style={{ color: '#B45309', fontWeight: '700' }}>Menipis ({stock})</span>;
    return <span style={{ color: '#166534', fontWeight: '600' }}>Aman ({stock})</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neutral-900)', marginBottom: '8px' }}>Gudang & Stok</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Kelola persediaan barang, restock, dan mutasi barang.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>Riwayat Mutasi</span>
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            <span>Tambah Stok Masuk</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--neutral-200)', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Total Produk di Gudang</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>1,482 <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--neutral-500)' }}>Item</span></div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--neutral-200)', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Stok Menipis (Butuh Restock)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#B45309' }}>2 <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--neutral-500)' }}>Produk</span></div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--neutral-200)', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Stok Habis</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--danger)' }}>1 <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--neutral-500)' }}>Produk</span></div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-400)' }} />
            <input 
              type="text" 
              placeholder="Cari produk (Nama / SKU)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--neutral-300)', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--neutral-50)', color: 'var(--neutral-600)' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Produk & SKU</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Status Stok</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Batas Minimum</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'center' }}>Aksi Mutasi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Memuat persediaan gudang...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Produk tidak ditemukan</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--neutral-900)' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>SKU: {item.sku}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '16px' }}>
                      {getStockStatus(item.stock, item.minStock)} <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 'normal' }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--neutral-600)' }}>
                      {item.minStock} {item.unit}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', border: '1px solid var(--neutral-200)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button style={{ padding: '8px 12px', backgroundColor: 'var(--neutral-50)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neutral-700)' }} title="Kurangi Stok (Barang Keluar/Rusak)">
                          <Minus size={14} /> Keluar
                        </button>
                        <div style={{ width: '1px', backgroundColor: 'var(--neutral-200)' }}></div>
                        <button style={{ padding: '8px 12px', backgroundColor: '#F0FDF4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#166534', fontWeight: '600' }} title="Tambah Stok (Restock)">
                          <Plus size={14} /> Masuk
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
