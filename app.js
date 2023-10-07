require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');

app.use(express.static('public'));

/**
 * Configura y ejecuta una tarea cron para actualizar la base de datos los lunes y jueves a las 3:30 horas.
 * 
 * @returns {void}
 */
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

/**
 * Configura y ejecuta una tarea cron para actualizar los tickets en la base de datos a las 23:30 horas todos los días.
 * 
 * @returns {void}
 */
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


/**
 * Ruta para la página de inicio.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get('/', (req, res) => {
    res.status(200).send('Pagina de inicio');
});

/**
 * Ruta para consultar el clima por ciudad.
 * @param {Object} req - Objeto de solicitud HTTP que contiene la ciudad a consultar.
 * @param {Object} res - Objeto de respuesta HTTP para enviar los resultados de la consulta.
 */
app.get('/consulta-ciudad', (req, res) => {
    controlador.obtenerClimaPorCiudad(req, res,process.env.base_datos, () => {
    });
});

/**
 * Ruta para consultar el clima por número de ticket.
 * @param {Object} req - Objeto de solicitud HTTP que contiene el número de ticket y la fecha.
 * @param {Object} res - Objeto de respuesta HTTP para enviar los resultados de la consulta.
 * @returns {void}
 */
app.get('/consulta-ticket', (req, res) => {
    controlador.obtenerClimaPorTicket(req, res, process.env.base_datos, () => {
    });
});


/**
 * Inicia el servidor en el puerto especificado.
 * 
 * @returns {void}
 */
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log("-------------------------------------")
    console.log(new Date().toISOString());
});