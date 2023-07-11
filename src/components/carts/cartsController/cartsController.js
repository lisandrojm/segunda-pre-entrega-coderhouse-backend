/* ************************************************************************** */
/* /src/components/carts/cartsController/cartsController.js - controlador de los carritos. */
/* ************************************************************************** */

/* Importar el servicio de carritos */
const cartsService = require('../cartsServices/cartsServices');

/* Definir la clase 'CartsController' */
class CartsController {
  /* Agregar un carrito */
  addCart = async (req, res, next) => {
    return await cartsService.addCart(res);
  };

  /* Obtener los productos de un carrito por su ID */
  getCartProductById = async (req, res, next) => {
    const { cid } = req.params;
    return await cartsService.getCartProductById(cid, res);
  };

  /* Agregar un producto a un carrito */
  addProductToCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    return await cartsService.addProductToCart(cid, pid, quantity, res);
  };

  /* Eliminar un carrito */
  deleteCart = async (req, res, next) => {
    const { cid } = req.params;
    return await cartsService.deleteCart(cid, res);
  };
  ///////////////////////////////////////////////////////////////////////////
  /* Nuevos métodos */
  /* Eliminar un producto del carrito */
  deleteProductFromCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    return await cartsService.deleteProductFromCart(cid, pid, res);
  };

  /* Actualizar el carrito con un arreglo de productos */
  updateCart = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;
    await cartsService.updateCart(cid, products, res);
  };

  /* Actualizar la cantidad de ejemplares de un producto en el carrito */
  updateProductQuantity = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartsService.updateProductQuantity(cid, pid, quantity, res);
  };

  /* Eliminar todos los productos del carrito */
  deleteAllProductsFromCart = async (req, res, next) => {
    const { cid } = req.params;
    await cartsService.deleteAllProductsFromCart(cid, res);
  };
}

/* Exportar una instancia de la clase 'CartsController' */
module.exports = new CartsController();
