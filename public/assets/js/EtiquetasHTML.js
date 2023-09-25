/**
 * Clase que tiene como fin construir los etiquetados necesarios de html
 * para la página web al mostrar resultados de busqueda
 */

/**
 * Método que construye un encabezado para la página html
 * 
 * @param {string} titulado correspondiente
 * @param {string} direccionImagen el cual se colocara una imagen
 * @returns una cadena que representa el código en html
 */
function encabezadoCiudad(titulado,direccionImagen,estado,animacion){
    encabezado = '<div class="container text center">';
        encabezado += '<h1>'+titulado+'</h1>\n';
        encabezado += '<h3>Actualmente esta el '+estado+'</h3>\n';
        encabezado += '<div class="col">\n';
            encabezado += '<img src="'+direccionImagen+'" width="200">\n'
            encabezado += '<img src="'+animacion+'" width="200">\n'
        encabezado += '</div>\n'
    encabezado += '</div>\n' 
    return encabezado;
}

/**
 * Método que cargar una seccion de html que muestra la informacion dada
 * 
 * @param {String} encabezado que acompañara a la seccion
 * @param {Array<String>} informacion que estara dentro de la seccion
 * @returns una cadena que representa una cadena html
 */
function cargarSeccion(encabezado,informacion) {
    seccion ='<div class="container text-center">';;
    seccion += '<div class="col" data-aos="fade-right">';
    seccion +='<div class="row">\n';
    seccion += '<h3>'+encabezado+'</h3>\n'
    cantidadDiv = 1;
    for (let i = 0; i < informacion.length; i++) {
        const elemento = informacion[i];
        if((i+1) % 3 == 0){
            seccion += '<div class="row">\n';
            seccion += iconoCaracteristica(elemento);
        }else{
            seccion += iconoCaracteristica(elemento);
        }
        
    }

    for(let i = 0; i < cantidadDiv; i++){
        seccion += '</div>\n'
    }
    seccion += '</div>\n'
    seccion += '</div>\n'

    return seccion;
}   

/**
 * Método que carga un html con un icono con alguna informacion
 * dentro
 * 
 * @param {String} informacion 
 * @returns una cadena que representa un icono en html
 */
function iconoCaracteristica(informacion){
    icono = "";
    icono += '<div class="col">\n';
        icono += '<div class="icon-box" data-aos="zoom-in-left">\n';
        icono += '<h4 class="title">'+informacion+'</h4>\n';
        icono += '</div>\n';
    icono += '</div>\n';
    return icono;
}

/**
 * Método que dependiendo del estado del clima, manda la direccion en memoria de
 * la imagen correspondiente
 * 
 * @param {string} estadoClima
 * @returns una cadena con la direccion de memoria
 */
function cargarImagen(estadoClima){
    direccion = "";
    tipo = {
        'Thunderstorm' : 'assets/img/estadoClima/Thunderstorm.jpg',
        'Drizzle' : 'assets/img/estadoClima/Drizzle.jpg',
        'Rain' : 'assets/img/estadoClima/Rain.jpg',
        'Snow' : 'assets/img/estadoClima/Snow.jpg',
        'Clear' : 'assets/img/estadoClima/Clear.jpg',
        'Clouds' : 'assets/img/estadoClima/Clouds.jpg',
    }

    atmosfera = "assets/img/estadoClima/Atmosphere.jpg";
    return tipo[estadoClima] !== undefined ? tipo[estadoClima] : atmosfera;
}

/**
 * Método que carga la seccion de datos generales del clima de una ciudad
 * que incluye la temperatura, presion y humedad
 * 
 * @param {JSON} clima_elemento 
 * @returns una cadena con los datos en html
 */
function cargarDatosGenerales(clima_elemento){
    datosGenerales = "";
    temperatura = "Temperatura: " + clima_elemento.main.temperatura;
    presion = "Presion: " + clima_elemento.main.presion;
    humedad = "Humedad: " + clima_elemento.main.humedad;
    informacion = [temperatura,presion,humedad];
    datosGenerales = cargarSeccion("Datos generales: ", informacion);

    return datosGenerales;
}

/**
 * Método que carga la seccion de caracteristicas del viento del clima de una ciudad
 * que incluye la velocidad, direccion y fuerza
 * 
 * @param {JSON} clima_elemento 
 * @returns una cadena con los datos en html
 */
function cargarCaracteristicasViento(clima_elemento){
    caracteristicas_viento = "";
    viento_velocidad = "Velocidad: "+clima_elemento.viento.velocidad;
    viento_direccion = "Direccion: "+clima_elemento.viento.direccion;
    viento_fuerza = "Rafaga: "+clima_elemento.viento.fuerza;
    informacion = [viento_velocidad,viento_direccion,viento_fuerza];
    caracteristicas_viento += cargarSeccion("Caracteristicas de viento: ",informacion);
    return caracteristicas_viento;
}

/**
 * Método que carga la seccion de otros datos del clima de una ciudad
 * que incluye visibilidad, precipitacion, nivel de lluvia y de nieve
 * 
 * @param {JSON} clima_elemento 
 * @returns una cadena con los datos en html
 */
function cargarOtrosDatos(clima_elemento){
    otros_datos = "";
    visibilidad = "visibilidad: "+clima_elemento.visibilidad;
    informacion = [visibilidad];
    precipitacion = "Precipitacion: "+clima_elemento.precipitacion;
    informacion.push(precipitacion);
    if(clima_elemento.lluvia != (-1)){
        lluvia = "Nivel de lluvia: "+clima_elemento.lluvia;
        informacion.push(lluvia);
    }

    if(clima_elemento.nieve != (-1)){
        nieve = "Nivel de nieve: "+clima_elemento.nieve;
        informacion.push(nieve);
    }
    
    otros_datos += cargarSeccion("Otras caracteristicas",informacion);
    return otros_datos;

}

/**
 * Método que carga los datos del clima en el html
 * 
 * @param {JSON} climaData 
 * @param {string} busqueda 
 * @returns un cadena en html que representa los datos del clima
 */
function cargarHTML(climaData, busqueda){
    let html = "";
    html += '<div class="container text-center">';
    html += '<div class="section-title" data-aos="zoom-out" >\n<p>Resultado por '+busqueda+': </p>\n';
    html += '<h3>Consultado: ' + new Date().toString() +'<h3></div>';
    html += '</div>\n';

    let encabezado_ciudad = climaData.clima.length > 1 ? ["de origen: ","de destino: "] : ["consultada: "];
    let avionAnimacion = climaData.clima.length > 1 ? "" : "assets/img/avionAnimacion.gif";

    html += '<!--Inicio seccion-->'
    html += '<div class="container text-center">\n';
    html += '<div class="row mt-6">\n';
    for (let i = 0; i < climaData.clima.length; i++) {
        const elemento = climaData.clima[i];
        let imagenCiudad = cargarImagen(elemento.clima.estado);
        let nombreCiudad = climaData.busqueda.ciudad[i].nombre;
        html += '<div class="col" data-aos="fade-right">';
        html += encabezadoCiudad('Ciudad '+ encabezado_ciudad[i] + '<br>' +nombreCiudad + '<br>',
                                imagenCiudad,elemento.clima.descripcion,avionAnimacion);
            html += cargarDatosGenerales(elemento.clima);
            html += cargarCaracteristicasViento(elemento.clima);
            html += cargarOtrosDatos(elemento.clima);
        html += '</div>\n'
        html += '</div>\n'
        html+='</div>\n'
        html += '<!--Fin seccion-->'   
    }    
    html += '</div>\n';
    html+='</div>\n'


    return html;
}
