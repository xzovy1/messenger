const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");
const { user } = require("./client");

const prisma = new PrismaClient();


const username = 'admin'
const firstname = 'adam'
const lastname = 'min'
async function main() {
  const data = await prisma.user.update({
    where: {
      id: 'c0af1279-a348-4474-921a-ec07309cb6b5'
    },
    data: {
      username,
      profile: {
        update: {
          bio: 'hey there!',
          lastname,
          firstname,
        }
      }
    }

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
