import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
const swaggerUi = require("swagger-ui-express");
import swaggerSpec from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "UP", message: "Banking service is running!!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
