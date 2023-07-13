const jwt = require('jsonwebtoken')

//jwt secret 
//TODO: add in env file
const JWT_SECRET = 'secretisgoodsoletshavesecret'

const fetchuser = (req, res, next) => {
    const token = req.header ('auth-token')
    if (!token) {
        res.status(401).send ('Authenticate using valid token')
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        console.log ('DATA ',data)
        req.user = data.user
        //next() means next function will be called after this
        next()

        
    } catch (error) {
        res.status (401).send('Authenticate using valid token')
    } 
}

module.exports = fetchuser;