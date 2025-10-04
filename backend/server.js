import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import cors from 'cors'
import ConnectDb from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import bookRoutes from './src/routes/bookRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import paymentRoutes from "./src/routes/paymentRoutes.js"
import cookieParser from 'cookie-parser'


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors({
     origin: "http://localhost:5173",
     credentials: true
}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// Routes
app.use("/uploads",express.static("uploads"))
app.use('/api', authRoutes)
app.use('/api', bookRoutes)
app.use('/api', orderRoutes)
app.use('/api', cartRoutes)
app.use('/api', paymentRoutes)



async function connection() {
    try {
        await ConnectDb()
        app.listen(port, () => {
    console.log("Server Running on http://localhost:5000")
})
    } catch (error) {
        console.log("Error Starting Application" , error)
        process.exit(1)
    }
} 

connection()





