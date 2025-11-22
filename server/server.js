import express from 'express'
import 'dotenv/config'
import dataRoutes from "./routes/dataRoutes.js";
import cors from 'cors'
import connectionDB from './config/db.js';


connectionDB(); 

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/',dataRoutes);


app.listen(port,()=>{console.log(`Server running on Port: ${port}`)})
