<<<<<<< HEAD
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
=======
const { prisma } = require('database');
>>>>>>> 18373dc (code review)

// Ambil semua ulasan untuk produk tertentu
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.productReview.findMany({
      where: { 
        productId,
        isVisible: true
      },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Hitung rata-rata rating
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({ 
      success: true, 
      data: {
        reviews,
        averageRating,
        totalReviews: reviews.length
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil ulasan.', error: error.message });
  }
};

// Cek apakah user bisa review produk ini (harus sudah beli & status COMPLETED)
const checkCanReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Cek apakah sudah pernah review
    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: { productId, userId }
      }
    });

    if (existingReview) {
      return res.status(200).json({ success: true, canReview: false, message: 'Anda sudah mengulas produk ini.' });
    }

    // Cek apakah ada order COMPLETED yang mengandung produk ini
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'COMPLETED'
        }
      }
    });

    // Atau transaksi kasir
    const hasTransaction = await prisma.transactionItem.findFirst({
      where: {
        productId,
        transaction: {
          cashierId: userId, // Assuming cashierId might map to user, but let's just stick to online orders for now or customerId
          status: 'COMPLETED'
        }
      }
    });

    if (hasOrdered) {
      return res.status(200).json({ success: true, canReview: true });
    }

    res.status(200).json({ success: true, canReview: false, message: 'Anda harus membeli produk ini terlebih dahulu.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengecek akses ulasan.', error: error.message });
  }
};

// Tambah ulasan baru
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating tidak valid.' });
    }

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId,
        rating,
        comment,
        images: req.body.images || null
      }
    });

    res.status(201).json({ success: true, data: review, message: 'Ulasan berhasil ditambahkan.' });
  } catch (error) {
    // Handle unique constraint error if already reviewed
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Anda sudah mengulas produk ini.' });
    }
    res.status(500).json({ success: false, message: 'Gagal menambahkan ulasan.', error: error.message });
  }
};

module.exports = {
  getProductReviews,
  checkCanReview,
  addReview
};
