export class Photo {
    constructor(data) {
        this.albumId = data.albumId;
        this.id = data.id;
        this.title = data.title;
        this.url = data.url;
        this.thumbnailUrl = data.thumbnailUrl;
    }
}
