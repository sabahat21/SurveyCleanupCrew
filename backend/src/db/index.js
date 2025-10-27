import mongoose from "mongoose";
//import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {

    const uri = process.env.MONGODB_URI;          
    const dbName = process.env.DB_NAME || "GameShow"; 
    const connectionInstance = await mongoose.connect(`${uri}/${dbName}`);


    //const connectionInstance = await mongoose.connect(
      //`${process.env.MONGODB_URI}/${DB_NAME}`
    //);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection FAILED !!:", error);
    process.exit(1);
  }
};

export default connectDB;
