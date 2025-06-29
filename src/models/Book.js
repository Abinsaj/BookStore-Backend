import mongoose, { model } from "mongoose";

const BookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        unique: true,
        required: true
    },
    authors:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        unique: true,
        required: true
    },
    slug:{
        type: String,
        unique: true
    },
    description:{ 
        type: String
    },
    price:{
        type: Number,
        required: true,
        min: 100,
        max: 1000
    },
    sellCount:{
        type: Number,
        default: 0
    }

},{
    timestamps: true
});

const BookModel = model('Book',BookSchema)

export default BookModel