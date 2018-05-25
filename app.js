"use strict"
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const controller = require("./controllers/appController");

let app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.status(200).send({
        message : 'ok'
    })
});

app.post("/register",controller.register);

app.post("/login",controller.login);

mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost:27017/auth')
    .then(()=>{
        app.listen(3001);
        console.log("Server started on Port 3001");
    }).catch((err)=>{
        console.error(err);
    }); 

module.exports = app;
