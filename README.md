# Proyecto 1: Consulta de clima de aeropuerto

Los Web Services permiten a las organizaciones intercambiar datos sin necesidad de conocer los detalles de sus respectivos Sistemas de Informacion.
En este proyecto se debera hacer uso de estas herramientas para llevar a cabo una aplicacion que consulte en tiempo real el clima de ciudades dadas.

## Colaboradores del proyecto
  - Comas Castañeda Mauricio Santiago 
  - Eslava Mendoza Fernando
  - Medina Peralta Joaquin

## Objetivo: 

Este proyecto se basa en la utilización de Web Services para desarrollar una aplicación innovadora que permite a los usuarios acceder en tiempo real a información climática de ciudades específicas. El objetivo principal es proporcionar datos precisos y actualizados sobre el clima de origen y destino para vuelos programados en el mismo día. Esta aplicación está diseñada con una interfaz intuitiva y accesible, dirigida tanto a usuarios técnicos como a aquellos que no tienen experiencia en programación.

## Características Principales de la Aplicación

Entradas Versátiles: La aplicación acepta una variedad de tipos de entrada, incluyendo el número de ticket y las coordenadas de latitud y longitud de origen y destino. Además, implementa un enfoque tolerante a errores, lo que significa que los usuarios pueden ingresar nombres de ciudades mal escritos sin problemas.

Obtención de Datos Climáticos: Aprovechando los servicios web, la aplicación consulta la API de OpenWeatherMap para recopilar información climática precisa en tiempo real. Esto garantiza que los usuarios tengan acceso a datos actualizados y relevantes.

Experiencia de Usuario Amigable: La interfaz de usuario está diseñada para ser fácil de usar y comprender. Esto es especialmente importante dado que el público objetivo incluye a sobrecargos, pilotos y clientes promedio que no necesariamente tienen experiencia en programación.

## Entorno de trabajo:

En este proyecto, se trabajara con MERN stack, el cual esta pensado para aplicaciones web con las siguientes herramientas:

- MongoDataBase: Es una aplicacion de base de datos no relacional, que guarda la informacion en archivos JSON y contiene su propia sintaxis para realizar las consultas. Su filosofia consiste en la informacion guardadas en documentos para su facil consulta.

- Express: Es un frameworks para aplicaciones web para node js, el cual se encarga de construir una sólida infrastructura y con el se puede el manejo de rutas, webpack, errores y backend para el llamado a la aplicacion de node js. 

- React: Es una libreria mantenida y desarrollada por Facebook para el desarrollo de frontend para darle más limpieza al código, organizacion y mejor interaccion entre el usuario y el servidor.

- Node Js: Es un entorno de tiempo de ejecucion para la parte del servidor, basando su sintaxis en Javascript y en el control de eventos, y diseñado para la simplificacion de la comunicacion debido a que no tiene subprocesos y de esta manera aprovechar multiples nucleos en su entorno y compartir sockets entre procesos.
  
- Dotenv: Una herramienta de entorno que sirve para ocultar claves de acceso que no querriamos que fueran visibles, vease claves de api la uri de consulta de mongo, los identificadores de las colecciones, nombre de la base de datos etc.
  
- Jasmine: Una herramienta para los unit test en javascript que proporciona atajos para que el diseño de las pruebas sea mas facil. 

- Levenshtein: Un algoritmo que detecta y corrige errores tipográficos en las ciudades ingresadas por los usuarios y encuentra coincidencias cercanas cuando los nombres de las ciudades no son exactos. Esto garantiza que incluso con entradas de usuario con errores, la aplicación pueda proporcionar datos climáticos precisos.

- Node-cron: Es una biblioteca utilizada para programar tareas periódicas (cron jobs) en la aplicación, como el registro de consultas y la actualización de datos climáticos.

- OpenWeather : Una API de obtencion de informacion del clima de una ciudad.

## Entendiendo el problema:

-¿Que es lo que queremos obtener?
  El clima de alguna ciudad dado un nombre de ciudad o un ticket o un un IATA.

-¿Cuales son los datos que tenemos para obtenerlo?
  tenemos algunas bases de datos que tendran tickets asociados a ciudades en codigo IATA, y ciudades en codigo IATA.
  
-¿Son suficientes?
  Sirven para poder trabajar y pensar en una solucion para el problema, asi que es un si.
  
-¿Que hace que el resulado obtenido resuelva el problema?
  Que el programa sea capaz de mostrar dadas nuestras entradas un clima que el ususario indique y a su vez que el usuario pueda operar el programa sin problema.

## Requisitos funcionales y no funcionales:

### Funcionales:

