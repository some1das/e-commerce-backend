const Product = require("../models/product");
const Category = require("../models/category");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const router = require("../routs/product");
const { ObjectId } = require("mongodb")

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")

    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "not found the product",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        message: "problem with image",
      });
    }
    //destructure the fields
    const { name, price, description, category, stock, sold } = fields;

    //TODO: restrictions on fields
    if (!name || !price || !description || !category || !stock) {
      return res.status(400).json({
        message: "something went wrong",
      });
    }
    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          message: "file is too big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //save to the DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          message: "saving product failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  console.log("This si---" + req.product);
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("content-type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //Updation code
    let product = req.product;

    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file is too big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //save to the DB
    Product.findByIdAndUpdate(product._id, product, (err, p) => {
      if (err) {
        return res.status(400).json({
          error: "unable to update",
        });
      }

      res.status(200).json(p);
    });
    // product.save((err, product) => {
    //   if (err) {
    //     return res.status(400).json({
    //       error: "updation failed",
    //     });
    //   }
    //   res.json(product);
    // });
  });
};
exports.deleteProduct = (req, res) => {
  let product = req.product;
  console.log(req.product);
  Product.deleteOne({ _id: product._id }).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "unable to delete",
      });
    } else {
      return res.status(200).json(data);
    }
  });
};
exports.getAllProducts = (req, res) => {
  // let limit = req.query.limit ? parseInt(req.require.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .sort([[sortBy, "asc"]])
    .populate("category")
    // .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: "no product found",
        });
      }
      res.json(products);
    });
};

exports.updateStocks = (req, res, next) => {
  //here let's assume we have a cart and we will update the stocks of each product in the cart
  let productsId = req.body.order.products;
  productsId.map((productId) => {
    let stock = 0;
    Product.findOne({ _id: productId }, (err, product) => {
      if (err || product.stock === 0) {
        return res.status(400).json({
          error: "something went wrong or stock out",
        });
      }
      stock = product.stock;

    });
    stock = stock - 1;
    Product.findByIdAndUpdate(
      productId,
      stock,
      (err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to update the stocks",
          });
        }
      }
    );
  });
  next();
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        message: "no category found in data base",
      });
    }
    res.json(category);
  });
};

exports.getProductDetails = (req, res) => {
  return res.status(200).json(req.product)
}
const makePhotoUndefined = (products, cb) => {

  let len = products.length;
  for (let i = 0; i < len; i++) {
    products[i].photo = undefined
  }
  return cb(products)
}
exports.getProductsByIdArray = (req, res) => {
  const idArray = req.body.ids;
  var obj_ids = idArray.map(function (id) { return ObjectId(id); });
  Product.find({ _id: { $in: obj_ids } }, (err, filteredProducts) => {
    if (err) {
      return res.status(400).json({
        error: "sorry no product found"
      })

    }
    makePhotoUndefined(filteredProducts, (fp) => {
      return res.status(200).json(fp)
    })

  });
}

//get products based on Ids on the array
exports.getProductsOnIdArray = (req, res) => {
  let Ids = req.body
  let queryArray = [];
  for (let i = 0; i < Ids.length; i++) {
    let temp = {
      _id: Ids[i]
    }
    queryArray.push(temp)
  }
  Product.find({ $or: queryArray }, (err, myProducts) => {
    if (err) {
      return res.status(400).json({
        error: "unable to fetch products"
      })
    }
    myProducts.forEach((p) => { p.photo = undefined })
    return res.status(200).json(myProducts)
  })
}