import dotenv from "dotenv";
dotenv.config();
import express from "express";
import PublicsRoutes from "./routes/public.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use("/", PublicsRoutes);
app.use(express.json());

const port = 3000;

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
