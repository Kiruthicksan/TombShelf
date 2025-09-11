import mongoose from "mongoose";

const ConnectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Db connected : ${connect.connection.host}`)
    } catch (error) {
        console.log("Error connecting database", error.message)
        process.exit(1)
    }
  
};

export default ConnectDb
