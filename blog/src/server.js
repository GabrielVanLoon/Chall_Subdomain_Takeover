const express = require('express')
const cookieParser = require('cookie-parser')
const { config } = require('./config')
const visiter = require('./visiter');

// Starting Express and Midlewares
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.static('public'));

// Setting engine view
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(function(req, res, next){
    if(req.cookies.flag === undefined)
        res.cookie('flag', 'Ganesh{You_4re_N0t_Th3_4dmiN_baka}', 
            { domain: config.SERVER_BLOG_HOSTNAME, samesite: 'lax', httpOnly: false, secure: false })
    next()
})

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
    const validHostnames =  config.SERVER_BLOG_SUBDOMAINS.map((sub) => `http://${sub ? `${sub}.` : ''}${config.SERVER_BLOG_HOSTNAME}`)
    
    // Allow admin to visit only domains and subdomains listed above
    if(typeof(targetUrl) !== "string"){
        return res.status(400).json({'message': 'Erro: Envie uma URL para o administrador >:('})
    } else if (targetUrl.indexOf('@') !== -1 ){
        return res.status(400).json({'message': 'Erro: Nada de gracinhas com o caracter @ >:('})
    } else if(!validHostnames.some((origin) => targetUrl.startsWith(origin))) {
        return res.status(400).json({'message': 'Erro: Reporte erros apenas de páginas do blog >:('})
    }

    await visiter.visit(targetUrl);
    return res.json({'message': 'Link enviado ao administrador!'})
})

// Starting Express Server
app.listen(config.SERVER_PORT, '0.0.0.0');