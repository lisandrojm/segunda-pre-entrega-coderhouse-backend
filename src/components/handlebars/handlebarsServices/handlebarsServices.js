/* ************************************************************************** */
/* /src/components/handlebars/handlebarsServices/handlebarsServices.js -
Servicios de handlebars */
/* ************************************************************************** */

/* Importar la conexión a la base de datos */
const { connection } = require('../../../config/mongo');
/* Importar el servicio de products */
const ProductsServices = require('../../products/productsServices/productsServices');
const CartsServices = require('../../carts/cartsServices/cartsServices');

/* Definir la clase HandlebarsServices */
class HandlebarsServices {
  /* Función auxiliar para obtener los datos de una colección */
  async getInicio(res) {
    try {
      return res.render('inicio', { success: true, title: 'Inicio', style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }
  async getCollectionData(collectionName, res) {
    try {
      /* Obtener la conexión a la base de datos */
      const database = connection;
      const collection = database.collection(collectionName);
      /* Obtener los datos de la colección */
      const data = await collection.find().toArray();
      return data;
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  /* Función para obtener la página de inicio */
  async getHome(res) {
    try {
      /* Obtener los productos de la colección 'products' */
      const products = await this.getCollectionData('products');
      return res.render('home', { success: true, title: 'Home', products, style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  /* Función para obtener los productos en tiempo real */
  async getRealTimeProducts(res) {
    try {
      /* Obtener los products de la colección 'productos' */
      const products = await this.getCollectionData('products');
      return res.render('realTimeProducts', { success: true, title: 'Real Time Products', products, style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  async getChat(res) {
    try {
      return res.render('chat', { success: true, title: 'Chat', style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  /* Nuevo método */
  /* Función para obtener los productos y mostrarlos en /src/views/products.handlebars  */
  async getProducts(limit, page, sort, query, res) {
    try {
      const products = await ProductsServices.getProducts(limit, page, sort, query, res);
      const context = {
        success: true,
        title: 'Productos',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
      };

      return res.render('products', context);
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  async getCartById(res) {
    try {
      /* Obtener los carts de la colección 'carts' y renderizar la vista 'carts' */
      const carts = await this.getCollectionData('carts');
      return res.render('carts', { success: true, title: 'Carts', carts, style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }
  async getCartProductById(cid, res) {
    try {
      /* Obtener los productos del carrito por su ID */
      const cartProducts = await CartsServices.getCartAllProductsById(cid, res);

      const context = {
        success: true,
        title: 'Carts',
        carts: cartProducts,
        style: 'index.css',
      };

      return res.render('carts', context);
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error getCartProductById Handlebars' });
    }
  }
}

/* Exportar una instancia de la clase HandlebarsServices */
module.exports = new HandlebarsServices();
