require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./client");

const delUsers = prisma.user.deleteMany();
const delPass = prisma.pW.deleteMany();
const delProfile = prisma.profile.deleteMany();
const getUser = prisma.user.findMany();
async function main() {
  const data = await prisma.user.create({
    data: {
      username: "admin",
      password: {
        create: {
          password: await bcrypt.hash("admin", 10),
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
