import { users } from './data/users.js';
import { posts } from './data/posts.js';
import { comments } from './data/comments.js';
import { photos } from './data/photos.js';
import { todos } from './data/todos.js';

import { User } from './models/User.js';
import { Post } from './models/Post.js';
import { Comment } from './models/Comment.js';
import { Todo } from './models/Todo.js';
import { Photo } from './models/Photo.js';

// Arrays para almacenar los objetos
const usuariosObjetos = [];
const publicacionesObjetos = [];
const comentariosObjetos = [];

// Crear usuarios predefinidos
let idMaximo = 0;
for (let i = 0; i < users.length; i++) {
  if (users[i].id > idMaximo) {
    idMaximo = users[i].id;
  }
}

const usuariosPredefinidos = [
  { id: idMaximo + 1, name: "Andrés", username: "andres.aranda", email: "andres@example.com", lat: "39.4699", lng: "-0.3763", phone: "123-456-789", website: "andres.dev" },
  { id: idMaximo + 2, name: "Saúl", username: "saul.dominguez", email: "saul@example.com", lat: "39.4699", lng: "-0.3763", phone: "234-567-890", website: "saul.dev" },
  { id: idMaximo + 3, name: "Miguel", username: "miguel.rico", email: "miguel@example.com", lat: "39.4699", lng: "-0.3763", phone: "345-678-901", website: "miguel.dev" },
  { id: idMaximo + 4, name: "Carlos", username: "carlos.perea", email: "carlos@example.com", lat: "39.4699", lng: "-0.3763", phone: "456-789-012", website: "carlos.dev" }
];

// Crear objetos User para los usuarios predefinidos
usuariosPredefinidos.forEach(datosUsuario => {
  const usuario = new User(
    datosUsuario.id,
    datosUsuario.name,
    datosUsuario.username,
    datosUsuario.email,
    datosUsuario.lat,
    datosUsuario.lng,
    datosUsuario.phone,
    datosUsuario.website
  );
  usuariosObjetos.push(usuario);
});

// Crear objetos User para los usuarios del JSON
users.forEach(datosUsuario => {
  const usuario = new User(
    datosUsuario.id,
    datosUsuario.name,
    datosUsuario.username,
    datosUsuario.email,
    datosUsuario.address.geo.lat,
    datosUsuario.address.geo.lng,
    datosUsuario.phone,
    datosUsuario.website
  );
  usuariosObjetos.push(usuario);
});

// Crear objetos Post
posts.forEach(datosPublicacion => {
  const publicacion = new Post(
    datosPublicacion.id,
    datosPublicacion.userId,
    datosPublicacion.title,
    datosPublicacion.body
  );

  // Encontrar el usuario correspondiente y asignarlo al post
  const usuario = usuariosObjetos.find(u => u.id === datosPublicacion.userId);
  if (usuario) {
    publicacion.asignarUsuario(usuario);
  }
  publicacionesObjetos.push(publicacion);
});

// Crear objetos Comment y asociarlos con las publicaciones
comments.forEach(datosComentario => {
  const comentario = new Comment(
    datosComentario.id,
    datosComentario.postId,
    datosComentario.name,
    datosComentario.email,
    datosComentario.body
  );
  comentariosObjetos.push(comentario);

  // Encontrar la publicacion a la que pertenece el comentario y agregarlo
  const publicacion = publicacionesObjetos.find(p => p.id === datosComentario.postId);
  if (publicacion) {
    publicacion.agregarComentario(comentario);
  }
});

// Establecer el select SOLO con los usuarios predefinidos
const selectorUsuario = document.getElementById('usuarioSelect');
usuariosPredefinidos.forEach(usuario => {
  const opcion = document.createElement('option');
  opcion.value = usuario.id;
  opcion.textContent = `${usuario.name} (@${usuario.username})`;
  selectorUsuario.appendChild(opcion);
});

