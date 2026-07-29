const { prisma } = require('database');

/**
 * Mendapatkan ringkasan laporan (Sales, Top Products, dll)
 */
const getDashboardStats = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    // Ambil pesanan sukses
    const orders = await prisma.order.findMany({
      where: { ...whereClause, status: 'COMPLETED' },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    const transactions = await prisma.transaction.findMany({
      where: { ...whereClause, status: 'SUCCESS' },
      include: {
        transactionItems: {
          include: { product: true }
        }
      }
    });

    let totalRevenue = 0;
    let totalSalesCount = orders.length + transactions.length;
    let productSalesMap = {};

    // Proses Orders (Online)
    orders.forEach(order => {
      totalRevenue += order.totalAmount;
      order.orderItems.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { 
            name: item.product.name, 
            qty: 0, 
            revenue: 0 
          };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += (item.price * item.quantity);
      });
    });

    // Proses Transactions (POS)
    transactions.forEach(trx => {
      totalRevenue += trx.totalAmount;
      trx.transactionItems.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { 
            name: item.product.name, 
            qty: 0, 
            revenue: 0 
          };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += (item.price * item.quantity);
      });
    });

    // Urutkan produk terlaris
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    res.status(200).json({ 
      success: true, 
      data: {
        totalRevenue,
        totalSalesCount,
        topProducts
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat statistik dashboard.' });
  }
};

module.exports = {
  getDashboardStats
};
