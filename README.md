# Proyecto 1: Consulta de clima de aeropuerto
Los Web Services permiten a las organizaciones intercambiar datos sin necesidad de conocer los detalles de sus respectivos Sistemas de Informacion.
En este proyecto se debera hacer uso de estas herramientas para llevar a cabo una aplicacion que consulte en tiempo real el clima de ciudades dadas.

# Objetivo: 
Este proyecto se basa en la utilización de Web Services para desarrollar una aplicación innovadora que permite a los usuarios acceder en tiempo real a información climática de ciudades específicas. El objetivo principal es proporcionar datos precisos y actualizados sobre el clima de origen y destino para vuelos programados en el mismo día. Esta aplicación está diseñada con una interfaz intuitiva y accesible, dirigida tanto a usuarios técnicos como a aquellos que no tienen experiencia en programación.

# Características Principales de la Aplicación
Entradas Versátiles: La aplicación acepta una variedad de tipos de entrada, incluyendo el número de ticket y las coordenadas de latitud y longitud de origen y destino. Además, implementa un enfoque tolerante a errores, lo que significa que los usuarios pueden ingresar nombres de ciudades mal escritos sin problemas.

Obtención de Datos Climáticos: Aprovechando los servicios web, la aplicación consulta la API de OpenWeatherMap para recopilar información climática precisa en tiempo real. Esto garantiza que los usuarios tengan acceso a datos actualizados y relevantes.

Experiencia de Usuario Amigable: La interfaz de usuario está diseñada para ser fácil de usar y comprender. Esto es especialmente importante dado que el público objetivo incluye a sobrecargos, pilotos y clientes promedio que no necesariamente tienen experiencia en programación.

# Entorno de trabajo:

En este proyecto, se trabajara con MERN stack, el cual esta pensado para aplicaciones web con las siguientes herramientas:

- MongoDataBase: Es una aplicacion de base de datos no relacional, que guarda la informacion en archivos JSON y contine su propia sintaxis para realizar las consultas. Su filosofia consiste en la informacion guardadas en documentos, los cuales pueden ser consultados.

- Express: Es un frameworks para aplicaciones web para node js, el cual se encarga de construir una sólida infrastructura y con el se puede el manejo de rutas, webpack, errores y backend para el llamado a la aplicacion de node js. 

- React: Es una libreria mantenida y desarrollada por Facebook para el desarrollo de frontend para darle más limpieza al código, organizacion y mejor interaccion entre el usuario y el servidor.

- Node Js: Es un entorno de tiempo de ejecucion para la parte del servidor, basando su sintaxis en Javascript y en el control de eventos, y diseñado para la simplificacion de la comunicacion debido a que no tiene subprocesos y de esta manera aprovechar multiples nucleos en su entorno y compartir sockets entre procesos.
  
- Dotenv: Una herramienta de entorno que sirve para ocultar claves de acceso que no querriamos que fueran visibles, vease claves de api la uri de consulta de mongo, los identificadores de las colecciones, nombre de la base de datos etc.
  
- Jasmine: Una herramienta para los unit test en javascript que proporciona atajos para que el diseño de las pruebas sea mas facil. 

- Levenshtein: Un algoritmo que detecta y corrige errores tipográficos en las ciudades ingresadas por los usuarios y encuentra coincidencias cercanas cuando los nombres de las ciudades no son exactos. Esto garantiza que incluso con entradas de usuario con errores, la aplicación pueda proporcionar datos climáticos precisos.

- Node-cron: Es una biblioteca utilizada para programar tareas periódicas (cron jobs) en la aplicación, como el registro de consultas y la actualización de datos climáticos.

# Entendiendo el problema:
-¿Que es lo que queremos obtener?
El clima de alguna ciudad dado un nombre de ciudad o un ticket o un un IATA.
-¿Cuales son los datos que tenemos para obtenerlo?
tenemos algunas bases de datos que tendran tickets asociados a ciudades en codigo IATA, y ciudades en codigo IATA.
-¿Son suficientes?
Sirven para poder trabajar y pensar en una solucion para el problema, asi que es un si.
-¿Que hace que el resulado obtenido resuelva el problema?
Que el programa sea capaz de mostrar dadas nuestras entradas un clima que el ususario indique y a su vez que el usuario pueda operar el programa sin problema.

# Proceso de solucion de problemas
Pseudo codigo para los metodos de vista (clase visualizador):
-Funcion cargarClima, recibe una referencia String con nombre url.
variable response <- metodo fetch(url)
Si response.status != 200{
throw new Error("Error al conslutar el clima")
}
variable data = response.json
regresa data
-Funcion remplazarDatos, recibe una referencia String con el nombre busqueda y una referencia JSON con el nombre climaData.
variable section <- ddocument.querySelector('resultados')
constante eqtiquetaHTML <- requiere paquete EtiquetasHTML.js
section.insertAdjacentHTM('beforebegin',etiquetaHTML.cargarClima(climaData,busqueda))

