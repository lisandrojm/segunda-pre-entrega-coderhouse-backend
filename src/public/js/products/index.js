/* ************************************************************************** */
/* /src/public/js/products/index.js - .js de /src/views/products.handlebars */
/* ************************************************************************** */

// Función para obtener el ID del carrito del almacenamiento local
const getCartId = () => localStorage.getItem('cartId');

// Función para guardar el ID del carrito en el almacenamiento local
const setCartId = (cartId) => localStorage.setItem('cartId', cartId);

// Función para obtener la cantidad de productos del almacenamiento local
const getProductCount = () => localStorage.getItem('productCount');

// Función para guardar la cantidad de productos en el almacenamiento local
const setProductCount = (count) => localStorage.setItem('productCount', count);

// Variable para almacenar el ID del carrito actual
let cartId = getCartId();

// Variable para almacenar la cantidad de productos
let productCount = getProductCount() || 0;

// Obtén el elemento DOM para mostrar el cartId
const cartIdElement = document.getElementById('cartId');
const cartQuantityElement = document.getElementById('cartQuantity');

// Función para actualizar el cartId y el contador de productos en el DOM
const updateCartId = () => {
  cartIdElement.textContent = cartId;
  cartQuantityElement.innerHTML = `<div class="d-flex align-items-center justify-content-center">
   <div class="pe-2">
    <img src="../../img/cart.svg" alt="cart" />
   </div>
   <div>
    <h5 class="fw-bold mb-2 text-danger">${productCount}</h5>
   </div>
  </div>`;
};

// Obtén todos los botones "Agregar al carrito"
const addToCartButtons = document.querySelectorAll('.btn-primary');

// Agrega un controlador de eventos a cada botón
addToCartButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    try {
      // Verificar si el carrito ya ha sido creado
      if (cartId === null) {
        // Realizar una solicitud POST al endpoint correspondiente para crear un nuevo carrito
        const response = await fetch('/api/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Obtén el ID del carrito creado de la respuesta
          const { payload } = await response.json();
          cartId = payload._id;
          // Guarda el ID del carrito en el almacenamiento local
          setCartId(cartId);
          // Actualiza el valor del cartId en el DOM
          updateCartId();
          // Muestra un mensaje de éxito al usuario con el ID del carrito
          swal('Nuevo carrito creado', `ID del carrito: ${cartId}`, 'success');
        } else {
          // Muestra un mensaje de error al usuario si no se pudo crear el carrito
          swal('Error al crear el carrito', '', 'error');
          return;
        }
      }

      // Realiza una solicitud POST al endpoint correspondiente para agregar el producto al carrito
      const productId = event.target.getAttribute('data-productid');

      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // Si la respuesta es exitosa, muestra un mensaje de éxito al usuario con el ID del carrito
        swal('Producto agregado al carrito', `Product ID: ${productId}\nCart ID: ${cartId}`, 'success');

        // Aumenta la cantidad de productos
        productCount++;

        // Guarda el valor actualizado en el almacenamiento local
        setProductCount(productCount);

        // Actualiza el valor del cartId y el contador de productos en el DOM
        updateCartId();
      } else {
        // Si la respuesta no es exitosa, muestra un mensaje de error al usuario
        swal('Error al agregar el producto al carrito', '', 'error');
      }
    } catch (error) {
      // Si ocurre un error, muestra un mensaje de error al usuario
      swal('Error al agregar el producto al carrito', '', 'error');
    }
  });
});

// Esperar a que la página haya cargado completamente
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Verificar si el carrito ya ha sido creado
    if (cartId === null) {
      // Realizar una solicitud POST al endpoint correspondiente para crear un nuevo carrito
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Obtén el ID del carrito creado de la respuesta
        const { payload } = await response.json();
        cartId = payload._id;
        // Guarda el ID del carrito en el almacenamiento local
        setCartId(cartId);
        // Actualiza el valor del cartId en el DOM
        updateCartId();
        // Muestra un mensaje de éxito al usuario con el ID del carrito
        swal('Nuevo carrito creado', `ID del carrito: ${cartId}`, 'success');
      } else {
        // Muestra un mensaje de error al usuario si no se pudo crear el carrito
        swal('Error al crear el carrito', '', 'error');
      }
    } else {
      // Actualiza el valor del cartId y el contador de productos en el DOM si ya existe
      updateCartId();
    }

    // Obtén el valor de productCount del almacenamiento local
    const storedProductCount = getProductCount();

    // Verifica si hay un valor almacenado y es un número válido
    if (storedProductCount && !isNaN(storedProductCount)) {
      // Actualiza productCount con el valor almacenado
      productCount = parseInt(storedProductCount);
    }
  } catch (error) {
    // Muestra un mensaje de error al usuario si ocurrió un error al crear el carrito
    swal('Error al crear el carrito', '', 'error');
  }
});

// Redirigir a la url del carrito con la variable del cartId http://localhost:8080/carts/${cartId}
const redirectToCart = () => {
  const cartId = document.getElementById('cartId').textContent;
  window.location.href = `http://localhost:8080/carts/${cartId}`;
};
