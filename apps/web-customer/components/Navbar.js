'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, MapPin, LogOut, LayoutGrid, Sparkles, HeartPulse, Sprout, Tag, Coffee, User, Package, Heart, Bell, Check } from 'lucide-react';
import useCartStore from '../store/cartStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchNotifications();
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('user');
      }
    } else if (storedUser === 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.data);
        setUnreadNotifCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/notifications/all/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUnreadNotifCount(0);
      setNotifications(notifications.map(n => ({...n, isRead: true})));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  return (
    <div className={styles.navbarWrapper}>
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
              placeholder="Cari sembako, snack, atau kebutuhan..." 
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={styles.locationBadge}>
              <MapPin size={16} />
              <span>Sindangjaya</span>
            </div>
            
            <Link href="/wishlist" className={styles.cartBtn} title="Favorit Saya">
              <Heart size={20} />
            </Link>
            
            <Link href="/cart" className={styles.cartBtn}>
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </Link>

            {mounted && user && (
              <div className={styles.notifContainer} onMouseLeave={() => setNotifDropdownOpen(false)}>
                <button className={styles.cartBtn} onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} title="Notifikasi">
                  <Bell size={20} />
                  {unreadNotifCount > 0 && (
                    <span className={styles.cartBadge}>{unreadNotifCount}</span>
                  )}
                </button>
                {notifDropdownOpen && (
                  <div className={styles.notifDropdown}>
                    <div className={styles.notifHeader}>
                      <span className={styles.notifTitle}>Notifikasi</span>
                      {unreadNotifCount > 0 && (
                        <button className={styles.notifMarkRead} onClick={handleMarkAsRead}>
                          <Check size={14} /> Tandai Dibaca
                        </button>
                      )}
                    </div>
                    <div className={styles.notifList}>
                      {notifications.length === 0 ? (
                        <div className={styles.notifEmpty}>Belum ada notifikasi.</div>
                      ) : (
                        notifications.slice(0, 5).map(notif => (
                          <div key={notif.id} className={`${styles.notifItem} ${!notif.isRead ? styles.notifUnread : ''}`}>
                            <div className={styles.notifItemTitle}>{notif.title}</div>
                            <div className={styles.notifItemMsg}>{notif.message}</div>
                            <div className={styles.notifItemTime}>Baru saja</div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link href="/profile" className={styles.notifViewAll} onClick={() => setNotifDropdownOpen(false)}>
                      Lihat Semua Notifikasi
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <div className={styles.divider}></div>
            
            {mounted && user ? (
              <div className={styles.userContainer} onMouseLeave={() => setDropdownOpen(false)}>
                <div className={styles.userBadge} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className={styles.userAvatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userName}>
                    <span>{user.name.split(' ')[0]}</span>
                    <span className={styles.userRole}>Member Baru</span>
                  </div>
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <User size={16} /> Profil Saya
                    </Link>
                    <Link href="/riwayat" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <Package size={16} /> Riwayat Belanja
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.dropdownLogout}`}>
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">Masuk</Link>
                <Link href="/register" className="btn btn-primary">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Categories Bar */}
      <div className={styles.catBar}>
        <div className={`container ${styles.catContent}`}>
          <div className={styles.segmentedControl}>
            <Link href="/" className={`${styles.catItem} ${pathname === '/' ? styles.catItemActive : ''}`}>
              <LayoutGrid size={16} className={styles.catIcon} />
              Beranda
            </Link>
            <Link href="/kategori/sembako" className={`${styles.catItem} ${pathname === '/kategori/sembako' ? styles.catItemActive : ''}`}>
              <Sparkles size={16} className={styles.catIcon} />
              Sembako
            </Link>
            <Link href="/kategori/snack" className={`${styles.catItem} ${pathname === '/kategori/snack' ? styles.catItemActive : ''}`}>
              <Coffee size={16} className={styles.catIcon} />
              Snack
            </Link>
            <Link href="/kategori/kesehatan" className={`${styles.catItem} ${pathname === '/kategori/kesehatan' ? styles.catItemActive : ''}`}>
              <HeartPulse size={16} className={styles.catIcon} />
              Kesehatan
            </Link>
            <Link href="/kategori/pertanian" className={`${styles.catItem} ${pathname === '/kategori/pertanian' ? styles.catItemActive : ''}`}>
              <Sprout size={16} className={styles.catIcon} />
              Pertanian
            </Link>
            <Link href="/promo" className={`${styles.catItem} ${pathname === '/promo' ? styles.catItemActive : ''} ${styles.promo}`}>
              <Tag size={16} className={styles.catIcon} />
              Promo Spesial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
