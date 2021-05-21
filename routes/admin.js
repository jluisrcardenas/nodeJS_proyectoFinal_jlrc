const express = require('express');
const admin = express.Router();
const db = require('../config/database');

admin.get('/getuser/:correoElectronico', async (req, res, next)=>{
    const us = await db.query("SELECT * FROM empleados");
    const correoElectronico = req.params.correoElectronico;
    const usr = us.filter((p)=>{
        return (p.correoElectronico.toUpperCase() == correoElectronico.toUpperCase()) && p;
    });
    (usr.length > 0) ? 
        res.status(200).json({code: 200, message: usr}) : 
        res.status(404).json({code: 404, message: "Usuario no encontrado"});
});

admin.post('/addUser', async (req, res, next)=>{
    const {nombre, apellidos, telefono, correoElectronico, direccion} = req.body;
    console.log(req.body);
    if(nombre && apellidos && correoElectronico){
        let query = "INSERT INTO empleados(nombre, apellidos, telefono, correoElectronico, direccion)";
        query +=  ` VALUES ('${nombre}','${apellidos}','${telefono}','${correoElectronico}','${direccion}');`;
        const  rows = await db.query(query);
        console.log(rows);
        if(rows.affectedRows==1){
            return res.status(201).json({code: 201, message: "Usuario insertado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }
    return res.status(505).json({code: 505, message: "Campos incompletos"});
});

admin.delete('/:id', async (req, res, next)=>{
    let query = `DELETE FROM empleados WHERE pk_empleado = ${req.params.id}`;
    const  rows = await db.query(query);
    if(rows.affectedRows==1){
        return res.status(200).json({code: 200, message: "Usuario borrado correctamente"});
    }
    return res.status(404).json({code: 404, message: "Usuario no encontrado"});
});

admin.put('/saveUser', async (req, res, next)=>{
    const {pk_empleado,nombre, apellidos, telefono, correoElectronico, direccion} = req.body;
    console.log(req.body);
    if(pk_empleado && nombre && apellidos && correoElectronico){
        let query = `UPDATE empleados SET nombre='${nombre}',apellidos='${apellidos}',telefono='${telefono}',`;
        query +=  `direccion='${direccion}' WHERE pk_empleado=${pk_empleado}`;
        const  rows = await db.query(query);
        if(rows.affectedRows==1){
            return res.status(200).json({code: 200, message: "Usuario modificado correctamente"});
        }
        return res.status(404).json({code: 404, message: "Usuario no encontrado"});
    }
    return res.status(500).json({code: 500, message: "Ocurrio un error"});
});

admin.get('/correoElectronico/:correoElectronico', async (req, res, next)=>{
    const us = await db.query("SELECT * FROM empleados");
    const correoElectronico = req.params.correoElectronico;
    const usr = us.filter((p)=>{
        return (p.correoElectronico.toUpperCase() == correoElectronico.toUpperCase()) && p;
    });
    (usr.length > 0) ? 
        res.status(200).json({code: 200, message: usr}) : 
        res.status(404).json({code: 404, message: "Usuario no encontrado"});
});


admin.get('/nombreSearch/:nombre', async (req, res, next)=>{
    const nombre = req.params.nombre;
    const us = await db.query("SELECT * FROM empleados");
    const usr = us.filter((p)=>{
        return (p.nombre.toUpperCase() == nombre.toUpperCase()) && p;
    });
    (usr.length > 0) ? 
        res.status(200).json({code: 200, message: usr}) : 
        res.status(404).json({code: 404, message: "Usuario no encontrado"});
});

module.exports = admin;