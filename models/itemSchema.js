import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name:{type: String, require:true, trim:true},
    isDone:{type:Boolean, default:false}
});

//const itemModel = new mongoose.model('item', itemSchema);
export default itemSchema;