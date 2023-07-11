/* /src/models/carts.js - Mongoose-definición de un esquema de carrito y creación de un modelo correspondiente */
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/* Definir el esquema de carrito */
const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { collection: 'carts' }
);

/* Aplicar la paginación al modelo de carrito */
cartSchema.plugin(mongoosePaginate);

/* Crear el modelo de carrito */
const Cart = model('Cart', cartSchema);

/* Exportar el modelo */
module.exports = {
  Cart,
};
