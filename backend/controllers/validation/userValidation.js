const { body } = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 and 10 characters";
const emptyErr = "field cannot be empty";
const passwordErr =
  "must contain atleast 8 characters, 1 uppercase, 1 lowercase and 1 number";

const validateUser = {
  username: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .notEmpty()
      .withMessage(`${errDescription} ${emptyErr}`)
      .isLength({ min: 4, max: 15 })
      .withMessage("Username must be between 4 and 15 characters");
  },
  password: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .notEmpty()
      .withMessage(`${errDescription} ${emptyErr}`)
      .isStrongPassword({
        minLength: 8,
        minSymbols: 0,
        minNumbers: 1,
      })
      .withMessage(`${errDescription} ${passwordErr}`);
  },
  name: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .notEmpty()
      .withMessage(`${errDescription} ${emptyErr}`)
      .isAlpha()
      .withMessage(`${errDescription} ${alphaErr}`)
      .isLength({ min: 1, max: 10 })
      .withMessage(`${errDescription} ${lengthErr}`);
  },
  dob: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .notEmpty()
      .withMessage("Birth date is required")
      .isISO8601()
      .withMessage("must be in the format YYYY-MM-DD")
      .isDate();
  },
  bio: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .isLength({ max: 250 })
      .withMessage("Bio cannot exceed 250 characters");
  },
};
//login
const validateLoginUsername = body("username")
  .trim()
  .notEmpty()
  .withMessage(emptyErr);
const validateLoginPassword = validateUser.password("password", "Password");

//signup
const validateSignup = {
  username: validateLoginUsername,
  password: validateLoginPassword,
  passwordConfirm: validateUser.password(
    "password-confirm",
    "Password Confirm",
  ),
  firstName: validateUser.name("firstname", "First name"),
  lastName: validateUser.name("lastname", "Last name"),
  dob: validateUser.dob("dob", "Birthday"),
  bio: validateUser.bio("bio", "About"),
};

module.exports = {
  validateLoginUsername,
  validateLoginPassword,
  validateSignup,
};
