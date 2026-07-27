'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dummy fetch
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, sku: 'BRS-001', name: 'Beras Setra Ramos 5kg', category: 'Sembako', price: 65000, stock: 120, status: 'Active' },
        { id: 2, sku: 'MYK-001', name: 'Minyak Goreng Bimoli 2L', category: 'Sembako', price: 34000, stock: 45, status: 'Active' },
        { id: 3, sku: 'GLA-001', name: 'Gula Pasir Gulaku 1kg', category: 'Sembako', price: 16500, stock: 80, status: 'Active' },
        { id: 4, sku: 'IDM-001', name: 'Indomie Kari Ayam', category: 'Snack & Minuman', price: 3000, stock: 350, status: 'Active' },
        { id: 5, sku: 'TLR-001', name: 'Telur Ayam Negeri 1kg', category: 'Sembako', price: 28000, stock: 15, status: 'Low Stock' },
        { id: 6, sku: 'PUP-001', name: 'Pupuk Urea 50kg', category: 'Kebutuhan Tani', price: 120000, stock: 0, status: 'Out of Stock' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span style={{ padding: '4px 8px', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Tersedia</span>;
    if (status === 'Low Stock') return <span style={{ padding: '4px 8px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Stok Menipis</span>;
    if (status === 'Out of Stock') return <span style={{ padding: '4px 8px', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Habis</span>;
    return null;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neutral-900)', marginBottom: '8px' }}>Data Produk</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Kelola inventaris dan katalog produk Koperasi Anda.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-400)' }} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--neutral-300)', fontSize: '14px' }}
            />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--neutral-50)', color: 'var(--neutral-600)' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Produk</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Kategori</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Harga Jual</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Stok</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Produk tidak ditemukan</td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', color: 'var(--neutral-900)' }}>{product.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>SKU: {product.sku}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--neutral-600)' }}>{product.category}</td>
                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--neutral-900)' }}>
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{product.stock}</td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(product.status)}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ color: 'var(--neutral-500)', padding: '6px', marginRight: '8px' }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button style={{ color: 'var(--danger)', padding: '6px' }} title="Hapus">
                        <Trash2 size={16} />
                      </button>
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
