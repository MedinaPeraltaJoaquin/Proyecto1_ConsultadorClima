/**
 * Clase para las pruebas unitarias
 */

const levenshtein = require('fast-levenshtein');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

describe('Pruebas del Controlador', () => {
    let db;
    let client;

    beforeAll(async () => {
        // Establecer conexión a la base de datos de prueba o usar una base de datos de prueba en lugar de la de producción
        const url = process.env.MONGODB_TEST_URL;
        client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(process.env.MONGODB_DATABASE);
    });

    afterAll(async () => {
        // Cerrar la conexión a la base de datos de prueba
        await client.close();
    });

    it('Debería calcular la distancia Levenshtein correctamente', () => {
        const distancia = levenshtein.get('kitten', 'sitting');
        expect(distancia).toEqual(3); // La distancia Levenshtein entre 'kitten' y 'sitting' es 3
    });

    it('Debería obtener datos climáticos mediante el ticket', async () => {
        // Simular una solicitud al servidor con un ticket válido
        const response = await axios.post('http://localhost:8000/get_weather', {
            ticket: 'TICKET_VALIDO',
            city: 'Monterrey', // Puedes ajustar la ciudad según tus datos de prueba
        });

        expect(response.status).toEqual(200);
        expect(response.data).toHaveProperty('temperatura');
        expect(response.data).toHaveProperty('descripcion');
        // Agregar más expectativas según la estructura de la respuesta esperada
    });

    it('Debería obtener datos climáticos mediante la consulta a la ciudad', async () => {
        // Simular una solicitud al servidor con el nombre de una ciudad válida
        const response = await axios.post('http://localhost:8000/get_weather', {
            city: 'Monterrey', // Puedes ajustar la ciudad según tus datos de prueba
        });

        expect(response.status).toEqual(200);
        expect(response.data).toHaveProperty('temperatura');
        expect(response.data).toHaveProperty('descripcion');
        // Agregar más expectativas según la estructura de la respuesta esperada
    });

    it('Debería manejar errores al obtener datos climáticos', async () => {
        // Simular una solicitud al servidor con datos inválidos o no válidos
        const response = await axios.post('http://localhost:8000/get_weather', {
            ticket: 'TICKET_INVALIDO', // Puedes usar un ticket inválido para provocar un error
            city: 'CiudadNoExistente', // Puedes usar una ciudad que no existe
        });

        expect(response.status).toEqual(400); // Cambia esto según cómo manejas los errores
        // Agregar más expectativas para manejar los errores esperados
    });
});


