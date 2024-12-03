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

// Crear objetos User
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

// Renderizar las publicaciones
const container = document.getElementById('container');
const fragmento = document.createDocumentFragment();

postObjetos.forEach(post => {
  fragmento.appendChild(post.render());
});

container.appendChild(fragmento);
