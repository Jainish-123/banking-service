import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "UP", message: "Banking service is running!!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