-Funcion cargarDatosTicket()
variable fecha <- new Date()
variable form <- document.querySelector('.form')
form.addEventListener('sumbit', sub funcion(event){
event.preventDefault()
variable ticket <- document.querySelecto('#ticket').value
variable url <- consulta coleccion ticket de mongo con variables ticket y fecha.getTime()
try{
variable climaDAta <- metodo cargarClima que recibe la variable url
metodo remplazarDatos que recibe la variable climaData y string "ticket"
}
catch{ 
window.alert("mensaje de errror")
}
})

-Funcion cargarDatosCiudad.
variable form <- document.querySelector('.form')
form.addEventListener('sumbit', sub funcion(event){
event.preventDefault()
variable ciudad <- document.querySelecto('#ciudad').value
variable url <- consulta coleccion ciudad de mongo con variables ciudad y fecha.getTime()
climaData <- metodo cargarClima que recibe la variable url
ClimaData.then(funcion datos => { funcion remplazarDatosTicket que recibe variable datos, string "ciudad")}).Error(async function(error producido de datos){
console.log(error)
window.alert("mensaje de error")
})
})

Pseudocodigo para metodos de modelo.
Clase conexion:
-Método insertar, recibe cliente de mongo, referencia en string de base de datos referencia a coleccion en string y un JSON llamado nuevo listado.
constante resultado <- metodo insertOne de mongo
regresar resultado

-Método busquedadeconsultaBD recibe cliente de mongo, referencia en string de base de datos referencia a coleccion en string y un JSON llamado busqueda
constante resultado <- metodo find de mongo con la busqueda
constante doc[]
Para cada constate indice de resultado{
agrega indice a doc
}
Si la logitud de doc == 0 {
'mongodb'throw new Error("No se ha encontrado elementos");
}
regresa doc



-Método insertaclima, recibe referencia en string de base de datos, referencia a coleccion en string, referencia en string a un codigo IATA y un JSON llamado nuevaL(el forecast de openweather).
constante uri<- uri de la base de datos de mongoDB
constante cliente <- nuevo cliente de mongo
variable registro <- json que contiene IATA y un sub json de nombre clima
para cada elemento i=0; i<longitud de nuevaL; i++{
variable creador <- un json con la informacion requerida sacada de nueva list(dt, main, temperatura,presion,humedad,estado,descripccion,viento,velocidad,direccion,fuerza,visibilidad,precipitacion,lluvia,nieve,fecha)
Si nuevaL.list[i].rain !== undefined{
creador.lluvia<-nuevaL.list[i].rain en  3 horas
}
Si nuevaL.list[i].snow !== undefined{
creador.nieve<-nuevaL.list[i].snow en  3 horas
}
registro.clima[nuevaL.list[i].dt]<- creador
}
variable insertado <- false
try{
esperar conexion de cliente
insertado <- insertar(cliente,baseDatos,coleccion,registro)
} catch{ error }
finally{
espera cerrar la conexion con el cliente
}
regresa el insertado.

-Método insertarciudadticket, recibe referencia en string de base de datos, referencia a coleccion en string y un JSON llamado ticketciudad.
constante uri <- uri de la abse de datos
costante cliente <- nuevo cliente de mongo
variable insertado <- false
try{
espera conexion de cliente
insertado <- insertar(cliente,baseDatos,coleccion,ticketciudad)
} catch{ error}
finally{
espera que el cliente cierre
}
regresa insertado.

-Método consultaBD, recibe  referencia en string de base de datos, referencia a coleccion en string y un JSON llamado busqueda.
constante uri <- uri de la abse de datos.
costante cliente <- nuevo cliente de mongo
variable consulta []
try{
espera conexion de cliente
consulta <- busquedadeconsultaBD(cliente,base de datos, coleccion, busqueda).
} catch{error}
finally{
espera cierre de conexion del cliente
}
regresa consulta.

-Método vacia, recibe  referencia en string de base de datos, una referencia a coleccion en string y un json que sera el filtro.
constante uri <- uri de la abse de datos.
costante cliente <- nuevo cliente de mongo
variable eliminar <- false
try{
espera conexion de cliente
metodo deleteMany de mongo con el filtro
} catch{error}
finally{
espera cierre de conexion del cliente
}
regresa elminar.

