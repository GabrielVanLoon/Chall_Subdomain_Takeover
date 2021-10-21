require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

// Auth Functions
const jwt = require('jsonwebtoken');
const jwt_secret = require('crypto').randomBytes(64).toString('hex')
const cookieConfigs = { maxAge: 600000, httpOnly: true, secure: false }


function generateAccessToken(userObject) {
    return jwt.sign(userObject, jwt_secret, { expiresIn: '600s' });
}

function authToken(req, res, next) { 
    const token = req.cookies?.auth

    if(!token)
        return res.sendStatus(401)
    
    try {
        req.user = jwt.verify(token, jwt_secret)
        next()
    } catch(err) {
        console.error(`Error on jwt auth: ${err}`)
        return res.sendStatus(401)
    }
}

// Starting Express and Midlewares
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use(express.static('public'));

// Setting engine view
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/validate', authToken, function(req, res) {
    return res.send(`Welcome ${req.user.username}!`)
})

app.get('/login', function(req, res) {
    return res.render('login');
})

app.post('/login', function(req, res) { 
    const username = req.body?.username
    const password = req.body?.password

    if(!username || !password)
        return res.redirect('/login?err=Username+and+Password+Required')

    if(username.length < 3 || username.length > 20)
        return res.redirect('/login?err=Username+invalid')

    res.cookie('auth', generateAccessToken({ username }), cookieConfigs)
    return res.redirect('/my-profile')
})

app.get('/logout', function(req, res) { 
    res.cookie('auth', '', { ...cookieConfigs, maxAge: 0 })
    return res.redirect('/login')
})

app.get('/my-profile', function(req, res){
    return res.render('edit-page');
})



// Starting Express Server
app.listen(process.env.SERVER_PORT || 3333, '0.0.0.0');