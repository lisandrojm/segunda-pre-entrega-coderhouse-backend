/* ************************************************************************** */
/* /src/components/messages/messagesController/messagesController.js -  
controlador de los productos. */
/* ************************************************************************** */

//* Importar el servicio de mensajes */
const MessagesServices = require('../messagesServices/messagesServices');

/* Definir la clase 'MessagesController' */
class MessagesController {
  /* Agregar un nuevo mensaje de usuario */
  addUserMessage = async (req, res, next) => {
    /* Obtener los datos del mensaje de los campos de payload */
    const payload = req.body;
    /* Llamar al método addUserMessage de MessagesServices */
    await MessagesServices.addUserMessage(payload, res);
  };
  getAllMessages = async (req, res, next) => {
    /* Llamar al método getAllProducts de ProductsServices */
    await MessagesServices.getAllMessages(res);
  };
  deleteUserMessage = async (req, res, next) => {
    /* Obtener el ID del producto de los parámetros de la solicitud */
    const { mid } = req.params;
    /* Llamar al método deleteProduct de ProductsServices */
    await MessagesServices.deleteUserMessage(mid, res, req);
  };
}

/* Exportar una instancia de la clase 'MessagesController' */
module.exports = new MessagesController();
