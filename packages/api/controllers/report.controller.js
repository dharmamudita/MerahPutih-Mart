const { prisma } = require('database');

/**
 * Mendapatkan ringkasan laporan (Sales, Top Products, dll)
 */
const getDashboardStats = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

<<<<<<< HEAD
    // Ambil pesanan sukses
    const orders = await prisma.order.findMany({
      where: { ...whereClause, status: 'COMPLETED' },
      include: {
        orderItems: {
=======
    // Ambil pesanan selesai
    const orders = await prisma.order.findMany({
      where: { ...whereClause, status: 'COMPLETED' },
      include: {
        items: {
>>>>>>> 18373dc (code review)
          include: { product: true }
        }
      }
    });

    const transactions = await prisma.transaction.findMany({
<<<<<<< HEAD
      where: { ...whereClause, status: 'SUCCESS' },
      include: {
        transactionItems: {
=======
      where: { ...whereClause, status: 'COMPLETED' },
      include: {
        items: {
>>>>>>> 18373dc (code review)
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
<<<<<<< HEAD
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
=======
      order.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.product?.name || item.productName,
            qty: 0,
            revenue: 0
          };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += (item.unitPrice * item.quantity);
>>>>>>> 18373dc (code review)
      });
    });

    // Proses Transactions (POS)
    transactions.forEach(trx => {
      totalRevenue += trx.totalAmount;
<<<<<<< HEAD
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
=======
      trx.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.product?.name || item.productName,
            qty: 0,
            revenue: 0
          };
        }
        productSalesMap[item.productId].qty += item.quantity;
        productSalesMap[item.productId].revenue += (item.unitPrice * item.quantity);
>>>>>>> 18373dc (code review)
      });
    });

    // Urutkan produk terlaris
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

<<<<<<< HEAD
    res.status(200).json({ 
      success: true, 
=======
    res.status(200).json({
      success: true,
>>>>>>> 18373dc (code review)
      data: {
        totalRevenue,
        totalSalesCount,
        topProducts
<<<<<<< HEAD
      } 
=======
      }
>>>>>>> 18373dc (code review)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat statistik dashboard.' });
  }
};

module.exports = {
  getDashboardStats
};
