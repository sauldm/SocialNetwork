export class Post {
    constructor(id, userId, title, body) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.body = body;
        this.user = null;
        this.comments = [];
    }

    asignarUsuario(user) {
        this.user = user;
    }

    agregarComentario(comment) {
        this.comments.push(comment);
    }

    render() {
        const template = document.getElementById('post-template').content.cloneNode(true);
        template.querySelector('.post-titulo').textContent = this.title;
        template.querySelector('.post-autor').textContent = `Posted by ${this.user.name} (@${this.user.username})`;
        template.querySelector('.post-body').textContent = this.body;

        const commentsContainer = template.querySelector('.comments-container');
        this.comments.forEach(comment => {
            commentsContainer.appendChild(comment.render());
        });

        return template;
    }
}
