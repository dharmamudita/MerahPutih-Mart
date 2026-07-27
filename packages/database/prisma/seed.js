const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai seeder Koperasi Desa Merah Putih...');

  // 1. Buat KopDes Pusat / Default
  const kopdes = await prisma.kopdes.upsert({
    where: { code: 'KOPDES-001' },
    update: {},
    create: {
      code: 'KOPDES-001',
      name: 'Koperasi Desa Merah Putih (Pusat)',
      description: 'Koperasi percontohan utama untuk program Merah Putih',
      address: 'Jl. Merdeka No. 17',
      province: 'Jawa Barat',
      city: 'Kabupaten Bandung',
      district: 'Soreang',
      village: 'Soreang',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Kopdes created:', kopdes.name);

  // 2. Buat Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@merahputih.id' },
    update: {},
    create: {
      email: 'admin@merahputih.id',
      // Password hash untuk: admin123 (nanti pakai bcrypt di production, ini dummy dulu)
      password: 'hashed_password_placeholder', 
      name: 'Super Admin Pusat',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Super Admin created:', admin.email);

  // 3. Buat Kategori Produk Dasar
  const categories = [
    { name: 'Sembako', slug: 'sembako', isGlobal: true },
    { name: 'Snack & Minuman', slug: 'snack-minuman', isGlobal: true },
    { name: 'Kebutuhan Tani', slug: 'kebutuhan-tani', isGlobal: true },
    { name: 'Kebersihan', slug: 'kebersihan', isGlobal: true }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug_kopdesId: { slug: cat.slug, kopdesId: '' } }, // Dummy where since we don't know the exact unique constraint matching here. Wait, schema says @@unique([slug, kopdesId]). But kopdesId is optional. If null, Prisma might complain about unique on null. Let's just create them.
      update: {},
      create: { ...cat }
    }).catch(async (e) => {
        // Fallback for optional fields
        const existing = await prisma.category.findFirst({ where: { slug: cat.slug }});
        if (!existing) await prisma.category.create({ data: cat });
    });
  }
  console.log('✅ Categories created');

  // 4. Buat Satuan
  const units = [
    { name: 'Kilogram', symbol: 'kg' },
    { name: 'Liter', symbol: 'L' },
    { name: 'Pieces', symbol: 'pcs' },
    { name: 'Dus', symbol: 'dus' },
    { name: 'Paket', symbol: 'pkt' }
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: {},
      create: { ...unit }
    });
  }
  console.log('✅ Units created');

  console.log('Seeder selesai! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
