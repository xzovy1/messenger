const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const testPass = await bcrypt.hash("admin", 10);
  // const users = await prisma.user.findMany();
  const users = await prisma.user.create({
    data: {
      username: "a",
      password: await bcrypt.hash("a", 10),
    },
  });
  // data: [
  //   {
  //     username: "user1",
  //     password: testPass,
  //   },
  //   {
  //     username: "user2",
  //     password: testPass,
  //   },
  // ],
  console.log(users);
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