- Datos de entrada:
    - Un cadena de texto de 16 caracteres que representa el identificador de un ticket de la parte visual del programa por parte del
      usuario y del servidor un archivo csv
    - Una cadena de texto con el nombre de la ciudad que desea obtener su clima de la parte visual del programa por parte del
      usuario y del servidor un archivo csv

- Datos de salida:
    - El clima de las ciudades consultadas del usuario, en un json con destino al visualizador del programa
 
### No funcionales: 

- Eficiencia: se busca la obtencion de los datos de manera rápida, en especifico en complejidad O(n)
  
- Tolerancia a fallas. se busca que el programa sea robusto ante possibles errores por parte del usuario, es decir
  al ingresar el nombre de una ciudad, se espera que aunque este mal, se encuentre aun asi al clima más parecido

- Amigabilidad: se busca que el usuario pueda interactuar de manera sencilla al programa.
  
- Escabilidad: solo es necesario una aplicacion que pueda regresar el clima por el momento.
  
- Seguridad : es necesario que la informacion de los tickets no sea visible ante el usuario debido a la importancia
  de estos, ya que se puede encontrar toda la informacion de cada vuelo.

## Para la ejecucion del programa

### Especificaciones técnicas de la aplicación:

En esta aplicacion se utilizo las siguientes paqueterias:

- Dependencias de npm:
    - axios : 0.21.1
    - convert-csv-to-json : 2.0.0
    - dotenv : 16.3.1
    - express : 4.18.2
    - fast.levenshtein : 3.0.0
    - mongodb : 6.1.0
    - node-cron : 3.0.2

- Dependencias de desarrollo de npm
    - dotenv : 16.3.1
    - jasmine : 3.0.2

- Aplicacion para correr el servidor
    - Node.js : 20.6.1

 
### Para la ejecucion del programa:

Esta guia se divide en dos secciones la cual se enfocara en la compilacion del
servidor de la aplicacion y de la visualizacion de la página web.


#### Para la compilacion del servidor:

Es necesario descargar el programa Node JS en el cual, las instrucciones de
instalacion son distintos dependiendo del sistema operativo. En este caso se 
trabajo en Linux.

Para su descarga e instalacion consultar la página de Node JS en el siguiente enlace:
https://nodejs.dev/en/download/package-manager/

La recomendacion para Linux, es instalar los archivos binarios y agregarlos a las
variables de entorno del sistema.

Teniendo ya instalado node JS y haber descargado la carpeta desde el repositorio
en la terminal del sistema colocado en la carpeta, realizar lo siguiente:

        npm install jasmine

Con esto tendria descargado la paqueteria para realizar las pruebas y ya no es
necesario descargar algo más manualmente.

Para realizar las pruebas del programa es necesario lo siguiente en la terminal

        npm test

Para inicializar el servidor debera de ejecutar el siguiente comando sobre la carpeta
del proyecto:

        npm start

Para finalizar el programa es necesario hacer Ctrl + C, ya que de otro modo, no se podra
ocupar el puerto 8000


#### Para la visualizacion de la pagina web

Es necesario haber inicializado el servidor según las indicaciones anteriores,
debera de ingresar a un navegador web y colocar en la url la siguiente direccion

        localhost:8000/

Con esto se desplegara la pagina web en una página principal, y de ahipor medio de botones
podra ser dirigidado a las páginas de consulta por ticket y por ciudad (IATA)



### Configuración de un archivo .env

El proyecto utiliza un archivo `.env` para gestionar las variables de entorno. Debes crear este archivo 
en la raíz del proyecto y configurarlo con tus valores específicos. Puedes utilizar el archivo `env_example.txt` como guía.

Aquí hay un ejemplo de cómo podría ser el contenido del archivo `.env`:

- Contraseña para las peticiones a API de openWeather:
	
      api_openweather=8000

- Puerto en el que se ejecutará el servidor

      PORT=8000

- Ruta para los archivos CSV en donde se obtendra la informacion de Tickets

      PATH_CSV= "./data/tickets.csv"

- Ruta donde se guardarán la informacion del clima de la base de datos
 
      PATH_guardar= "./data/"

- Uri para la conexion a la base de datos de MongoDB, el siguiente ejemplo es para la conexion
  a la base de datos en ATLAS.

	  uri= "mongodb+srv://<user>:<password>@cluster0.mejzlcy.mongodb.net/?retryWrites=true&w=majority"
	  
- Nombre de la base de datos MongoDB

      base_datos= #clima_db

- Colecciones en la base de datos en donde se encuentran los tickets, ciudad y clima

      coleccion_ticket= #tickets
      coleccion_ciudad= #ciudades
      coleccion_clima= #clima







