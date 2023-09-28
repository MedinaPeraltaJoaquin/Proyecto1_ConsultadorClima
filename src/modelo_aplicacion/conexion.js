const { MongoClient } = require('mongodb');
require('dotenv').config();

/**
 * Método que inserta un elemento a una coleccion por medio de un cliente de mongoDB
 * 
 * @param {MongoClient} cliente 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} nuevoListado 
 */
async function insertar(cliente,baseDatos,coleccion,nuevoListado){
    const resultado = await cliente.db(baseDatos).collection(coleccion).insertOne(nuevoListado);
    return resultado.acknowledged;
}



/**
 * Método que busca por medio de un filtro un objeto en una coleccion por medio de un 
 * cliente de mongoDB
 * 
 * @param {MongoClient} cliente 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} busqueda 
 * @returns un arreglo con todos los elementos que cumplen por el filtro, regresa un arreglo
 * vacio si no se encontro nada
 */
async function busquedadeconsultaBD(cliente,baseDatos,coleccion,busqueda){
    const resultado = await cliente.db(baseDatos).collection(coleccion).find(busqueda);
    const doc=[];
    for await (const indice of resultado){
            doc.push(indice);
    }
    return doc;
}

/**
 * Método que inserta en la base de datos un archivo JSON limpio sobre datos del clima 
 * @param {String} baseDatos 
 * @param {JSON} nuevaL 
 * @param {String} coleccion 
 * @param {String} IATA
 */
async function insertarclima(baseDatos,coleccion,nuevaL,IATA){
    const uri = proces.env.uri;
    const cliente = new MongoClient(uri);
   
    let registro = {
        "IATA" : IATA,
        "clima" : {}
    };

    for(let i=0; i < nuevaL.list.length; i++){
        let creador = {
                  "dt": nuevaL.list[i].dt,
                  "main": {
                    "temperatura": nuevaL.list[i].main.temp,
                    "presion": nuevaL.list[i].main.pressure,
                    "humedad": nuevaL.list[i].main.humidity
                  },
        
                  "estado": nuevaL.list[i].weather[0].main,
                  "descripcion": nuevaL.list[i].weather[0].description,
                  "viento": {
                    "velocidad": nuevaL.list[i].wind.speed,
                    "direccion": nuevaL.list[i].wind.deg,
                    "fuerza": nuevaL.list[i].wind.gust
                  },
                  "visibilidad" : nuevaL.list[i].visibility,
                  "precipitacion": nuevaL.list[i].pop,
                  "lluvia": -1,
                  "nieve" : -1,
                  "dt_txt": nuevaL.list[i].dt_txt
        };

        if(nuevaL.list[i].rain !== undefined){
            creador.lluvia = nuevaL.list[i].rain['3h'];
        }
        if(nuevaL.list[i].snow !== undefined){
            creador.nieve = nuevaL.list[i].snow['3h'];
        }
        registro.clima[nuevaL.list[i].dt]= creador;
    }
    let insertado = false;
    try {

        await cliente.connect();
        insertado = await insertar(cliente,baseDatos,coleccion,registro);

    } catch (e) {
        console.error(e);
    } finally {
        await cliente.close();
    }
    return insertado;

}

/**
 * 
 * Método que busca un certificado por medio de un filtro en una base de datos de mongoDB
 * 
 * @param {String} baseDatos 
 * @param {JSON} busqueda
 * @returns un JSON con todos los certificados encontrados por medio del filtro
 */
async function consultaBD(baseDatos,coleccion,busqueda){
    const uri = process.env.uri;
    const cliente = new MongoClient(uri);
    let consulta = [];

    try {
        await cliente.connect();
        consulta = await busquedadeconsultaBD(cliente,baseDatos,coleccion,busqueda);
        

    } catch (e) {
        console.error(e);
    } finally {
        await cliente.close();
    }

    return consulta;
}

/**
 * Método que elimina informacion de una coleccion de la base de datos.
 * @param {String} baseDatos
 * @param {String} coleccion
 * @param {JSON} filtro
 */
async function vacia(baseDatos,coleccion,filtro){
    const uri = proces.env.uri;
    const cliente = new MongoClient(uri);
    let eliminar = false;
    try {
        await cliente.connect();
        let eliminado = await cliente.db(baseDatos).collection(coleccion).deleteMany(filtro);
        elmiminar = eliminado.acknowledged;
    } catch (e) {
        console.error(e);
    } finally {
        await cliente.close();
    }
    return eliminar;
}

/**
 *  Método que devuelve el clima y IATA de la ciudad.
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} busqueda 
 * @param {String} fechaUnix
 * @returns 
 */
async function consultaClima(baseDatos,coleccion,busqueda,fechaUnix){
    const uri = proces.env.uri;
    const cliente = new MongoClient(uri);
    let consulta = [];

    try {
        await cliente.connect();
        const consultado = await busquedadeconsultaBD(cliente,baseDatos,coleccion,busqueda);
        if(consultado.length != 0){
            for(let i=0; i< consultado.length; i++){
                consulta.push({
                    "IATA": consultado[i].IATA,
                    "clima": consultado[i].clima[fechaUnix]

                })
            }
        }
        

    } catch (e) {
        console.error(e);
    } finally {
        await cliente.close();
    }

    return consulta;
}

/**
 * Método que inserta varios elementos a la base de datos 
 * 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} nuevoListado 
 * @returns un booleano que indica si se inserto o no
 */

async function insertarVariosBD(baseDatos,coleccion,nuevoListado){
    const uri = process.env.uri;
    const cliente = new MongoClient(uri);
    let insertado = false;
    try {
        await cliente.connect();
        insertado = (await cliente.db(baseDatos).collection(coleccion).insertMany(nuevoListado)).acknowledged;
        
    } catch (e) {
        console.error(e);
    } finally {
        await cliente.close();
    }
    return insertado;

}

module.exports = {
    consultaClima,insertarclima, consultaBD, vacia, insertarVariosBD

}
