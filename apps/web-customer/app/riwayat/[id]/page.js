import TransactionDetailClient from './TransactionDetailClient';

export const metadata = {
  title: 'Detail Transaksi - Koperasi Desa Merah Putih',
  description: 'Rincian pesanan dan struk belanja Anda',
};

export default function TransactionDetailPage({ params }) {
  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', paddingBottom: '60px' }}>
      <TransactionDetailClient orderId={params.id} />
    </div>
  );
}
