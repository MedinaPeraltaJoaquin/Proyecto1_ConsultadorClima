// Importa el módulo que contiene las funciones a probar
const controlador = require('../src/controlador_aplicacion/controlador');

describe('Pruebas para el Controlador', () => {
  // Prueba 1: Consulta por Ticket
  it('Debería devolver un resultado válido al consultar por ticket', async () => {
    const reqTicket = {
      query: {
        ticket: 'ABC123', // Cambio en la estructura de datos (query en lugar de body)
        date: '2023-08-30', // Agrega una fecha (puedes ajustarla según sea necesario)
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
  });

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
  });

  // Prueba 3: Algoritmo de Levenshtein
  it('Debería corregir la ciudad utilizando el algoritmo de Levenshtein', async () => {
    const ciudadIncorrecta = 'New Yark';
    const ciudadCorregida = 'New York';

    // Simula una función de consulta en la base de datos
    const consultaBD = async () => {
      return [{ ciudad: ciudadCorregida }];
    };

    const mejorCoincidencia = await controlador.corregirCiudad(ciudadIncorrecta, consultaBD);
    expect(mejorCoincidencia).toEqual(ciudadCorregida);
  });
});
