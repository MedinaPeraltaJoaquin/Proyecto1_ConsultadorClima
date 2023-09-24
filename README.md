# Proyecto 1: Consulta de clima de aeropuerto
Los Web Services permiten a las organizaciones intercambiar datos sin necesidad de conocer los detalles de sus respectivos Sistemas de Informacion.
En este proyecto se debera hacer uso de estas herramientas para llevar a cabo una aplicacion que consulte en tiempo real el clima de ciudades dadas.

# Objetivo: 
Este proyecto se basa en la utilización de Web Services para desarrollar una aplicación innovadora que permite a los usuarios acceder en tiempo real a información climática de ciudades específicas. El objetivo principal es proporcionar datos precisos y actualizados sobre el clima de origen y destino para vuelos programados en el mismo día. Esta aplicación está diseñada con una interfaz intuitiva y accesible, dirigida tanto a usuarios técnicos como a aquellos que no tienen experiencia en programación.

#Características Principales de la Aplicación
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

# Entendiendo el problema:
-¿Que es lo que queremos obtener?
El clima de alguna ciudad dado un nombre de ciudad o un ticket o un un IATA.
-¿Cuales son los datos que tenemos para obtenerlo?
tenemos algunas bases de datos que tendran tickets asociados a ciudades en codigo IATA, y ciudades en codigo IATA.
-¿Son suficientes?
Sirven para poder trabajar y pensar en una solucion para el problema, asi que es un si.
-¿Que hace que el resulado obtenido resuelva el problema?
Que el programa sea capaz de mostrar dadas nuestras entradas un clima que el ususario indique y a su vez que el usuario pueda operar el programa sin problema.

# Requisitos funcionales y no funcionales:
-Funcionales: Se espera que el programa sea capaz de buscar el clima de una ciudad por su nombre, codiago IATA o ticket,
el programa podra consultar el clima tato de la ciudad de origen como el de la ciudad de destino.
-No funcionales: Se espera una eficiencia decente, una tolerancia a fallas robusta, se espera que sea amigable e ilustrativa para el ususario, que sea de facil escalabilidad y con alta seguridad gracias a el trabajo elegido con MERN.



