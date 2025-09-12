import jwt from 'jsonwebtoken'

const genrateToken = (userId) => {
    return jwt.sign(
        {id : userId},
        process.env.SECRET,
        {expiresIn : '1d'}
    )
}

export default genrateToken