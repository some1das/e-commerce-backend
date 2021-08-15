const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "no usre found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO:get back here for password
  req.profile.password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "unable to update",
        });
      }
      req.profile.password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          message: "no order is found",
        });
      }
      return res.json(order);
    });
};

exports.pushOderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //Store the array in data base
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          message: " no purchased item is found",
        });
      }
      next();
    }
  );

  next();
};
exports.getAllTheUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(404).json({
        error: "unable to fetch users from database"
      })
    }
    return res.status(200).json(users)
  })
}
//update role
exports.updateRole = (req, res) => {
  User.updateOne(
    { _id: req.body.userId },
    { $set: { role: req.body.role } },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Can't update"
        })
      }
      res.json(user)
    }
  )
}