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
import jobRouter from "../routes/jobRoutes";
import applicationRouter from "../routes/applicationRoutes";
import interviewRouter from "../routes/interviewRoutes";
import reviewRouter from "../routes/reviewRoutes";

function createServer() {
  const app = express();

  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(cookieParser(<string>process.env.JWT_SECRET));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/application", applicationRouter);
  app.use("/api/v1/interview", interviewRouter);
  app.use("/api/v1/review", reviewRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}

export default createServer;
