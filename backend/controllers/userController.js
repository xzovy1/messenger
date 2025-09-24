const bcrypt = require("bcryptjs");
const db = require("../db/userQueries");
const { validateUserLogin } = require("./validation/userValidation");

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
  const path = process.env.BACKENDURL || "http://localhost:8000/images";
  const image = path.dirname(`${process.env.BACKENDURL}`);

  const confirmPassword = req.body["password-confirm"];
  if (user.password != confirmPassword) {
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
  const { id } = req.params; //user id
  const confirmPassword = req.body["password-confirm"];
  const currentPassword = req.body["password-current"];
  let user = { username: field.username, id };
  //validate current password.
  const hashedPassword = await db.getUserPassword(id);
  const matched = await bcrypt.compare(currentPassword, hashedPassword);
  if (!matched) {
    res.status(400).json({ message: "current password is incorrect" });
    return;
  }

  //validate password with password comfirmation
  if (field.password != confirmPassword) {
    res.status(400).json({ message: "passwords do not match!" });
    return;
  }

  //check if password or username is empty
  if (user.username == "") {
    res.status(400).json({ message: "username cannot be empty!" });
    return;
  }
  if (field.password !== "" || confirmPassword !== "") {
    user.password = await bcrypt.hash(field.password, 10);
  } else {
    res.status(400).json({ message: "password fields cannot be empty!" });
    return;
  }

  try {
    console.log(user);
    const updatedInfo = await db.updateUser(user);
    res.json(updatedInfo);
  } catch (error) {
    throw new Error(error);
  }
};

exports.uploadProfileImage = async (req, res) => {
  const { id } = req.params;
  const path =
    "http://localhost:8000/uploads/" + encodeURI(req.file.originalname);
  await db.updateProfileImage(path, id);
  res.json({ message: "image uploaded" });
};

exports.updateProfile = async (req, res) => {
  const user = req.body;
  const { id } = req.params; //user id
  try {
    const updatedInfo = await db.updateProfile(user, id);
    res.json(updatedInfo);
  } catch (error) {
    throw new Error(error);
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
