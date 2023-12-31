const { MongoClient } = require('mongodb');
require('dotenv').config();

/**
 * Método que inserta un elemento a una coleccion por medio de un cliente de mongoDB
 * 
 * @param {MongoClient} cliente, el cliente que se conecta a la base de datos.
 * @param {String} baseDatos, la base de datos de MongoDB.
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB. 
 * @param {JSON} nuevoListado, el JSON que se insertara a la base de datos.
 * @returns la verificacion de la busqueda.
 */
async function insertar(cliente,baseDatos,coleccion,nuevoListado){
    const resultado = await cliente.db(baseDatos).collection(coleccion).insertOne(nuevoListado);
    return resultado.acknowledged;
}



/**
 * Método que busca por medio de un filtro un objeto en una coleccion por medio de un 
 * cliente de mongoDB
 * 
 * @param {MongoClient} cliente, el cliente que se conecta a la base de datos.
 * @param {String} baseDatos, la base de datos de MongoDB. 
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB. 
 * @param {JSON} busqueda, el elemento JSON que se desea encontrar en la base de datos. 
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
 * @param {String} baseDatos, la base de datos de MongoDB. 
 * @param {JSON} nuevaL, el JSON de donde se sacaran los datos para el clima. 
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB. 
 * @param {String} IATA
 * @returns la verificacion de que se inserto el clima pormedio del metodo insertado
 */
async function insertarclima(baseDatos,coleccion,nuevaL,IATA){
    const uri = process.env.uri;
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
 * @param {String} baseDatos, la base de datos de MongoDB.
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB.
 * @param {JSON} busqueda, el JSON consultado en la base de datos.
 * @returns un JSON con todos los certificados encontrados por medio del filtro.
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
 * @param {String} baseDatos, la base de datos de MongoDB.
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB.
 * @param {JSON} filtro, el JSON que contendra los elementos especificos a eliminar.
 * @returns verificacion de que se elimino el filtro de la base de datos
 */
async function vacia(baseDatos,coleccion,filtro){
    const uri = process.env.uri;
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
 * @param {String} baseDatos, la base de datos de MongoDB.
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB. 
 * @param {JSON} busqueda, el JSON que tendra la informacion de lo que se desea consultar en la base de datos. 
 * @param {String} fechaUnix, la fecha del dia.
 * @returns un arreglo con el IATA, fecha y clima consultados.
 */
async function consultaClima(baseDatos,coleccion,busqueda,fechaUnix){
    const uri = process.env.uri;
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
 * @param {String} baseDatos, la base de datos de MongoDB. 
 * @param {String} coleccion, la coleccion dentro de la base de datos de mongoDB. 
 * @param {JSON} nuevoListado, el JSON que contiene las colecciones que se insertaran en la base de datos. 
 * @returns verificacion de que se inserto correctamente en la base de datos
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
