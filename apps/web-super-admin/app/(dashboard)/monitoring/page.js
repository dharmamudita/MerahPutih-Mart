'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, PackageSearch, Clock, RefreshCcw } from 'lucide-react';
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
        if (json.success) setTransactions(json.data);
      } else {
        const res = await apiFetch('/superadmin/monitoring/stock');
        const json = await res.json();
        if (json.success) setCriticalStocks(json.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data monitoring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Monitoring Operasional</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Pantau langsung aliran transaksi dan stok di seluruh jaringan Koperasi Desa.</p>
        </div>
        <button className="btn-primary" onClick={fetchData} style={{ background: 'white', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>
          <RefreshCcw size={18} /> Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('TRANSAKSI')}
          style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: activeTab === 'TRANSAKSI' ? 'var(--primary-600)' : 'white',
            color: activeTab === 'TRANSAKSI' ? 'white' : 'var(--neutral-600)',
            boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
          }}
        >
          <Activity size={18} /> Live Transaksi Nasional
        </button>
        <button 
          onClick={() => setActiveTab('STOK')}
          style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: activeTab === 'STOK' ? 'var(--danger)' : 'white',
            color: activeTab === 'STOK' ? 'white' : 'var(--neutral-600)',
            boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
          }}
        >
          <AlertTriangle size={18} /> Monitor Stok Kritis
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--neutral-500)' }}>Menarik data dari seluruh server cabang...</div>
        ) : activeTab === 'TRANSAKSI' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>WAKTU</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>INVOICE</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>CABANG / KOPDES</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>SUMBER</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: 'var(--neutral-500)' }}>NOMINAL</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--neutral-500)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Belum ada transaksi</td></tr>
              ) : (
                transactions.map((trx, idx) => (
                  <tr key={`${trx.id}-${idx}`} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {new Date(trx.date).toLocaleTimeString('id-ID')}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--primary-600)' }}>{trx.invoice}</td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>
                      <div style={{ fontWeight: '700' }}>{trx.kopdes}</div>
                      <div style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>{trx.city}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', backgroundColor: trx.type.includes('POS') ? 'var(--info)' : 'var(--warning)', color: 'white' }}>
                        {trx.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '700' }}>Rp {trx.amount.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--success)' }}>{trx.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid var(--neutral-200)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>SKU</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>NAMA PRODUK</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>KATEGORI</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--neutral-500)' }}>LOKASI CABANG</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--danger)', fontWeight: '800' }}>SISA STOK</th>
              </tr>
            </thead>
            <tbody>
              {criticalStocks.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Stok nasional aman. Tidak ada barang kritis.</td></tr>
              ) : (
                criticalStocks.map(stock => (
                  <tr key={stock.id} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--neutral-500)' }}>{stock.sku}</td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--neutral-900)' }}>{stock.name}</td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>{stock.category?.name || '-'}</td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>
                      <div style={{ fontWeight: '600' }}>{stock.kopdes?.name}</div>
                      <div style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>{stock.kopdes?.city}</div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', backgroundColor: 'var(--danger)', color: 'white' }}>
                        {stock.stockQuantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
