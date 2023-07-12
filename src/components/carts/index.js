/* ************************************************************************** */
/* /src/components/carts/index.js - Contiene las rutas y controladores de  
cartsController.js. */
/* ************************************************************************** */

/* Importar el módulo de enrutador de Express */
const { Router } = require('express');

/* Importar el controlador de carrito */
const cartsController = require('./cartsController/cartsController');

module.exports = (app) => {
  /* Crear una nueva instancia del enrutador de Express */
  const router = new Router();

  /* Registrar el enrutador en la aplicación principal */
  app.use('/api/carts', router);

  /* Definir las rutas y asignar los controladores correspondientes */
  /* Agregar un carrito nuevo */
  router.post('/', cartsController.addCart);
  /* Obtener los productos de un carrito por su ID */
  router.get('/:cid', cartsController.getCartProductById);
  /* Agregar un producto a un carrito */
  router.post('/:cid/product/:pid', cartsController.addProductToCart);
  /* Eliminar un carrito */
  router.delete('/:cid', cartsController.deleteCart);
  ///////////////////////////////////////////////////////////////////////////
  /* Nuevos endpoints */
  /* Eliminar un producto del carrito */
  router.delete('/:cid/product/:pid', cartsController.deleteProductFromCart);
  /* Actualizar el carrito con un arreglo de productos */
  router.put('/:cid', cartsController.updateCart);
  /* Actualizar la cantidad de ejemplares de un producto en el carrito */
  router.put('/:cid/product/:pid', cartsController.updateProductQuantity);
  /* Eliminar todos los productos del carrito */
  router.delete('/:cid/products', cartsController.deleteAllProductsFromCart);
};
