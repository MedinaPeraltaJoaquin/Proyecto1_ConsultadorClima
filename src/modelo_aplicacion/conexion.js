const { MongoClient } = require('mongodb');

/**
 * Método que inserta un elemento a una coleccion por medio de un cliente de mongoDB
 * 
 * @param {MongoClient} client 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} newList 
 */
async function insertar(client,baseDatos,coleccion,nuevoListado){
    const resultado = await client.db(baseDatos).collection(coleccion).insertOne(nuevoListado);
}



/**
 * Método que busca por medio de un filtro un objeto en una coleccion por medio de un 
 * cliente de mongoDB
 * 
 * @param {MongoClient} client 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} busqueda 
 * @returns un arreglo con todos los elementos que cumplen por el filtro, regresa un arreglo
 * vacio si no se encontro nada
 */
async function consultSearch_baseDatos(client,baseDatos,coleccion,busqueda){
    const resultado = await client.db(baseDatos).collection(coleccion).find(busqueda);
    const doc=[];
    for await (const index of result){
            doc.push(index);
    }
    if(doc.length == 0){'mongodb'
        console.log("No se ha encontrado elementos")
        throw new Error("No se ha encontrado elementos");
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
    const client = new MongoClient(uri);
    let registro = {
        "IATA" : IATA,
        "clima" : []
    };

    for(let i=0; i < nuevaL.list.length; i++){
        let finjson = JSON.stringify("{'"+nuevaL.list[i].dt+"': {}}")
        let creador = {
                  "dt": nuevaL.list[i].dt,
                  "main": {
                    "temperatura": nuevaL.list[i].main.temp,
                    "presion": nuevaL.list[i].main.pressure,
                    "humedad": nuevaL.list[i].main.humifity
                  },
        
                  "estado": nuevaL.list[i].weather.main,
                  "descripcion": nuevaL.list[i].weather.description,
                  "viento": {
                    "velocidad": nuevaL.list[i].wind.speed,
                    "direccion": nuevaL.list[i].wind.deg,
                    "fuerza": nuevaL.list[i].wind.gust
                  },
                  "visibilidad" : nuevaL.list[i].visibility,
                  "precipitacion": nuevaL.list[i].pop,
                  "lluvia": -1,
                  "nieve" : -1,
                  "dt_txt": "nuevaL.dt_txt"
        };

        if(nuevaL.list[i].rain !== null){
            creador.lluvia = nuevaL.list[i].rain['3h'];
        }
        if(nuevaL.list[i].snow !== null){
            creador.nieve = nuevaL.list[i].snow['3h'];
        }
        finjson[nuevaL.list[i].dt] = creador;
        registro.clima.push(finjson);
    }

    try {

        await client.connect();
        console.log("Conexion exitosa");
        const insertar = await insertar(client,baseDatos,coleccion,registro);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Conexion cerrada");
    }

}

/**
 * Método que inserta las ciudades y tickes como clecciones de la base de datos.
 * 
 * @param {String} baseDatos 
 * @param {String} coleccion
 * @param {JSON} ticketciudad
 */
async function insertarciudadticket(baseDatos,coleccion,ticketciudad){
    const client = new MongoClient(uri);
        try {
            await client.connect();
            console.log("Conexion exitosa")
            const insertar = await consultSearch_baseDatos(client,baseDatos,coleccion,ticketciudad);
    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Conexion cerrada");
        }
}



/**
 * Método que actualiza en la base de datos un apartado
 * "dt": nuevaL.list[i].dt,
 * @param {MongoClient} client 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} busqueda 
 * @param {JSON} actualizar 
 */
async function updateSearch_baseDatos(client,baseDatos,coleccion, busqueda, actualizar){
    await client.db(baseDatos).collection(coleccion).updateOne(busqueda,actualizar); //{ $set : { field : update}});
}


/**
 * 
 * Método que busca un certificado por medio de un filtro en una base de datos de mongoDB
 * 
 * @param {String} uri 
 * @param {String} baseDatos 
 * @param {JSON} busqueda
 * @returns un JSON con todos los certificados encontrados por medio del filtro
 */

// { "ticket " : "gvdgsvdgs"}
// { "IATA" : "MEX"}
// { $or : [{"IATA" : "MEX"},{"IATA" : "MTY"}]}

async function consultaBD(uri,baseDatos,coleccion,busqueda){
    
    const client = new MongoClient(uri);
    let consulta = [];

    try {
        await client.connect();
        console.log("Conexion exitosa")
        const consulta = await consultSearch_baseDatos(client,baseDatos,coleccion,busqueda);
        

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Conexion cerrada");
    }

    return consulta;
}

/**
 *  Funcion que devuelve el clima y IATA de la ciudad.
 * @param {String} uri 
 * @param {String} baseDatos 
 * @param {String} coleccion 
 * @param {JSON} busqueda 
 * @param {String} fechaUnix
 * @returns 
 */
async function consultaClima(uri,baseDatos,coleccion,busqueda,fechaUnix){
    
    const client = new MongoClient(uri);
    let consulta = [];

    try {
        await client.connect();
        console.log("Conexion exitosa")
        const temp = await consultSearch_baseDatos(client,baseDatos,coleccion,busqueda);
        if(temp.length != 0){
            for(let i=0; i< temp.length; i++){
                consulta.push({
                    "IATA": temp[i].IATA,
                    "clima": temp[i].clima[fechaUnix]

                })
            }
        }
        

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Conexion cerrada");
    }

    return consulta;
}

module.exports = {
    consultaClima,insertarclima, insertarciudadticket, consultaBD

}

/*const uri = "mongodb+srv://pruebaIGEF:IGEF2024@cluster0.mejzlcy.mongodb.net/?retryWrites=true&w=majority";
const database = "practice_certificate_checker";
*/
