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
        //verify will synchronously verify given token using jwt secret
        const data = jwt.verify(token, JWT_SECRET)
        console.log ('DATA ',data)

        //modifying request object, by adding data attribute and assigning user to it 
        req.user = data.user
        //next() means next function will be called after this
        next()

    } catch (error) {
        res.status (401).send('Authenticate using valid token')
    } 
}

module.exports = fetchuser;