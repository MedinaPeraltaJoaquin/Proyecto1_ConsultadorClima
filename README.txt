Para la ejecucion del programa

Especificaciones técnicas de la aplicación:

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

 
Para la ejecucion del programa:

Esta guia se divide en dos secciones la cual se enfocara en la compilacion del
servidor de la aplicacion y de la visualizacion de la página web.


Para la compilacion del servidor:

Es necesario descargar el programa Node JS en el cual, las instrucciones de
instalacion son distintos dependiendo del sistema operativo. En este caso se 
trabajo en Linux.

Para su descarga e instalacion consultar la página de Node JS en el siguiente enlace:
https://nodejs.dev/en/download/package-manager/

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



Para la visualizacion de la pagina web

Es necesario haber inicializado el servidor según las indicaciones anteriores,
debera de ingresar a un navegador web y colocar en la url la siguiente direccion

        localhost:8000/

Con esto se desplegara la pagina web en una página principal, y de ahipor medio de botones
podra ser dirigidado a las páginas de consulta por ticket y por ciudad (IATA)



Configuración de un archivo .env

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

