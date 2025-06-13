"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("./../node_modules/@prisma/client");
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client.users.findMany();
    res.json({
        users,
    });
}));
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield client.users.findFirst({
        where: {
            id: Number(id),
        },
        select: {
            todos: true,
            username: true,
            password: true,
        },
    });
    res.json({
        user,
    });
}));
app.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield client.users.create({ data: { username, password } });
    res.json({
        user,
    });
}));
app.listen(3000, () => {
    console.log("App running on port 3000");
});
// async function createUser() {
//   await client.users.create({
//     data: {
//       username: "huzfm",
//       password: "123",
//     },
//   });
// }
// const findUser = async () => {
//   const user = await client.users.findFirst({
//     where: { id: 1 },
//     include: {
//       todos: true,
//     },
//   });
//   console.log(user);
// };
// createUser();
// findUser();
