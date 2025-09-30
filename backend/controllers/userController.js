const bcrypt = require("bcryptjs");
const db = require("../db/userQueries");
const path = require("node:path");
const { validateSignup, validateLoginPassword } = require("./validation/userValidation");
const { validationResult } = require("express-validator");
const { hash } = require("node:crypto");

exports.getUser = async (req, res) => {
  const id = req.user.id;
  if (!id) {
    res.status(404).json("User not found");
    return;
  }
  const user = await db.getUser(id);
  res.json(user);
};

exports.createUser = [
  validateSignup.username,
  validateSignup.password,
  validateSignup.passwordConfirm,
  validateSignup.firstName,
  validateSignup.lastName,
  validateSignup.dob,
  validateSignup.bio,
  async (req, res) => {
    const { username, password, firstname, lastname, dob, bio } = req.body;
    const imgPath = process.env.BACKEND_URL || "http://localhost:8000/uploads";
    const image = path.dirname(`${process.env.BACKEND_URL}/uploads/default_image.jpg`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      next(errors.array());
      return;
    }
    const confirmPassword = req.body["password-confirm"];
    if (password != confirmPassword) {
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
    try {
      const user = await db.newUser(userInfo);
      res.json({ user });
    } catch (error) {
      res.status(400).send({ message: "User already exists" });
    }
  },
];

exports.updateUser = [
  validateLoginPassword,
  async (req, res, next) => {
    const confirmPassword = req.body["password-confirm"];
    const currentPassword = req.body["password-current"];
    const { password } = req.body
    const username = req.body.username;
    const currentInfo = await db.getUser(req.user.id);
    let updatedUser = {
      id: currentInfo.id,
      username: currentInfo.id,
      password: currentInfo.password.hash
    }
    const hashed = await bcrypt.compare(currentPassword, currentInfo.password.hash);
    if (!hashed) {
      res.status(401).send({ message: "password incorrect" });
      return;
    }

    if (username) {
      updatedUser.username = username
    }
    if (password) {
      if (password == confirmPassword) {
        const newPassword = await bcrypt.hash(password, 10)
        updatedUser.password = newPassword
      } else {
        res.status(400).send({ message: "passwords must match" })
      }
    }
    try {
      const updatedInfo = await db.updateUser(updatedUser);
      res.json(updatedInfo);
    } catch (error) {
      next(error)
    }
  }];

exports.uploadProfileImage = async (req, res, next) => {
  const { id } = req.params;
  const path =
    "http://localhost:8000/uploads/" + encodeURI(req.file.originalname);
  try {
    await db.updateProfileImage(path, id);
    res.json({ message: "image uploaded" });
  } catch (error) {
    next(error)
  }
};

exports.updateProfile = async (req, res, next) => {
  const user = req.body;
  const { id } = req.params; //user id
  try {
    const updatedInfo = await db.updateProfile(user, id);
    res.json(updatedInfo);
  } catch (error) {
    next(error)
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: {},
    });
    res.json(user);
  } catch (error) {
    next(error)
  }
};
