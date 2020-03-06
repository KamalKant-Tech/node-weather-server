const jwt = require('jsonwebtoken')
var util = require('util')
var user = require('../models/user')
const redisClient = require('./redisClient')
const Bottleneck = require('bottleneck');

//Middleware for API calls
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const tokenStatus = await isRedisTokenExist(token)
        if(tokenStatus.code === 400) {
            throw {code: tokenStatus.code, message: tokenStatus.message}
        }
        const decodedToken = jwt.verify(token,'KIAAUTHRETGDHFCSD-IYD$&tgRETGSL')
        const isUserExistStatus = await user.isUserExist(decodedToken._id)
        if(!isUserExistStatus) throw {code : 401, message : 'User Does not exist !!!'}
        req.user = isUserExistStatus[0]
        req.token = token
        next();
    } catch (e) {
        res.status(401).send({code: e.code || 401, message: e.message || 'Please provide authentication'})
    }
}

var isRedisTokenExist = (keyName) => {

    return new Promise((resolve, reject) => {
        redisClient.lrange('token',0,-1,(err,data) => {
    
            if(err) {
                return reject(err)
            }   
            if(data.length > 0) {
                if(data.indexOf(keyName) > -1){
                    return resolve({ code: 400, message: 'Invalid Token'})
                }
            } 
            return resolve({ code: 200, message: 'Valid Token'})   
        })
    })
}

module.exports = auth