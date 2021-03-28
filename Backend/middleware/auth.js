const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const header = req.header("Authorization")
    const bearer = header.split(" ")
    const token = bearer[1]
    if (!token) return res.status(401).json({ msg: "No token, auth failed" })
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = decoded.userId
        next()
      } catch(error) {
        res.status(401).json({
          msg: "Token not valid"
        })
      }
}

module.exports = { verifyToken }