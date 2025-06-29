import BaseRepository from "./BaseRepository.js";

export default class UserRepository extends BaseRepository{
    constructor(UserModel){
        super(UserModel)
    }

    async findByEmail(email){
        return await this.model.findOne({email});
    }

    async incrementRevenue(_id, amount){
        return await this.model.findByIdAndUpdate(
            _id,
            {
                $inc: {revenue:amount}
            },
            {
                new: true
            }
        )
    }

    async getRetailUsers(){
        return await this.model.find({role:'retail'})
    }

}