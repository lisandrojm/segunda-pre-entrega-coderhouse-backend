/* ************************************************************************** */
/* /src/utils/multer/multer.js - Configuración de Multer  (middleware de manejo de
 archivos para aplicaciones web basadas en Node.js)
/* ************************************************************************** */

/* Importamos el paquete 'multer' para manejar la carga de archivos */
const multer = require('multer');

/* Importar el módulo 'uuid' para generar identificadores únicos */
const { v4: uuidv4 } = require('uuid');

/* Configuramos el almacenamiento de archivos */
const storage = multer.diskStorage({
  /* Ruta donde se guardarán las imágenes */
  destination: (req, file, cb) => {
    cb(null, './src/uploads/productos');
  },
  /* Generamos un prefijo único para el nombre del archivo y lo combinamos con el nombre original del archivo */
  filename: (req, file, cb) => {
    const uniquePrefix = uuidv4().slice(0, 4);
    cb(null, uniquePrefix + '-' + file.originalname);
  },
});

/* Creamos una instancia de 'multer' con la configuración de almacenamiento */
const upload = multer({ storage });

/* Exportamos la instancia de 'multer' para su uso en otros archivos */
module.exports = upload;
