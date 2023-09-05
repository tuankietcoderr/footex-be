import mongoose from "mongoose";

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  try {
    await mongoose.connect(
      isProduction
        ? (process.env.MONGODB_URI_PROD as string)
        : (process.env.MONGODB_URI_DEV as string),
      {
        autoIndex: true,
      }
    );
    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export { connectDB };
