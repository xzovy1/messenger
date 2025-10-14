const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { user, profile, pW } = require("./client");
const { newUser } = require("../db/userQueries");

const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await bcrypt.hash("Password123$", 10);
  const user1 = {
    username: "TestUser",
    password: hashedPassword,
    firstname: "Test",
    lastname: "User",
    dob: "2020-01-01T00:00:00Z",
    bio: "Test User 1",
    image: "http://localhost:8000/uploads/default_image.jpg",
  };
  const user2 = {
    username: "TestUser2",
    password: hashedPassword,
    firstname: "Test",
    lastname: "UserTwo",
    dob: "2020-01-01T00:00:00Z",
    bio: "Test User 2",
    image: "http://localhost:8000/uploads/default_image.jpg",
  };
  console.log("Seeding...");
  await newUser(user1);
  await newUser(user2);
  console.log("created user");

  console.log("Seeding complete");
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
