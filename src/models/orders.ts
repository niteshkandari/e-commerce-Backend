import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId: String,
    userId: String,
    amount: Number,
    status: String,
    txnId: String,
    items: [
        {   
            product: {type: Schema.Types.ObjectId, ref: 'product', required: true} ,
            unit: { type: Number, require: true} 
        }
    ]
},
{
    // toJSON: {
    //     transform(doc, ret){
    //         delete ret.__v;
    //     }
    // },
    timestamps: true
});

export default mongoose.model('order', OrderSchema);