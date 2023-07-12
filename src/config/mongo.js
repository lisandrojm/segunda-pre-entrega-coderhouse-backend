/* ************************************************************************** */
/* /src/config/mongo.js - configuracion de mongoose. */
/* ************************************************************************** */

/* Importar el módulo mongoose para trabajar con la base de datos MongoDB */
const mongoose = require('mongoose');

/* Importar el objeto 'db' del archivo actual './' */
const { db } = require('./index');

mongoose.set('debug', false); // Modo de depuración activado (solo para desarrollo)
mongoose.set('strictQuery', false); // Validación estricta de consultas desactivada (tener cuidado)

/* Declarar una variable 'connection' */
let connection;

/* Establecer la conexión a la base de datos MongoDB utilizando la URL proporcionada en 'db.mongo_atlas' */
/* Se configuran algunas opciones adicionales, como el uso del nuevo analizador de URL, la utilización de la topología unificada y el nombre de la base de datos */
mongoose.connect(db.mongo_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME, // Utilizar la variable de entorno en lugar del valor directo
});

/* Obtener la conexión de Mongoose */
connection = mongoose.connection;

/* Manejar el evento 'connected' para verificar la conexión exitosa */
connection.on('connected', () => {
  console.log('Conexión exitosa a la base de datos');
});

/* Manejar el evento 'error' en caso de que ocurra un error durante la conexión */
connection.on('error', (error) => {
  console.error('Error en la conexión a la base de datos:', error);
});

/* Exportar el objeto 'connection' para que pueda ser utilizado en otros archivos */
module.exports = { connection };
