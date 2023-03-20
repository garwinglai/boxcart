import { PrismaClient } from '@prisma/client';

const prismaClientOptions =
  process.env.NODE_ENV === 'production'
    ? {
        log: ['info', 'warn'],
        errorFormat: 'minimal',
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
            provider: 'mysql',
            ssl: {
              rejectUnauthorized: false,
            },
          },
        },
      }
    : {
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      };

const prisma = new PrismaClient(prismaClientOptions);

export default prisma;
