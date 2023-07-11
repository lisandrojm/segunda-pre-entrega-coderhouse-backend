/* ************************************************************************** */
/* /src/public/js/chat/index.js - .js de /src/views/chat.handlebars */
/* ************************************************************************** */

/* Imprimir en la consola el mensaje 'socket running' para indicar que el cliente está conectado a Socket.io */
console.log('socket running');

/* Crear una instancia de socket para establecer una conexión del cliente con el servidor de Socket.io */
const socket = io();

/* Declarar una variable user y la inicializa como null */
let user = null;

/* Función para solicitar el correo electrónico al usuario */
function promptEmail() {
  return swal({
    text: 'Escribe tu Email',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'nombre@correo.com',
        type: 'email',
      },
    },
    button: {
      text: 'Iniciar Chat',
      closeModal: true,
    },
  });
}

/* Función para validar el formato del correo electrónico */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* Iniciar el chat solicitando el correo electrónico al usuario */
function startChat() {
  promptEmail().then((name) => {
    if (!name || !validateEmail(name)) {
      swal('Correo electrónico inválido', 'Por favor, ingresa un correo electrónico válido', 'error').then(() => {
        startChat();
      });
    } else {
      user = name;
      const nameElement = document.getElementById('user-name');
      nameElement.innerHTML = `<b>Usuario conectado:</b> ${user}`;
    }
  });
}

startChat();

let message = document.getElementById('mensaje');
let btnEnviar = document.getElementById('enviar');

let chat_contenedor = document.getElementById('chat');

btnEnviar.addEventListener('click', sendMessage);

/* Capturar el evento "keydown" en el campo de mensaje */
message.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    sendMessage();
  }
});

/* Función para enviar un mensaje */
function sendMessage() {
  if (!user) {
    swal('Error', 'Debes ingresar tu correo electrónico primero', 'error');
    return;
  }

  if (!message.value.trim()) {
    swal('Error', 'El mensaje no puede estar vacío', 'error');
    return;
  }

  const payload = {
    user: user,
    message: message.value,
  };

  /* Enviar el mensaje al servidor a través del evento 'mensaje' */
  socket.emit('mensaje', payload);

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mensaje enviado a la base de datos MongoDB:', data);
      /* Limpiar el campo de mensaje después de enviarlo */
      message.value = '';
    })
    .catch((error) => {
      console.error(error);
    });
}

readSockets();

/* Cargar el historial de chat al cargar la página */
function loadChat() {
  socket.on('init', (data) => {
    console.log('init', data);
    loadData(data);
  });
}

/* Leer los mensajes nuevos recibidos */
function readSockets() {
  loadChat();
  socket.on('nuevomensaje', (data) => {
    loadData(data);
  });
}

/* Cargar los mensajes en el contenedor del chat */
function loadData(data) {
  let innerHtml = '';
  data.forEach((msj) => {
    innerHtml += `<b>${msj.user}:</b> <span>${msj.message}</span><br>`;
  });
  chat_contenedor.innerHTML = innerHtml;
}
