const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");
const { user } = require("./client");

const prisma = new PrismaClient();


const username = 'admin'
const firstname = 'adam'
const lastname = 'min'
async function main() {
  const data = await prisma.profile.updateMany({

    data: {
      image: 'http://localhost:8000/uploads/default_image.jpg'
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
