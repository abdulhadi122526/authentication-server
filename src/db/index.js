import mongoose from "mongoose";

const connecrDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}user`
    );
    console.log(`\n mongo db connected`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connecrDB;