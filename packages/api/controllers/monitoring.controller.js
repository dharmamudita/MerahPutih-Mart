const { prisma } = require('database');

/**
 * Mendapatkan List Semua Transaksi Nasional
 */
const getNationalTransactions = async (req, res) => {
  try {
    // Kombinasi POS (Transaction) dan E-Commerce (Order)
    const posTransactions = await prisma.transaction.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        kopdes: { select: { name: true, city: true } },
        cashier: { select: { name: true } }
      }
    });

    const onlineOrders = await prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        kopdes: { select: { name: true, city: true } },
        user: { select: { name: true } }
      }
    });

    // Formatting for frontend
    const formattedPos = posTransactions.map(t => ({
      id: t.id,
      invoice: t.invoiceNo,
      type: 'POS (Offline)',
      amount: t.totalAmount,
      kopdes: t.kopdes.name,
      city: t.kopdes.city,
      status: t.status,
      date: t.createdAt,
      handledBy: t.cashier.name
    }));

    const formattedOnline = onlineOrders.map(o => ({
      id: o.id,
      invoice: o.orderNo,
      type: 'E-Commerce (Online)',
      amount: o.totalAmount,
      kopdes: o.kopdes.name,
      city: o.kopdes.city,
      status: o.status,
      date: o.createdAt,
      handledBy: o.user.name
    }));

    const allTransactions = [...formattedPos, ...formattedOnline]
      .sort((a, b) => b.date - a.date)
      .slice(0, 100);

    res.status(200).json({ success: true, data: allTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat transaksi nasional' });
  }
};

/**
 * Mendapatkan Stok Kritis Nasional (Hampir habis)
 */
const getNationalCriticalStock = async (req, res) => {
  try {
    const criticalProducts = await prisma.product.findMany({
      where: {
        stockQuantity: { lte: 10 } // Anggap di bawah 10 adalah kritis
      },
      take: 50,
      orderBy: { stockQuantity: 'asc' },
      include: {
        kopdes: { select: { name: true, city: true } },
        category: { select: { name: true } }
      }
    });

    res.status(200).json({ success: true, data: criticalProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat stok kritis' });
  }
};

module.exports = {
  getNationalTransactions,
  getNationalCriticalStock
};
