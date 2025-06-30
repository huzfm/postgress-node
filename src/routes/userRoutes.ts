import { Router } from "express";
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
import { ratelimiter } from "../middlewares/rateLimiter";
import { validateApiKey } from "../middlewares/validateApiKey";

const router = Router();

router.get("/", validateApiKey, userController.getAllUsers);
router.get("/apikey", authController.generateApiKey);
router.get("/:id", userController.getUser);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.delete("/delte/:id", userController.delete);
router.patch("/update/:id", userController.edit);

export default router;
