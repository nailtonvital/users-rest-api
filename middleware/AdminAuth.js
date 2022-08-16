const jwt = require("jsonwebtoken")
var secret = "Google API Client Library for JavaScript"

module.exports = (req, res, next)=>{
    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        var token = bearer[1]

        try {
            var decoded = jwt.verify(token, secret)

            if(decoded.role ==1){
                next()
            } else{
                res.status(403).json("not authorized")
                return
            }
        } catch (error) {
            res.status(403).json(error.message)
            return
        }
        

        console.log(decoded)
        next()
    } else{
        res.status(403).json("not auth")
    }
}