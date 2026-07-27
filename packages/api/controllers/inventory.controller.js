const { prisma } = require('database');

/**
 * Mendapatkan semua produk beserta stok (Untuk Gudang)
 */
const getInventory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        unit: true,
      },
      orderBy: { stockQuantity: 'asc' } // Yang mau habis duluan di atas
    });
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat persediaan barang.' });
  }
};

/**
 * Melakukan mutasi barang (Barang Masuk / Keluar)
 */
const mutateStock = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;
    // type: 'IN' atau 'OUT'
    
    if (!productId || !type || !quantity) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) return res.status(400).json({ success: false, message: 'Kuantitas harus lebih dari 0.' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });

    if (type === 'OUT' && product.stockQuantity < qty) {
      return res.status(400).json({ success: false, message: 'Stok tidak mencukupi untuk dikeluarkan.' });
    }

    // Karena di Prisma Schema kita belum membuat tabel khusus StockMovement untuk MVP ini,
    // kita cukup meng-update stockQuantity di tabel Product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: type === 'IN' 
          ? { increment: qty } 
          : { decrement: qty }
      }
    });

    res.status(200).json({ 
      success: true, 
      message: `Stok berhasil di${type === 'IN' ? 'tambah' : 'kurangi'}.`, 
      data: updatedProduct 
    });
  } catch (error) {
    console.error('Inventory mutation error:', error);
    res.status(500).json({ success: false, message: 'Gagal melakukan mutasi stok.' });
  }
};

module.exports = {
  getInventory,
  mutateStock
};
