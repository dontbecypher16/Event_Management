const jwt = require('jsonwebtoken')
const secret = "verySecureSecret"


exports.authenticateUser = ( req, res, next) => {
    // check if there is an authorize token
    if(!req.headers.authorization){
        return res.status(401).json({ message: "authorization header required" })
    }
    let splittedHeader = req.headers.authorization.split(' ')
    if(splittedHeader[0] !== "Bearer"){
        return res.status(401).json({ message: "authorization format is Bearer <token>"})
    }
    let token = splittedHeader[1]
    // decode token
    jwt.verify(token, secret, (err, decodedToken) => {
        if(err){
            console.log({err})
            return res.status(500).json({ err })
        
        } // check if valid
        if(!decodedToken){
            return res.status(401).json({ message: "invalid authorization token. please login"})
        }
        // allow user to continue request
        req.user = decodedToken
        return next()
        


    })

}


exports.checkIfAdmin = (req, res, next) => {
    console.log(req.user)
    if(req.user.role !== "admin"){
        return res.status(401).json({ message: "this route is restricted to admin users"})
    }
    return next()
}