export class Recipe {
    id: number;
    title: string;
    image: string;
    level: number;
    time: number;
    ingredients: string;
    description: string;

    constructor(id: number, title: string, image: string, level: number, time: number, ingredients: string, description: string) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.level = level;
        this.time = time;
        this.ingredients = ingredients;
        this.description = description;
    }
}