'use client';

import { useState, useEffect } from 'react';
import styles from './Riwayat.module.css';
import { Package, Clock, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function RiwayatClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchOrders(storedToken);
  }, [router]);

  const fetchOrders = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.data || []);
      } else {
        toast.error('Gagal memuat riwayat pesanan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      WAITING_PAYMENT: 'Menunggu Pembayaran',
      VERIFYING: 'Menunggu Verifikasi',
      PROCESSED: 'Diproses',
      SHIPPING: 'Dalam Pengiriman',
      READY_FOR_PICKUP: 'Siap Diambil',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  if (!mounted || !user) return null;

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Riwayat Belanja</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neutral-500)' }}>
          Memuat pesanan...
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon}>🛒</span>
          <h3>Belum Ada Pesanan</h3>
          <p>Anda belum pernah melakukan pemesanan. Yuk mulai belanja sekarang!</p>
          <Link href="/belanja" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <Link href={`/riwayat/${order.orderNo || order.id}`} key={order.id} style={{ textDecoration: 'none' }}>
              <div className={styles.orderCard} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                <div className={styles.orderHeader}>
                <div>
                  <div className={styles.orderNo}>
                    <ShoppingBag size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {order.orderNo}
                  </div>
                  <div className={styles.orderDate}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles['status' + order.status]}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>
              
              <div className={styles.orderBody}>
                {order.items && order.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.itemName}>
                      {item.product?.name || 'Produk'} <span className={styles.itemQty}>x {item.quantity}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.orderFooter}>
                <div className={styles.totalLabel}>Total Belanja</div>
                <div className={styles.totalAmount}>
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
