const campgrounds=require('../models/campground');
const {cloudinary}= require('../cloudinary/index');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.MAPBOX_TOKEN;
const geocode=mbxGeocoding({accessToken:mapboxtoken});

console.log(process.env.MAPBOX_TOKEN);

module.exports.index= async(req,res)=>{
    const camps=await campgrounds.find({});
     res.render('campgrounds.ejs',{camps});
 }

 module.exports.newform=(req,res)=>{
    res.render('new.ejs');
}

module.exports.createcamp=async(req,res)=>{
    // if(!req.body.campgrounds) throw new Expresseror("Invalid Campground Data",400);
   
    const geodata=await geocode.forwardGeocode({
        query:req.body.campgrounds.location,
        limit:1,
    }).send();
    const c=new campgrounds(req.body.campgrounds);
    c.geometry=geodata.body.features[0].geometry;
    console.log(c.geometry);
    c.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    c.author=req.user.id;
    console.log(c.images);
    await c.save();
    req.flash('success','successfully created new camp');
    res.redirect(`campgrounds/${c.id}`);
}

module.exports.showcamp=async(req,res)=>{
    const{id}=req.params;
    const camp=await campgrounds.findById(id).populate({
       path:'reviews',
       populate:
          { path:'author' }
       
   }).populate('author');
    // console.log(camp);
   if(!camp){
       req.flash('error','Campground Not Found!');
       return res.redirect('/campgrounds')
   }
    res.render('show.ejs',{camp});
}

module.exports.editcamp=async(req,res)=>{
    const {id}=req.params;
     const campground=await campgrounds.findById(id);
     if(!campground) {
        req.flash('error','Cannot find that campground!')
     }
     const camp=await campgrounds.findById(id);
     res.render('edit.ejs',{camp});
 }

 module.exports.updatecamp=async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const c=await campgrounds.findByIdAndUpdate(id,{... req.body.campgrounds});
    const imgs= req.files.map(f=>({url:f.path,filename:f.filename}));
    c.images.push(...imgs);
    await c.save();
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
       await c.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
       console.log(c);
    }
    req.flash('success','successfully Updated the Campground!');
    // console.log(c);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deletecamp=async(req,res)=>{
    
    const {id}=req.params;
   
    await campgrounds.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Campground!');
    res.redirect('/campgrounds');
}