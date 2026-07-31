'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';
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
      if (json.success) setDeposits(json.data);
    } catch (error) {
      toast.error('Gagal memuat daftar setoran');
    } finally {
      setLoading(false);
    }
  };

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
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--warning)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> MENUNGGU</span>;
      case 'VERIFIED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--success)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> DIVERIFIKASI</span>;
      case 'REJECTED':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--danger)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={12} /> DITOLAK</span>;
      default:
        return status;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Verifikasi Setoran Harian</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Kelola dan verifikasi setoran kas fisik dari seluruh Koperasi Desa ke Pusat.</p>
        </div>
        <button className="btn-primary" style={{ background: 'white', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>
          <Download size={18} /> Export Laporan (PDF)
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Daftar Setoran Menunggu Verifikasi</h2>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>TANGGAL</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>KOPERASI DESA</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>NOMINAL SETORAN</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>BUKTI TRANSFER</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>STATUS</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--neutral-500)' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</td></tr>
            ) : deposits.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Belum ada data setoran.</td></tr>
            ) : deposits.map(dep => (
              <tr key={dep.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--neutral-600)' }}>
                  {new Date(dep.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{dep.kopdes?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Disetor oleh: {dep.user?.name}</div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '800', color: 'var(--primary-700)' }}>
                  Rp {dep.amount.toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {dep.transferProof ? (
                    <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--info)', color: 'var(--info)', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                      <Eye size={14} /> Lihat
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontStyle: 'italic' }}>Tidak ada lampiran</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {getStatusBadge(dep.status)}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {dep.status === 'PENDING' && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => handleVerify(dep.id, 'VERIFIED')}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'var(--success)', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle size={14} /> Terima
                      </button>
                      <button 
                        onClick={() => handleVerify(dep.id, 'REJECTED')}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <XCircle size={14} /> Tolak
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
