
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly : true,
        secure : process.env.Node_ENV === 'production',
        sameSite : 'strict' ,
        maxAge : 24 * 60 * 60 * 1000
    })
}

export default setAuthCookie