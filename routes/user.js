const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');

user.post('/login', async (req, res, next)=>{
    const {user_mail, user_password} = req.body;
    let query = `SELECT * FROM empleados WHERE correoElectronico = '${user_mail}' ` 
    query +=`AND contrasena = '${user_password}' AND admin = 1;`;
    const  rows = await db.query(query);
    console.log(rows);
    
    if(user_mail && user_password){
        if(rows.length == 1){
            const token = jwt.sign({
                pk_empleado : rows[0].pk_empleado,
                nombre: rows[0].nombre,
                apellidos: rows[0].apellidos,
                admin: rows[0].admin,
            }, "debugkey")
            return res.status(200).json({code: 200, message: token});
        }else{
            return res.status(200).json({code: 401, message: "Usuario y/o Contraseña Incorrectos"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

user.get('/', async (req, res, next)=>{
    return res.status(200).json({ code: 0, message: "Ingrese al login para iniciar sesión"});
});

module.exports = user;