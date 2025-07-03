import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client'; 

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);
  try {
 
    await prisma.user.deleteMany({});
    console.log('Cleaned up existing users.');

    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: Role.REGISTERED, 
      },
    });
    console.log(`Created user with ID: ${user.id}`);
  } catch (e: any) {
    console.error('Seeding failed:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log(`Seeding finished.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });