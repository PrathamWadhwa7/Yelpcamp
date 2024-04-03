
const mongoose=require('mongoose');
const schema=mongoose.Schema;
const reviewsShema = new schema({
    body:String,
    ratings:Number,
    author:{
        type:schema.Types.ObjectId,
        ref:'user',
    }

});
module.exports=mongoose.model('Reviews',reviewsShema);