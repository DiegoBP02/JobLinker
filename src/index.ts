import createServer from "./utils/createServer";
import connectDB from "./db/connect";

const app = createServer();

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
