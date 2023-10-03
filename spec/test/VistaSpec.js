/**
 * Clase para las pruebas unitarias de la vista de la aplicación, en este caso
 * se prueba la creación de etiquetas html
 */


/**
 * Método que construye la parte de un div que contiene una seccion
 * 
 * @param {String} llenado que se colocara dentro del div como encabezado
 * @returns un string en codigo html que representa el encabezado
 */

function llenaDivSeccion(llenado) {
    return'<div class="col">\n<div class="icon-box" data-aos="zoom-in-left">\n<h4 class="title">'+llenado+'</h4>\n</div>\n</div>\n';
}


/**
 * Método qu crea un icono para las pruebas
 * 
 * @param {String} llenado que se colocara dentro de un icono
 * @returns un string en codigo html que representa el icono
 */
function llenaIcono(llenado){
    icono = "";
    icono += '<div class="col">\n';
        icono += '<div class="icon-box" data-aspec os="zoom-in-left">\n';
        icono += '<h4 class="title">'+llenado+'</h4>\n';
        icono += '</div>\n';
    icono += '</div>\n';
    return icono
}

/**
 * Prueba para la creacion de un encabezado, se verifica los tres posibles encabezados
 * que tendra la vista
 */
describe('Prueba para la creacion de un encabezado', () => {
    const EtiquetasHTML = require('../../src/visual_aplicacion/EtiquetasHTML.js');
    const codigoHTML = require('../helpers/codigoHTML.json');
    let encabezado = codigoHTML.pruebaEncabezado.encabezado;
    let direccionImagen = codigoHTML.pruebaEncabezado.direccionImagen;
    for (let i = 0; i < encabezado.length; i++) {
        const ciudad = codigoHTML.pruebaEncabezado.encabezado[i];
        const estadoActual = codigoHTML.pruebaEncabezado.estado[i];
        let esperado = '<div class="container text center">\n';
        esperado += '<h1>'+ciudad+'</h1>\n<h3>Actualmente esta el '+estadoActual+'</h3>\n<div class="col">\n<img src="';
        esperado += direccionImagen+'" width="200">\n<img src="" width="200">\n</div>\n';
        esperado += '</div>\n';

        let resultado = EtiquetasHTML.encabezadoCiudad(ciudad,direccionImagen,estadoActual,"");
        it('Debe de ser el mismo codigo html de encabezado', () => {
            expect(esperado).toContain(resultado);
        });
        
    }
});

/**
 * Prueba para la creacion de una seccion, se verifica los dos posibles casos de encabezado
 */
describe('Prueba para la creacion de una seccion', () => {
    const EtiquetasHTML = require('../../src/visual_aplicacion/EtiquetasHTML.js');
    const codigoHTML = require('../helpers/codigoHTML.json');
    let encabezado = codigoHTML.pruebaSeccion.encabezado;
    let informacion = [];
    informacion.push(codigoHTML.pruebaSeccion.informacion[0]['Datos Generales']);
    informacion.push(codigoHTML.pruebaSeccion.informacion[1]['Caracteristicas de Viento']);
    informacion.push(codigoHTML.pruebaSeccion.informacion[2]['Otras Caracteristicas']);

    let esperado_datosGenerales ='<div class="container text-center">\n<div class="col" data-aos="fade-right">';
    esperado_datosGenerales += '\n<div class="row">\n<h3>Datos Generales</h3>\n';
    esperado_datosGenerales += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[0]['Datos Generales'][0]);
    esperado_datosGenerales += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[0]['Datos Generales'][1]);
    esperado_datosGenerales += '<div class="row">\n';
    esperado_datosGenerales += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[0]['Datos Generales'][2]);
    esperado_datosGenerales += '</div>\n</div>\n</div>\n';

    let esperado_caracteristicasViento ='<div class="container text-center">\n<div class="col" data-aos="fade-right">';
    esperado_caracteristicasViento += '\n<div class="row">\n<h3>Caracteristicas de Viento</h3>\n';
    esperado_caracteristicasViento += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[1]['Caracteristicas de Viento'][0]);
    esperado_caracteristicasViento += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[1]['Caracteristicas de Viento'][1]);
    esperado_caracteristicasViento += '<div class="row">\n';
    esperado_caracteristicasViento += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[1]['Caracteristicas de Viento'][2]);
    esperado_caracteristicasViento += '</div>\n</div>\n</div>\n';

    let esperado_otrasCaracteristicas ='<div class="container text-center">\n<div class="col" data-aos="fade-right">';
    esperado_otrasCaracteristicas += '\n<div class="row">\n<h3>Otras Caracteristicas</h3>\n';
    esperado_otrasCaracteristicas += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[2]['Otras Caracteristicas'][0]);
    esperado_otrasCaracteristicas += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[2]['Otras Caracteristicas'][1]);
    esperado_otrasCaracteristicas += '<div class="row">\n';
    esperado_otrasCaracteristicas += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[2]['Otras Caracteristicas'][2]);
    esperado_otrasCaracteristicas += llenaDivSeccion(codigoHTML.pruebaSeccion.informacion[2]['Otras Caracteristicas'][3]);
    esperado_otrasCaracteristicas += '</div>\n</div>\n</div>\n';
    
    let esperado = [esperado_datosGenerales,esperado_caracteristicasViento,esperado_otrasCaracteristicas];
    
    for (let i = 0; i < encabezado.length; i++) {
        const elemento = encabezado[i];
        const informacionActual = informacion[i];
        let resultado = EtiquetasHTML.cargarSeccion(elemento,informacionActual);
        it ('Debe de ser el mismo codigo html de seccion', () => {
            expect(esperado[i]).toContain(resultado);
        });
    }
});

/**
 * Prueba para la creacion de un icono, se verifica los tres posibles casos
 */
describe('Prueba el codigo html de un icono', () => {
    const EtiquetasHTML = require('../../src/visual_aplicacion/EtiquetasHTML.js');
    const codigoHTML = require('../helpers/codigoHTML.json');
    let informacion = codigoHTML.PruebaIcono;

    for (let i = 0; i < informacion.length; i++) {
        const elemento = informacion[i];
        let esperado = llenaIcono(elemento);
        let resultado = EtiquetasHTML.iconoCaracteristica(elemento);
        it('Debe de ser el mismo codigo html de icono', () => {
            expect(esperado).toContain(resultado);
        });
    }
});

/**
 * Prueba si la direccion de la imagen se encuentra bien
 */
describe('Prueba si la direccion esta bien', () => {
    const EtiquetasHTML = require('../../src/visual_aplicacion/EtiquetasHTML.js');
    const codigoHTML = require('../helpers/codigoHTML.json');
    let direccionImagen = codigoHTML.PruebaDireccionImagen.direccion;
    let estado = codigoHTML.PruebaDireccionImagen.estado;
    for (let i = 0; i < estado.length; i++) {
        const estadoActual = estado[i];
        let resultado = EtiquetasHTML.cargarImagen(estadoActual);
        it('Debe de ser la misma direccion', () => {
            expect(direccionImagen[i]).toContain(resultado);
        });
    }
});
