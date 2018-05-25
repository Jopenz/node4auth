"use strict"

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = Schema({
    email: String,
    password: String,
    facebookId: String,
    googleId: String,
    role: {type: String, enum: ['chef','company']},
});

module.exports = mongoose.model('User',UserSchema);