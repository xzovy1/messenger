require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./client");

const delUsers = prisma.user.deleteMany();
const delPass = prisma.pW.deleteMany();
const delProfile = prisma.profile.deleteMany();
const clearDB = async () =>
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.pW.deleteMany(),
    prisma.user.deleteMany(),
  ]);

const getUsers = prisma.user.findMany();
async function main() {
  console.log(await clearDB());
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
