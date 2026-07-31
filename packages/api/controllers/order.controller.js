const { prisma } = require('database');

const checkout = async (req, res) => {
  try {
    const { items, deliveryMethod, shippingAddressId, paymentMethod, notes, kopdesId, pointsUsed, voucherCode } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }

    // Fetch products untuk harga & nama real (bukan input client)
    const productIds = [...new Set(items.map(i => i.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map(p => [p.id, p]));

    // Hitung subtotal dari harga DB
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Produk tidak ditemukan: ${item.productId}`);
      const qty = item.quantity || 1;

      // Validasi stok cukup
      if (product.stockQuantity < qty) {
        throw new Error(`Stok ${product.name} tidak cukup (tersisa ${product.stockQuantity}, diminta ${qty}).`);
      }

      const unitPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.sellPrice;
      subtotal += unitPrice * qty;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: qty,
        unitPrice,
        totalPrice: unitPrice * qty
      };
    });
    const shippingCost = deliveryMethod === 'DELIVERY' ? 10000 : 0;

    // Hitung diskon (lookup voucher dari DB)
    let discountAmount = 0;
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } });
      if (!voucher || !voucher.isActive) throw new Error('Kode voucher tidak valid.');
      const now = new Date();
      if (now < voucher.startDate || now > voucher.endDate) throw new Error('Voucher sudah tidak berlaku.');
      if (voucher.minPurchase && subtotal < voucher.minPurchase) {
        throw new Error(`Minimal belanja Rp ${voucher.minPurchase.toLocaleString('id-ID')} untuk voucher ini.`);
      }
      if (voucher.maxUsage && voucher.usedCount >= voucher.maxUsage) throw new Error('Voucher sudah habis.');
      discountAmount = voucher.type === 'PERCENTAGE'
        ? Math.min((subtotal * voucher.value) / 100, voucher.maxDiscount || Infinity)
        : voucher.value;
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Poin discount
    const pointsDiscount = pointsUsed > 0 ? pointsUsed * 100 : 0;

    const grandTotal = subtotal + shippingCost - discountAmount - pointsDiscount;

    // Generate Invoice Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNo = `INV-${dateStr}-${randomStr}`;

    // Get Customer ID
    let customer = await prisma.customer.findUnique({ where: { userId } });

    // Ambil kopdesId — fallback ke kopdes pertama
    const targetKopdes = kopdesId || (await prisma.kopdes.findFirst());
    if (!targetKopdes) throw new Error('Tidak ada data kopdes.');
    const targetKopdesId = typeof targetKopdes === 'string' ? targetKopdes : targetKopdes.id;

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderNo,
          user: { connect: { id: userId } },
          kopdes: { connect: { id: targetKopdesId } },
          customer: customer ? { connect: { id: customer.id } } : undefined,
          type: deliveryMethod === 'DELIVERY' ? 'DELIVERY' : 'PICKUP',
          status: 'WAITING_PAYMENT',
          subtotal,
          discountAmount,
          shippingCost,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod,
          addressId: shippingAddressId,
          notes,
          voucherCode,
          pointsUsed,

          items: {
            create: orderItems
          },
          statusHistory: {
            create: {
              status: 'WAITING_PAYMENT',
              notes: 'Pesanan dibuat'
            }
          }
        }
      });

      // 2. Reduce points if used
      if (pointsUsed > 0 && customer) {
        await tx.customer.update({
          where: { id: customer.id },
          data: { totalPoints: { decrement: pointsUsed } }
        });
        await tx.pointTransaction.create({
          data: {
            customerId: customer.id,
            userId,
            type: 'REDEEM',
            points: pointsUsed,
            description: `Dipakai untuk pesanan ${orderNo}`
          }
        });
      }

      // 3. Update stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }

      return order;
    });

    res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', data: newOrder });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses pesanan.', error: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { select: { name: true, images: { take: 1 } } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { 
        OR: [{ id: req.params.id }, { orderNo: req.params.id }],
        userId: req.user.id 
      },
      include: {
        items: {
          include: { product: { select: { name: true, images: { take: 1 } } } }
        },
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: { product: { select: { name: true, sku: true } } }
        },
        user: { select: { name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const identifier = req.params.id;

    // Cari order by id atau orderNo
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: identifier }, { orderNo: identifier }] }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: `Status diubah menjadi ${status} oleh Admin`
          }
        }
      }
    });
    res.status(200).json({ success: true, data: updated, message: 'Status pesanan berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan.' });
  }
};

module.exports = {
  checkout,
  getOrderHistory,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
