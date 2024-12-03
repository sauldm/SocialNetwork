export class Comment {
    constructor(id, postId, name, email, body) {
        this.id = id;
        this.postId = postId;
        this.name = name;
        this.email = email;
        this.body = body;
    }

    render() {
        const template = document.getElementById('comment-template').content.cloneNode(true);
        template.querySelector('.comment-autor').textContent = this.name;
        template.querySelector('.comment-username').textContent = this.email;
        template.querySelector('.comment-body').textContent = this.body;
        return template;
    }
}
