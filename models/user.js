const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userShchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userShchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userShchema);