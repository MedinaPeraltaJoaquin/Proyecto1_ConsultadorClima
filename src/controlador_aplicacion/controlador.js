const axios = require('axios');
const levenshtein = require('fast-levenshtein');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Método lógico para obtener clima por ticket
async function obtenerClimaPorTicket(req, res) {
    const { ticket, city } = req.body;

    if (!ticket) {
        return res.status(400).json({ error: 'Por favor, ingrese el número de ticket.' });
    }

    if (!city) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DATABASE);
        const ticketsCollection = db.collection('tickets');

        const ticketData = await ticketsCollection.findOne({ ticket: ticket });

        if (!ticketData) {
            return res.status(400).json({ error: 'El ticket no se encontró en la base de datos.' });
        }

        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
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
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.' });
    } finally {
        await client.close();
    }
}

// Método lógico para obtener clima por ciudad
async function obtenerClimaPorCiudad(req, res) {
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DATABASE);
        const collection = db.collection(process.env.MONGODB_COLLECTION);

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

        if (!mejorCoincidencia) {
            return res.status(400).json({ error: 'No se encontró una ciudad coincidente.' });
        }

        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
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
        res.status(200).json(data);
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
