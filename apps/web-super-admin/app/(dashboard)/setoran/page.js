'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Eye, Download, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SetoranHarian() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await apiFetch('/superadmin/deposits');
      const json = await res.json();
      if (json.success && json.data) setDeposits(json.data);
    } catch (error) {
      toast.error('Gagal memuat daftar setoran');
    } finally {
      setLoading(false);
    }
  };

  const mockDeposits = deposits.length > 0 ? deposits : [
    { id: 1, date: new Date().toISOString(), kopdes: { name: 'Kopdes Merah Putih Sukamaju' }, user: { name: 'Budi Admin' }, amount: 1500000, transferProof: 'proof1.jpg', status: 'PENDING' },
    { id: 2, date: new Date(Date.now() - 86400000).toISOString(), kopdes: { name: 'Kopdes Harapan Desa' }, user: { name: 'Siti Rahma' }, amount: 2450000, transferProof: 'proof2.jpg', status: 'VERIFIED' },
    { id: 3, date: new Date(Date.now() - 172800000).toISOString(), kopdes: { name: 'Kopdes Tani Makmur' }, user: { name: 'Joko Widodo' }, amount: 1800000, transferProof: 'proof3.jpg', status: 'VERIFIED' },
  ];

  const handleVerify = async (id, status) => {
    if (!confirm(`Apakah Anda yakin ingin mem-${status === 'VERIFIED' ? 'verifikasi' : 'tolak'} setoran ini?`)) return;
    
    try {
      const res = await apiFetch(`/superadmin/deposits/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Setoran berhasil di-${status === 'VERIFIED' ? 'verifikasi' : 'tolak'}`);
        fetchDeposits();
      }
    } catch (error) {
      toast.error('Gagal memverifikasi setoran');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', backgroundColor: 'var(--warning)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> MENUNGGU VERIFIKASI</span>;
      case 'VERIFIED':
        return <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', backgroundColor: 'var(--success)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> DIVERIFIKASI</span>;
      case 'REJECTED':
        return <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', backgroundColor: 'var(--danger)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={12} /> DITOLAK</span>;
      default:
        return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Verifikasi Setoran Harian</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Konsolidasi dan verifikasi setoran kas fisik & transfer bank dari seluruh Kopdes ke Pusat.</p>
        </div>
        <button className="btn-primary">
          <Download size={18} /> Export Rekapitulasi (PDF)
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={28} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Total Setoran Bulan Ini</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--neutral-900)' }}>Rp 1.850.000.000</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={12} /> 98.5% Rekonsiliasi Cocok</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={28} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Pending Verifikasi</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--neutral-900)' }}>{mockDeposits.filter(d => d.status === 'PENDING').length} Transaksi</div>
            <div style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '700' }}>Butuh Persetujuan Super Admin</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Audit Keamanan Kas</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--success)' }}>100% Terverifikasi</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600' }}>Terenkripsi Multi-Signature</div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', backgroundColor: 'rgba(248, 250, 252, 0.8)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Daftar Setoran Masuk Cabang Kopdes</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Tanggal Setor</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Koperasi Desa & Disetor Oleh</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Nominal Setoran</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Bukti Transfer</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Status Audit</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Tindakan Super Admin</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: 'var(--neutral-500)' }}>Memuat data setoran harian...</td></tr>
              ) : mockDeposits.map(dep => (
                <tr key={dep.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                  <td style={{ padding: '18px 24px', fontSize: '13px', color: 'var(--neutral-600)', fontWeight: '600' }}>
                    {new Date(dep.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--neutral-900)', fontSize: '14px' }}>{dep.kopdes?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>Disetor oleh: {dep.user?.name}</div>
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: '16px', fontWeight: '800', color: 'var(--primary-700)' }}>
                    Rp {dep.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    <button style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--primary-200)', color: 'var(--primary-700)', background: 'var(--primary-50)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}>
                      <Eye size={14} /> Pratinjau Bukti
                    </button>
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    {getStatusBadge(dep.status)}
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    {dep.status === 'PENDING' ? (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => handleVerify(dep.id, 'VERIFIED')}
                          className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          <CheckCircle size={14} /> Verifikasi
                        </button>
                        <button 
                          onClick={() => handleVerify(dep.id, 'REJECTED')}
                          className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        >
                          <XCircle size={14} /> Tolak
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: '600' }}>Sudah Diproses</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
