import { emailQueue } from "../jobs/emailQueue.js";
import AppError from "../utils/AppError.js";
import slugify from "slugify";

export default class BookService{
    constructor(bookRepository, userRepository){
        this.bookRespository = bookRepository
        this.userRepository = userRepository
    }

    async createBook(bookData){

        const existingBook = await this.bookRespository.findByTitle(bookData.title)

        if(existingBook){
            throw new AppError('A book with this title already exists.', 400)
        }

        if(bookData.price < 100 || bookData.price > 1000){
            throw new AppError('Price must be between 100 and 1000',400)
        }
       
        const baseSlug = slugify(bookData.title, { lower: true, strict: true});

        const count = await this.bookRespository.countBooksBySlug(baseSlug);

        const sequence = count + 1;
        const bookId = `${baseSlug}-${sequence}`;

        bookData.slug = baseSlug;
        bookData.bookId = bookId;

        const book = await this.bookRespository.create(bookData);

        const author = await this.userRepository.findById(bookData.authors)

        const retailUsers = await this.userRepository.getRetailUsers()
        for(const user of retailUsers){
            await emailQueue.add('newBookNotification',{
                userEmail: user.email,
                bookTitle: book.title,
                authorName: author.name
            })
        }

        return book;
    }

    async getBook(){
        return await this.bookRespository.findAll();
    };

    async getBookBySlug(slug){
        const book = await this.bookRespository.findBySlug(slug);
        if(!book){
            throw new AppError('Book not found', 404);
        };

        return book;
    }

}