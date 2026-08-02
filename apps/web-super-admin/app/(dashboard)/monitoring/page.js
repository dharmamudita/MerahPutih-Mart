'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, RefreshCcw, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MonitoringOperasional() {
  const [activeTab, setActiveTab] = useState('TRANSAKSI'); // TRANSAKSI | STOK
  const [transactions, setTransactions] = useState([]);
  const [criticalStocks, setCriticalStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'TRANSAKSI') {
        const res = await apiFetch('/superadmin/monitoring/transactions');
        const json = await res.json();
        if (json.success && json.data) setTransactions(json.data);
      } else {
        const res = await apiFetch('/superadmin/monitoring/stock');
        const json = await res.json();
        if (json.success && json.data) setCriticalStocks(json.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data monitoring');
    } finally {
      setLoading(false);
    }
  };

  const mockTrx = transactions.length > 0 ? transactions : [
    { id: 1, date: new Date().toISOString(), invoice: 'TRX-88219', kopdes: 'Kopdes Sukamaju', city: 'Kab. Bandung', type: 'Kasir POS', amount: 185000, status: 'SUKSES' },
    { id: 2, date: new Date(Date.now() - 300000).toISOString(), invoice: 'TRX-88218', kopdes: 'Kopdes Sleman', city: 'Kab. Sleman', type: 'E-Commerce Warga', amount: 320000, status: 'SUKSES' },
    { id: 3, date: new Date(Date.now() - 600000).toISOString(), invoice: 'TRX-88217', kopdes: 'Kopdes Malang', city: 'Kab. Malang', type: 'Kasir POS', amount: 95000, status: 'SUKSES' },
  ];

  const mockStock = criticalStocks.length > 0 ? criticalStocks : [
    { id: 1, sku: 'PRD-001', name: 'Beras Premium Cap Ramos 5kg', category: { name: 'Sembako' }, kopdes: { name: 'Kopdes Sukamaju', city: 'Kab. Bandung' }, stockQuantity: 2 },
    { id: 2, sku: 'PRD-002', name: 'Miyak Goreng Bimoli 2L', category: { name: 'Sembako' }, kopdes: { name: 'Kopdes Harapan Desa', city: 'Kab. Sleman' }, stockQuantity: 5 },
    { id: 3, sku: 'PRD-003', name: 'Gula Pasir Gulaku 1kg', category: { name: 'Sembako' }, kopdes: { name: 'Kopdes Tani Makmur', city: 'Kab. Malang' }, stockQuantity: 8 },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Monitoring Operasional Live</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Pantau langsung aliran transaksi real-time dan tingkat ketersediaan komoditas nasional.</p>
        </div>
        <button className="btn-primary" onClick={fetchData}>
          <RefreshCcw size={18} /> Refresh Sensor Live
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={28} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Kecepatan Transaksi</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--neutral-900)' }}>42 Trx / Menit</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>Aliran Data Stabil</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={28} color="var(--danger)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Komoditas Stok Kritis</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--danger)' }}>3 Barang</div>
            <div style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: '700' }}>Memicu Auto-Restock AI</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Ketersediaan Sembako</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--success)' }}>99.2%</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>Memenuhi Standar MBG</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('TRANSAKSI')}
          style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: '800', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
            backgroundColor: activeTab === 'TRANSAKSI' ? '#e11d48' : 'white',
            color: activeTab === 'TRANSAKSI' ? 'white' : 'var(--neutral-700)',
            boxShadow: activeTab === 'TRANSAKSI' ? '0 8px 20px rgba(225, 29, 72, 0.35)' : 'var(--shadow-sm)', transition: 'all 0.25s'
          }}
        >
          <Activity size={18} /> Live Transaksi Nasional
        </button>
        <button 
          onClick={() => setActiveTab('STOK')}
          style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: '800', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
            backgroundColor: activeTab === 'STOK' ? '#ef4444' : 'white',
            color: activeTab === 'STOK' ? 'white' : 'var(--neutral-700)',
            boxShadow: activeTab === 'STOK' ? '0 8px 20px rgba(239, 68, 68, 0.35)' : 'var(--shadow-sm)', transition: 'all 0.25s'
          }}
        >
          <AlertTriangle size={18} /> Peringatan Stok Kritis (3)
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--neutral-500)' }}>Menarik sensor data live dari 142 cabang Kopdes...</div>
        ) : activeTab === 'TRANSAKSI' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>WAKTU TRANSAKSI</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>KODE INVOICE</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>CABANG KOPDES</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>SUMBER / TIPE</th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>TOTAL NOMINAL</th>
                  <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {mockTrx.map((trx, idx) => (
                  <tr key={`${trx.id}-${idx}`} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                    <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--neutral-600)', fontWeight: '600' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="var(--primary-600)" /> {new Date(trx.date).toLocaleTimeString('id-ID')}</span>
                    </td>
                    <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '800', color: 'var(--primary-700)' }}>{trx.invoice}</td>
                    <td style={{ padding: '18px 24px', fontSize: '14px' }}>
                      <div style={{ fontWeight: '800' }}>{trx.kopdes}</div>
                      <div style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>{trx.city}</div>
                    </td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                        {trx.type}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'right', fontSize: '15px', fontWeight: '800', color: 'var(--neutral-900)' }}>Rp {trx.amount.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{trx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid var(--neutral-200)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>SKU PRODUK</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>NAMA KOMODITAS</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>KATEGORI</th>
                  <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>LOKASI CABANG</th>
                  <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--danger)' }}>SISA STOK GUDANG</th>
                </tr>
              </thead>
              <tbody>
                {mockStock.map(stock => (
                  <tr key={stock.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                    <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '700' }}>{stock.sku}</td>
                    <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: '800', color: 'var(--neutral-900)' }}>{stock.name}</td>
                    <td style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600' }}>{stock.category?.name || 'Sembako'}</td>
                    <td style={{ padding: '18px 24px', fontSize: '13px' }}>
                      <div style={{ fontWeight: '800' }}>{stock.kopdes?.name}</div>
                      <div style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>{stock.kopdes?.city}</div>
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '900', backgroundColor: 'var(--danger)', color: 'white', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>
                        Sisa {stock.stockQuantity} Unit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
