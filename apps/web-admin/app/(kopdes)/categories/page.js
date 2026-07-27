'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dummy fetch (Nanti diganti dengan fetch dari API)
  useEffect(() => {
    // Simulasi loading dari API
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Sembako', slug: 'sembako', isGlobal: true, productsCount: 15 },
        { id: 2, name: 'Snack & Minuman', slug: 'snack-minuman', isGlobal: true, productsCount: 42 },
        { id: 3, name: 'Kebutuhan Tani', slug: 'kebutuhan-tani', isGlobal: true, productsCount: 8 },
        { id: 4, name: 'Kebersihan', slug: 'kebersihan', isGlobal: true, productsCount: 12 },
        { id: 5, name: 'Lokal KopDes', slug: 'lokal-kopdes', isGlobal: false, productsCount: 3 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neutral-900)', marginBottom: '8px' }}>Kategori Produk</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Kelola daftar kategori untuk mengelompokkan produk Anda.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--neutral-200)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-400)' }} />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
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
                <th style={{ padding: '16px', fontWeight: '600' }}>Nama Kategori</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Slug</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Tipe</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Total Produk</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--neutral-500)' }}>Kategori tidak ditemukan</td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--neutral-900)' }}>{cat.name}</td>
                    <td style={{ padding: '16px', color: 'var(--neutral-500)' }}>{cat.slug}</td>
                    <td style={{ padding: '16px' }}>
                      {cat.isGlobal ? (
                        <span style={{ padding: '4px 8px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Pusat (Global)</span>
                      ) : (
                        <span style={{ padding: '4px 8px', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Lokal KopDes</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--neutral-500)' }}>{cat.productsCount} produk</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button style={{ color: 'var(--neutral-500)', padding: '6px', marginRight: '8px' }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button style={{ color: 'var(--danger)', padding: '6px' }} title="Hapus" disabled={cat.isGlobal}>
                        <Trash2 size={16} style={{ opacity: cat.isGlobal ? 0.3 : 1 }} />
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
