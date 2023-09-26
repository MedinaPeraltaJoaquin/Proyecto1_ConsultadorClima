// Importa el módulo que contiene las funciones a probar
const controlador = require('../src/controlador_aplicacion/controlador');

describe('Pruebas para el Controlador', () => {
  // Prueba 1: Consulta por Ticket
  it('Debería devolver un resultado válido al consultar por ticket', async () => {
    const reqTicket = {
      body: {
        ticket: 'ABC123',
      },
    };
    const resTicket = {
      status: (statusCode) => {
        expect(statusCode).toBe(200);
        return {
          json: (data) => {
            expect(data).toBeDefined();
            expect(data.main).toBeDefined();
          },
        };
      },
    };

    await controlador.consultaPorTicket(reqTicket, resTicket);
  });

  // Prueba 2: Consulta por Ciudad
  it('Debería devolver un resultado válido al consultar por ciudad', async () => {
    const reqCiudad = {
      body: {
        city: 'New York',
      },
    };
    const resCiudad = {
      status: (statusCode) => {
        expect(statusCode).toBe(200);
        return {
          json: (data) => {
            expect(data).toBeDefined();
            expect(data.main).toBeDefined();
          },
        };
      },
    };

    await controlador.consultaPorCiudad(reqCiudad, resCiudad);
  });

  // Prueba 3: Algoritmo de Levenshtein
  it('Debería corregir la ciudad utilizando el algoritmo de Levenshtein', async () => {
    const ciudadIncorrecta = 'New Yark';
    const ciudadCorregida = 'New York';

    const db = {
      collection: () => {
        return {
          find: () => {
            return {
              toArray: () => {
                return [{ origin: 'New York' }];
              },
            };
          },
        };
      },
    };

    const mejorCoincidencia = await controlador.corregirCiudad(ciudadIncorrecta, db);
    expect(mejorCoincidencia.origin).toEqual(ciudadCorregida);
  });
});
