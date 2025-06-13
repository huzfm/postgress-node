import { Router } from "express";
const userController = require("../controllers/userController");

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.addUser);
router.delete("/:id", userController.delete);
router.patch("/:id", userController.edit);

export default router;
