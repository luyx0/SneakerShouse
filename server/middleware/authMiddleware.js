const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1] //bearer sadasdadsadsad
        if (!token){
            return res.status(481).json({message: "Not auth"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()

    }catch (e){
        res.status(481).json({message: "Not auth"})
    }
}
