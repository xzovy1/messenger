const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");

// '/user'
userRouter.get("/profile", userController.getUser);

userRouter
  .route("/")
  .post(userController.createUser)
  .delete(userController.deleteUser)
  .put(userController.updateUser);

module.exports = userRouter;
