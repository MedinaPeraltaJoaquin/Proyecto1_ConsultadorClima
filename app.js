const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const controlador = require('./src/controlador_aplicacion/controlador');

app.use(express.json());
app.use(express.static('public'));

// Rutas para obtener datos climáticos por ticket y por ciudad
app.post('/get_weather_by_ticket', controlador.obtenerClimaPorTicket);
app.post('/get_weather_by_city', controlador.obtenerClimaPorCiudad);

// Ruta de redirección
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
