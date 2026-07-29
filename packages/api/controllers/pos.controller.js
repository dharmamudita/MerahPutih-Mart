const { prisma } = require('database');

/**
 * Buat transaksi Point of Sales (Offline Kasir)
 */
const checkoutPOS = async (req, res) => {
  try {
    const { items, kopdesId } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }

    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const invoiceNumber = `POS-${dateStr}-${randomStr}`;

    const newOrder = await prisma.$transaction(async (prisma) => {
      // 1. Buat record Order POS (customerId null karena offline, status DONE, payment PAID)
      const order = await prisma.order.create({
        data: {
          invoiceNumber,
          kopdesId: req.user.kopdesId || kopdesId || null,
          totalAmount,
          status: 'DONE',
          paymentStatus: 'PAID',
          shippingType: 'PICKUP',
          notes: 'Transaksi Offline POS',
          
          items: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.qty,
              price: item.price
            }))
          }
        }
      });

      // 2. Kurangi stok produk
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stockQuantity: {
              decrement: item.qty
            }
          }
        });
      }

      // 3. Catat Arus Kas Masuk (Pemasukan)
      await prisma.cashFlow.create({
        data: {
          kopdesId: req.user.kopdesId || kopdesId,
          type: 'IN',
          category: 'SALES',
          amount: totalAmount,
          description: `Pendapatan dari penjualan POS (Invoice: ${invoiceNumber})`,
          referenceId: order.id
        }
      });

      return order;
    });

    res.status(201).json({ 
      success: true, 
      message: 'Transaksi POS berhasil.', 
      data: newOrder 
    });
  } catch (error) {
    console.error('POS Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses transaksi kasir.' });
  }
};

module.exports = {
  checkoutPOS
};
