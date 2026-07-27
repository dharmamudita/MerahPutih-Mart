import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Tambah item ke keranjang
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity }] });
        }
      },

      // Hapus item dari keranjang
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        });
      },

      // Update kuantitas
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },

      // Kosongkan keranjang
      clearCart: () => set({ items: [] }),

      // Total item (qty)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Total harga
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.sellPrice * item.quantity), 0);
      }
    }),
    {
      name: 'merahputih-cart', // nama key di localStorage
    }
  )
);

export default useCartStore;
