import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {type:String, required:true},
    desc: {type:String, required:true},
    banner: {data:Buffer, contentType:String},
    unit: {type:String, required:true},
    price: {type:String, required:true},
    available: {type:Boolean, required:false, default:false},
    supplier: {type:String, required:false, default:""}
});

export default mongoose.model('product', ProductSchema); 