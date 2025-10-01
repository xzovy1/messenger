const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");

const user = {
  username: "TestUser",
  password: "TestUser@1",
  firstname: "Test",
  lastname: "User",
  bio: "Hi I'm Test User",
  dob: new Date("01-01-2000").toISOString(),
};
const createNewUser = async (info) => {
  const { username, password, firstname, lastname, bio, dob } = info;
  return await prisma.user.create({
    data: {
      username,
      password: {
        create: {
          hash: await bcrypt.hash(password, 10),
        },
      },
      profile: {
        create: {
          firstname,
          lastname,
          bio,
          dob,
        },
      },
    },
    include: {
      profile: true,
    },
  });
};

module.exports = { user, createNewUser };
