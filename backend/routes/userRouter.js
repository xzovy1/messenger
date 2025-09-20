const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");

// '/user'
userRouter.get("/profile", userController.getUser);

userRouter
  .route("/:id")
  .delete(userController.deleteUser)
  .put(userController.updateUser);

userRouter.put('/:id/profile', userController.updateProfile)

module.exports = userRouter;
