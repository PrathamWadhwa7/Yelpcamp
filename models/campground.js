const { ref } = require('joi');
const mongoose=require('mongoose');
const reviews=require('./reviews.js');
const user=require('./user.js');
const schema=mongoose.Schema;
const imageSchema=new schema({
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts={ toJSON : {virtuals:true}};
const campgroundSchema=new schema({
    title:String,
    images:[imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:schema.Types.ObjectId,
        ref:'user',
    },
    reviews :[
        {
            type:schema.Types.ObjectId,
            ref:'Reviews'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href='/campgrounds/${this.id}'>${this.title}</a></strong>`
})
campgroundSchema.post('findOneAndDelete',async function(doc){
    if (doc) {
        await reviews.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('campgrounds',campgroundSchema);
