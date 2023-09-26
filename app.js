const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const controlador = require('./src/controlador_aplicacion/controlador');

app.use(express.json());
app.use(express.static('public'));

// Rutas para obtener datos climáticos por ticket y por ciudad
app.get('/consulta-ticket', (req, res) => {
    res.sendFile(__dirname + '/public/consulta-ticket.html');
});

app.get('/consulta-ciudad', (req, res) => {
    res.sendFile(__dirname + '/public/consulta-ciudad.html');
});

app.post('/get_weather_by_ticket', controlador.obtenerClimaPorTicket);
app.post('/get_weather_by_city', controlador.obtenerClimaPorCiudad);

// Ruta de redirección
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
