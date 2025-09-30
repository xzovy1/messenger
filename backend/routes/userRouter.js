const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, file.originalname)
})

const upload = multer({ storage })

// '/api/user'
userRouter.get("/profile", userController.getUser);

userRouter
  .route("/:id")
  .delete(userController.deleteUser)
  // .get(userController.getUser)
  .put(userController.updateUser);

userRouter.put('/:id/profile', userController.updateProfile)

userRouter.post('/:id/image', upload.single('image'), userController.uploadProfileImage)

module.exports = userRouter;
