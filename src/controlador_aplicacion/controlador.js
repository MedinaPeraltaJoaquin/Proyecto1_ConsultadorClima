const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Importa los métodos desde conexion.js
const { consultaBD, insertarclima } = require('../modelo_aplicacion/conexion');

const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para obtener clima por ticket
async function obtenerClimaPorTicket(req, res) {
    const { ticket, city } = req.body;

    // Verifica si se proporcionó un número de ticket
    if (!ticket) {
        return res.status(400).json({ error: 'Por favor, ingrese el número de ticket.' });
    }

    try {
        await client.connect();
        const db = client.db(process.env.base_datos);
        const ticketsCollection = db.collection(process.env.coleccion_ticket);

        const ticketData = await ticketsCollection.findOne({ ticket: ticket });

        // Verifica si se encontró el ticket en la base de datos
        if (!ticketData) {
            return res.status(400).json({ error: 'El ticket no se encontró en la base de datos.' });
        }

        const apiKey = process.env.api_openweather;
        const url = `https://api.openweathermap.org/data/2.5/weather?iata=${ticketData.iata}&appid=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        const horaActual = new Date().getHours();
        let lapso = '';

        if (horaActual >= 6 && horaActual < 12) {
            lapso = 'de 6 a 12';
        } else if (horaActual >= 12 && horaActual < 19) {
            lapso = 'de 12 a 19';
        } else {
            lapso = 'de 19 a 24';
        }

        data['lapso_de_tiempo'] = lapso;

        // Consulta el clima desde la base de datos usando la función de conexion.js
        const climaData = await consultaBD(process.env.base_datos, process.env.coleccion_clima, {
            IATA: ticketData.iata,
            /* Agrega aquí cualquier otro filtro que necesites */
        });

        // Envia una respuesta JSON
        res.status(200).json({ climaData, city });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.' });
    } finally {
        await client.close();
    }
}

// Función para obtener clima por ciudad
async function obtenerClimaPorCiudad(req, res) {
    const { city } = req.body;

    // Verifica si se proporcionó el nombre de la ciudad
    if (!city) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    try {
        await client.connect();
        const db = client.db(process.env.base_datos);
        const collection = db.collection(process.env.coleccion_ciudad);

        let mejorCoincidencia = null;
        let distanciaMinima = Number.MAX_VALUE;

        const ciudades = await collection.find({}).toArray();

        ciudades.forEach((ciudad) => {
            const distancia = levenshtein.get(city.toLowerCase(), ciudad.origin.toLowerCase());

            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                mejorCoincidencia = ciudad;
            }
        });

        // Verifica si se encontró una ciudad coincidente
        if (!mejorCoincidencia) {
            return res.status(400).json({ error: 'No se encontró una ciudad coincidente.' });
        }

        const apiKey = process.env.api_openweather;
        const url = `https://api.openweathermap.org/data/2.5/weather?iata=${mejorCoincidencia.iata}&appid=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        const horaActual = new Date().getHours();
        let lapso = '';

        if (horaActual >= 6 && horaActual < 12) {
            lapso = 'de 6 a 12';
        } else if (horaActual >= 12 && horaActual < 19) {
            lapso = 'de 12 a 19';
        } else {
            lapso = 'de 19 a 24';
        }

        data['lapso_de_tiempo'] = lapso;

        // Consulta el clima desde la base de datos usando la función de conexion.js
        const climaData = await consultaBD(process.env.base_datos, process.env.coleccion_clima, {
            IATA: mejorCoincidencia.iata,
        });

        // Envia una respuesta JSON
        res.status(200).json({ climaData, city });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.' });
    } finally {
        await client.close();
    }
}

module.exports = {
    obtenerClimaPorTicket,
    obtenerClimaPorCiudad,
};
