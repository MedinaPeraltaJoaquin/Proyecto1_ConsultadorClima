require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');

app.use(express.static('public'));

// Configura una tarea cron para ejecutar actualización de base de datos los lunes
// y jueves a las 3:30 horas.
cron.schedule('30 3 * * 1,4', async () => {
    console.log("-------------------------------------")
    try {
        await controlador.actualizarBaseDeDatos();
        console.log("Tarea cron: Se actualizó la base de datos.")
        console.log(new Date().toISOString())
    } catch (error) {
        console.error('Tarea cron: Error al actualizar la base de datos.', error);
    }

    console.log("-------------------------------------")
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

cron.schedule('30 23 * * *', async () => {
    console.log("-------------------------------------")
    try {
        await controlador.actualizaTickets();
        console.log("Tarea cron: Se actualizó los tickets en la base de datos.")
        console.log(new Date().toISOString())
    } catch (error) {
        console.error('Tarea cron: Error al actualizar la base de datos.', error);
    }

    console.log("-------------------------------------")
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

app.get('/', (req, res) => {
    res.status(200).send('Pagina de inicio');
});

app.get('/consulta-ciudad', (req, res) => {
    controlador.obtenerClimaPorCiudad(req, res,process.env.base_datos, () => {
        // No se muestra mensaje de terminación en la consola
    });
});

app.get('/consulta-ticket', (req, res) => {
    controlador.obtenerClimaPorTicket(req, res, process.env.base_datos, () => {
        // No se muestra mensaje de terminación en la consola
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log("-------------------------------------")
    console.log(new Date().toISOString());
});