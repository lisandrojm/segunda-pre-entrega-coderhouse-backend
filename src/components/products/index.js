/* ************************************************************************** */
/* /src/components/products/index.js - Contiene las rutas y controladores de 
productsController.js. */
/* ************************************************************************** */

/* Importar el módulo de enrutador de Express */
const { Router } = require('express');

/* Importar el controlador de productos */
const productsController = require('./productsController/productsController');

const upload = require('../../utils/multer/multer');

module.exports = (app) => {
  /*  Crear una nueva instancia del enrutador de Express */
  const router = new Router();

  /*  Registrar el enrutador en la aplicación principal */
  app.use('/api/products', router);

  /* Definir las rutas y asignar los controladores correspondientes */
  /* Obtener todos los productos */
  router.get('/', productsController.getAllProducts);
  /* Obtener un producto por ID */
  router.get('/:pid', productsController.getProductById);
  /* Obtener un producto por ID */
  router.put('/:pid', productsController.updateProduct);
  /* Eliminar un producto */
  router.delete('/:pid', productsController.deleteProduct);
  /* Ruta para agregar un producto, se utiliza el middleware 'upload' para manejar la carga de imágenes */
  router.post('/', upload.array('image', 5), productsController.addProduct);
};
