// Importa el módulo que contiene las funciones a probar
const controlador = require('../../src/controlador_aplicacion/controlador.js');
const conexion = require('../../src/modelo_aplicacion/conexion.js');

describe('Pruebas para el Controlador', () => {
  // Prueba 1: Consulta por Ticket
  beforeAll(async () => {
      await conexion.vacia("test_climaConsulta", "ticket",{});
      await conexion.vacia("test_climaConsulta", "ciudad",{});
      await conexion.vacia("test_climaConsulta", "clima",{});

      const busqueda_clima = require('../helpers/pruebaControladorClima.json');
      const busqueda_ciudad = require('../helpers/pruebaControladorCiudad.json');
      const busqueda_ticket = [{
          "ticket" : "kw9f0kwvZJmsukQy",
          "ciudad_origen" : "JFK",
          "ciudad_destino" : "TLC",
      }];
      const insertado_ticket = await conexion.insertarVariosBD("test_climaConsulta", "ticket", busqueda_ticket);
      const insertado_clima = await conexion.insertarVariosBD("test_climaConsulta", "clima", busqueda_clima);
      const insertado_ciudad = await conexion.insertarVariosBD("test_climaConsulta", "ciudad", busqueda_ciudad);
      
  }, 10000);
  it('Debería devolver un resultado válido al consultar por ticket', async () => {
    const reqTicket = {
      query: {
        ticket: 'kw9f0kwvZJmsukQy',
        date: 1695762000000
              
      },
    };
    const resTicket = {
      status: (statusCode) => {
        expect(statusCode).toBe(200);
        return {
          json: (data) => {
            expect(data).toBeDefined();
            expect(data.busqueda).toBeDefined();
            expect(data.clima).toBeDefined();
          },
        };
      },
    };

    await controlador.obtenerClimaPorTicket(reqTicket, resTicket, "test_climaConsulta");

  },10000);

  // Prueba 2: Consulta por Ciudad
  it('Debería devolver un resultado válido al consultar por ciudad', async () => {
    const reqCiudad = {
      query: {
        ciudad: 'New York',
        date: 1695762000000
      },
    };
    const resCiudad = {
      status: (statusCode) => {
        expect(statusCode).toBe(200);
        return {
          json: (data) => {
            expect(data).toBeDefined();
            expect(data.busqueda).toBeDefined(); // Cambio en la estructura de respuesta
            expect(data.clima).toBeDefined();
          },
        };
      },
    };

    await controlador.obtenerClimaPorCiudad(reqCiudad, resCiudad, "test_climaConsulta");
  },10000);

  afterAll(async () => {
    await conexion.vacia("test_climaConsulta", "ticket",{});
    await conexion.vacia("test_climaConsulta", "ciudad",{});
    await conexion.vacia("test_climaConsulta", "clima",{});
  });

});