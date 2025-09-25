const { body } = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 and 10 characters";
const emptyErr = "field cannot be empty";
const passwordErr = "must contain atleast 8 characters, 1 uppercase, 1 lowercase,1 symbol and 1 number";

const validateUser = {
  username: (inputName, errDescription) => {
    return body(inputName)
      .trim()
      .notEmpty()
      .withMessage(`${errDescription} ${emptyErr}`)
      .isLength({ min: 4, max: 15 })
      .withMessage("Username must be between 4 and 15 characters")
  },
  password: (inputName, errDescription) => {
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

}



const validateLoginUsername = validateUser.username("username", "Username")
const validateLoginPassword = validateUser.password("password", "Password")


module.exports = {
  validateLoginUsername, validateLoginPassword
};
