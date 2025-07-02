import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connsctionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected ! DB host : ${connsctionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error ", error);
        process.exit(1)
    }
}

export default connectDB

