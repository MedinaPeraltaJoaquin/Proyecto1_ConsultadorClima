const cron = require('node-cron');
const levenshtein = require('fast-levenshtein');
const conexion = require('../modelo_aplicacion/conexion.js');
const actualizaBD = require('../modelo_aplicacion/actualizabd.js'); 

async function actualizarBaseDeDatos() {
    try {
        const csvData = await actualizaBD.agregaInformacionCSV('ruta_del_archivo.csv');
        const climasActualizados = await actualizaBD.actualizaClimaBasedeDatos();
 } catch (error) {
        console.error('Error al actualizar la base de datos:', error);
    }
}

// Función para obtener clima por ticket
async function obtenerClimaPorTicket(req, res) {
    const ticket = req.query.ticket;
    const date = req.query.date;

    // Verifica si se proporcionó un número de ticket
    if (!ticket) {
        return res.status(400).json({ error: 'Por favor, ingrese el número de ticket.' });
    }

    // Verifica si se proporcionó una fecha
    if (!date) {
        return res.status(400).json({ error: 'Por favor, ingrese la fecha.' });
    }
        
    let ticketData = await conexion.consultaBD(process.env.base_datos, process.env.coleccion_ticket, {"ticket" : ticket})
    const ciudades = await conexion.consultaBD(process.env.base_datos, process.env.coleccion_ciudad, {});


    // Verifica si se encontró el ticket en la base de datos
    if (ticketData.length == 0) {
        return res.status(400).json({ error: 'El ticket no se encontró en la base de datos.' });
    }

    let ciudad_origen = ticketData[0].ciudad_origen;
    let ciudad_destino = ticketData[0].ciudad_destino;
    let fecha = new Date(date);
    let horas = fecha.getHours();
    let consulta = new Date(fecha.setHours(horas - (horas % 3)));
    consulta.setSeconds(0);
    consulta.setMinutes(0);
    consulta.setMilliseconds(0);
    let fechaUnix = (''+consulta.getTime()).substring(0,10);

    const climas = await conexion.consultaClima(process.env.base_datos, process.env.coleccion_clima, 
        {$or : [{"IATA" : ciudad_origen}, {"IATA" : ciudad_destino}]},fechaUnix);
    
    // Verifica si se encontró el clima en la base de datos
    if (climas.length == 0) {
        return res.status(400).json({ error: 'El clima no se encontró en la base de datos.' });
    }

    let busqueda = {
        "ciudad" : [
            {
                "nombre" : ciudades[0][ciudad_origen].ciudad,
            },
            {
                "nombre" : ciudades[0][ciudad_destino].ciudad,
            }
        ]
    }

        return res.status(200).json({ "busqueda" : busqueda, "clima" : climas});
}

// Función para obtener clima por ciudad
async function obtenerClimaPorCiudad(req, res) {
    const ciudad = req.query.ciudad;
    const date = req.query.date;
    // Verifica si se proporcionó el nombre de la ciudad
    if (!ciudad) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    const ciudades = await conexion.consultaBD(process.env.base_datos, process.env.coleccion_ciudad, {});
    
    let mejorCoincidencia = "";
    let distanciaMinima = Number.MAX_VALUE;
    let ciudadIATA = "";

    ciudades[1].ciudades.forEach(elemento => {
        const distancia = levenshtein.get(ciudad.toLowerCase(), ciudades[0][elemento].ciudad.toLowerCase());

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            if(distancia < 4){
                mejorCoincidencia = ciudades[0][elemento].ciudad;
                ciudadIATA = ciudades[0][elemento].IATA;
            }
        }
    });

    // Verifica si se encontró una ciudad coincidente
    if (mejorCoincidencia == "") {
        return res.status(400).json({ error: 'No se encontró una ciudad que coincida'});
    }

    let fecha = new Date(date);
    let horas = fecha.getHours();
    let consulta = new Date(fecha.setHours(horas - (horas % 3)));
    consulta.setSeconds(0);
    consulta.setMinutes(0);
    consulta.setMilliseconds(0);
    let fechaUnix = (''+consulta.getTime()).substring(0,10);
    const climas = await conexion.consultaClima(process.env.base_datos, process.env.coleccion_clima, 
        {"IATA" : ciudadIATA},fechaUnix);
    
    // Verifica si se encontró el clima en la base de datos
    if (climas.length == 0) {
        return res.status(400).json({ error: 'El clima no se encontró en la base de datos.' });
    }

    let busqueda = {
        "ciudad" : [
            {
                "nombre" : mejorCoincidencia
            }
        ]
    }
        return res.status(200).json({ "busqueda" : busqueda, "clima" : climas});

}

module.exports = {
    actualizarBaseDeDatos,
    obtenerClimaPorTicket,
    obtenerClimaPorCiudad,
};