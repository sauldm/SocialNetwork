export class Todo {
    constructor(data) {
        this.userId = data.userId;
        this.id = data.id;
        this.title = data.title;
        this.completed = data.completed;
    }
}
