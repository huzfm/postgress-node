import { Router } from "express";
const userController = require("../controllers/userController");

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.delete("/delte/:id", userController.delete);
router.patch("/update/:id", userController.edit);

export default router;
