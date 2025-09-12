import jwt from 'jsonwebtoken'
import User from '../models/userSchema.js'

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token){
            return res.status(401).json({message : "Not Authorized. No token"})
        }

        const decoded = jwt.verify(token, process.env.SECRET)

        const user = await User.findById(decoded.id).select('-password')

        if (!user){
            return res.status(401).json({message : "Authorization Denied"})
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Auth middleware error", error)

        if (error.name === 'JsonWebTokenError'){
            return res.status(401).json({message : 'Not Authorized. Invalid Token'})
        }

        if (error.name === "TokenExpiredError"){
            return res.status(401).json({message : "Not Authorized. Token Expired"})
        }

        res.status(500).json({message : "Internal Server Error"})
    }
   
}

export default protect