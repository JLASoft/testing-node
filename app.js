var express = require('express');
var mongoose = require('mongoose');
var body_parser = require('body-parser');
var path = require('path');

var app = express();

const PORT = 6969;

// MIDDLEWARE DE BODY-PARSER
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// CARGAR RUTAS
var app_routes = require('./routes/app');
var app_usuario = require('./routes/usuario');
var app_login = require('./routes/login');

mongoose.set('useCreateIndex', true);
mongoose.connection.openUri
(
    'mongodb://localhost:27017/db_inmobiliaria', { useNewUrlParser: true }, (err, res) =>
    {
        if (err)
            throw err;
        else
            console.log('Mongo connected in port \x1b[33m 27017\x1b[0m: \x1b[32m%s\x1b[0m', 'Online');
    }
);

// CONFIGURAR CABECERAS Y CORS
app.use
(
    (req, res, next) =>
    {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    }
);

// RUTAS BASE
app.use(express.static(path.join(__dirname, 'public')));
app.use('/usuario', app_usuario);
app.use('/login', app_login);
app.use('/', app_routes);

app.listen
( 
    PORT, () => 
    {
        console.log('Server running in port \x1b[33m ' + PORT + '\x1b[0m: \x1b[32m%s\x1b[0m', 'Online');
    }
);