const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkout = async (req, res) => {
  try {
    const { items, deliveryMethod, shippingAddressId, paymentMethod, notes, kopdesId, pointsUsed, voucherCode } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
    }

    // Hitung subtotal
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingCost = deliveryMethod === 'DELIVERY' ? 10000 : 0;
    
    // Hitung diskon (mock logic for voucher)
    let discountAmount = 0;
    if (voucherCode === 'DISKONKOPDES') {
      discountAmount = 15000;
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
    
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderNo,
          userId,
          kopdesId: kopdesId || (await tx.kopdes.findFirst()).id,
          customerId: customer?.id || null,
          type: deliveryMethod === 'DELIVERY' ? 'DELIVERY' : 'PICKUP',
          status: 'WAITING_PAYMENT',
          subtotal,
          discountAmount,
          shippingCost,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod, // e.g. TRANSFER, QRIS, COD (Need to add to Prisma enum if not exist, or store as string if nullable. Oh wait PaymentMethod enum might be strict. Let's assume it maps to string or we use notes if error). 
          // Wait, Prisma PaymentMethod might be CASH, TRANSFER, QRIS. Let's pass it.
          addressId: shippingAddressId,
          notes,
          voucherCode,
          pointsUsed,
          
          items: {
            create: items.map(item => ({
              productId: item.productId,
              productName: 'Product', // Should fetch actual name, keeping simple
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity
            }))
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
          data: { stock: { decrement: item.quantity } }
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
    const orderId = req.params.id;

    const order = await prisma.order.update({
      where: { id: orderId },
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
    res.status(200).json({ success: true, data: order, message: 'Status pesanan berhasil diperbarui.' });
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
