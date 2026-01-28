import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: "majority",
      });
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB Error (Attempt ${retries}/${maxRetries}):`, error.message);

      if (retries < maxRetries) {
        console.log(`⏳ Retrying in 3 seconds...`);
        setTimeout(connect, 3000);
      } else {
        console.error("❌ Failed to connect to MongoDB after 5 attempts");
        process.exit(1);
      }
    }
  };

  await connect();
};

export default connectDB;
