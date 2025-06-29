import express from "express";
import BookRepository from "../repositories/BookRepository.js";
import BookModel from "../models/Book.js";
import BookService from "../services/BookService.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";
import BookController from "../controllers/bookController.js";
import UserRepository from "../repositories/UserRepository.js";
import UserModel from "../models/User.js";

const bookRouter = express.Router();

const userRepository = new UserRepository(UserModel)
const bookRepository = new BookRepository(BookModel);
const bookService = new BookService(bookRepository,userRepository)

bookRouter.post('/',verifyToken,checkRole('author'),BookController.createBook(bookService))
bookRouter.get('/',BookController.getBook(bookService));
bookRouter.get('/:slug',BookController.getBookBySlug(bookService));

export default bookRouter;
