const { PrismaClient } = require("@prisma/client");

const prismaClientOptions = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      provider: "mysql",
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

const prisma = new PrismaClient(prismaClientOptions);

module.exports = prisma;
