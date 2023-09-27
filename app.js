require('dotenv').config();
const express = require('express');
const app = express();
const cron = require('node-cron');
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');
const conexion = require('../modelo_aplicacion/conexion.js');
const actualizabd = require('./actualizabd.js'); 

app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log('Pagina de inicio');
    res.status(200);
    res.send('Pagina de inicio');
})

// Ruta para actualizar la base de datos con el archivo CSV
app.get('/actualizar-db', async (req, res) => {
    try {
        const direccionCSV = 'ruta/al/archivo.csv';
        const resultado = await actualizabd.agregaInformacionCSV(direccionCSV);
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar la base de datos.' });
    }
});


// Ruta para ejecutar la actualización de clima en la base de datos
app.get('/actualizar-clima', async (req, res) => {
    try {
        const climasActualizados = await actualizabd.actualizaClimaBasedeDatos();
        res.status(200).json({ message: 'Actualización de clima completada.', climasActualizados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el clima en la base de datos.' });
    }
});

app.get('/consulta-ciudad', (req, res) => {
    console.log('Pagina de consulta por ciudad');
    controlador.obtenerClimaPorCiudad(req,res,()=>{
        console.log('Termino la consulta');
    });

})


app.get('/consulta-ticket', (req, res) => {
    console.log('Pagina de consulta por ticket');
    controlador.obtenerClimaPorTicket(req,res,()=>{
        console.log('Termino la consulta');
    });
})
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})