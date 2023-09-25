require('dotenv').config();

process.env.base_datos = "prueba_consultaClima"
process.env.coleccion_clima = "clima"
process.env.coleccion_ciudad = "ciudad"
process.env.coleccion_ticket = "ticket"
process.env.uri = "mongodb+srv://pruebaIGEF:IGEF2024@cluster0.mejzlcy.mongodb.net/?retryWrites=true&w=majority"
process.env.api_openweather = "840e22170caf08fd45442d15f26ee98b";
process.env.PATH_CSV = "../../dataset2.csv"

/**
 * Método que añade los datos de ticket y ciudad en la base datos desde un csv.
 * 
 * @param {String} direccionCSV en donde se encuentra la informacion de los tickets.
 * @return regresa un arreglo con todos los elementos subidos
 */
async function agregaInformacionCSV(direccionCSV){
    let csvToJson = require('convert-csv-to-json');
    const conexion = require('./conexion.js');


    const json = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(direccionCSV);
    let ciudades = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_ciudad,{});
    await conexion.vacia(process.env.base_datos,process.env.coleccion_ciudad,{});
    if(ciudades[0] == undefined){
        ciudades[0] = {};
    }

    if(ciudades[1] == undefined){
        ciudades[1] = {"ciudades":[]};
    }
    let  ticketArreglo = [];
    let tickets = {};
    
    for(let i=0; i<json.length; i++){
        const elemento = json[i];
        tickets ={
            "ticket" : elemento.num_ticket,
            "ciudad_origen" : elemento.origin,
            "ciudad_destino": elemento.destination,
        }
        ticketArreglo.push(tickets)
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
            };
            ciudades[1]["ciudades"].push(elemento.destination);
        }
    }

    //await conexion.insertarVariosBD(process.env.base_datos,process.env.coleccion_ticket,ticketArreglo);
    await conexion.insertarVariosBD(process.env.base_datos,process.env.coleccion_ciudad,ciudades);
    return {
        "ticketsAlta": ticketArreglo,
        "ciudadesAlta": ciudades
    };
}

/**
 * Método que actuliza los climas de la base de datos.
 */
async function actualizaClimaBasedeDatos(){
    const conexion = require('./conexion.js');
    var fs = require('fs');

    let recuperaClima = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_clima,{});
    if(recuperaClima.length != 0){
        fs.appendFile("./climaBD.json", JSON.stringify(recuperaClima), async function (err) {
            if (err) throw err;
            await conexion.vacia(process.env.base_datos,process.env.coleccion_clima,{});
        });
    }
    
    let climas = [];
    let ciudades = await conexion.consultaBD(process.env.base_datos,process.env.coleccion_ciudad,{});
    if(ciudades.length == 0){
        ciudades = [{},{"ciudades":[]}];
    }
    
    console.log(new Date().toDateString())
    for(let i=0; i<ciudades[1]["ciudades"].length; i++){
        console.log("Iteracion: "+i)
        const referencia = ciudades[1]["ciudades"][i];
        const ciudad = ciudades[0][referencia];
        const clima = await realizaPeticion(ciudad);

        if(clima != undefined){
            let verificadoInsertar = await conexion.insertarclima(process.env.base_datos,process.env.coleccion_clima,clima,ciudad.IATA);
            if(verificadoInsertar){
                console.log(clima.list[0].dt)
                climas.push(clima);
            }      
        }
        await petateate(4);
    }
    console.log(new Date().toDateString())

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

async function realizaPeticion(ciudad){
    let url = "https://api.openweathermap.org/data/2.5/forecast?lat="+ciudad.coordenadas.latitud+"&lon="+ciudad.coordenadas.longitud+"&lang=es&appid="+process.env.api_openweather;
    let respuesta = await fetch(url);
    console.log(respuesta.status);
    return respuesta.status != 200 ? undefined : await respuesta.json();
}


actualizaClimaBasedeDatos().then((resultado) =>{
    console.log(JSON.stringify(resultado));
}).catch((error) =>{
    console.log(error);
});