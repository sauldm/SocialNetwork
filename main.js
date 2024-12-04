import { users } from './data/users.js';
import { posts } from './data/posts.js';
import { comments } from './data/comments.js';

import { User } from './models/User.js';
import { Post } from './models/Post.js';
import { Comment } from './models/Comment.js';

// Arrays para almacenar los objetos
const userObjetos = [];
const postObjetos = [];
const commentObjetos = [];

// Crear usuarios predefinidos
let maxId = 0;
for (let i = 0; i < users.length; i++) {
    if (users[i].id > maxId) {
        maxId = users[i].id;
    }
}

const usuariosPredefinidos = [
    { id: maxId + 1, name: "Andrés", username: "andres.aranda", email: "andres@example.com" },
    { id: maxId + 2, name: "Saúl", username: "saul.dominguez", email: "saul@example.com" },
    { id: maxId + 3, name: "Miguel", username: "miguel.rico", email: "miguel@example.com" },
    { id: maxId + 4, name: "Carlos", username: "carlos.perea", email: "carlos@example.com" }
];

// Crear objetos User para los usuarios predefinidos
usuariosPredefinidos.forEach(userData => {
    const user = new User(
        userData.id,
        userData.name,
        userData.username,
        userData.email
    );
    userObjetos.push(user);
});

// Crear objetos User para los usuarios del JSON
users.forEach(userData => {
    const user = new User(
        userData.id,
        userData.name,
        userData.username,
        userData.email
    );
    userObjetos.push(user);
});

// Crear objetos Post
posts.forEach(postData => {
    const post = new Post(
        postData.id,
        postData.userId,
        postData.title,
        postData.body
    );
    const user = userObjetos.find(u => u.id === postData.userId);
    if (user) {
        post.asignarUsuario(user);
    }
    postObjetos.push(post);
});

// Crear objetos Comment y asociarlos con las publicaciones
comments.forEach(commentData => {
    const comment = new Comment(
        commentData.id,
        commentData.postId,
        commentData.name,
        commentData.email,
        commentData.body
    );
    commentObjetos.push(comment);

    // Encontrar la publicacion a la que pertenece el comentario y agregarlo
    const post = postObjetos.find(p => p.id === commentData.postId);
    if (post) {
        post.agregarComentario(comment);
    }
});

// Poblar el select SOLO con los usuarios predefinidos
const userSelect = document.getElementById('usuarioSelect');
usuariosPredefinidos.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.name} (@${user.username})`;
    userSelect.appendChild(option);
});

// Manejar la creación de nuevas publicaciones
document.getElementById('nuevoPostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('usuarioSelect').value);
    const title = document.getElementById('postTitulo').value;
    const body = document.getElementById('postBody').value;
    
    // Obtener el siguiente ID disponible
    let nextId = 0;
    for (const post of postObjetos) {
        nextId = Math.max(nextId, post.id);
    }
    nextId++;
    
    // Crear nuevo post
    const newPost = new Post(nextId, userId, title, body);
    const user = userObjetos.find(u => u.id === userId);
    if (user) {
        newPost.asignarUsuario(user);
    }
    
    // Añadir al principio del array
    postObjetos.splice(0, 0, newPost);
    
    // Renderizar la nueva publicación al principio del contenedor de posts
    const postsContainer = document.getElementById('posts-container');
    postsContainer.insertBefore(newPost.render(), postsContainer.firstChild);
    
    // Limpiar el formulario
    this.reset();
});

// Renderizar las publicaciones
const postsContainer = document.getElementById('posts-container');
const fragmento = document.createDocumentFragment();

postObjetos.forEach(post => {
    const postElement = post.render();
    
    // Actualizar el contador de comentarios
    const commentsCountSpan = postElement.querySelector('.comments-count');
    const commentCount = post.comments.length;
    commentsCountSpan.textContent = commentCount;
    
    fragmento.appendChild(postElement);
});

postsContainer.appendChild(fragmento);
