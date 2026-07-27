const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai seeding database...');

  // 1. Buat Super Admin
  const hashedPassword = await bcrypt.hash('superadmin123', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@kopdes.id' },
    update: {},
    create: {
      email: 'superadmin@kopdes.id',
      password: hashedPassword,
      name: 'Super Admin Pusat',
      phone: '081234567890',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log('Super Admin dibuat:', superAdmin.email);

  // 2. Buat Kopdes contoh
  const kopdes1 = await prisma.kopdes.upsert({
    where: { code: 'KD-001' },
    update: {},
    create: {
      code: 'KD-001',
      name: 'Kopdes Maju Bersama',
      description: 'Koperasi Desa Maju Bersama - Desa Sukamaju',
      address: 'Jl. Raya Sukamaju No. 1',
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Cimahi',
      village: 'Sukamaju',
      postalCode: '40512',
      latitude: -6.8721,
      longitude: 107.5425,
      phone: '022-12345678',
      email: 'kopdes.majubersama@kopdes.id',
      operationalHours: {
        senin: '08:00-17:00',
        selasa: '08:00-17:00',
        rabu: '08:00-17:00',
        kamis: '08:00-17:00',
        jumat: '08:00-16:00',
        sabtu: '08:00-12:00',
        minggu: 'Tutup',
      },
      status: 'ACTIVE',
    },
  });

  const kopdes2 = await prisma.kopdes.upsert({
    where: { code: 'KD-002' },
    update: {},
    create: {
      code: 'KD-002',
      name: 'Kopdes Sejahtera',
      description: 'Koperasi Desa Sejahtera - Desa Harapan',
      address: 'Jl. Harapan Baru No. 45',
      province: 'Jawa Tengah',
      city: 'Semarang',
      district: 'Ungaran',
      village: 'Harapan',
      postalCode: '50518',
      latitude: -7.1399,
      longitude: 110.4057,
      phone: '024-87654321',
      email: 'kopdes.sejahtera@kopdes.id',
      operationalHours: {
        senin: '07:30-16:30',
        selasa: '07:30-16:30',
        rabu: '07:30-16:30',
        kamis: '07:30-16:30',
        jumat: '07:30-15:30',
        sabtu: '08:00-12:00',
        minggu: 'Tutup',
      },
      status: 'ACTIVE',
    },
  });
  console.log('Kopdes dibuat:', kopdes1.name, ',', kopdes2.name);

  // 3. Buat Admin Kopdes
  const adminPassword = await bcrypt.hash('adminkopdes123', 12);
  const adminKopdes1 = await prisma.user.upsert({
    where: { email: 'admin@majubersama.kopdes.id' },
    update: {},
    create: {
      email: 'admin@majubersama.kopdes.id',
      password: adminPassword,
      name: 'Admin Kopdes Maju Bersama',
      phone: '081345678901',
      role: 'ADMIN_KOPDES',
      status: 'ACTIVE',
      emailVerified: true,
      kopdesId: kopdes1.id,
    },
  });

  // 4. Buat Kasir
  const kasirPassword = await bcrypt.hash('kasir123', 12);
  const kasir1 = await prisma.user.upsert({
    where: { email: 'kasir1@majubersama.kopdes.id' },
    update: {},
    create: {
      email: 'kasir1@majubersama.kopdes.id',
      password: kasirPassword,
      name: 'Siti Kasir',
      phone: '081456789012',
      role: 'KASIR',
      status: 'ACTIVE',
      emailVerified: true,
      kopdesId: kopdes1.id,
    },
  });
  console.log('Admin & Kasir dibuat');

  // 5. Buat Satuan
  const units = ['Pcs', 'Kg', 'Liter', 'Dus', 'Pack', 'Sachet', 'Botol', 'Kaleng'];
  const unitSymbols = ['pcs', 'kg', 'L', 'dus', 'pack', 'sct', 'btl', 'kl'];
  for (let i = 0; i < units.length; i++) {
    await prisma.unit.upsert({
      where: { name: units[i] },
      update: {},
      create: { name: units[i], symbol: unitSymbols[i] },
    });
  }
  console.log('Satuan dibuat');

  // 6. Buat Brand
  const brands = ['Indomie', 'Aqua', 'Kapal Api', 'ABC', 'Indofood', 'Wings', 'Unilever', 'Mayora', 'GarudaFood', 'Sasa'];
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand },
      update: {},
      create: { name: brand },
    });
  }
  console.log('Brand dibuat');

  // 7. Buat Kategori Global
  const categories = [
    { name: 'Makanan & Minuman', slug: 'makanan-minuman', isGlobal: true },
    { name: 'Kebutuhan Pokok', slug: 'kebutuhan-pokok', isGlobal: true },
    { name: 'Bumbu & Rempah', slug: 'bumbu-rempah', isGlobal: true },
    { name: 'Snack & Cemilan', slug: 'snack-cemilan', isGlobal: true },
    { name: 'Minuman', slug: 'minuman', isGlobal: true },
    { name: 'Perawatan Tubuh', slug: 'perawatan-tubuh', isGlobal: true },
    { name: 'Kebersihan Rumah', slug: 'kebersihan-rumah', isGlobal: true },
    { name: 'Perlengkapan Bayi', slug: 'perlengkapan-bayi', isGlobal: true },
    { name: 'Obat & Kesehatan', slug: 'obat-kesehatan', isGlobal: true },
    { name: 'Alat Tulis', slug: 'alat-tulis', isGlobal: true },
    { name: 'Elektronik', slug: 'elektronik', isGlobal: true },
    { name: 'Pertanian', slug: 'pertanian', isGlobal: true },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug_kopdesId: { slug: cat.slug, kopdesId: null } },
      update: {},
      create: cat,
    });
  }
  console.log('Kategori global dibuat');

  // 8. Buat Pelanggan contoh
  const pelangganPassword = await bcrypt.hash('pelanggan123', 12);
  const pelanggan = await prisma.user.upsert({
    where: { email: 'budi@email.com' },
    update: {},
    create: {
      email: 'budi@email.com',
      password: pelangganPassword,
      name: 'Budi Santoso',
      phone: '081567890123',
      role: 'PELANGGAN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  await prisma.customer.upsert({
    where: { userId: pelanggan.id },
    update: {},
    create: {
      userId: pelanggan.id,
      kopdesId: kopdes1.id,
      memberCode: 'MBR-00001',
      memberLevel: 'SILVER',
      totalPoints: 150,
    },
  });
  console.log('Pelanggan contoh dibuat');

  // 9. Buat System Settings default
  const settings = [
    { key: 'app_name', value: 'Koperasi Desa Merah Putih', group: 'GENERAL' },
    { key: 'app_tagline', value: 'Bersama Membangun Desa', group: 'GENERAL' },
    { key: 'point_per_transaction', value: '10', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'point_min_redeem', value: '100', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'point_value', value: '100', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'silver_min_spending', value: '0', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'gold_min_spending', value: '1000000', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'platinum_min_spending', value: '5000000', type: 'NUMBER', group: 'LOYALTY' },
    { key: 'session_timeout', value: '30', type: 'NUMBER', group: 'SECURITY' },
    { key: 'max_login_attempts', value: '5', type: 'NUMBER', group: 'SECURITY' },
    { key: 'tax_rate', value: '11', type: 'NUMBER', group: 'PAYMENT' },
  ];
  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('System settings dibuat');

  // 10. Buat Bank Accounts
  const banks = [
    { bankName: 'BRI', accountNo: '1234567890', accountName: 'Koperasi Desa Merah Putih' },
    { bankName: 'BNI', accountNo: '0987654321', accountName: 'Koperasi Desa Merah Putih' },
    { bankName: 'Mandiri', accountNo: '1122334455', accountName: 'Koperasi Desa Merah Putih' },
  ];
  for (const bank of banks) {
    await prisma.bankAccount.create({ data: bank });
  }
  console.log('Bank accounts dibuat');

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
