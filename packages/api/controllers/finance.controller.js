const { prisma } = require('database');

/**
 * Mendapatkan riwayat arus kas
 */
const getCashFlows = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    const cashFlows = await prisma.cashFlow.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: cashFlows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat arus kas.' });
  }
};

/**
 * Mencatat arus kas secara manual (pemasukan/pengeluaran)
 */
const addCashFlow = async (req, res) => {
  try {
    const { type, category, amount, description, reference, kopdesId } = req.body;
    
    if (!type || !category || !amount) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
    }

    const newCashFlow = await prisma.cashFlow.create({
      data: {
        kopdesId: req.user.kopdesId || kopdesId,
        type,
        category,
        amount: parseFloat(amount),
        description,
        reference,
        createdBy: req.user.name || 'Admin'
      }
    });

    res.status(201).json({ success: true, data: newCashFlow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mencatat arus kas.' });
  }
};

/**
 * Mendapatkan ringkasan saldo keuangan
 */
const getFinanceSummary = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    const allFlows = await prisma.cashFlow.findMany({ where: whereClause });
    
    let totalIncome = 0;
    let totalExpense = 0;

    allFlows.forEach(flow => {
      if (flow.type === 'INCOME' || flow.type === 'IN') {
        totalIncome += flow.amount;
      } else if (flow.type === 'EXPENSE' || flow.type === 'OUT') {
        totalExpense += flow.amount;
      }
    });

    res.status(200).json({ 
      success: true, 
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat ringkasan keuangan.' });
  }
};

module.exports = {
  getCashFlows,
  addCashFlow,
  getFinanceSummary
};
