"use strict"

const mongoose = require("mongoose");
const User = require("../model/user");
const Activity = require("../model/activity");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "XxHAUS8*DR&FUr%+LnW(5)@65~CaLLgS*ypL%DZktU}";


function getUser(email){
    return new Promise(resolve => {
        User.findOne({email: email }).exec((err,user)=>{
            if(err) resolve(null)
            resolve(user);
        });
  });
}

async function login(req, res){
    if (await validateParams(req)) {
        let user = await getUser(req.body.email.toLowerCase());
        if (user != null){
            bcrypt.compare(req.body.password,user.password,(err,check)=>{
                if(err){
                    res.status(404).send({
                        message: "User data does not match"
                    });
                }
                if(check){
                    generateToken(user).then((token)=>{
                        setActivity('login', user.email,req);
                        res.status(200).send({
                            token: token
                        });
                    });
                }else{
                    res.status(404).send({
                        message: "User data does not match"
                    });
                }
            });   
        }else {
            res.status(404).send({
                message: "user does't exist"
            });
        }
    } else {
        res.status(500).send({
            message: 'parameters not allowed.'
        });
    }

}

async function register(req, res){
    if (await validateParams(req)) {
        let user = await getUser(req.body.email.toLowerCase());
        if (user == null){
            user = new User();
            user.email = req.body.email;
            user.role = req.body.role;
            bcrypt.hash(req.body.password,null,null,(err,hash)=>{
                user.password = hash;
                user.save(async (err, userStored) => {
                    if (err) return res.status(500).send({ message: 'Some problem occurred when saving the user' });
                    if (userStored) {
                        setActivity('register',user.email,req);
                        let token = await generateToken(userStored);
                        res.status(200).send({
                            token: token
                        });
                    }
                });
            });
        } else {
           login(req,res);
        }
    }else {
        res.status(500).send({
            message: 'parameters not allowed.'
        });
    }
}

function generateToken(user){
    return new Promise(resolve => {
        let payload = {
            loginId : user._id,
            email : user.email,
            facebookId : user.facebookId,
            googleId : user.googleId,
            iat : moment().unix() 
        }
        resolve(jwt.encode(payload,secret));
  });
    
}


function validateParams(req){
    if (req.body.email && req.body.password) {
        return true;
    } else {
        return false;
    }
}

function setActivity(type,email,req){
    let activity = new Activity({
        email: email,
        ip : (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').pop(),
        action : type,
        iat : moment().unix()
    });
    activity.save();
}


module.exports = {
    login,
    register

}