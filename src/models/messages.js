/* ************************************************************************** */
/* /src/models/carts.js - Mongoose-definición de un esquema de carrito y 
creación de un modelo correspondiente */
/* ************************************************************************** */

/* Importar las clases Schema y model del módulo 'mongoose'. */
const { Schema, model } = require('mongoose');

/* Definir el esquema de mensaje */
const messageSchema = new Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true, collection: 'messages' }
);

// Agregar índice a los campos createdAt y updatedAt
messageSchema.index({ createdAt: 1, updatedAt: 1 });

/* Crear el modelo del mensaje */
const Message = model('Message', messageSchema);

/* Exportar solo el modelo */
module.exports = {
  Message,
};
