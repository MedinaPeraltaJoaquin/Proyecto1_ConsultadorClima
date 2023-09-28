require('dotenv').config();

/**
 * Método que añade los datos de ticket y ciudad en la base datos desde un csv.
 * @param {JSON} datosCSV un documento json en donde se encuentra la informacion de ciudades y tickets.
 * @param {JSON} ciudades un documento json con la informacion de ciudades.
 */
async function obtenerTicketsCiudades(datosCSV,ciudades){
    let  ticketArreglo = [];
    for(let i=0; i<datosCSV.length; i++){
        let tickets ={};
        const elemento = datosCSV[i];
        tickets ={
            "ticket" : elemento.num_ticket,
            "ciudad_origen" : elemento.origin,
            "ciudad_destino": elemento.destination,
        }
        ticketArreglo.push(tickets);
        if(ciudades[0][elemento.origin] == undefined){
            ciudades[0][elemento.origin] ={
                "ciudad": "",
                "coordenadas":{
                "latitud": elemento.origin_latitude,
                "longitud": elemento.origin_longitude
            },
            "IATA": elemento.origin
        };
        ciudades[1]["ciudades"].push(elemento.origin); 
        }
        if((ciudades[0][elemento.destination] == undefined)){
            ciudades[0][elemento.destination] ={
                "ciudad": "",
                "coordenadas":{
                "latitud": elemento.destination_latitude,
                "longitud": elemento.destination_longitude
            },
            "IATA": elemento.destination
        }
        ciudades[1]["ciudades"].push(elemento.destination);
        }
    }
    return {
        "ticketsAlta": ticketArreglo,
        "ciudadesAlta": ciudades
    };
}

/**
 * Método que añade los datos de ticket y ciudad en la base datos desde un csv.
 * 
 * @param {String} direccionCSV un document JSON en donde se encuentra la informacion de los tickets.
 */
async function agregaInformacionCSV(direccionCSV){
    let csvToJson = require('convert-csv-to-json');
    const conexion = require('./conexion.js');


    const datosCSV = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(direccionCSV);
    let ciudades = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_ciudad,{});
    await conexion.vacia(process.env.base_datos,process.env.coleccion_ciudad,{});
    if(ciudades[0] == undefined){
        ciudades[0] = {};
    }

    if(ciudades[1] == undefined){
        ciudades[1] = {"ciudades":[]};
    }
    
    let resultado = obtenerTicketsCiudades(datosCSV,ciudades);

    await conexion.insertarVariosBD(process.env.base_datos,process.env.coleccion_ticket,resultado.ticketsAlta);
    await conexion.insertarVariosBD(process.env.base_datos,process.env.coleccion_ciudad,resultado.ciudadesAlta);
    
    return resultado;
}

/**
 * Método que actuliza los climas de la base de datos.
 * @param {String} guardainfo
 */
async function actualizaclimabd(guardainfo){
    const conexion = require('./conexion.js');
    var fs = require('fs');
    var fecha = new Date();

    let recuclim = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_clima,{});
    if(recuclim.length != 0){
        fs.appendFile(guardainfo +"./climaBD"+fecha.getTime()+".json", JSON.stringify(recuclim), async function (err) {
            if (err) throw err;
            await conexion.vacia(process.env.base_datos,process.env.coleccion_clima,{});
        });
    }

    let climas = [];
    let ciudades = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_ciudad,{});
    if(ciudades.length == 0){
        ciudades = [{},{"ciudades":[]}];
    }
    for(let i=0; i < ciudades[1]["ciudades"].length; i++){
        const referencia = ciudades[1]["ciudades"][i];
        const ciudad = ciudades[0][referencia];;
        const clima = await realizaPeticion(ciudad);
        if(clima != undefined){
            let verificadoInsertar = await conexion.insertarclima(process.env.base_datos,process.env.coleccion_clima,clima,ciudad.IATA);
            if(verificadoInsertar){
                climas.push(clima);
            }      
        }
        await petateate(4);
    }
    return climas;

}

/**
 * Metodo que por medio de una funcion y timeout imita un sleep para no saturar la API en cada llamada.
 * Recibe un entero que seran los segundos que dormira el programa.
 * @param {Integer} duracion 
 */
async function petateate(duracion){
    return new Promise(resolve =>{setTimeout(()=>{resolve()},duracion*1000)});
}

/**
 * Método auxiliar que realiza la peticion a la api de openweather.
 * @param {JSON} ciudad a buscar en openweather.
 */
async function realizaPeticion(ciudad){
    let url = "https://api.openweathermap.org/data/2.5/forecast?lat="+ciudad.coordenadas.latitud+"&lon="+ciudad.coordenadas.longitud+"&lang=es&appid="+process.env.api_openweather;
    let respuesta = await fetch(url);
    return respuesta.status != 200 ? undefined : await respuesta.json();
}

module.exports = {
    agregaInformacionCSV,
    actualizaClimaBasedeDatos,
    obtenerTicketsCiudades
}

