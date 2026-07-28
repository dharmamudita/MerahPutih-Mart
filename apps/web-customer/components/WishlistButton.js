'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function WishlistButton({ productId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/wishlist/check/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setIsWishlisted(data.isWishlisted);
        }
      } catch (error) {
        console.error('Failed to check wishlist status', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [productId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Silakan login untuk menyimpan produk ke Favorit');
      router.push('/login');
      return;
    }

    try {
      // Optimistic update
      setIsWishlisted(!isWishlisted);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/wishlist/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productId })
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(data.isWishlisted);
        if (data.isWishlisted) toast.success('Ditambahkan ke Favorit');
        else toast.success('Dihapus dari Favorit');
      } else {
        // Revert on fail
        setIsWishlisted(!isWishlisted);
        toast.error(data.message || 'Gagal mengubah favorit');
      }
    } catch (error) {
      setIsWishlisted(!isWishlisted);
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  if (loading) return null;

  return (
    <button 
      onClick={toggleWishlist}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'var(--white)',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 10,
        transition: 'all 0.2s ease',
        color: isWishlisted ? 'var(--danger)' : 'var(--neutral-400)'
      }}
      title={isWishlisted ? "Hapus dari Favorit" : "Tambah ke Favorit"}
    >
      <Heart 
        size={18} 
        fill={isWishlisted ? 'var(--danger)' : 'none'} 
        style={{ transition: 'all 0.2s ease' }}
      />
    </button>
  );
}
