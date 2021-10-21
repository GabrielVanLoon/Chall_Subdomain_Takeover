require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')

const visiter = require('./visiter');

// Starting Express and Midlewares
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.static('public'));

// Setting engine view
app.set('view engine', 'ejs');
app.set('views', './views');

// XSS Vulnerable Route 
app.get('/blog/diario-viajante-ep7', function(req, res) { 

    const nome = (req.query.nome) ? req.query.nome : ""
    const comentario = (req.query.comentario) ? req.query.comentario : ""
  
    return res.render('blog-post', {nome, comentario})
})

app.get('/', function(req, res) { 
    return res.render('index');
})

// Ask Admin to visit the url
app.post('/visit', async function(req, res) { 

    const targetUrl = req.body.target 
    const baseHostname = process.env.SERVER_HOST || 'localhost:3333/'
    const serverOrigin =  ['', 'vanloon', 'van', 'loon', 'charles', 'charlesmelara'].map((sub) => `http://${sub ? `${sub}.` : ''}${baseHostname}`)
    
    // Allow admin to visit only domains and subdomains listed above
    if(!targetUrl || !serverOrigin.some((origin) => targetUrl.startsWith(origin)) ){
        return res.status(400).json({'message': 'Hostname inválido!!'})
    }

    await visiter.visit(targetUrl);

    return res.json({'message': 'Link enviado ao administrador!'})
})

// Starting Express Server
app.listen(process.env.SERVER_PORT || 3333, '0.0.0.0');