import { Router } from "express";
import multer from 'multer';
import { UserController } from "../controllers/user.controllers.js";
export const userRoutes = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
        cb(null, 'images/'); // Directorio donde se guardarán las imágenes
    },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Nombre original del archivo
  }
});

const upload = multer({ storage: storage });

userRoutes.post("/login", UserController.authenticateUser);
userRoutes.post("/register", UserController.createUser);

userRoutes.get("/test", UserController.authenticate, (req, res) => {
  res.status(200).json({
    message: "Autenticación correcta"
  });
});

userRoutes.use(UserController.authenticate);

userRoutes.post('/project', upload.single('imageProject'), UserController.submitProject)

