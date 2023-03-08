import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";

// packages
import morgan from "morgan";
import cookieParser from "cookie-parser";

// middlewares
import notFoundMiddleware from "../middleware/not-found";
import errorHandlerMiddleware from "../middleware/error-handler";

// routes
import authRouter from "../routes/authRoutes";

function createServer() {
  const app = express();

  if (process.env.NODE_ENV !== "dev") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(cookieParser(<string>process.env.JWT_SECRET));

  app.use("/api/v1/auth", authRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}

export default createServer;
