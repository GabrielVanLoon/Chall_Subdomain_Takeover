const express = require('express')
const cookieParser = require('cookie-parser')
const { config } = require('./config')

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
        return res.redirect('/login')
    
    try {
        req.user = jwt.verify(token, jwt_secret)
        next()
    } catch(err) {
        console.error(`Error on jwt auth: ${err}`)
        return res.redirect('/login')
    }
}

// Database configurations
const { db } = require('./db')

// Starting Express and Midlewares
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use(express.static('public'));

// Setting engine view
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware to custom domains
app.use(function(req, res, next){
    // Obs: hostname pega o valor do header Host ignorando a porta :)
    if(req.hostname !== config.SERVER_MYPROFILE_HOSTNAME){
        db.get('SELECT content FROM users WHERE domain=?;', [req.hostname], (err, row) => {
            if(err || row === undefined) {
                return res.status(404).render('404')
            }
            return res.render('profile', { content: row.content });
        })
    } else {
        next()
    }
})

app.get('/login', function(req, res) {
    return res.render('login');
})

app.post('/login', function(req, res) { 
    const username = req.body?.username
    const password = req.body?.password

    if(!username || !password)
        return res.redirect('/login?err=Username+and+Password+Required')

    if(username.length < 3 || username.length > 20 || !username.match(/^[a-zA-Z0-9]{3,20}$/))
        return res.redirect('/login?err=Username+invalid')

    db.get('SELECT username, password FROM users WHERE username=?;', [username], (err, row) => {
        if(err) {
            console.error(`Login SELECT Error ${err}`);
            return res.redirect('/login?err=Unexpected+Error+lol')
        }

        // Register new user
        if(row === undefined){
            db.run("INSERT INTO users VALUES (?,?,'','')", [username,password], (err) => { 
                if(err) {
                    console.error(`Login INSERT Error ${err}`);
                    return res.redirect('/login?err=Unexpected+Error+lol')
                }    
                res.cookie('auth', generateAccessToken({ username }), cookieConfigs)
                return res.redirect('/my-profile')
            });
        
        // Invalid Password
        } else if(password !== row.password) {
            return res.redirect('/login?err=Username+or+Password+invalid')
        
        // User and password correct :)
        } else {
            res.cookie('auth', generateAccessToken({ username }), cookieConfigs)
            return res.redirect('/my-profile')
        }
    })
})

app.get('/logout', function(req, res) { 
    res.cookie('auth', '', { ...cookieConfigs, maxAge: 0 })
    return res.redirect('/login')
})

app.get('/my-profile',  authToken, function(req, res){
    db.get('SELECT username, domain, content FROM users WHERE username=?;', [req.user.username], (err, row) => {
        if(err) {
            console.error(`My-profile SELECT Error ${err}`);
            return res.redirect('/login?err=Unexpected+Error+lol')
        }
        return res.render('edit-page', { username: req.user.username, domain: row.domain, content: row.content });
    })
})

app.post('/my-profile',  authToken, function(req, res){
    const domain = req.body?.domain || ""
    const content = req.body?.content || ""

    if(content !== undefined && typeof(content) !== "string")
        return res.redirect('/my-profile?err=Invalid+content+type!')
    else if(content !== undefined && content.length > 3000)
        return res.redirect('/my-profile?err=Content+max+length+is+3000+chars')

    db.run('UPDATE users SET domain=?, content=? WHERE username=?;', [domain, content, req.user.username], (err, row) => {
        if(err) {
            console.error(`My-profile UPDATE Error ${err}`);
            return res.redirect('/my-profile?err=Error+on+update')
        }
        return res.redirect('/my-profile')
    })
})

app.get('/view/:username', function(req, res){
    const username = req.params.username
    db.get('SELECT domain, content FROM users WHERE username=?;', [username], (err, row) => {
        if(err || row === undefined) {
            return res.status(404).render('404')
        }
        return res.render('profile', { domain: row.domain, content: row.content });
    })
})

app.get('/vanloon', function(req, res){
    return res.render('author_van');
})

app.use(function(req, res){
    return res.status(404).render('404')
})

// Starting Express Server
app.listen(config.SERVER_PORT, '0.0.0.0');

// Autokill timeout :c
setTimeout(function(){ process.exit(0) }, 10*60*1000)