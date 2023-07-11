/* ************************************************************************** */
/* /src/components/handlebars/index.js - Contiene las rutas y controladores de los
 de handlebarsController.js. */
/* ************************************************************************** */

/* Importar el módulo de enrutador de Express */
const { Router } = require('express');

/* Importar el controlador de handlebars */
const handlebarsController = require('./handlebarsController/handlebarsController');

module.exports = (app) => {
  /*  Crear una nueva instancia del enrutador de Express */
  const router = new Router();

  /*  Registrar el enrutador en la aplicación principal */
  app.use('/', router);

  /* Definir las rutas y asignar los controladores correspondientes */

  router.get('/', handlebarsController.getInicio);
  router.get('/products', handlebarsController.getProducts);
  router.get('/carts/:cid', handlebarsController.getCartProductById);
  router.get('/home', handlebarsController.getHome);
  router.get('/realTimeProducts', handlebarsController.getRealTimeProducts);
  router.get('/chat', handlebarsController.getChat);
};
