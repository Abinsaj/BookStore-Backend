import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin','author','retail'],
        default: ['retail']
    },
    revenue:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

UserSchema.pre('save',async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

UserSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password)
}

const UserModel = model('User',UserSchema);

export default UserModel;