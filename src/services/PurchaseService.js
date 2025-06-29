import { emailQueue } from "../jobs/emailQueue.js";
import AppError from "../utils/AppError.js";

export default class PurchaseService {
    constructor(purchaseRepository, bookRepository, userRepository) {
        this.purchaseRepository = purchaseRepository
        this.bookRepository = bookRepository
        this.userRepository = userRepository
    }

    async createPurchase(userId, { bookId, quantity }) {
        const book = await this.bookRepository.findByBookId(bookId);
        if (!book) {
            throw new AppError('Book not found', 404);
        }

        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0')

        const maxId = await this.purchaseRepository.getMaxIncrementId(year, month);
        const incrementId = maxId + 1;

        const purchaseId = `${year}-${month}-${incrementId}`;

        const purchase = await this.purchaseRepository.create({
            purchaseId,
            bookId: book._id,
            userId: userId,
            price: book.price,
            quantity,
        });

        await this.bookRepository.update(
            { _id: book._id },
            { $inc: { sellCount: purchase.quantity } }
        );

        await this.userRepository.incrementRevenue(book.authors, purchase.price * purchase.quantity)

        await emailQueue.add('authorNotification', {
            authorId: book.authors,  
            purchaseDetails: {
              bookTitle: book.title,
              price: book.price,
              quantity,
            },
          });

        return purchase

    }

    async getUserPurchases(userId) {
        return this.purchaseRepository.findByUser(userId);
    }

}