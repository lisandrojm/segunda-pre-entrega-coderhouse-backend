/* ************************************************************************** */
/* /src/components/products/productsServices/productsServices.js -
 controlador de los productos. */
/* ************************************************************************** */

/* Importar el modelo de producto */
const { Product } = require('../../../models/products');

/* Definir la clase 'ProductsServices' */
class ProductsServices {
  /* Obtener todos los productos */
  getAllProducts = async (limit, page, sort, query, res) => {
    try {
      /* Configuración de las opciones de paginación y ordenamiento */
      const options = {
        /* Número máximo de productos por página (valor predeterminado: 10) */
        limit: limit ? parseInt(limit) : 10,
        /* Página actual (valor predeterminado: 1) */
        page: page ? parseInt(page) : 1,
        /* Orden de clasificación: ascendente o descendente según el parámetro 'sort' (valor predeterminado: no se aplica ningún orden) */
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
      };

      /* Configuración del filtro de búsqueda */
      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query } // Búsqueda por categoría exacta
        : {};

      /* Consulta a la base de datos utilizando el filtro y opciones definidas */
      const result = await Product.paginate(filter, options);

      /* Validar si la página solicitada es un número válido */
      if (page && !/^\d+$/.test(page)) {
        return res.status(400).json({ status: 'error', error: 'El parámetro "page" debe ser un número válido' });
      }

      /* Verificar si la página existe */
      if (page && (parseInt(page) < 1 || parseInt(page) > result.totalPages)) {
        return res.status(400).json({ status: 'error', error: 'El número de página no existe' });
      }

      /* Construcción del objeto de respuesta */
      const data = {
        status: 'success',
        /* Lista de productos obtenidos */
        payload: result.docs,
        /* Número total de páginas disponibles */
        totalPages: result.totalPages,
        /* Página anterior (si no hay página anterior, se establece como nulo) */
        prevPage: result.prevPage || null,
        /* Página siguiente (si no hay página siguiente, se establece como nulo) */
        nextPage: result.nextPage || null,
        /* Página actual */
        page: result.page,
        /* Indica si hay una página anterior */
        hasPrevPage: result.hasPrevPage,
        /* Indica si hay una página siguiente */
        hasNextPage: result.hasNextPage,
        /* Enlace a la página anterior (si existe) */
        prevLink: result.hasPrevPage ? `/api/products?limit=${options.limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
        /* Enlace a la página siguiente (si existe) */
        nextLink: result.hasNextPage ? `/api/products?limit=${options.limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
      };

      /* Devolver la respuesta exitosa al cliente */
      return res.status(200).json(data);
    } catch (error) {
      /* Devolver una respuesta de error al cliente en caso de excepción */
      return res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
  };

  /* Agregar un producto */
  addProduct = async (payload, images, res, req) => {
    try {
      /* Obtener los datos del producto de los campos de payload */
      const { title, description, code, price, stock, category } = payload;

      if (!title || !description || !code || !price || !stock || !category) {
        /* Enviar una respuesta de error si faltan campos obligatorios */
        return res.status(500).json({ success: false, error: 'Faltan campos obligatorios' });
      }

      /* Verificar si ya existe un producto con el mismo código */
      const existingProduct = await Product.findOne({ code: code });

      if (existingProduct) {
        /* Enviar una respuesta de error si ya existe un producto con el mismo código */
        return res.status(400).json({ success: false, error: 'Ya existe un producto con el mismo código' });
      }

      /* Crear el objeto del nuevo producto */
      const newProduct = new Product({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: images && images.length > 0 ? images.map((image) => image.filename) : [],
      });

      /* Guardar el nuevo producto en la base de datos */
      await newProduct.save();
      /* Emitir un evento de 'newProduct' a través de socket.io */
      req.app.io.emit('newProduct', newProduct);

      const data = newProduct;
      /* Eviar una respuesta exitosa con un mensaje de éxito */
      return res.status(201).json({ success: true, message: 'Producto agregado correctamente', payload: data });
    } catch (error) {
      /* Enviar una respuesta de error en caso de producirse un error al agregar el producto */
      return res.status(500).json({ success: false, error: 'Error al agregar el producto' });
    }
  };

  /* Obtener un producto por ID */
  getProductById = async (pid, res) => {
    try {
      /* Buscar el producto por su ID en la base de datos */
      const product = await Product.findById(pid);

      if (!product) {
        /* Enviar una respuesta de error si el producto no se encuentra */
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      const data = product;
      /* Enviar una respuesta exitosa con el producto encontrado */
      return res.status(200).json({ success: true, payload: data });
    } catch (error) {
      /* Enviar una respuesta de error en caso de producirse un error al obtener el producto */
      return res.status(500).json({ success: false, error: 'Error al obtener el producto' });
    }
  };

  /* Actualizar un producto */
  updateProduct = async (pid, updateFields, res, req) => {
    try {
      /* Obtener los campos de actualización de la solicitud */
      const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category'];

      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));
      /* Filtrar los campos de actualización que no están permitidos */

      if (invalidFields.length > 0) {
        /* Enviar una respuesta de error si se intenta modificar campos no permitidos */
        return res.status(400).json({ success: false, error: `Los siguientes campos no se pueden modificar: ${invalidFields.join(', ')}` });
      }

      /* Buscar el producto por su ID y actualizar los campos */
      const updatedProduct = await Product.findByIdAndUpdate(pid, updateFields, { new: true });

      if (!updatedProduct) {
        /* Enviar una respuesta de error si el producto no se encuentra */
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }
      /* Emitir un evento de 'updateProduct' a través de socket.io */
      req.app.io.emit('updateProduct', updatedProduct);

      const data = updatedProduct;
      /* Enviar una respuesta exitosa con un mensaje de éxito */
      return res.status(200).json({ success: true, message: 'Producto actualizado correctamente', payload: data });
    } catch (error) {
      /* Enviar una respuesta de error en caso de producirse un error al actualizar el producto */
      return res.status(500).json({ success: false, error: 'Error al actualizar el producto' });
    }
  };

  deleteProduct = async (pid, res, req) => {
    try {
      /* Buscar el producto por su ID y eliminarlo */
      const deletedProduct = await Product.findByIdAndDelete(pid);

      if (!deletedProduct) {
        /* Enviar una respuesta de error si el producto no se encuentra */
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      /* Emitir un evento de 'deleteProduct' a través de socket.io */
      req.app.io.emit('deleteProduct', pid);

      const data = deletedProduct;
      /* Enviar una respuesta exitosa con un mensaje de éxito */
      return res.status(200).json({ success: true, message: 'Producto eliminado correctamente', payload: data });
    } catch (error) {
      /* Enviar una respuesta de error en caso de producirse un error al eliminar el producto */
      return res.status(500).json({ success: false, error: 'Error al eliminar el producto' });
    }
  };

  /*  Obtener todos los productos para mostrar en /src/views/products.handlebars */
  getProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };

      /* Configuración del filtro de búsqueda */
      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query } // Búsqueda por categoría exacta
        : {};

      /* Consulta a la base de datos utilizando el filtro y opciones definidas */
      const result = await Product.paginate(filter, options);

      /* Construcción del objeto de respuesta */
      const formattedProducts = result.docs.map((product) => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
        };
      });

      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;

      const prevLink = result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}` : null;

      return {
        success: true,
        title: 'Products',
        products: formattedProducts,
        style: 'index.css',
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error handlebars' });
    }
  };
}

/* Exportar una instancia de la clase 'ProductsServices' */
module.exports = new ProductsServices();
