/**
 * Clase que visualiza el contenido de la respuesta de la consulta por medio
 * de la llamada al servidor
 */


/**
 * Funcion que hace una peticion al servidor para obtener el clima
 * 
 * @param {string} url a la que se realizara la peticion
 */
async function cargarClima(url){
    let response = await fetch(url);
    if(response.status != 200){
        throw new Error("Error al consultar el clima");
    }
    let data = await response.json();
    return data;
}

/**
 *  Método que actualiza la pagina web con informacion del clima correspondiente
 *  a ticket o ciudad
 * 
 * @param {JSON} climaData
 * @param {String} busqueda
 */
async function remplazarDatos(climaData,busqueda){
    let section = document.querySelector('resultados');
    const etiquetaHTML = await require('../../public/assets/js/EtiquetasHTML.js');

    section.insertAdjacentHTML('beforebegin',etiquetaHTML.cargarClima(climaData,busqueda));   
}

module.exports = {
    cargarClima,remplazarDatos
}

