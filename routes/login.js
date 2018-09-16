var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

app.post
(
    '/', (req, res) =>
    {
        var body = req.body;

        Usuario.findOne
        (
            { email: body.email }, (err, usario_db) => 
            {
                if (err)
                {
                    res.status(500).json
                    ({
                        ok: false,
                        message: 'Error al BUSCAR el usuarios...',
                        errors: err
                    });
                }

                if (!usario_db)
                {
                    return res.status(400).json
                    ({
                        ok: false,
                        message: 'Credenciales incorrectas: - Email.',
                        errors: err
                    });
                }

                if (!bcrypt.compareSync(body.password, usario_db.password))
                {
                    return res.status(400).json
                    ({
                        ok: false,
                        message: 'Credenciales incorrectas: - Password.',
                        errors: err
                    });
                }

                usario_db.password = ':)';
                var token = jwt.sign({ usuario: usario_db }, SEED, { expiresIn:  3600 });

                res.status(200).json
                ({
                    ok: true,
                    usuario: usario_db,
                    token: token,
                    id: usario_db._id
                });
            }
        );
    }
);

module.exports = app;