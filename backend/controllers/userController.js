const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  const user = await prisma.user.findMany();
  return res.json(user);
};

exports.createUser = async (req, res) => {
  const { username, password, firstname, lastname, dob, bio, image } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  const profile = await prisma.profile.create({
    data: {
      user_id: user.id,
      firstname,
      lastname,
      dob: new Date(dob), //convert from "YYYY-MM-DD" to time
      bio,
      image: image || "backend/images/default_image.jpg",
    },
  });
  console.log(username, profile);
  res.json({ user, profile });
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
