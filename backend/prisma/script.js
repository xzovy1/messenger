const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");
const { user } = require("./client");

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.chat.findFirst({
    include: {
      message: {
        select: {
          read: true,
        },
      },
    },
  });

  console.log(data);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
