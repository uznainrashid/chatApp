import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const MongoURI = process.env.MONGODB_URL
        await mongoose.connect(MongoURI)
        console.log("Mongodb Connected successfully");   
    } catch (error) {
        console.log("Connection failed to mongodb", error);
        
    }
}
export default connectDB