var mongoose = require('mongoose');
var unique_validator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roles_validos =
{
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var UsuarioSchema = new Schema
({
    nombre:
    {
        type: String, 
        require: [true, 'El nombre es necesario'] 
    },
    email:
    {
        type: String, 
        unique: true, 
        required: [true, 'El correo es ncesario']
    },
    password:
    {
        type: String, 
        required: [true, 'El password es necesario']
    },
    img:
    {
        type: String, 
        required: false
    },
    role:
    {
        type: String, 
        required: true, 
        default: 'USER_ROLE', 
        enum: roles_validos
    }
});

UsuarioSchema.plugin(unique_validator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model('Usuario', UsuarioSchema);