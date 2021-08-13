const Category = require("../models/category");
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        message: "not found LOL",
      });
    }
    req.category = cate;
    next();
  });
  
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        message: "unable to save in database",
      });
    }
    res.json({category});
  });
};

exports.getCategory=(req,res)=>{
    return res.json(req.category)
}
exports.getAllCategories=(req,res)=>{
    Category.find().exec((err,categories)=>{
      if(err){
        return res.status(400).json({
          message: " No category is found in data base"
        })
      }
      res.json(categories)
    })
}

exports.updateCategory=(req,res)=>{
  const category=req.category;
  category.name=req.body.name;
  category.save((err,updatedCategory)=>{
    if(err){
      return res.status(400).json({
        message:"Unable to update"
      })
    }
    res.json(updatedCategory)
  })
}

exports.removeCategory=(req,res)=>{
  const category=req.category;
  category.remove((err,category)=>{
    if(err){
      return res.status(400).json({
        message:"Unable to delete"
      })
    }
    res.json({
      message:"Sussessfully deleted"
    })
  })
}