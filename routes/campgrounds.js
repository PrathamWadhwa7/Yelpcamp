const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Expresseror = require("../utils/Expresseror");
const campgrounds = require('../models/campground');
const campcontroller = require('../controllers/campgrounds.js');
const { campschema } = require("../schemas.js");
const { isLoggedIn, isaAuthor, validatecamp } = require('../middleware.js');
const { equal } = require('joi');
const multer=require('multer');
const {storage}=require('../cloudinary/index.js');
// const upload=multer({dest:'uploads/'});
const upload=multer({storage});



router.get('/', catchAsync(campcontroller.index));

router.get('/new', isLoggedIn, campcontroller.newform);

router.post('/', isLoggedIn, upload.array('image'),validatecamp, catchAsync(campcontroller.createcamp));
// router.post('/',upload.array('image'),(req,res)=>{
//     res.send('it worked');
//     console.log(req.body,req.files);
// });

router.get('/:id', isLoggedIn, catchAsync(campcontroller.showcamp));

router.get('/:id/edit', isLoggedIn, isaAuthor, catchAsync(campcontroller.editcamp));

router.put('/:id', isLoggedIn, isaAuthor,upload.array('image'), validatecamp, catchAsync(campcontroller.updatecamp));

router.delete('/:id', isLoggedIn, isaAuthor, catchAsync(campcontroller.deletecamp));
module.exports = router;