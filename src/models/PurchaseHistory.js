import mongoose, { model } from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    purchaseId :{
        type: String,
        unique:true
    },
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaseDate:{
        type: Date,
        default: Date.now()
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        default:1
    }
},{
    timestamps: true
})

const PurchaseModel = model('Purchase',PurchaseSchema)

export default PurchaseModel