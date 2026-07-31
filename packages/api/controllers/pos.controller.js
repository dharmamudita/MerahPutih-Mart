const { prisma } = require('database');

/**
 * Buat transaksi Point of Sales (Offline Kasir)
 */
const checkoutPOS = async (req, res) => {
  try {
    const { items, kopdesId, paymentMethod, amountPaid } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }

    // Hitung total dan ambil data produk
    const productIds = items.map(item => item.productId || item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sellPrice: true, stockQuantity: true }
    });

    const productMap = {};
    for (const p of products) productMap[p.id] = p;

    // Validasi stok
    for (const item of items) {
      const pid = item.productId || item.id;
      const prod = productMap[pid];
      if (!prod) {
        return res.status(404).json({ success: false, message: `Produk ${pid} tidak ditemukan.` });
      }
      if (prod.stockQuantity < (item.qty || item.quantity)) {
        return res.status(400).json({ success: false, message: `Stok ${prod.name} tidak mencukupi.` });
      }
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNo = `POS-${dateStr}-${randomStr}`;

    // Hitung total dari harga jual aktual
    const totalAmount = items.reduce((acc, item) => {
      const pid = item.productId || item.id;
      const price = item.price || productMap[pid].sellPrice;
      const qty = item.qty || item.quantity;
      return acc + (price * qty);
    }, 0);

    const changeAmount = amountPaid ? amountPaid - totalAmount : 0;

    // Ambil kopdesId — fallback ke kopdes pertama
    const fallbackKopdes = await prisma.kopdes.findFirst();
    if (!fallbackKopdes) {
      return res.status(400).json({ success: false, message: 'Tidak ada data kopdes.' });
    }
    const targetKopdesId = req.user.kopdesId || kopdesId || fallbackKopdes.id;

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Buat record Order POS
      const order = await tx.order.create({
        data: {
          orderNo,
          user: { connect: { id: req.user.id } },
          kopdes: { connect: { id: targetKopdesId } },
          totalAmount,
          type: 'PICKUP',
          status: 'COMPLETED',
          paymentMethod: paymentMethod || 'CASH',
          notes: 'Transaksi Offline POS',

          items: {
            create: items.map(item => {
              const pid = item.productId || item.id;
              const prod = productMap[pid];
              const qty = item.qty || item.quantity;
              const price = item.price || prod.sellPrice;
              return {
                productId: pid,
                productName: prod.name,
                quantity: qty,
                unitPrice: price,
                totalPrice: price * qty
              };
            })
          }
        }
      });

      // 2. Kurangi stok produk
      for (const item of items) {
        const pid = item.productId || item.id;
        await tx.product.update({
          where: { id: pid },
          data: { stockQuantity: { decrement: item.qty || item.quantity } }
        });
      }

      // 3. Catat Arus Kas Masuk
      await tx.cashFlow.create({
        data: {
          kopdesId: targetKopdesId,
          type: 'INCOME',
          category: 'SALES',
          amount: totalAmount,
          description: `Pendapatan dari penjualan POS (Invoice: ${orderNo})`,
          reference: order.id
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
