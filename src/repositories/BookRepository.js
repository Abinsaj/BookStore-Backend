import BaseRepository from "./BaseRepository.js";

export default class BookRepository extends BaseRepository{
    constructor(BookModel){
        super(BookModel)
    }

    async countBooksBySlug(baseSlug){
        return await this.model.findOne({slug: baseSlug});
    }

    async findByTitle(title){
        return await this.model.findOne({title});
    }

    async findBySlug(slug){
        return await this.model.findOne({slug}).populate('authors');
    }
    
    async findByBookId(bookId){
        return await this.model.findOne({bookId}).populate('authors')
    }

    async increaseSellCount(bookId, quantity){
        return await this.model
    }
}