-Método consultaClima, recibe  referencia en string de base de datos, referencia a coleccion en string , un JSON llamado busqueda y la fecha unix en string.
constante uri <- uri de la base de datos de mongo
constante cliente <- nuevo cliente de mongo
variable consulta <- []
try{
espera conecion de cliente
constante consultado <- busquedadeconsultaBD(cliente,base de datos, coleccion, busqueda)
Si la longitud de consultado es diferente de 0{
Para cada elementeo i=0 hasta i<longitud de temp i++
agrega a consulta (objeto json con IATA <- i-esimo elemento de consultado con el valor del IATA 
clima <- i-esmo elemento de consultado con el valor clima y su fecha unix
}catch{error}
finally{
espera cierre de conecion de cliente
}
regresa consulta.

-Método insetarVariosBD, recibe  referencia en string de base de datos, una referencia a coleccion en string y un json que sera el nuevoListado. 
constante uri <- uri de la base de datos de mongo
costante cliente <- nuevo cliente de mongo
variable insertado <- false
try{
espera conexion de cliente
insertado<- metodo inserMany de mongo
}catch{error
}finally{
espera cierre de conexion de cliente
}
regresa insertado.

Clase actualizabd:
-Método agregaInformacionCSV, recibe una  referencia string llamada direccionCSV
variable csvToJson <- requiere el paquete 'convert csv to json'
constante conexion <- requiere clase conexion
constante json <- csvToJson.metodos de converttojson para direccionCSV
variable ciudades <-metodo consultaBD de conexion con la base de datos de mongo, la coleccion ciudad de mongo y un json vacio{}
metodo de conexion vacia con la base de datos de mongo, la coleccion ciudad de mongo y un json vacio{}
Si ciudades[0] == undefined{
ciudades[0]= {}
}
Si ciudades[1] == undefined{
ciudades[1]= {"ciudades":[]}
}
variable ticketarreglo = []
variable tickets = {}
Para cada elemento i=0 hasta i<longitud de json; i++{
constante lemento <- json[i]
tickets = elemento json que contiene ticket <- num_ticket del elemento, ciudad_origen <- origien del elemento, ciudad destino <- destino del elemento.
agregar tickets en ticketArreglo
Si ciudades[0][elemento.origin]== undefined {
ciudades[0][elemento.origin] <- elemento json con ciudad teniendo una string vacia, cordenadas latitud, longitud y IATA extraidos del elemento.origin
agregar elemento.origin a ciudades[1]["ciudades"]
}
Si ciudades[0][elemento.destination]== undefined {
ciudades[0][elemento.destination] <- elemento json con ciudad teniendo una string vacia, cordenadas latitud, longitud y IATA extraidos del elemento.destinaton
agregar elemento.destination a ciudades[1]["ciudades"]
}

ciudades[elemento.destination] <- elelmento json con IATA<- elemento.destination
conexion.insertarciudadticket(base de datos,ciudad,ciudad_destino);
}
conexion.insertarVariosBD(base de datos de mongo, coleccion ciudad de mongo, ciudades)
regresa un objeto json con ticketsAlta <- ticketArreglo, ciudadesAlta <- ciudades.

-Método actualizaclimabd
constante conexion <- requiere clase conecion
variable fs <- requiere paquete fs
variable recuclim <- conexion.consultaBD(base de datos mongo,clima mongo,{})
Si longitud de recuclim != 0{
fs.appendFile("./climaBD.json", JSON.stringify(recuclim), async function (err) {
            if (err) throw err)
metodo vacia de conexion con la base de datos de mongo, la coleccion ciudad de mongo, {}
}
variable climas <- []
variable ciudades <- conexion.consultaBD con base de datos de mongo, coleccion ciudad de mongo, {}.
Si longitud de ciudades == 0{
ciudades <- [{},{"ciudades":[]}]
}
Para cada elemento i=0 hasta i< longitud de ciudades[1]["ciudades"] i++{
constante referencia <-ciudades[1]["ciudades"][i];
constante ciudad <-ciudades[0][referencia];;
 constante clima <- metodo realizaPeticion con ciudad;
Si clima != undefined{
variable verificadoInsetar <- metodo instertar clima de conexion con base de datos de mongo, coleccion clima de mongo,clima,ciudad.IATA
Si verificadoInsertar{
agrega clima a climas
}
}
metodo petateate(4)
}
regresa climas.

-Método petateate, recibe un entero que sera la duracion de dormir en segundos el programa.
regresa una nueva promesa que dado el metodo timeout le dara la duracion del entero*1000 milisegundos para que siempre sean segundos. 

-Método realizaPeticion, recibe una referencia String con el nombre de ciudad.
variable url <- llamada de la api de openwether con la latitud y longitud de la ciudad y la apikey
variable respuesta <- metodo fetch de url
Si respuesta.status != 200{
regresa undefined
} en otro caso
regresa  el metodo.json de la respuesta.

# Requisitos funcionales y no funcionales:
-Funcionales: Se espera que el programa sea capaz de buscar el clima de una ciudad por su nombre, codiago IATA o ticket,
el programa podra consultar el clima tato de la ciudad de origen como el de la ciudad de destino.
-No funcionales: Se espera una eficiencia decente, una tolerancia a fallas robusta, se espera que sea amigable e ilustrativa para el ususario, que sea de facil escalabilidad y con alta seguridad gracias a el trabajo elegido con MERN.



