if(process.env.Node_ENV!=='production'){
    require('dotenv').config();
}
// require('dotenv').config();
const express=require('express');
const app= express();
const mongoose = require('mongoose');
const path=require('path');
const mo=require('method-override');
const ejsmate=require('ejs-mate');
const session= require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy  = require('passport-local');
const { storeReturnTo } = require('./middleware.js');
const Expresseror =require('./utils/Expresseror.js');
const mongoSanitize=require('express-mongo-sanitize');
const helmet= require('helmet');


const userRoutes=require('./routes/user.js');
const campgroundRoutes=require('./routes/campgrounds.js');
const reviewRoutes=require('./routes/reviews.js');
const user = require('./models/user.js');



mongoose.connect(('mongodb://127.0.0.1:27017/p1'),{
    
});
const db=mongoose.connection;
db.on("error",console.error.bind(console,'Connection error:'));
db.once("open",()=>{
    console.log('database connected');
});
app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(mo('_method'));
app.use(express.static(path.join(__dirname,'public')));
// app.use(mongoSanitize());
const sessionconfig={
    name:'session',
    secret:'mysecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
         httpOnly:true,  //  session id can only be accessed  bu the http not by others ie js 
        //Secure:true,  //doesnot make session id on local host
        expires:Date.now()+1000*60*60*7*24,
        maxage:1000*60*60*7*24
    }
};
app.use(session(sessionconfig));
app.use(flash());
app.use(helmet(
    {
        contentSecurityPolicy:false
    }
))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);
app.listen(8080,(req,res)=>{
    console.log('server 8080 is listening!');
})



app.get('/',(req,res)=>{
   res.render('home.ejs');
});
app.get('/fakeUser',async(req,res)=>{
    const u= new user({email:'p@gmail.com',username:'pratham'})
    const newUser=await user.register(u,'12345678');
    res.send(newUser);
})
app.all('*',(req,res,next)=>{
    next(new Expresseror("Page Not Found!",404));
})
app.use((err,req,res,next)=>{
    const{status=500}=err;
    if(!err.message) err.message="SOMETHING WENT WRONG!"
    res.status(status).render('error.ejs',{err});
})
