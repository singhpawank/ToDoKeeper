
import mongoose from "mongoose";

const connectDB = async (DATABASE_URI, options) => {
    try {
        await mongoose.connect(DATABASE_URI, options);
        console.log(`Database connected successfully...`);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

export default connectDB;