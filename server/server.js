import express from 'express'
import 'dotenv/config'
import dataRoutes from "./routes/dataRoutes.js"
import authRoutes from './routes/authRoutes.js'
import searchHistoryRoutes from './routes/searchHistoryRoutes.js'
import compareRoutes from './routes/compareRoutes.js'
import cors from 'cors'
import connectionDB from './config/db.js';


connectionDB(); 

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/',dataRoutes);
app.use('/api/',authRoutes);
app.use('/api/',searchHistoryRoutes);
app.use("/api", compareRoutes);

app.listen(port,()=>{console.log(`Server running on Port: ${port}`)})
