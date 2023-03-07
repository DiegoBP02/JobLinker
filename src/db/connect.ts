import mongoose from "mongoose";

const connect = async () => {
  const dbURI = <string>process.env.MONGO_URI;

  try {
    await mongoose.connect(dbURI);
    console.log("DB connected!");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to DB!");
  }
};

export default connect;
