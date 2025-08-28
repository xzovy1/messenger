const { PrismaClient, Prisma } = require("../generated/prisma/index");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding...");
    const testPass = await bcrypt.hash("asdf", 10)
    await prisma.user.create({
        data: {
            username: "test1",
            password: testPass
        }
    })
    console.log("created user 'test1'")
    console.log("Seeding complete")
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })