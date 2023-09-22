const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

app.use(express.json());

// Conectarse a la base de datos MongoDB
const url = process.env.MONGODB_URL; // Usar la variable de entorno para la URL de MongoDB
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para corregir la ciudad utilizando distancia Levenshtein
async function corregirCiudad(inputCity, db) {
    const collection = db.collection(process.env.MONGODB_COLLECTION); // Usar la variable de entorno para el nombre de la colección

    let mejorCoincidencia = null;
    let distanciaMinima = Number.MAX_VALUE;

    // Buscar todas las ciudades en la base de datos
    const ciudades = await collection.find({}).toArray();

    ciudades.forEach((ciudad) => {
        const distancia = levenshtein.get(inputCity.toLowerCase(), ciudad.origin.toLowerCase());

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            mejorCoincidencia = ciudad;
        }
    });

    return mejorCoincidencia;
}

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación de consulta de clima en Node.js!');
});

app.post('/get_weather', async (req, res) => {
    const { ticket, city } = req.body;

    if (!ticket) {
        return res.status(400).json({ error: 'Por favor, ingrese el número de ticket.' });
    }

    if (!city) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    // Obtener datos de longitud, latitud y IATA del ticket desde MongoDB
    try {
        await client.connect(); // Conectar a MongoDB
        const db = client.db(process.env.MONGODB_DATABASE); // Usar la variable de entorno para el nombre de la base de datos
        const ticketsCollection = db.collection('tickets'); // Cambiar el nombre de la colección según tu configuración

        const ticketData = await ticketsCollection.findOne({ ticket: ticket });

        if (!ticketData) {
            return res.status(400).json({ error: 'El ticket no se encontró en la base de datos.' });
        }

        // Consultar el clima utilizando los datos del ticket
        const apiKey = process.env.OPENWEATHERMAP_API_KEY; // Usar la variable de entorno para la API Key
        const url = `https://api.openweathermap.org/data/2.5/weather?iata=${ticketData.iata}&appid=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        // Determinar el lapso de tiempo actual
        const horaActual = new Date().getHours();
        let lapso = '';

        if (horaActual >= 6 && horaActual < 12) {
            lapso = 'de 6 a 12';
        } else if (horaActual >= 12 && horaActual < 19) {
            lapso = 'de 12 a 19';
        } else {
            lapso = 'de 19 a 24';
        }

        // Procesar los datos de respuesta y agregar el lapso de tiempo
        data['lapso_de_tiempo'] = lapso;
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.' });
    } finally {
        await client.close(); // Cerrar la conexión a la base de datos
    }
});

app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`);
});

process.on('SIGINT', () => {
    client.close();
    console.log('Conexión a la base de datos cerrada');
    process.exit(0);
});
