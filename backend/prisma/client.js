// const { PrismaClient, Prisma } = require("../generated/prisma/index");
const { PrismaClient } = require("@prisma/client");

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `Database URL not found for environment ${process.env.NODE_ENV}`,
  );
}
// console.log(databaseUrl);
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
module.exports = prisma;
