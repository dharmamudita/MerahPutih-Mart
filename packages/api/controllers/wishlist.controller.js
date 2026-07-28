const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getWishlist = async (req, res) => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: wishlists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil wishlist.', error: error.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Cek apakah sudah ada di wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    if (existing) {
      // Hapus jika sudah ada
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return res.status(200).json({ success: true, message: 'Produk dihapus dari wishlist.', isWishlisted: false });
    } else {
      // Tambah jika belum ada
      const newWishlist = await prisma.wishlist.create({
        data: {
          userId: req.user.id,
          productId
        }
      });
      return res.status(201).json({ success: true, message: 'Produk ditambahkan ke wishlist.', data: newWishlist, isWishlisted: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengubah wishlist.', error: error.message });
  }
};

const checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    res.status(200).json({ success: true, isWishlisted: !!existing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengecek status wishlist.', error: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  checkWishlistStatus
};
