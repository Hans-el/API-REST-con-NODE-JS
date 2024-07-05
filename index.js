const express = require('express');
const bodyParser = require( 'body-parser');
const mysql = require ('mysql');

const app = express();


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use (bodyParser.json({ type: 'application/json' }));

const conexion = mysql.createConnection({
    host: 'localhost',
    database:'db_curso_app',
    user: 'root',
    password: ''
});

conexion.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Conectado con el id ' + conexion.threadId);
});


app.get('/', function (req, res) {
    res.send('API CONECTADA EXITOSAMENTE')
});


//1ERA API. MÉTODO GET PARA LA SENTENCIA SELECT

app.get('/usuarios', function (req, res) {
    const query = 'SELECT * FROM persona';
    conexion.query(query, function (err, results) {
        if (err) {
            console.error('error in query: ' + err.stack);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

// Las 4 apis restantes con el método POST usando los sentencias INSERT, UPDATE, DELETE, Y WHERE.
// 2DA API. MÉTODO POST PARA LA SENTENCIA INSERT
app.post('/guardar_persona', function (req, res) {
    const query = `INSERT INTO persona (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)`;
    conexion.query(query, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion], function (error, results, fields) {
        if (error) {
            console.error('error in query: ' + error.stack);
            res.status(500).send('Error en la inserción');
            return;
        }
        res.json({ datos_usuarios: results });
    });
});

// 3RA API. MÉTODO POST PARA LA SENTENCIA UPDATE
app.post('/actualizar_persona', function (req, res) {
    const query = `UPDATE persona SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE idpersona = ?`;
    conexion.query(query, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion, req.body.idpersona], function (error, results, fields) {
        if (error) {
            console.error('error in query: ' + error.stack);
            res.status(500).send('Error en la actualización');
            return;
        }
        res.json({ datos_usuarios: results });
    });
});

// 4TA API. MÉTODO POST PARA LA SENTENCIA DELETE
app.post('/eliminar_persona', function (req, res) {
    const query = `DELETE FROM persona WHERE idpersona = ?`;
    conexion.query(query, [req.body.idpersona], function (error, results, fields) {
        if (error) {
            console.error('error in query: ' + error.stack);
            res.status(500).send('Error en la eliminación');
            return;
        }
        res.json({ datos_usuarios: results });
    });
});

// 5TA API. MÉTODO POST PARA LA SENTENCIA WHERE (SELECT CON CONDICIÓN)
// buscaremos a un usuario por su numero de cédula.
app.post('/buscar_persona', function (req, res) {
    const query = `SELECT * FROM persona WHERE cedula = ?`;
    conexion.query(query, [req.body.cedula], function (error, results, fields) {
        if (error) {
            console.error('error in query: ' + error.stack);
            res.status(500).send('Error en la búsqueda');
            return;
        }
        res.json(results);
    });
});



// puerto de escucha.
app.listen(3000);
console.log("Servidor iniciado en el puerto: " + 3000);