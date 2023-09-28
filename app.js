require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');
const { actualizaClimaBasedeDatos } = require('./src/modelo_aplicacion/actualizabd');

app.use(express.static('public'))


// Configura una tarea cron para ejecutar agregaInformacionCSV cada día a las 2 AM
cron.schedule('* 0 2 * * *', async () => {
    try {
        const direccionCSV = 'ruta/al/archivo.csv';
        const resultado = await actualizaBD.agregaInformacionCSV(direccionCSV);
        console.log('Tarea cron: Actualización de base de datos realizada.');
    } catch (error) {
        console.error('Tarea cron: Error al actualizar la base de datos.', error);
    }
},{
    scheduled: true,
    timezone: "America/Mexico_City"
});

// Configura otra tarea cron para ejecutar actualizaClimaBasedeDatos cada hora
cron.schedule('* * * * * *', async () => {
    try {
        const climasActualizados = await actualizaBD.actualizaClimaBasedeDatos();
        console.log('Tarea cron: Actualización de clima completada.');
    } catch (error) {
        console.error('Tarea cron: Error al actualizar el clima en la base de datos.', error);
    }
});



app.get('/', (req, res) => {
    console.log('Pagina de inicio');
    res.status(200);
    res.send('Pagina de inicio');
})

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
    console.log(new Date().toISOString());
    // Configura una tarea cron para ejecutar agregaInformacionCSV cada día a las 2 AM
    cron.schedule('* 0 3 * * *', async () => {
        console.log(new Date().toISOString());
        actualizaClimaBasedeDatos();
    },{
        scheduled: true,
        timezone: "America/Mexico_City"
    });
})