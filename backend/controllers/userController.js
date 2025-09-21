const bcrypt = require("bcryptjs");
const db = require("../db/userQueries");
const path = require("node:path")
const { fileUrlToPath } = require("node:url")
// const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })


exports.getUser = async (req, res) => {
  const id = req.user.id;
  if (!id) {
    res.status(404).json("User not found");
    return;
  }
  const user = await db.getUser(id);
  res.json(user);
};

exports.createUser = async (req, res) => {
  const { username, password, firstname, lastname, dob, bio } = req.body;
  const path = process.env.BACKENDURL || "http://localhost:8000/images"
  const image = path.dirname(`${process.env.BACKENDURL}`)

  const passwordconfirm = req.body["password-confirm"]
  if (user.password != passwordconfirm) {
    res.status(400).json({ message: "passwords do not match!" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userInfo = {
    username,
    password: hashedPassword,
    firstname,
    lastname,
    dob,
    bio,
    image,
  };

  const user = await db.newUser(userInfo);
  res.json({ user });
};

exports.updateUser = async (req, res) => {
  const field = req.body;
  const { id } = req.params //user id
  const passwordconfirm = req.body["password-confirm"]
  let user = { username: field.username, id, }

  //validate password with password comfirmation
  if (field.password != passwordconfirm) {
    res.status(400).json({ message: "passwords do not match!" });
    return;
  }
  //check if password or username is empty
  if (user.username == '') {
    res.status(400).json({ message: "username cannot be empty!" });
    return;
  }
  if (field.password !== '' && passwordconfirm !== '') {
    user.password = field.password;
  }
  console.log(user)
  try {
    const updatedInfo = await db.updateUser(user);
    res.json(updatedInfo);
  } catch (error) {
    throw new Error(error)
  }
}


exports.uploadProfileImage = async (req, res) => {
  console.log(req.file)


}

exports.updateProfile = async (req, res) => {
  const user = req.body;
  const { id } = req.params //user id
  try {
    const updatedInfo = await db.updateProfile(user, id);
    res.json(updatedInfo);
  } catch (error) {
    throw new Error(error)
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
