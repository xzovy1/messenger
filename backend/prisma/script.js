const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // const deleteMessages = prisma.message.deleteMany();
  // const deleteUsers = prisma.user.deleteMany();
  // const deleteProfiles = prisma.profile.deleteMany();
  // const deleteChats = prisma.chat.deleteMany();
  const testPass = await bcrypt.hash("admin", 10);
  // const data = await prisma.$transaction([
  //   deleteMessages,
  //   deleteProfiles,
  //   deleteUsers,
  //   deleteChats,
  // ]);
  const data = await prisma.user.findUnique({
    where: {
      username: 'adam'
    },
    include: {
      password: true
    }
  })
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
