const express=require('express');
const router = express.Router();
const user= require('../models/user');
const catchAsync=require("../utils/catchAsync");
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const usercontroller=require('../controllers/users');

router.get('/register',usercontroller.renderregister);

router.post('/register', catchAsync(usercontroller.register));

router.get('/login',usercontroller.renderlogin);

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),usercontroller.login);

router.get('/logout',usercontroller.logout);

module.exports=router;