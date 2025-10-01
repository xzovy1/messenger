const bcrypt = require("bcryptjs");
const db = require("../db/userQueries");
const path = require("node:path");
const {
  validateUser,
  validatePassword,
  validateProfile,
} = require("./validation/userValidation");
const { validationResult } = require("express-validator");

const calculateAge = (dob) => {
  const birthdate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  return age;
};

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
  validateUser,
  validatePassword,
  validateProfile,
  async (req, res) => {
    const { username, password, firstname, lastname, dob, bio } = req.body;
    const imgPath = process.env.BACKEND_URL || "http://localhost:8000/uploads";
    const image = `${process.env.BACKEND_URL}/uploads/default_image.jpg`;

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
  validateUser,
  async (req, res, next) => {
    const confirmPassword = req.body["password-confirm"];
    const currentPassword = req.body["password-current"];
    const { password } = req.body;
    const username = req.body.username;
    const currentInfo = await db.getUser(req.user.id);
    let updatedUser = {
      id: currentInfo.id,
      username: currentInfo.id,
      password: currentInfo.password.hash,
    };
    const hashed = await bcrypt.compare(
      currentPassword,
      currentInfo.password.hash,
    );
    if (!hashed) {
      res.status(401).send({ message: "password incorrect" });
      return;
    }

    if (username) {
      if (!(await db.usernameTaken(username))) {
        updatedUser.username = username;
      } else {
        res.status(400).send({ message: "username already taken" });
        return;
      }
    }
    if (password) {
      if (password == confirmPassword) {
        const newPassword = await bcrypt.hash(password, 10);
        updatedUser.password = newPassword;
      } else {
        res.status(400).send({ message: "passwords must match" });
        return;
      }
    }
    try {
      const updatedInfo = await db.updateUser(updatedUser);
      res.json(updatedInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
];

exports.uploadProfileImage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    next(errors.array());
    return;
  }
  const { id } = req.params;
  const path =
    "http://localhost:8000/uploads/" + encodeURI(req.file.originalname);
  try {
    await db.updateProfileImage(path, id);
    res.json({ message: "image uploaded" });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = [
  validateProfile,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      next(errors.array());
      return;
    }

    const user = req.body;
    const { id } = req.user; //user id
    const age = calculateAge(user.dob);
    if (age > 110 || age < 12) {
      res
        .status(400)
        .json({ message: "Age must be less than 110 years and more than 12" });
      return;
    }
    try {
      const updatedInfo = await db.updateProfile(user, id);
      res.json(updatedInfo);
    } catch (error) {
      next(error);
    }
  },
];

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: {},
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
