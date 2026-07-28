'use client';
import { useState, useEffect } from 'react';
import styles from './Member.module.css';
import { Award, Coins, ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MemberClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMemberData(token);
  }, []);

  const fetchMemberData = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/member/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMemberData(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return <div className={styles.container} style={{ textAlign: 'center', padding: '60px' }}>Memuat data member...</div>;
  }

  if (!memberData) {
    return <div className={styles.container}>Gagal memuat data member.</div>;
  }

  const { memberLevel, memberCode, totalPoints, progress, nextLevel, spendingRequired, pointTransactions } = memberData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Member</h1>
        <p className={styles.subtitle}>Kelola poin dan nikmati berbagai keuntungan eksklusif.</p>
      </div>

      <div className={styles.bentoGrid}>
        
        {/* Level Card */}
        <div className={`${styles.card} ${styles.levelCard}`}>
          <div className={styles.levelHeader}>
            <div>
              <div className={styles.levelTitle}>Status Keanggotaan</div>
              <div className={`${styles.levelName} ${styles[memberLevel]}`}>{memberLevel}</div>
            </div>
            <div className={styles.memberCode}>
              {memberCode}
            </div>
          </div>
          
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Progres ke {nextLevel}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={`${styles.progressBarFill} ${styles[memberLevel]}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
              Tingkatkan belanja Anda untuk menikmati keuntungan {nextLevel}.
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className={`${styles.card} ${styles.pointsCard}`}>
          <Coins size={48} color="#bae6fd" style={{ marginBottom: '16px' }} />
          <div className={styles.pointsValue}>{totalPoints}</div>
          <div className={styles.pointsLabel}>Total Koin Aktif</div>
        </div>

        {/* History Card */}
        <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
          <h2 className={styles.historyTitle}>Riwayat Poin & Transaksi</h2>
          
          <div className={styles.historyList}>
            {!pointTransactions || pointTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--neutral-500)', padding: '20px' }}>
                Belum ada riwayat transaksi poin.
              </div>
            ) : (
              pointTransactions.map(pt => (
                <div key={pt.id} className={styles.historyItem}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`${styles.historyIcon} ${pt.type === 'EARN' ? styles.earn : styles.redeem}`}>
                      {pt.type === 'EARN' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className={styles.historyDetails}>
                      <div className={styles.historyDesc}>{pt.description || (pt.type === 'EARN' ? 'Mendapat Poin' : 'Tukar Poin')}</div>
                      <div className={styles.historyDate}>{new Date(pt.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className={`${styles.historyPoints} ${pt.type === 'EARN' ? styles.earn : styles.redeem}`}>
                    {pt.type === 'EARN' ? '+' : '-'}{pt.points} Poin
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
