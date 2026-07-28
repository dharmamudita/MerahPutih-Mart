'use client';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { Search, ShoppingCart, User, MapPin } from 'lucide-react';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Prevent hydration mismatch by only rendering cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.navbarWrapper}>
      {/* Main Navbar */}
      <nav className={styles.mainNav}>
        <div className={`container ${styles.navContent}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>MP</div>
            <div className={styles.logoText}>
              MerahPutih<br/><span>Mart</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Cari sembako, snack, atau kebutuhan sehari-hari..." 
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={styles.locationBadge}>
              <MapPin size={14} />
              <span>KopDes Sindangjaya</span>
            </div>
            <Link href="/cart" className={styles.cartBtn}>
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>
            <div className={styles.divider}></div>
            <Link href="/login" className={styles.loginBtn}>Masuk</Link>
            <Link href="/register" className={styles.registerBtn}>Daftar</Link>
          </div>
        </div>
      </nav>
      
      {/* Categories Bar */}
      <div className={styles.catBar}>
        <div className={`container ${styles.catContent}`}>
          <Link href="/kategori/sembako" className={styles.catItem}>Sembako</Link>
          <Link href="/kategori/snack" className={styles.catItem}>Snack & Minuman</Link>
          <Link href="/kategori/kesehatan" className={styles.catItem}>Kesehatan</Link>
          <Link href="/kategori/kebersihan" className={styles.catItem}>Kebersihan</Link>
          <Link href="/kategori/pertanian" className={styles.catItem}>Kebutuhan Tani</Link>
          <Link href="/promo" className={`${styles.catItem} ${styles.promo}`}>Promo Spesial</Link>
        </div>
      </div>
    </div>
  );
}
