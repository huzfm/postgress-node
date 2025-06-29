import { Router } from "express";
import { ratelimiter } from "./../middlewares/rateLimiter";
const todoController = require("./../controllers/todoController");

const router = Router();

router.get("/", ratelimiter, todoController.getAllTodos);
router.get("/:id", todoController.getTodo);
router.post("/", todoController.addTodo);
router.patch("/:id", todoController.editTodo);
router.delete("/:id", todoController.deleteTodo);

export default router;
