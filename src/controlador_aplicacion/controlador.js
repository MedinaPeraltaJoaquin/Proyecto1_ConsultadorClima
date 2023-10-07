const cron = require('node-cron');
const levenshtein = require('fast-levenshtein');
const conexion = require('../modelo_aplicacion/conexion.js');
const actualizaBD = require('../modelo_aplicacion/actualizabd.js'); 

/**
 * Actualiza la base de datos con información de clima desde archivos CSV.
 * @returns {Promise<void>}  Promesa que indica que la actualización ha finalizado.
 */
async function actualizarBaseDeDatos() {
    try {
        const climasActualizados = await actualizaBD.actualizaclimabd(process.env.PATH_guardar);
        for(let i=0; i < climasActualizados.length; i++){
            const clima = climasActualizados[i];
            if(clima.error != undefined){
                console.log(clima.error);
            }
        }
    } catch (error) {
        console.error('Error al actualizar la base de datos:', error);
    }
}

/**
 * Actualiza los tickets en la base de datos desde un archivo CSV.
 * @returns {Promise<void>} Promesa que indica que la actualización ha finalizado.
 */
async function actualizaTickets() {
    try {
        const direccionCSV = process.env.PATH_CSV;
        const ticketsActualizados = await actualizaBD.agregaInformacionCSV(direccionCSV);
    } catch (error) {
        console.error('Error al actualizar la base de datos:', error);
    }
}

/**
 * Obtiene información de clima por número de ticket y fecha.
 * @param {Object} req - Objeto de solicitud HTTP con datos del ticket y la fecha.
 * @param {Object} res - Objeto de respuesta HTTP para enviar la respuesta.
 * @param {String} base_datos - Nombre de la base de datos.
 * @returns {Promise<void>}  Promesa que resuelve con los datos del clima.
 */
async function obtenerClimaPorTicket(req, res,base_datos) {
    const ticket = req.query.ticket;
    const date = req.query.date;

    if (!ticket) {
        return res.status(400).json({ error: 'Por favor, ingrese el número de ticket.' });
    }
    if (!date) {
        return res.status(400).json({ error: 'Por favor, ingrese la fecha.' });
    }
        
    let ticketData = await conexion.consultaBD(base_datos, process.env.coleccion_ticket, {"ticket" : ticket})
    const ciudades = await conexion.consultaBD(base_datos, process.env.coleccion_ciudad, {});
    
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

    const climas = await conexion.consultaClima(base_datos, process.env.coleccion_clima, 
        {$or : [{"IATA" : ciudad_origen}, {"IATA" : ciudad_destino}]},fechaUnix);
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

/**
 * Obtiene información de clima por nombre de ciudad y fecha.
 * @param {Object} req - Objeto de solicitud HTTP con el nombre de la ciudad y la fecha.
 * @param {Object} res - Objeto de respuesta HTTP para enviar la respuesta.
 * @param {String} base_datos - Nombre de la base de datos.
 * @returns {Promise<void>}  Promesa que resuelve con los datos del clima.
 */
async function obtenerClimaPorCiudad(req, res,base_datos) {
    const ciudad = req.query.ciudad;
    const date = req.query.date;
    
    if (!ciudad) {
        return res.status(400).json({ error: 'Por favor, ingrese la ciudad.' });
    }

    const ciudades = await conexion.consultaBD(base_datos, process.env.coleccion_ciudad, {});
    
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
    const climas = await conexion.consultaClima(base_datos, process.env.coleccion_clima, 
        {"IATA" : ciudadIATA},fechaUnix);
    
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
    actualizaTickets
};