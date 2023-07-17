const express = require('express')
const {body, validationResult } = require ('express-validator')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')

const router = express.Router()
const User = require ('../models/User')
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = 'secretisgoodsoletshavesecret'


//ROUTE 1 
//create a user using: POST "/api/auth/createuser". No login required 
router.post ('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({min: 5}),
],  async (req, res) => {
        //if errors, return Bad request and errors 
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            /*check if user with same email exists*/
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json(req.body)
            }
            /*default will be 10 even if you do not give number of round*/
            /*METHOD=> without using await*/
            /*let secPass
            let rounds = 10
            bcrypt.genSalt(rounds, (err,salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    secPass = hash
                    console.log ('secPass ',secPass)
                    console.log ('req.body.name ',req.body.name)
                    user = User.create({
                        name: req.body.name,
                        password: secPass,
                        email: req.body.email,
                    })
                    res.json(user)
                })
            })*/

            /*bcrypt.genSalt and bcrypt.hash returns a promise*/
            /*METHOD => using await async*/
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            /*create new user based on User schema*/
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            })

            //creating token to send to it to user after he logs in
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)//sign is synchronous function
            console.log ('DATA ',authToken)
            res.json({authToken})
            
        } catch (error) {
            console.error (error.message)
            res.status(500).send('Bad Request')
        }
        
        
        // user = await res.json(user)
        // .catch (err => {
        //     console.log (err) 
        //     res.json({error: 'Please enter unique value for email', msg: err.message})
        //     }
        // )
    }
)



//ROUTE 2
//authenticate a user using: POST "/api/auth/login". No login required 
router.post('/login',[ 
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req)
    //is any of the above conditions is not true, throw error 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {email, password} = req.body
    try {
        let user = await User.findOne({ email })
        /*if email is not found*/
        if (!user) {
            return res.status(400).json({ error: "try to login with correct credentials" })
        }

        //if user exists with that email
        const passCompare = await bcrypt.compare(password, user.password)
        if (!passCompare) {
            return res.status(400).json({ error: "try to login with correct credentials" })
        }
        //creating token to send to it to user after he logs in
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)//sign is synchronous function, so no need of await
        res.json({authToken})

    } catch (error) {
        console.log (error.message)
        res.status(500).send('Bad Request')
    }
    
})



//ROUTE 3
//get logged in user details using: POST "/api/auth/getuser". login required 
//fetchuser is a middleware
router.post('/getuser', fetchuser, async (req, res) => {
    let userId = req.user.id
    try {
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Bad Request')
    }
})

module.exports = router

