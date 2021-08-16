const { Order, Product } = require("../models/order")
const User = require("../models/user")

exports.getOrderById = (req, res, next, id) => {

    Order.findById(id, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: "unable to get order"
            })
        }
        else {
            req.order = order;
            next()
        }
    })

    // Order.findById(id)
    // .populate("products.product","name price")
    // .exec((err,order)=>{
    //     if(err){
    //         return res.status(400).json({
    //             error:"no order found"
    //         })
    //     }
    //     req.order=order;
    //     next()
    // })
}
exports.singleOrderDetails = (req, res) => {
    let order = req.order;
    console.log(order)
    return res.status(200).json(order)
}
exports.createOrder = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)

    // console.log("the order is--------------------")
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: " unable to save the order in Data base"
            })
        }
        User.findByIdAndUpdate(req.profile._id, {
            $push: {
                "purchases": order._id
            }
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "not able to create order"
                })
            }
            res.json(order)
        })


    })
}
exports.getAllOrders = (req, res) => {
    Order.find().populate("user", "_id name").exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                message: "no orders "
            })
        }
        res.json(orders)
    })
}
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues)

}
exports.updateStatus = (req, res) => {
    Order.updateOne(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Can't update"
                })
            }
            res.json(order)
        }
    )
}
exports.cancelOrder = (req, res) => {
    Order.updateOne(
        { _id: req.body.orderId },
        { $set: { canceled: 1 } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Can't update"
                })
            }
            res.json(order)
        }
    )
}

exports.getOrdersOfTheUser = (req, res) => {
    const userId = req.profile._id;
    Order.find({ userId: userId }, (err, ordersOfTheUser) => {

        if (err) {
            return res.status(400).json({
                error: "No order found here"
            })
        }
        res.status(200).json(ordersOfTheUser)
    })
}

exports.deleteOrder = (req, res) => {
    let orderId = req.body
    Order.deleteOne(orderId, (err, order) => {
        if (err) {
            return res.status(404).json({
                error: err
            })
        }
        return res.status(200).json({
            message: "successfully deleted the order"
        })
    })
}