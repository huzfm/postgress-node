"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const boxen = require("boxen");
const figlet = require("figlet");
const chalk = require("chalk");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/users", userRoutes_1.default);
app.use("/todos", todoRoutes_1.default);
// app.listen(PORT, () => {
//   const msg = figlet.textSync("Server is up and working", {
//     font: "Standard",
//     horizontalLayout: "default",
//   });
//   const boxed = boxen(msg, {
//     padding: 1,
//     margin: 1,
//     borderColor: "cyan", // Try other colors like 'magenta', 'green', etc.
//     borderStyle: "double", // 'single', 'double', 'round', 'bold', 'classic'
//     backgroundColor: "black", // Any Chalk-compatible color
//     align: "center", // 'left' (default), 'center', or 'right'
//     dimBorder: true, // Makes border a bit muted
//     title: "My Prisma API", // Title on the top border
//     titleAlignment: "center", // 'left' | 'center' | 'right'
//   });
//   console.log(boxed);
//   console.log(
//     chalk.green.bold(`🚀 Server is live on http://localhost:${PORT}`)
//   );
// });
app.listen(PORT, () => {
    console.log(`Server ruuning on ${PORT}`);
});
