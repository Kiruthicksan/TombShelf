import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT



app.listen(port, () => {
    console.log("Server Running on http://localhost:5000")
})


