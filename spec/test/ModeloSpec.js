/*
 * 
 * Clase para las pruebas unitarias del modelo, en especifico
 * en la conexion a la base de datos.
 */
describe('Prueba de insertar clima a la base de datos', () => {
  const conexion = require('../../src/modelo_aplicacion/conexion.js');
  const pruebaInsertar = require('../helpers/pruebaInsertarClima.json');

  /*
  * Metodo que verifica y comprueba que se halla insertado el clima correctamente en la base de datos.
  * @param test_climaConsulta la base de datos de prueba en mongoDB.
  * @param clima, la coleccion donde se guardaran los datos insertados.
  */
  
  it('deberia insertar un clima a la base de datos y verificar si es lo mismo', async () => {
    await conexion.vacia("test_climaConsulta", "clima", {});
    let insertado = await conexion.insertarclima("test_climaConsulta", "clima", pruebaInsertar[0], "MTY");
    expect(insertado).toBe(true);
    let consultado = await conexion.consultaBD("test_climaConsulta", "clima", { "IATA" : "MTY"});

    let respuesta = {
      "IATA" : consultado[0].IATA,
      "clima" : consultado[0].clima
    }

    expect(pruebaInsertar[1]).toEqual(respuesta);
    await conexion.vacia("test_climaConsulta", "clima", {});
  },10000);
});

describe('prueba de insertar una ciudad o ticket a la base de datos', () => {
  const conexion = require('../../src/modelo_aplicacion/conexion.js');
  require('dotenv').config();

  let busqueda = [
    {
      "YVR": {
        "ciudad": "Vancouver",
        "coordenadas": {
          "latitud": 49.1939,
          "longitud": -123.184
        },
        "IATA": "YVR"
      },"CDG": {
        "ciudad": "Paris",
        "coordenadas": {
          "latitud": 49.0128,
          "longitud": 2.55
        },
        "IATA": "CDG"
      }
    },
    {
      "ciudades" : ["YVR","CDG"]
    }
  ]
  
  /*
  * Metodo que verifica si se insertaron datos a la base de datos y si la busqueda es correcta en ciudades.
  * @param test_climaConsulta la base de datos de prueba en mongoDB.
  * @param ciudad, la coleccion donde se guardaran los datos insertados.
  */
  it('deberia insertar un dato a la base de datos y buscar lo que se inserto', async () => {
    let insertado = await conexion.insertarVariosBD("test_climaConsulta", "ciudad", busqueda);
    expect(insertado).toBe(true);
    let consultado = await conexion.consultaBD("test_climaConsulta", "ciudad", {});
    expect(busqueda).toEqual(consultado);
    await conexion.vacia("test_climaConsulta", "ciudad", {});
  },10000);

});

describe('prueba de consulta a la base de datos', () => {
  const conexion = require('../../src/modelo_aplicacion/conexion.js');
  require('dotenv').config();

  let busqueda = [{
    "ticket": "kw9f0kwvZJmsukQy",
    "ciudad_origen": "TLC",
    "ciudad_destino": "MTY"
  }];

  /*
  * Metodo que verifica y comprueba que la consulta de la base de datos sea correcta en tickets.
  * @param test_climaConsulta la base de datos de prueba en mongoDB.
  * @param ticket, la coleccion donde se guardaran los datos insertados.
  */

  it('deberia ser igual a la busqueda de la consulta', async () => {
    let insertado = await conexion.insertarVariosBD("test_climaConsulta", "ticket", busqueda);
    if(insertado){
      let consulta = await conexion.consultaBD("test_climaConsulta", "ticket", {"ticket" : "kw9f0kwvZJmsukQy"});
      expect(busqueda[0]).toEqual(consulta[0]);
      await conexion.vacia("test_climaConsulta", "ticket", {});
    }else{
      fail("No se pudo insertar el ticket");
    }
    
  },10000);
});

describe('prueba de consulta de clima a la base de datos', () => {
  const conexion = require('../../src/modelo_aplicacion/conexion.js');
  require('dotenv').config();
  const pruebaInsertar = require('../helpers/pruebaInsertarClima.json');

  let esperado = pruebaInsertar[3];
  let insertar = pruebaInsertar[2];
  let fechaUnix = '1695621600';

  /*
  * Metodo que verifica y comprueba que la consulta del clima sea correcta.
  * @param test_climaConsulta la base de datos de prueba en mongoDB.
  * @param clima, la coleccion donde se guardaran los datos insertados.
  */
  it('deberia insertar un dato a la base de datos', async () => {
    await conexion.vacia("test_climaConsulta", "clima", {});
    let insertado = await conexion.insertarVariosBD("test_climaConsulta", "clima", [insertar]);
    if(insertado){
      let consulta = await conexion.consultaClima("test_climaConsulta", "clima", {"IATA" : "MEX"}, fechaUnix);
      expect([esperado]).toEqual(consulta);
      await conexion.vacia("test_climaConsulta", "clima", {});
    }else{
      fail("no se pudo insertar el elemento")
    }
  },10000);

});

describe('prueba de limpiar un json csv', () => {
  const actualizabd = require('../../src/modelo_aplicacion/actualizabd.js');
  let csvToJson = require('convert-csv-to-json');
  let direccionCSV = './spec/helpers/pruebaCSV.csv';
  let esperado = require('../helpers/pruebaCSV.json');

  const datosCSV = csvToJson.formatValueByType().fieldDelimiter(',').getJsonFromCsv(direccionCSV);
  const ciudades = [{},{"ciudades" : []}];
  
  /*
  * Metodo que verifica y comprueba que se obtengan los datos del csv a JSON correctamente.
  * @param datosCSV, la direccion del CSV que contiene los datos.
  * @param ciudades, la coleccion donde estan los datos esperados.
  */
  
  it('deberia limpiar un json csv', async () => {
    let resultado = await actualizabd.obtenerTicketsCiudades(datosCSV,ciudades);
    expect(esperado).toEqual(resultado);
  });

});
