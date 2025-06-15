import { Router } from "express";
const userController = require("../controllers/userController");
import { authenticate } from "../middlewares/protect";

const router = Router();

router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.delete("/delte/:id", userController.delete);
router.patch("/update/:id", userController.edit);

export default router;
