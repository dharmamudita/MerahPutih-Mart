const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  // Cek apakah ada Kopdes
  let kopdes = await prisma.kopdes.findFirst();
  if (!kopdes) {
    kopdes = await prisma.kopdes.create({
      data: {
        code: 'KOPDES-001',
        name: 'Koperasi Desa Merah Putih',
        address: 'Jl. Merah Putih No. 1',
        province: 'Jawa Tengah',
        city: 'Semarang',
        district: 'Banyumanik',
        village: 'Gedawang'
      }
    });
    console.log('Created Kopdes:', kopdes.id);
  }

  // Cek apakah ada SUPER_ADMIN
  let admin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@merahputih.com',
        password: 'hashed_password_mock',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        kopdesId: kopdes.id
      }
    });
    console.log('Created Super Admin:', admin.id);
  } else if (!admin.kopdesId) {
    admin = await prisma.user.update({
      where: { id: admin.id },
      data: { kopdesId: kopdes.id }
    });
    console.log('Updated Super Admin kopdesId:', admin.id);
  }

  // Generate Token
  const token = jwt.sign(
    { id: admin.id, role: admin.role, kopdesId: admin.kopdesId },
    process.env.JWT_SECRET || 'supersecretjwtkey',
    { expiresIn: '30d' }
  );

  console.log('\n--- KOPDES ID ---');
  console.log(kopdes.id);
  console.log('\n--- JWT TOKEN ---');
  console.log(token);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
