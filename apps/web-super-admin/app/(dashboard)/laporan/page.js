'use client';
import { useState } from 'react';
import { FileText, Download, Filter, ShieldCheck, Printer } from 'lucide-react';

export default function LaporanAuditPage() {
  const auditLogs = [
    { id: 'LOG-1092', timestamp: '2026-08-02 21:45:10', actor: 'Super Admin Pusat', action: 'Verifikasi Setoran Harian Kopdes Bandung (Rp 1.500.000)', status: 'SUCCESS' },
    { id: 'LOG-1091', timestamp: '2026-08-02 20:30:22', actor: 'Admin Kopdes Sukamaju', action: 'Input Transaksi Kasir POS #TRX-8821', status: 'SUCCESS' },
    { id: 'LOG-1090', timestamp: '2026-08-02 19:15:00', actor: 'System Auto-Trigger', action: 'Sistem Deteksi Stok Kritis: Beras Premium 5kg', status: 'WARNING' },
    { id: 'LOG-1089', timestamp: '2026-08-02 18:00:15', actor: 'Super Admin Pusat', action: 'Pembaruan Harga Master Data Nasional', status: 'SUCCESS' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Laporan & Audit Sistem</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Audit log aktivitas nasional dan ekspor laporan keuangan Koperasi Desa.</p>
        </div>
        <button className="btn-primary">
          <Download size={16} /> Ekspor Laporan (PDF)
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600' }}>TOTAL AUDIT LOG (BULAN INI)</div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>1.482 Log</div>
          <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px', fontWeight: '600' }}>100% Terenkripsi & Valid</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600' }}>SETORAN TERVERIFIKASI</div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>98.5%</div>
          <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>Dari total 142 cabang</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600' }}>STATUS KEAMANAN SISTEM</div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={28} /> AMAN
          </div>
          <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>Zero Security Vulnerability</div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary-600)" /> Riwayat Audit Log Real-Time
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px' }}>
              <Filter size={14} /> Filter Aktivitas
            </button>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px' }}>
              <Printer size={14} /> Cetak Log
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--neutral-200)', color: 'var(--neutral-500)', fontSize: '13px' }}>
                <th style={{ padding: '16px 12px' }}>ID LOG</th>
                <th style={{ padding: '16px 12px' }}>WAKTU</th>
                <th style={{ padding: '16px 12px' }}>AKTOR / PENGGUNA</th>
                <th style={{ padding: '16px 12px' }}>AKTIVITAS & KETERANGAN</th>
                <th style={{ padding: '16px 12px' }}>STATUS AUDIT</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--neutral-100)', fontSize: '14px' }}>
                  <td style={{ padding: '16px 12px', fontWeight: '700', color: 'var(--primary-700)' }}>{log.id}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--neutral-500)', fontSize: '13px' }}>{log.timestamp}</td>
                  <td style={{ padding: '16px 12px', fontWeight: '600' }}>{log.actor}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--neutral-800)' }}>{log.action}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                      background: log.status === 'SUCCESS' ? 'var(--primary-50)' : 'rgba(245, 158, 11, 0.1)',
                      color: log.status === 'SUCCESS' ? 'var(--primary-700)' : 'var(--warning)'
                    }}>
                      {log.status}
                    </span>
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