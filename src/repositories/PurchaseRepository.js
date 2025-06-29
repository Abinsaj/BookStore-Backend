import BaseRepository from "./BaseRepository.js";

export default class PurchaseRepository extends BaseRepository{
    constructor(PurchaseModel){
        super(PurchaseModel)
    }

    async findByUser(userId) {
        return this.model.find({ user: userId }).populate('book');
      }
    
      async countMonthlyPurchases(year, month) {
        const start = new Date(`${year}-${month}-01`);
        const end = new Date(`${year}-${month}-31`);
        return this.model.find({ purchaseDate: { $gte: start, $lte: end } });
      }
    
      async getMaxIncrementId(year, month) {
        const regex = new RegExp(`^${year}-${month}-\\d+$`);
        const purchases = await this.model.find({ purchaseId: regex }).sort({ purchaseId: -1 }).limit(1);
        if (purchases.length > 0) {
          const parts = purchases[0].purchaseId.split('-');
          return parseInt(parts[2]);
        }
        return 0;
      }
}