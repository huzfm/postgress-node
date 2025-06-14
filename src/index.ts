import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import todoRoutes from "./routes/todoRoutes";

const boxen = require("boxen");
const figlet = require("figlet");
const chalk = require("chalk");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  const msg = figlet.textSync("Server is up and working", {
    font: "Standard",
    horizontalLayout: "default",
  });
  const boxed = boxen(msg, {
    padding: 1,
    margin: 1,
    borderColor: "cyan", // Try other colors like 'magenta', 'green', etc.
    borderStyle: "double", // 'single', 'double', 'round', 'bold', 'classic'
    backgroundColor: "black", // Any Chalk-compatible color
    align: "center", // 'left' (default), 'center', or 'right'
    dimBorder: true, // Makes border a bit muted
    title: "My Prisma API", // Title on the top border
    titleAlignment: "center", // 'left' | 'center' | 'right'
  });

  console.log(boxed);
  console.log(
    chalk.green.bold(`🚀 Server is live on http://localhost:${PORT}`)
  );
});
