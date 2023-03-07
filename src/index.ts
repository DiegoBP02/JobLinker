import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import morgan from "morgan";

// middlewares
import notFoundMiddleware from "./middleware/not-found";
import errorHandlerMiddleware from "./middleware/error-handler";

// routes
import authRouter from "./routes/authRoutes";

const app = express();

import connectDB from "./db/connect";

if (process.env.NODE_ENV !== "dev") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
    await connectDB();
  } catch (error) {
    console.log(error);
  }
};

start();
