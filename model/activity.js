"use strict"

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ActivitySchema = Schema({
    email: String,
    ip: String,
    facebookId: String,
    googleId: String,
    iat: String,
    action: {type: String, enum: ['login','register']},
});

module.exports = mongoose.model('Activity',ActivitySchema);