import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import ConnectDb from './src/config/db.js'
dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))



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





