const bcrypt = require("bcryptjs");
const { getUser, newUser } = require("../db/userQueries")

// exports.getUser = async (req, res) => {
//   const user = await prisma.user.findMany();
//   return res.json(user);
// };
exports.getUser = async (req, res) => {
  console.log(req.app.user)
  const id = req.app.user.id;
  if (!id) {
    res.status(404).json("User not found");
    return;
  }
  const user = await getUser(id);
  res.json(user);
};

exports.createUser = async (req, res) => {
  console.log(req.body)
  const { username, password, firstname, lastname, dob, bio, image } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userInfo = { username, password: hashedPassword, firstname, lastname, dob, bio, image };

  const user = await newUser(userInfo)
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
