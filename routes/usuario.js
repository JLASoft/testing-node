var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var autenticacion = require('../middlewares/autenticacion');

// OBTENER TODOS LOS USUARIOS
app.get
(
    '/', (req, res, next) =>
    {
        Usuario
            .find({ }, 'nombre email img role')
            .exec
            (
                (err, usuarios) =>
                {
                    if (err)
                    {
                        res.status(500).json
                        ({
                            ok: false,
                            message: 'Error al intenter CARGAR los usuarios...',
                            errors: err
                        });
                    }

                    res.status(200).json
                    ({
                        ok: true,
                        usuarios: usuarios
                    });
                }
            );
    }
);

// ACTUALIZAR USUARIO
app.put
(
    '/:id', autenticacion.VerificaToken, (req, res) =>
    {
        var id = req.params.id;
        var body = req.body;

        Usuario.findById
        (
            id, (err, usuario) =>
            {
                if (err)
                {
                    return res.status(500).json
                    ({
                        ok: false,
                        message: 'Error al buscar usuario...',
                        errors: err
                    });
                }

                if (!usuario)
                {
                    return res.status(400).json
                    ({
                        ok: false,
                        message: 'El usuario con el id: ' + id + ' no existe.',
                        errors: { message: 'No existe un usuario con ese ID' }
                    });
                }

                usuario.nombre = body.nombre;
                usuario.email = body.email;
                usuario.role = body.role;

                usuario.save
                (
                    (err, usuario_save) =>
                    {
                        if (err)
                        {
                            res.status(400).json
                            ({
                                ok: false,
                                message: 'Error al intenter ACTUALIZAR los usuarios...',
                                errors: err
                            });
                        }

                        usuario_save.password = ':)';

                        res.status(200).json
                        ({
                            ok: true,
                            usuario: usuario_save
                        });
                    }
                );
            }
        );
    }
);

// CREAR USUARIOS
app.post
(
    '/', autenticacion.VerificaToken, (req, res) => 
    {
        var body = req.body;
        var usuario = new Usuario
        ({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            nombre: body.nombre,
            img: body.img,
            role: body.role
        });

        usuario.save
        (
            (err, usuario_save) =>
            {
                if (err)
                {
                    res.status(400).json
                    ({
                        ok: false,
                        message: 'Error al intenter CREAR los usuarios...',
                        errors: err
                    });
                }

                res.status(201).json
                ({
                    ok: true,
                    usuario: usuario_save
                });
            }
        );
    }
);

// ELIMINAR USUARIO
app.delete
(
    '/:id', autenticacion.VerificaToken, (req, res) =>
    {
        var id = req.params.id;

        Usuario.findByIdAndRemove
        (
            id, (err, usuario_delete) =>
            {
                if (err)
                {
                    res.status(500).json
                    ({
                        ok: false,
                        message: 'Error al BORRAR el usuarios...',
                        errors: err
                    });
                }

                if (!usuario_delete)
                {
                    return res.status(400).json
                    ({
                        ok: false,
                        message: 'El usuario con el id: ' + id + ' no existe.',
                        errors: { message: 'No existe un usuario con ese ID' }
                    });
                }

                res.status(200).json
                ({
                    ok: true,
                    usuario: usuario_delete
                });
            }
        );
    }
);

module.exports = app;