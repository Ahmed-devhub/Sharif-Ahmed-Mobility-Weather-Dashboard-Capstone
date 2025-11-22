import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

async function connectionDB(){
    try{
        const connectionString = process.env.MONGO_URL
        await mongoose.connect(connectionString)
        console.log("Successfully, Connected to MongoDB")
    }
    catch(e){
        console.error("MongoDB Connection Error: ", e.message)
    }
    }

export default connectionDB
