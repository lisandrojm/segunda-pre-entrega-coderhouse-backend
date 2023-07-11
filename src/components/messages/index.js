/* ************************************************************************** */
/* /src/components/messages/index.js - Contiene las rutas y controladores de 
messagesController.js. */
/* ************************************************************************** */

/* Importar el módulo de enrutador de Express */
const { Router } = require('express');

/* Importar el controlador de productos */
const messagesController = require('./messagesController/messagesController');

module.exports = (app) => {
  /* Crear una nueva instancia del enrutador de Express */
  const router = new Router();

  /* Registrar el enrutador en la aplicación principal */
  app.use('/api/chat', router);

  /* Definir las rutas y asignar los controladores correspondientes */
  router.get('/', messagesController.getAllMessages);
  router.post('/', messagesController.addUserMessage);
  router.delete('/:mid', messagesController.deleteUserMessage);
};
