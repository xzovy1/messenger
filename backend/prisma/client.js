const { PrismaClient, Prisma } = require("../generated/prisma/index");
const prisma = new PrismaClient();
module.exports = prisma;
