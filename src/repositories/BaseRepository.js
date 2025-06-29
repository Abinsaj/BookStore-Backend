export default class BaseRepository {
    constructor(model){
        this.model = model
    }
    
    async create(data){
        return await this.model.create(data);
    }

    async findOne(query){
        return await this.model.findOne(query);
    }

    async findById(id){
        return await this.model.findById(id);
    }

    async findAll(){
        return await this.model.find()
    }

    async update(query, data){
        return await this.model.findOneAndUpdate(query, data, {new:true});
    }

    async delete(query){
        return await this.model.findOneAndDelete(query)
    }

}