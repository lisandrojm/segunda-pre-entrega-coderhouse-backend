/* ************************************************************************** */
/* /src/components/handlebars/handlebarscController/handlebarsController.js - Controlador de handlebars */
/* ************************************************************************** */

/* Importar el servicio de handlebars */
const HandlebarsServices = require('../handlebarsServices/handlebarsServices');

/* Definir la clase HandlebarsController */
class HandlebarsController {
  /* Función para obtener la página de inicio */
  getInicio = async (req, res, next) => {
    await HandlebarsServices.getInicio(res);
  };
  /* Función para obtener la página home */
  getHome = async (req, res, next) => {
    await HandlebarsServices.getHome(res);
  };
  /* Función para obtener los productos en tiempo real */
  getRealTimeProducts = async (req, res, next) => {
    await HandlebarsServices.getRealTimeProducts(res);
  };
  /* Función para obtener los productos en tiempo real */
  getChat = async (req, res, next) => {
    await HandlebarsServices.getChat(res);
  };
  /* Función para obtener el listado de productos */
  getProducts = async (req, res, next) => {
    const { limit, page, sort, query } = req.query;
    await HandlebarsServices.getProducts(limit, page, sort, query, res);
  };
  /* Función para obtener la página de inicio */
  getCartById = async (req, res, next) => {
    await HandlebarsServices.getCartById(res);
  };

  /* Obtener un producto por ID */
  getCartProductById = async (req, res, next) => {
    /* Obtener el ID del carrito de los parámetros de la solicitud */
    const { cid } = req.params;
    /* Llamar al método getCartProductById de ProductsServices */
    await HandlebarsServices.getCartProductById(cid, res);
  };
}

/* Exportar una instancia de la clase HandlebarsController */
module.exports = new HandlebarsController();
