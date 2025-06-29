import { Router } from "express";
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
import { authenticate } from "../middlewares/protect";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.delete("/delte/:id", userController.delete);
router.patch("/update/:id", userController.edit);

export default router;
