const { body } = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 and 10 characters";
const emptyErr = "field cannot be empty";
const passwordErr = "must contain letters and atleast 1 symbol and 1 number";
const validateName = (inputName, errDescription) => {
  return body(inputName)
    .trim()
    .notEmpty()
    .withMessage(`${errDescription} ${emptyErr}`)
    .isAlpha()
    .withMessage(`${errDescription} ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`${errDescription} ${lengthErr}`);
};

const validatePassword = (inputName, errDescription) => {
  return body(inputName)
    .trim()
    .notEmpty()
    .withMessage(`${errDescription} ${emptyErr}`)
    .isStrongPassword({
      minLength: 8,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage(`${errDescription} ${passwordErr}`);
};

const validateUsername = validateName("username", "User name")
const validateUserPassword = validatePassword("password", "Password")

validateUserLogin = () => {
  return {
    username: validateName("username", "User name"),
    password: validatePassword("password", "Password"),
  }
};

module.exports = {
  validateUsername, validateUserPassword
};
