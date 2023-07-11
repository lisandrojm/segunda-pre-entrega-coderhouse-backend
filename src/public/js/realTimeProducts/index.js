/* ************************************************************************** */
/* /src/public/js/realTimeProducts/index.js - .js de /src/views/realTimeProducts.handlebars 
/* ************************************************************************** */

/* Conecta el cliente a Socket.io */
const socket = io();

/* Función para agregar o actualizar una fila de producto en la tabla */
const addOrUpdateProductRow = (product) => {
  const productRow = `
    <tr id="${product._id}">
      <td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.code}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Eliminar</button>
      </td>
    </tr>
  `;

  const productTable = document.getElementById('product-table');
  const existingRow = document.getElementById(product._id);

  if (existingRow) {
    /* Actualiza la fila de producto existente en la tabla */
    existingRow.innerHTML = productRow;
  } else {
    /* Agrega una nueva fila de producto a la tabla */
    productTable.insertAdjacentHTML('beforeend', productRow);
  }
};

/* Función para eliminar una fila de producto de la tabla */
const deleteProductRow = (productId) => {
  const productRow = document.getElementById(productId);
  if (productRow) {
    /* Elimina la fila de producto de la tabla */
    productRow.remove();
  }
};

/* Escucha el evento 'newProduct' emitido por el servidor y llama a la función addOrUpdateProductRow */
socket.on('newProduct', addOrUpdateProductRow);

/* Escucha el evento 'updateProduct' emitido por el servidor y llama a la función addOrUpdateProductRow */
socket.on('updateProduct', addOrUpdateProductRow);

/* Escucha el evento 'deleteProduct' emitido por el servidor y llama a la función deleteProductRow */
socket.on('deleteProduct', deleteProductRow);

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');

  /* Maneja el evento submit del formulario para agregar un nuevo producto */
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      /* Restablece los valores del formulario después de agregar el producto correctamente */
      productForm.reset();
    } else {
      const error = await response.json();
      console.error('Error al agregar el producto:', error);
    }
  });
});

/* Función para eliminar un producto */
const deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        /* La eliminación se realizó correctamente, emite el evento 'deleteProduct' */
        socket.emit('deleteProduct', id);
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch((error) => {
      console.error('Error al eliminar el producto:', error);
    });
};
