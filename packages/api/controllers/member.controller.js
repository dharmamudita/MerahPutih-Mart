<<<<<<< HEAD
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
=======
const { prisma } = require('database');
>>>>>>> 18373dc (code review)

const getMemberProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find customer profile
    let customer = await prisma.customer.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        pointTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    // If customer doesn't exist, create a default one
    if (!customer) {
      // Find kopdes (assuming there's a default or first kopdes)
      const kopdes = await prisma.kopdes.findFirst();
      if (!kopdes) {
        return res.status(404).json({ success: false, message: 'Data Koperasi belum ada.' });
      }

      customer = await prisma.customer.create({
        data: {
          userId,
          kopdesId: kopdes.id,
          memberCode: 'MBR' + Math.floor(Math.random() * 1000000),
          memberLevel: 'SILVER',
          totalPoints: 0,
          totalSpending: 0
        },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          pointTransactions: true
        }
      });
    }

    // Determine next level
    let nextLevel = 'GOLD';
    let spendingRequired = 1000000; // Example
    let progress = 0;
    
    if (customer.memberLevel === 'SILVER') {
      nextLevel = 'GOLD';
      spendingRequired = 1000000;
      progress = Math.min((customer.totalSpending / spendingRequired) * 100, 100);
    } else if (customer.memberLevel === 'GOLD') {
      nextLevel = 'PLATINUM';
      spendingRequired = 5000000;
      progress = Math.min((customer.totalSpending / spendingRequired) * 100, 100);
    } else {
      nextLevel = 'MAX';
      progress = 100;
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...customer,
        nextLevel,
        spendingRequired,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data member.', error: error.message });
  }
};

module.exports = {
  getMemberProfile
};
