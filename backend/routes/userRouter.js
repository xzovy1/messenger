const { Router } = require('express')
const userRouter = Router();
const userController = require('../controllers/userController')


userRouter.get("/profile", userController.getUser);

userRouter.post("/", userController.createUser);
userRouter.delete("/", userController.deleteUser);
userRouter.put("/", userController.updateUser);

module.exports = userRouter;