import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      //   useUnifiedTopology: true,
      //   useNewUrlParser: true,
    });

    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error occurred during DB connection: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
