/* ************************************************************************** */
/* /src/utils/sockets/socket.io.js - configuración de websockets */
/* ************************************************************************** */

/*  Importar el módulo 'socket.io' */
const { Server: SocketIO } = require('socket.io');

class SocketConfig {
  /* Variable estática para almacenar la instancia única de la clase */
  static instancia = undefined;

  constructor(server) {
    /* Si ya hay una instancia creada, devolverla en lugar de crear una nueva */
    if (SocketConfig.instancia) {
      return SocketConfig.instancia;
    }

    /* Si no hay una instancia creada, asignar esta instancia a la variable estática */
    SocketConfig.instancia = this;

    /* Crear una instancia de SocketIO pasando el objeto 'server' como argumento */
    this.io = new SocketIO(server);
    this.mensajes = [];

    /* Inicializar la configuración */
    this.init();
  }

  init() {
    try {
      /* Escuchar el evento 'connection' cuando un cliente se conecta al socket */
      this.io.on('connection', (socket) => {
        console.log('Cliente conectado');
        this.io.sockets.emit('init', this.mensajes);

        /* Escuchar el mensaje del usuario y emitirlo */
        socket.on('mensaje', (data) => {
          this.mensajes.push({ ...data });
          this.io.sockets.emit('nuevomensaje', this.mensajes);
        });

        /* Escuchar el evento 'newProduct' cuando un cliente envía un nuevo producto */
        socket.on('newProduct', (product) => {
          this.io.emit('newProduct', product);
        });

        /* Escuchar el evento 'updateProduct' cuando un cliente actualiza un producto */
        socket.on('updateProduct', (product) => {
          this.io.emit('updateProduct', product);
        });

        /* Escuchar el evento 'deleteProduct' cuando un cliente elimina un producto */
        socket.on('deleteProduct', (productId) => {
          this.io.emit('deleteProduct', productId);
        });

        /* Escuchar el evento 'disconnect' cuando un cliente se desconecta del socket */
        socket.on('disconnect', () => {
          console.log('Cliente desconectado');
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

/* Exportamos la instancia de 'SocketConfig' para su uso en otros archivos */
module.exports = SocketConfig;
