const mongoose = require('mongoose')

const SauceSchema = new mongoose.Schema({
    id: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0
    },
    usersLiked: {
        type: Array,
        required: true,
        default: []
    },
    usersDisliked: {
        type: Array,
        required: true,
        default: []
    }
})

SauceSchema.pre('save', function (next) {
    var sauce = this;
    sauce.id = sauce._id;
    next()
    return sauce
})

module.exports = mongoose.model("Sauce", SauceSchema)