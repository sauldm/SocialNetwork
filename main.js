import {posts} from './data/posts.js';

const container = document.getElementById('container');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();

posts.forEach(post => {
  const clone = template.cloneNode(true);
  clone.querySelector('h2').textContent = post.title;
  clone.querySelector('p').textContent = post.body;
  fragment.appendChild(clone);
});

container.appendChild(fragment);