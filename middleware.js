const Expresseror=require('./utils/Expresseror');
const campgrounds=require('./models/campground');
const reviews=require('./models/reviews.js')
const {campschema} =require('./schemas');
const {reviewSchema}=require("./schemas.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isaAuthor=async(req,res,next)=>{
    const {id} =req.params;
    const campground=await campgrounds.findById(id);
    if(!campground.author.equals(req.user.id))
    {
       req.flash('error','You dont Have permission for this ')
      return  res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isreviewAuthor=async(req,res,next)=>{
    const {id,review_id} =req.params;
    const review=await reviews.findById(review_id);
    if(!review.author.equals(req.user.id))
    {
       req.flash('error','You dont Have permission for this ')
      return  res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validatecamp=(req,res,next)=>{
    const {error}=campschema.validate(req.body);
    if(error)
    {
        const message=error.details.map(el=>el.message).join(',');
        throw new Expresseror(message,400);
    }
    else
    {
        next();
    }
}
module.exports.validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error)
    {
        const message=error.details.map(el=>el.message).join(',');
        throw new Expresseror(message,400);
    }
    else
    {
        next();
    }
}