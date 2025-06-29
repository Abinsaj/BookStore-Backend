import asyncHandler from "../middlewares/asyncHandler.js";

export default class PurchaseController {
    static createPurchase = (purchaseService) =>
        asyncHandler(async (req, res) => {
            const purchaseData = req.body;
            const userId = req.user.userId;
            const purchase = await purchaseService.createPurchase(userId, purchaseData);
            res.status(201).json({ success: true, data: purchase });
        });

    static getMyPurchase = (purchaseService) =>
        asyncHandler(async (req, res) => {
            const userId = req.user.userId;
            const purchase = await purchaseService.getUserPurchases(userId);
            res.status(200).json({ success: true, data: purchase });
        });
}