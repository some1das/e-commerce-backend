const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    price: Number,
    count: Number
})
const Product = mongoose.model("ProductCart", ProductCartSchema)

const OrderSchema = new mongoose.Schema({
    products: [{
        type: ObjectId,
        ref: "Product",
        required: true
    }],
    canceled: {
        type: Number,
        default: 0
    },
    transiction_id: {},
    cost: { type: Number },
    address: {},
    updated: Date,
    status: {
        type: Number,
        default: 0,

    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    userEmail: {
        type: String,
    },
    userName: {
        type: String
    }
}, { timestamps: true })

const Order = mongoose.model("Order", OrderSchema)

module.exports = { Order, Product }