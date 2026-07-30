const { prisma } = require('database');

/**
 * Mendapatkan ringkasan dashboard nasional (Pusat Kendali)
 */
const getNationalDashboard = async (req, res) => {
  try {
    // 1. KPI Cards
    const totalKopdesAktif = await prisma.kopdes.count({ where: { status: 'ACTIVE' } });
    const totalKopdesNonaktif = await prisma.kopdes.count({ where: { status: { not: 'ACTIVE' } } });
    const totalPengguna = await prisma.user.count({ where: { role: { in: ['ADMIN_KOPDES', 'KASIR', 'OPERATOR_GUDANG'] } } });
    const totalPelanggan = await prisma.user.count({ where: { role: 'PELANGGAN' } });

    // 2. Transaksi Hari Ini & Bulan Ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const transactionsToday = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: today }
      }
    });

    const transactionsMonth = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: startOfMonth }
      }
    });

    const ordersToday = await prisma.order.findMany({
      where: {
        createdAt: { gte: today },
        status: 'COMPLETED'
      }
    });

    const ordersMonth = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: 'COMPLETED'
      }
    });

    const totalTransaksiHariIni = transactionsToday.length + ordersToday.length;
    const totalTransaksiBulanIni = transactionsMonth.length + ordersMonth.length;

    const totalOmzetHarian = 
      transactionsToday.reduce((acc, t) => acc + t.totalAmount, 0) + 
      ordersToday.reduce((acc, o) => acc + o.totalAmount, 0);

    const totalOmzetBulanan = 
      transactionsMonth.reduce((acc, t) => acc + t.totalAmount, 0) + 
      ordersMonth.reduce((acc, o) => acc + o.totalAmount, 0);

    // 3. Pengeluaran Nasional Bulan Ini
    const expensesMonth = await prisma.cashFlow.findMany({
      where: {
        type: 'EXPENSE',
        date: { gte: startOfMonth }
      }
    });
    const totalPengeluaran = expensesMonth.reduce((acc, e) => acc + e.amount, 0);

    // 4. Laba Kasar
    // (Asumsi estimasi HPP 70% dari omzet)
    const estimasiHPP = totalOmzetBulanan * 0.7;
    const totalLaba = totalOmzetBulanan - estimasiHPP - totalPengeluaran;

    // 5. Persebaran Kopdes (Top 5 berdasarkan Omzet)
    const kopdesList = await prisma.kopdes.findMany({
      include: {
        transactions: { where: { createdAt: { gte: startOfMonth } } },
        orders: { where: { createdAt: { gte: startOfMonth }, status: 'COMPLETED' } }
      }
    });

    const kopdesPerformance = kopdesList.map(k => {
      const omzetTrx = k.transactions.reduce((acc, t) => acc + t.totalAmount, 0);
      const omzetOrd = k.orders.reduce((acc, o) => acc + o.totalAmount, 0);
      return {
        id: k.id,
        name: k.name,
        city: k.city,
        omzet: omzetTrx + omzetOrd
      };
    }).sort((a, b) => b.omzet - a.omzet).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalKopdesAktif,
          totalKopdesNonaktif,
          totalPengguna,
          totalPelanggan,
          totalTransaksiHariIni,
          totalTransaksiBulanIni,
          totalOmzetHarian,
          totalOmzetBulanan,
          totalPengeluaran,
          totalLaba
        },
        topKopdes: kopdesPerformance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard nasional' });
  }
};

module.exports = {
  getNationalDashboard
};