// Manejar la creación de nuevas publicaciones
document.getElementById('nuevoPostForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const userId = parseInt(document.getElementById('usuarioSelect').value);
  const title = document.getElementById('postTitulo').value;
  const body = document.getElementById('postBody').value;

  // Obtener el siguiente ID disponible
  let nextId = 0;
  for (const post of publicacionesObjetos) {
    nextId = Math.max(nextId, post.id);
  }
  nextId++;

  // Crear nuevo post
  const newPost = new Post(nextId, userId, title, body);
  const usuario = usuariosObjetos.find(u => u.id === userId);
  if (usuario) {
    newPost.asignarUsuario(usuario);
  }

  // Añadir al principio del array
  publicacionesObjetos.splice(0, 0, newPost);

  // Renderizar la nueva publicación al principio del contenedor de posts
  const contenedorPublicaciones = document.getElementById('posts-container');
  contenedorPublicaciones.insertBefore(newPost.render(), contenedorPublicaciones.firstChild);

  // Limpiar el formulario
  this.reset();
});

// Renderizar las publicaciones
const contenedorPublicaciones = document.getElementById('posts-container');
const fragmento = document.createDocumentFragment();

publicacionesObjetos.forEach(publicacion => {
  const elementoPublicacion = publicacion.render();

  // Actualizar el contador de comentarios
  const contadorComentarios = elementoPublicacion.querySelector('.comments-count');
  const cantidadComentarios = publicacion.comments.length;
  contadorComentarios.textContent = cantidadComentarios;

  fragmento.appendChild(elementoPublicacion);
});

contenedorPublicaciones.appendChild(fragmento);

// Lógica para el botón de volver arriba
const botonVolverArriba = document.getElementById('volverArriba');

// Mostrar/ocultar el botón según el scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    botonVolverArriba.classList.add('visible');
  } else {
    botonVolverArriba.classList.remove('visible');
  }
});

