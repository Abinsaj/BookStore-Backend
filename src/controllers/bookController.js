import asyncHandler from "../middlewares/asyncHandler.js";

export default class BookController {
    static createBook = (bookService) =>
        asyncHandler(async (req, res) => {
            const bookData = req.body;
            bookData.authors = req.user.userId
            const book = await bookService.createBook(bookData);
            res.status(201).json({ success: true, data: book });
        });

    static getBook = (bookService) =>
        asyncHandler(async (req, res) => {
            const books = await bookService.getBook();
            res.status(200).json({ success: true, data: books });
        })

    static getBookBySlug = (bookService) =>
        asyncHandler(async (req, res) => {
            const { slug } = req.params;
            const book = await bookService.getBookBySlug(slug);
            res.status(200).json({ success: true, data: book });
        });

}