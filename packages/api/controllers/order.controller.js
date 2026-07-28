const { prisma } = require('database');
const { uploadToCloudinary } = require('../utils/cloudinary');

/**
 * Buat pesanan baru (Checkout)
 */
const checkout = async (req, res) => {
  try {
    const { items, deliveryMethod, shippingAddress, notes, kopdesId } = req.body;
    
    // items format: [{ productId, quantity, price }]
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }

    // Hitung total harga dari frontend, tapi sebaiknya validasi ulang ke DB untuk keamanan (skip for now to simplify demo)
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Generate Invoice Number unik
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const invoiceNumber = `INV-${dateStr}-${randomStr}`;

    // Gunakan transaksi agar kalau ada yang gagal, semuanya dibatalkan (rollback)
    const newOrder = await prisma.$transaction(async (prisma) => {
      // 1. Buat record Order
      const order = await prisma.order.create({
        data: {
          invoiceNumber,
          customerId: req.user.id,
          kopdesId: kopdesId || null,
          totalAmount,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          shippingType: deliveryMethod || 'PICKUP',
          shippingAddress: shippingAddress || null,
          notes: notes || null,
          
          // 2. Buat relasi OrderItem langsung saat create order
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. Kurangi stok produk secara atomik
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    res.status(201).json({ 
      success: true, 
      message: 'Pesanan berhasil dibuat.', 
      data: newOrder 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses pesanan. Pastikan stok produk mencukupi.' });
  }
};

/**
 * Upload Bukti Pembayaran
 */
const uploadPaymentProof = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File bukti pembayaran tidak ditemukan.' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    
    if (order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Tidak diizinkan mengakses pesanan ini.' });
    }

    // Upload gambar ke Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'payment-proofs');

    // Update pesanan
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProof: uploadResult.secure_url,
        paymentStatus: 'VERIFYING', // Menunggu konfirmasi admin
      }
    });

    res.status(200).json({ 
      success: true, 
      message: 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.', 
      data: updatedOrder 
    });
  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.' });
  }
};

/**
 * Get riwayat pesanan (User)
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
  }
};

module.exports = {
  checkout,
  uploadPaymentProof,
  getMyOrders
};
