require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');
const actualizabd = require('./src/modelo_aplicacion/actualizabd');

app.use(express.static('public'));

// Configura una tarea cron para ejecutar agregaInformacionCSV cada día a las 2 AM
cron.schedule('* 0 2 * * *', async () => {
    try {
        const direccionCSV = process.env.PATH_CSV;
        await actualizabd.agregaInformacionCSV(direccionCSV);
    } catch (error) {
        console.error('Tarea cron: Error al actualizar la base de datos.', error);
    }
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

app.get('/', (req, res) => {
    res.status(200).send('Pagina de inicio');
});

app.get('/consulta-ciudad', (req, res) => {
    controlador.obtenerClimaPorCiudad(req, res, () => {
        // No se muestra mensaje de terminación en la consola
    });
});

app.get('/consulta-ticket', (req, res) => {
    controlador.obtenerClimaPorTicket(req, res, () => {
        // No se muestra mensaje de terminación en la consola
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log(new Date().toISOString());
    // Configura una tarea cron para ejecutar agregaInformacionCSV cada día a las 3 AM
    cron.schedule('* 0 2 * * *', async () => {
        console.log(new Date().toISOString());
        controlador.actualizarBaseDeDatos()
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });
});
