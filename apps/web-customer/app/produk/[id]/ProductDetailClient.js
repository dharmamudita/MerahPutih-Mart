'use client';

import { useState, useEffect } from 'react';
import styles from './ProductDetail.module.css';
import { Star, ShoppingCart, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useCartStore from '../../../store/cartStore';
import WishlistButton from '../../../components/WishlistButton';
import AddToCartButton from '../../../components/AddToCartButton';

export default function ProductDetailClient({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Similar products state
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    fetchProductDetail();
    fetchReviews();
    checkCanReview();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products/${productId}`);
      const data = await res.json();
      
      if (res.ok) {
        setProduct(data.data);
        if (data.data.categoryId) {
          fetchSimilarProducts(data.data.categoryId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reviews/${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.data.reviews);
        setAvgRating(data.data.averageRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkCanReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reviews/check/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCanReview(data.canReview);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSimilarProducts = async (categoryId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products?category=${categoryId}`);
      const data = await res.json();
      if (res.ok) {
        setSimilarProducts(data.data.filter(p => p.id !== productId).slice(0, 4));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success('Ulasan berhasil ditambahkan!');
        setCanReview(false);
        fetchReviews();
      } else {
        toast.error(data.message || 'Gagal menambahkan ulasan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Memuat produk...</div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;
  }

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Beranda</Link>
        <ChevronRight size={14} />
        <Link href="/belanja" className={styles.breadcrumbLink}>Belanja</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className={styles.productLayout}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} />
            ) : (
              '🌾'
            )}
            <WishlistButton productId={product.id} />
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.category}>{product.category?.name || 'Lainnya'}</div>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={18} fill={star <= Math.round(avgRating) ? 'var(--warning)' : 'none'} color={star <= Math.round(avgRating) ? 'var(--warning)' : 'var(--neutral-300)'} />
              ))}
            </div>
            <span>{avgRating} ({reviews.length} Ulasan)</span>
            <span>•</span>
            <span style={{ color: product.stockQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
              Stok: {product.stockQuantity}
            </span>
          </div>

          <div className={styles.price}>
            Rp {product.sellPrice.toLocaleString('id-ID')}
            {product.unit && <span> /{product.unit.symbol}</span>}
          </div>

          <div className={styles.description}>
            {product.description || 'Tidak ada deskripsi produk.'}
          </div>

          <div className={styles.actions}>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 className={styles.sectionTitle}>Ulasan Pembeli</h2>
        
        {canReview && (
          <form onSubmit={submitReview} className={styles.reviewForm}>
            <h3 style={{ marginBottom: '16px', fontWeight: '700' }}>Berikan Ulasan Anda</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starRatingBtn} ${reviewForm.rating >= star ? styles.active : ''}`}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                >
                  <Star size={32} fill={reviewForm.rating >= star ? 'var(--warning)' : 'none'} />
                </button>
              ))}
            </div>
            <textarea
              className={styles.reviewInput}
              rows="4"
              placeholder="Bagaimana kualitas produk ini? Ceritakan pengalaman Anda (opsional)"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            ></textarea>
            <button type="submit" className={styles.submitReviewBtn} disabled={submittingReview}>
              {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        )}

        <div className={styles.reviewLayout}>
          <div className={styles.reviewSummary}>
            <div className={styles.reviewScore}>{avgRating}</div>
            <div className={styles.stars} style={{ justifyContent: 'center', marginBottom: '8px' }}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={20} fill={star <= Math.round(avgRating) ? 'var(--warning)' : 'none'} color={star <= Math.round(avgRating) ? 'var(--warning)' : 'var(--neutral-300)'} />
              ))}
            </div>
            <div className={styles.reviewTotal}>{reviews.length} Ulasan Terverifikasi</div>
          </div>

          <div className={styles.reviewList}>
            {reviews.length === 0 ? (
              <div style={{ color: 'var(--neutral-500)', padding: '20px' }}>Belum ada ulasan untuk produk ini.</div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewer}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {review.user?.name || 'Anonim'}
                      <CheckCircle2 size={14} color="var(--success)" />
                    </div>
                    <div className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className={styles.stars} style={{ marginBottom: '12px' }}>
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} fill={star <= review.rating ? 'var(--warning)' : 'none'} color={star <= review.rating ? 'var(--warning)' : 'var(--neutral-300)'} />
                    ))}
                  </div>
                  {review.comment && <div className={styles.reviewComment}>{review.comment}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <h2 className={styles.sectionTitle}>Produk Serupa</h2>
          <div className={styles.similarGrid}>
            {similarProducts.map(prod => {
              const simImageUrl = prod.images && prod.images.length > 0 ? prod.images[0].url : null;
              return (
                <div key={prod.id} className="product-card-cart" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: '180px', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden', position: 'relative' }}>
                    {simImageUrl ? (
                      <img src={simImageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ opacity: 0.5 }}>🌾</div>
                    )}
                    <WishlistButton productId={prod.id} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <Link href={`/produk/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--neutral-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--danger)', marginBottom: '16px' }}>
                      Rp {prod.sellPrice.toLocaleString('id-ID')}
                    </p>
                    <AddToCartButton product={prod} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
