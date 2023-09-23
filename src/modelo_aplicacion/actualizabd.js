const { resolve } = require('path');
const conexion = require('../modelo_aplicacion/conexion');
var fs = require('fs');

/**
 * Método que actualiza los tickets por csv.
 */
async function actualizacsv(){

}

/**
 * Método que actualiza mongo
 */

async function actualizamongo(){
    let recuclim = conexion.consultaBD(uri,baseDatos,clima,busqueda);
    JSON.stringify(recuclim);
    fs.appendFile('clima.txt', recuclim);
    await conexion.vacia(cliente,baseDatos,clima);
    let ciudades = conexion.consultaBD(uri,baseDatos,ciudad,busqueda);
    for(let i=0; i < ciudades.length; i++){
        let respuesta = fetch("api.openweathermap.org/data/2.5/forecast?lat=ciudad.latitud&lon=ciudad.longitud&appid=60135e641ac6998ca2554e16d51046f8");
        let climanuevo = respuesta.json();
        conexion.insertarclima(baseDatos,coleccion,climanuevo,ciudades.IATA);
        await petateate(2);
    }

}

/**
 * Metodo que por medio de una funcion y timeout imita un sleep para no saturar la API en cada llamada.
 * Recibe un entero que seran los segundos que dormira el programa.
 * @param {Integer} duracion 
 */
async function petateate(duracion){
    return new Promise(resolve =>{setTimeout(()=>{resolve()},duracion*1000)});
}
