# Controlador de Consulta de Clima

El controlador de consulta de clima es una parte fundamental de la aplicación que se encarga de procesar las solicitudes de los usuarios y proporcionar datos climáticos. Este controlador contiene dos métodos principales: uno para obtener el clima por ticket y otro para obtener el clima por ciudad.

## Obtener Clima por Ticket

Este método permite a los usuarios obtener información climática utilizando un número de ticket y una ciudad. El proceso se puede resumir de la siguiente manera:

1. Verificar si se proporcionó un número de ticket y una ciudad. Si alguno de los dos no se proporciona, se devuelve un error.

2. Conectar con la base de datos de MongoDB, donde se almacenan los datos de los tickets.

3. Buscar el ticket proporcionado en la base de datos para obtener el código IATA de la ciudad de origen.

4. Utilizar el código IATA para consultar la API de OpenWeatherMap y obtener los datos climáticos.

5. Determinar el lapso de tiempo actual (mañana, tarde o noche) según la hora del día.

6. Agregar el lapso de tiempo a los datos climáticos y responder con los datos al usuario.

## Obtener Clima por Ciudad

Este método permite a los usuarios obtener información climática utilizando el nombre de una ciudad. El proceso se puede resumir de la siguiente manera:

1. Verificar si se proporcionó el nombre de una ciudad. Si no se proporciona, se devuelve un error.

2. Conectar con la base de datos de MongoDB, que contiene una colección de ciudades y sus códigos IATA.

3. Calcular la distancia de Levenshtein entre el nombre de la ciudad proporcionado y los nombres de las ciudades en la base de datos.

4. Encontrar la ciudad con la distancia de Levenshtein más pequeña (mejor coincidencia).

5. Utilizar el código IATA de la mejor coincidencia para consultar la API de OpenWeatherMap y obtener los datos climáticos.

6. Determinar el lapso de tiempo actual (mañana, tarde o noche) según la hora del día.

7. Agregar el lapso de tiempo a los datos climáticos y responder con los datos al usuario.

En ambos métodos, se manejan errores y excepciones para garantizar una experiencia de usuario fluida. Además, se utiliza una base de datos MongoDB para almacenar información relevante, como los códigos IATA de las ciudades y los datos de los tickets.

Este controlador es esencial para brindar a los usuarios la capacidad de acceder a datos climáticos en tiempo real de manera eficiente y precisa.