// Volver arriba con animación suave
botonVolverArriba.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Funcionalidad del modal
const modalEliminar = document.getElementById('modal-eliminar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnEliminar = document.getElementById('btn-eliminar');

function mostrarModalEliminar() {
  modalEliminar.classList.remove('oculto');
}

function ocultarModalEliminar() {
  modalEliminar.classList.add('oculto');
}

// Eventos para la funcionalidad de eliminar
document.addEventListener('click', (e) => {
  if (e.target.closest('.eliminar-post-btn')) {
    mostrarModalEliminar();
  }

  // Cerrar modal al hacer click fuera
  if (e.target === modalEliminar) {
    ocultarModalEliminar();
  }
});

btnCancelar.addEventListener('click', ocultarModalEliminar);

btnEliminar.addEventListener('click', () => {
  alert("Esto aun no está implementado jaja poneros las pilas");
  ocultarModalEliminar();
});

// Configuración de búsqueda
const entradaBusqueda = document.getElementById('buscador');
const opcionesBusqueda = document.querySelectorAll('.search-option');
const encabezadoResultados = document.querySelector('.search-results-header');
const listaResultados = document.querySelector('.search-results-list');
let tipoBusquedaSeleccionado = 'publicaciones';

// Evento para cambiar el tipo de búsqueda
opcionesBusqueda.forEach(opcion => {
  opcion.addEventListener('click', () => {
    // Remover la clase selected de todas las opciones
    opcionesBusqueda.forEach(opt => opt.classList.remove('selected'));
    // Añadir la clase selected a la opción clickeada
    opcion.classList.add('selected');
    // Actualizar el tipo de búsqueda seleccionado
    tipoBusquedaSeleccionado = opcion.dataset.type;
    // Realizar la búsqueda con el nuevo tipo
    realizarBusqueda(entradaBusqueda.value);
  });
});

// Evento para realizar la búsqueda mientras se escribe
entradaBusqueda.addEventListener('input', (e) => {
  realizarBusqueda(e.target.value);
});

// Funcionalidad del modal de usuario
const modalUsuario = document.getElementById('modal-usuario');
const btnCerrarModalUsuario = modalUsuario.querySelector('.cerrar-modal');

// Hacer la función mostrarPerfilUsuario disponible globalmente
window.mostrarPerfilUsuario = function(usuario) {
  // Rellenar la información del usuario en el modal
  modalUsuario.querySelector('.perfil-nombre').textContent = usuario.name;
  modalUsuario.querySelector('.perfil-username').textContent = `@${usuario.username}`;
  modalUsuario.querySelector('.perfil-email').textContent = usuario.email;
  modalUsuario.querySelector('.perfil-telefono').textContent = usuario.phone;

  const websiteLink = modalUsuario.querySelector('.perfil-website');
  websiteLink.href = `http://${usuario.website}`;
  websiteLink.textContent = usuario.website;

  modalUsuario.querySelector('.perfil-ubicacion').textContent = `Lat: ${usuario.lat}, Lng: ${usuario.lng}`;

  // Configurar el enlace a Google Maps
  const mapaLink = modalUsuario.querySelector('.perfil-mapa');
  mapaLink.href = `https://www.google.com/maps/search/?api=1&query=${usuario.lat},${usuario.lng}&zoom=20`;

  // Mostrar el modal
  modalUsuario.classList.remove('oculto');
};

function ocultarModalUsuario() {
  modalUsuario.classList.add('oculto');
}

// Eventos para abrir/cerrar el modal de usuario
btnCerrarModalUsuario.addEventListener('click', ocultarModalUsuario);
modalUsuario.addEventListener('click', (e) => {
  if (e.target === modalUsuario) {
    ocultarModalUsuario();
  }
});

// Función para mostrar los resultados
function mostrarResultados(resultados, tipo) {
  encabezadoResultados.textContent = `${resultados.length} resultados encontrados`;

  listaResultados.innerHTML = resultados.map(resultado => {
    switch (tipo) {
      case 'usuarios':
        return `
          <div class="item-resultado-busqueda usuario" data-userid="${resultado.id}">
            <strong>@${resultado.username}</strong>
            <div>${resultado.name}</div>
          </div>`;
      case 'fotos':
        return `
          <div class="item-resultado-busqueda photo">
            <img src="${resultado.url}" alt="${resultado.title}">
            <div class="photo-title">${resultado.title}</div>
          </div>`;
      case 'publicaciones':
        const autor = usuariosObjetos.find(user => user.id === resultado.userId);
        return `
          <div class="item-resultado-busqueda">
            <div class="post-title">${resultado.title}</div>
            <div class="post-author">Publicado por @${autor.username}</div>
          </div>`;
      case 'comentarios':
        return `
          <div class="item-resultado-busqueda">
            <div class="comment-name">${resultado.name}</div>
            <div class="comment-body">${resultado.body.substring(0, 100)}...</div>
          </div>`;
      case 'todos':
        return `
          <div class="item-resultado-busqueda">
            <div class="todo-title">${resultado.title}</div>
            <div class="todo-status">${resultado.completed ? '✓ Completado' : '○ Pendiente'}</div>
          </div>`;
      default:
        return `<div class="item-resultado-busqueda">${resultado.title || resultado.name}</div>`;
    }
  }).join('');

  // Añadir event listeners para los resultados de usuarios
  if (tipo === 'usuarios') {
    const resultadosUsuarios = listaResultados.querySelectorAll('.item-resultado-busqueda.usuario');
    resultadosUsuarios.forEach(resultado => {
      resultado.addEventListener('click', () => {
        const userId = parseInt(resultado.dataset.userid);
        const usuario = usuariosObjetos.find(u => u.id === userId);
        if (usuario) {
          mostrarPerfilUsuario(usuario);
        }
      });
    });
  }
}

// Función para realizar la búsqueda
function realizarBusqueda(consulta) {
  if (!consulta) {
    encabezadoResultados.textContent = '';
    listaResultados.innerHTML = '';
    return;
  }

  let resultados = [];
  consulta = consulta.toLowerCase();

  switch (tipoBusquedaSeleccionado) {
    case 'usuarios':
      resultados = usuariosObjetos.filter(usuario =>
        usuario.username.toLowerCase().includes(consulta)
      );
      break;
    case 'publicaciones':
      resultados = posts.filter(publicacion =>
        publicacion.title.toLowerCase().includes(consulta)
      );
      break;
    case 'comentarios':
      resultados = comments.filter(comentario =>
        comentario.name.toLowerCase().includes(consulta)
      );
      break;
    case 'fotos':
      resultados = photos.filter(foto =>
        foto.title.toLowerCase().includes(consulta)
      ).map(foto => new Photo(foto));
      break;
    case 'todos':
      resultados = todos.filter(tarea =>
        tarea.title.toLowerCase().includes(consulta)
      ).map(tarea => new Todo(tarea));
      break;
  }

  mostrarResultados(resultados, tipoBusquedaSeleccionado);
}
