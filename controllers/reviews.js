const reviews=require('../models/reviews');
const campgrounds=require('../models/campground');

module.exports.createreview=async(req,res)=>{
    const camp=await campgrounds.findById(req.params.id);
    const review=new reviews(req.body.review);
    review.author=req.user.id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success','successfully posted a review!');
    res.redirect(`/campgrounds/${camp.id}`);
    
}

module.exports.deletereview=async(req,res)=>{
    const{id,review_id}=req.params;
    await campgrounds.findByIdAndUpdate(id,{$pull:{reviews:review_id}});
    await reviews.findByIdAndDelete(review_id);
    req.flash('success','successfully Deleted a review!');
    res.redirect(`/campgrounds/${id}`);
    
}