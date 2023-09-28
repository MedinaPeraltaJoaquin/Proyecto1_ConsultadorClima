/**
 * 
 * Clase para las pruebas unitarias del modelo
 */

describe("insetarclima", function(){
  const conexion = require('../../src/modelo_aplicacion/conexion.js');
  const baseDatos = process.env.base_datos;
  const coleccion = process.env.coleccion_clima;
  
  const entradajson = { "city":{
      "id":3999707,
      "name":"Las Ladrilleras",
      "coord":{
          "lat":25.7785,
          "lon":-100.107},
          "country":"MX",
          "population":0,
          "timezone":-21600,
          "sunrise":1694435084,
          "sunset":1694479790
      },
      "cod": "200",
      "message": 0,
      "cnt": 40,
      "list": [
        {
          "dt": 1694498400,
          "main": {
            "temp": 303.33,
            "feels_like": 303.56,
            "temp_min": 299.69,
            "temp_max": 303.33,
            "pressure": 1013,
            "sea_level": 1013,
            "grnd_level": 970,
            "humidity": 44,
            "temp_kf": 3.64
          },
          "weather": [
            {
              "id": 800,
              "main": "Clear",
              "description": "cielo claro",
              "icon": "01n"
            }
          ],
          "clouds": {
            "all": 0
          },
          "wind": {
            "speed": 4.52,
            "deg": 112,
            "gust": 7.78
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
            "pod": "n"
          },
          "dt_txt": "2023-09-12 06:00:00"
        } ,
        {
          "dt": 1694509200,
          "main": {
            "temp": 300.09,
            "feels_like": 301.23,
            "temp_min": 297.56,
            "temp_max": 300.09,
            "pressure": 1012,
            "sea_level": 1012,
            "grnd_level": 969,
            "humidity": 61,
            "temp_kf": 2.53
          },
          "weather": [
            {
              "id": 800,
              "main": "Clear",
              "description": "cielo claro",
              "icon": "01n"
            }
          ],
          "clouds": {
            "all": 0
          },
          "wind": {
            "speed": 2.83,
            "deg": 94,
            "gust": 4.82
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
            "pod": "n"
          },
          "dt_txt": "2023-09-12 09:00:00"
        }
      ]
  };
  const jsonesperado = [{"IATA": "MTY",
  "clima":
    {
      "1694498400" : {
      "dt": 1694498400,
      "main": {
        "temperatura": 303.33,
        "presion": 1013,
        "humedad": 44
      },
      "estado": "Clear",
      "descripcion": "cielo claro",
      "viento": {
        "velocidad": 4.52,
        "direccion": 112,
        "fuerza": 7.78
      },
      "lluvia": -1,
      "nieve": -1,
      "precipitacion": 0,
      "dt_txt": "2023-09-12 06:00:00"
    }},
      "1694509200" : {
      "dt": 1694509200,
      "main": {
        "temperatura": 300.09,
        "presion": 1012,
        "humedad": 61
      },
      "estado": "Clear",
      "descripcion": "cielo claro",
      "viento": {
        "velocidad": 2.83,
        "direccion": 94,
        "fuerza": 4.82
      },
      "lluvia": -1,
      "nieve" : -1,
      "precipitacion": 0,
      "dt_txt": "2023-09-12 09:00:00"
    }}];
  it("deberia generar archivo",() =>{
      conexion.insertarclima(baseDatos,coleccion,entradajson,"MTY").then((resultado) =>{
        expect(true).toEqual(resultado);
      });
      conexion.consultaBD(baseDatos,coleccion,{"IATA":"MTY"}).then((resultado) =>{
        expect(jsonesperado).toEqual(resultado);
      });
  });
});

describe("consultarclima", function(){
const conexion = require('../../src/modelo_aplicacion/conexion.js');
const baseDatos = process.env.base_datos;
const coleccion = process.env.coleccion_clima;
const jsonesperado = [{"IATA": "MTY",
"clima": [
  {
    "dt": 1694498400,
    "main": {
      "temperatura": 303.33,
      "presion": 1013,
      "humedad": 44
    },
    "estado": "Clear",
    "descripcion": "cielo claro",
    "viento": {
      "velocidad": 4.52,
      "direccion": 112,
      "fuerza": 7.78
    },
    "lluvia": -1,
    "nieve": -1,
    "precipitacion": 0,
    "dt_txt": "2023-09-12 06:00:00"
  },
  {
    "dt": 1694509200,
    "main": {
      "temperatura": 300.09,
      "presion": 1012,
      "humedad": 61
    },
    "estado": "Clear",
    "descripcion": "cielo claro",
    "viento": {
      "velocidad": 2.83,
      "direccion": 94,
      "fuerza": 4.82
    },
    "lluvia": -1,
    "nieve" : -1,
    "precipitacion": 0,
    "dt_txt": "2023-09-12 09:00:00"
  }]}];

it("deberia generar archivo",() =>{
    conexion.consultaBD(baseDatos,coleccion,{"IATA":"MTY"}).then((resultado) =>{
      expect(jsonesperado).toEqual(resultado);
    });
});


});
