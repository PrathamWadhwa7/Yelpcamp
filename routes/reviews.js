const express=require('express');
const router=express.Router({mergeParams:true});
const campgrounds=require('../models/campground');
const catchAsync=require("../utils/catchAsync");
const Expresseror=require("../utils/Expresseror");
const reviewcontroller=require('../controllers/reviews.js')
const {isLoggedIn,validatereview,isreviewAuthor}=require('../middleware.js');




router.post('/',isLoggedIn, validatereview,catchAsync(reviewcontroller.createreview))

router.delete('/:review_id',isreviewAuthor,catchAsync(reviewcontroller.deletereview))

module.exports=router;