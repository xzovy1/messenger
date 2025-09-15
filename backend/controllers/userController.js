const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  const user = await prisma.user.findMany();
  return res.json(user);
};
exports.getUser = async (req, res) => {
  console.log(req.app.user)
  const id = req.app.user.id;
  if (!id) {
    res.status(404).json("User not found");
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
  res.json(user);
};

exports.createUser = async (req, res) => {
  console.log(req.body)
  const { username, password, firstname, lastname, dob, bio, image } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: {
        create: {
          password: hashedPassword,
        },
      },
      profile: {
        create: {
          firstname,
          lastname,
          dob: new Date(dob), //convert from "YYYY-MM-DD" to time
          bio,
          image: image || "backend/images/default_image.jpg",
        },
      },
    },
  });
  res.json({ user });
};

exports.updateUser = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {},
    });
    return res.json(user);
  } catch (error) {
    res.json({ error: `user does not exist in the database` });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {},
    });
    res.json(user);
  } catch (error) {
    res.json({ error: `user does not exist in the database` });
  }
};
