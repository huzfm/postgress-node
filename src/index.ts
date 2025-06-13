import express from "express";
const app = express();
import userRoutes from "./routes/userRoutes";

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
