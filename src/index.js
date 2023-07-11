/* ************************************************************************** */
/* /src/index.js - Punto de entrada principal para la ejecución de la aplicación */
/* ************************************************************************** */

/* Importar el módulo 'express' para crear y configurar la aplicación del servidor */
const express = require('express');

/* Importar el módulo 'cors' para manejar la configuración de CORS */
const cors = require('cors');

/* Importar el módulo 'path' para trabajar con rutas de archivos y directorios */
const path = require('path');

/* Importar el módulo 'express-handlebars' para configurar Handlebars */
const expressHandlebars = require('express-handlebars');

/* Importar el módulo 'socket.io' para configurar Socket.io */
const SocketConfig = require('./utils/sockets/socket.io'); /* Importar la clase SocketConfig */

const routes = require('./routes');
require('dotenv').config();
require('./config/mongo');

const PORT = process.env.PORT || 3001;

/* Definir la clase 'Server' */
class Server {
  constructor() {
    /* Crear una nueva instancia de la aplicación de Express */
    this.app = express();

    /* Llamar al método 'settings' para configurar la aplicación */
    this.settings();

    /* Llamar al método 'routes' para definir las rutas de la aplicación */
    this.routes();

    /* Llamar al método 'views' para configurar la carpeta de las vistas y el motor de plantillas views */
    this.views();

    /* Llamar al método 'middlewares' para configurar los middlewares */
    this.middlewares();

    /* Llamar al método 'socket' para configurar Socket.io */
    this.socket();
  }

  /* Configurar la aplicación */
  settings() {
    /* Utilizar el middleware de Express para el manejo de JSON */
    this.app.use(express.json());

    /* Utilizar el middleware de Express para el manejo de datos codificados en la URL */
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    /* Establecer de manera estática la carpeta 'public' */
    this.app.use(express.static(path.join(__dirname, '/public')));
  }

  /* Definir las rutas de la aplicación y elegir entre MongoDB o FileSystem */
  routes() {
    routes(this.app);
  }

  /* Configurar la carpeta de las vistas y el motor de plantillas */
  views() {
    /* Configurar Handlebars como motor de plantillas */
    const handlebars = expressHandlebars.create({
      defaultLayout: 'main',
    });

    /* Establecer la ruta de las vistas como la carpeta 'views' */
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.engine('handlebars', handlebars.engine);
    this.app.set('view engine', 'handlebars');
  }

  /* Configurar los middlewares de la aplicación */
  middlewares() {
    /* Añadir el middleware de CORS con origen permitido "*" */
    this.app.use(cors('*'));
  }

  /* Configurar Socket.io */
  socket() {
    const server = require('http').createServer(this.app);
    /* Crear una instancia de SocketConfig con el servidor */
    const socketConfig = new SocketConfig(server);
    /* Acceder al objeto io desde la instancia de SocketConfig */
    this.app.io = socketConfig.io;
  }

  /* Iniciar el servidor */
  listen() {
    const server = this.app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });

    this.app.io.attach(server);
  }
}

/* Exportar una instancia de la clase Server para su uso en otros archivos */
module.exports = new Server();
