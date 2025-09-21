const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: 'public/images/' })

// '/user'
userRouter.get("/profile", userController.getUser);

userRouter
  .route("/:id")
  .delete(userController.deleteUser)
  .put(userController.updateUser);

userRouter.put('/:id/profile', userController.updateProfile)

userRouter.post('/:id/image', upload.single('image'), userController.uploadProfileImage)

module.exports = userRouter;
