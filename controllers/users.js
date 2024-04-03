const user = require('../models/user');

module.exports.renderregister=(req,res)=>{
    res.render('register.ejs')
}

module.exports.register=async(req,res,next)=>{
    try
    { const {email,username,password}=req.body;
     const u= new user({email,username});
     const newUser= await user.register(u,password);
     req.logIn(newUser,err=>{
         if(err) return next(err)
         req.flash('success','welcome to Yelpcamp');
         res.redirect('/campgrounds');
 
     })
     }
     catch(e){
         req.flash('error',e.message);
     res.redirect('/register');
     }
 
 }

 module.exports.renderlogin=(req,res)=>{
    res.render('login.ejs');
}
module.exports.login=(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully LoggedOut!');
        res.redirect('/campgrounds');
    });
    
}