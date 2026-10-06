import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Evita multiple istanze di Prisma Client in ambiente development/hot reload
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__db;
}

export default prisma;
