// Importa el módulo que contiene las funciones a probar
const controlador = require('../../src/controlador_aplicacion/controlador.js');

describe('Pruebas para el Controlador', () => {
  // Prueba 1: Consulta por Ticket
  it('Debería devolver un resultado válido al consultar por ticket', async () => {
    let date = new Date("2023-09-14")
    const reqTicket = {
      query: {
        ticket: 'kw9f0kwvZJmsukQy', // Cambio en la estructura de datos (query en lugar de body)
        date: date, // Agrega una fecha (puedes ajustarla según sea necesario)
      },
    };
    const resTicket = {
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

    await controlador.obtenerClimaPorTicket(reqTicket, resTicket);

  },10000);

  // Prueba 2: Consulta por Ciudad
  it('Debería devolver un resultado válido al consultar por ciudad', async () => {
    const reqCiudad = {
      query: {
        ciudad: 'New York', // Cambio en la estructura de datos (query en lugar de body)
        date: '2023-08-30', // Agrega una fecha (puedes ajustarla según sea necesario)
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

    await controlador.obtenerClimaPorCiudad(reqCiudad, resCiudad);
  },10000);

});
