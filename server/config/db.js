import mongoose from 'mongoose'
import 'dotenv'

dotenv.config()

function connection(){

const connectionString = process.env.MONGO_URL
const connection = mongoose.connect(connectionString)
                    .then (()=>{
                        console.log("Successfully, Connected to MongoDB")
                    }).catch(e)(()=>{
                        console.log("MongoDB Connection Error: ", e)
                    })
}

export default connection
