'use client';
import useCartStore from '../store/cartStore';

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, 1);
    // Opsional: Bisa tambahkan toast notification di sini
  };

  return (
    <button 
      onClick={handleAdd}
      className="btn btn-outline" 
      style={{ width: '100%', marginTop: '16px' }}
    >
      Tambah ke Keranjang
    </button>
  );
}
