'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'INV-000';

  return (
    <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '60px 40px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', maxWidth: '600px', margin: '0 auto' }}>
      <CheckCircle size={80} color="#166534" style={{ margin: '0 auto 24px' }} />
      
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: 'var(--neutral-900)' }}>
        Pesanan Berhasil Dibuat!
      </h1>
      
      <p style={{ fontSize: '16px', color: 'var(--neutral-600)', marginBottom: '32px', lineHeight: 1.6 }}>
        Terima kasih telah berbelanja di Koperasi Desa Merah Putih. Pesanan Anda sedang kami proses. 
        Bukti pembayaran Anda juga sudah kami terima.
      </p>
      
      <div style={{ backgroundColor: 'var(--neutral-50)', padding: '24px', borderRadius: '16px', marginBottom: '40px', border: '1px dashed var(--neutral-300)' }}>
        <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Nomor Pesanan Anda</div>
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-700)', letterSpacing: '1px' }}>{orderId}</div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link href="/pesanan" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} />
          <span>Lihat Status Pesanan</span>
        </Link>
        
        <Link href="/belanja" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} />
          <span>Kembali Belanja</span>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', padding: '60px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Suspense fallback={<div>Memuat halaman...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
