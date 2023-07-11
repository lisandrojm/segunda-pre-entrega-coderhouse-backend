/* ************************************************************************** */
/* /src/components/carts/index.js - Contiene las rutas y controladores de  
cartsController.js. */
/* ************************************************************************** */

/* Importar el módulo de enrutador de Express */
const { Router } = require('express');

/* Importar el controlador de carrito */
const carritoController = require('./cartsController/cartsController');

module.exports = (app) => {
  /* Crear una nueva instancia del enrutador de Express */
  const router = new Router();

  /* Registrar el enrutador en la aplicación principal */
  app.use('/api/carts', router);

  /* Definir las rutas y asignar los controladores correspondientes */
  /* Agregar un carrito nuevo */
  router.post('/', carritoController.addCart);
  /* Obtener los productos de un carrito por su ID */
  router.get('/:cid', carritoController.getCartProductById);
  /* Agregar un producto a un carrito */
  router.post('/:cid/product/:pid', carritoController.addProductToCart);
  /* Eliminar un carrito */
  router.delete('/:cid', carritoController.deleteCart);
  ///////////////////////////////////////////////////////////////////////////
  /* Nuevos endpoints */
  /* Eliminar un producto del carrito */
  router.delete('/:cid/product/:pid', carritoController.deleteProductFromCart);
  /* Actualizar el carrito con un arreglo de productos */
  router.put('/:cid', carritoController.updateCart);
  /* Actualizar la cantidad de ejemplares de un producto en el carrito */
  router.put('/:cid/product/:pid', carritoController.updateProductQuantity);
  /* Eliminar todos los productos del carrito */
  router.delete('/:cid/products', carritoController.deleteAllProductsFromCart);
};
