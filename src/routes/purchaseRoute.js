import express from 'express'
import PurchaseRepository from '../repositories/PurchaseRepository.js'
import PurchaseModel from '../models/PurchaseHistory.js'
import BookRepository from '../repositories/BookRepository.js';
import BookModel from '../models/Book.js';
import PurchaseService from '../services/PurchaseService.js';
import { checkRole, verifyToken } from '../middlewares/authMiddleware.js';
import PurchaseController from '../controllers/purchaseController.js';
import UserRepository from '../repositories/UserRepository.js';
import UserModel from '../models/User.js';

const purchaseRouter = express.Router();

const userRepository = new UserRepository(UserModel)
const purchaseRepository = new PurchaseRepository(PurchaseModel);
const bookRespository = new BookRepository(BookModel);
const purchaseService = new PurchaseService(purchaseRepository, bookRespository, userRepository);

purchaseRouter.post('/',verifyToken,checkRole('retail'),PurchaseController.createPurchase(purchaseService));
purchaseRouter.get('/id',verifyToken,checkRole('retail'),PurchaseController.getMyPurchase(purchaseService))

export default purchaseRouter