/* ************************************************************************** */
/* /src/components/handlebars/handlebarscController/handlebarsController.js - Controlador de handlebars */
/* ************************************************************************** */

/* Importar el servicio de handlebars */
const HandlebarsServices = require('../handlebarsServices/handlebarsServices');

/* Definir la clase HandlebarsController */
class HandlebarsController {
  /* Función para obtener la página de inicio */
  getInicio = async (req, res, next) => {
    return await HandlebarsServices.getInicio(res);
  };
  /* Función para obtener la página home */
  getHome = async (req, res, next) => {
    return await HandlebarsServices.getHome(res);
  };
  /* Función para obtener los productos en tiempo real */
  getRealTimeProducts = async (req, res, next) => {
    return await HandlebarsServices.getRealTimeProducts(res);
  };
  /* Función para obtener los productos en tiempo real */
  getChat = async (req, res, next) => {
    return await HandlebarsServices.getChat(res);
  };
  /* Función para obtener el listado de productos */
  getProducts = async (req, res, next) => {
    const { limit, page, sort, query } = req.query;
    return await HandlebarsServices.getProducts(limit, page, sort, query, res);
  };
  /* Obtener un producto por ID */
  getCartProductById = async (req, res, next) => {
    /* Obtener el ID del carrito de los parámetros de la solicitud */
    const { cid } = req.params;
    /* Obtener el ID del carrito */
    const cartId = cid; // Agregar esta línea para obtener el ID del carrito

    /* Llamar al método getCartProductById de ProductsServices */
    return await HandlebarsServices.getCartProductById(cartId, res);
  };
}

/* Exportar una instancia de la clase HandlebarsController */
module.exports = new HandlebarsController();
