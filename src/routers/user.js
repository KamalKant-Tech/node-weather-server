const express = require('express')
const  bcrypt = require('bcryptjs')
var database = require('../models/dbConnect')
var user = require('../models/user')
const auth = require('../middleware/authentication')
const redisClient = require('../middleware/redisClient')
const router = new express.Router()

//let database = new db();
//Get method
router.get('/users/me',auth, (req,res) => {
    let params = req.body
    try {
        res.status(200).send(req.user)

    } catch(e) {
        res.status(400).send({
            error: e
        })
    }
})


//post method
router.post('/users',async (req,res) => {
    let params = req.body
    try {
        if(params.email.length <= 0 || params.password.length <= 0) {
            throw "Email/ Password can't be empty!!!"
        }
        
        params.password = await bcrypt.hash(params.password,8)

        let result = await database.query('INSERT into users (email,password) VALUES("'+ params.email +'","' + params.password + '") ')
        
        if(result.affectedRows <= 0) throw { message: "User is not available !!!" , code: 501 }

        res.status(200).send({
            code : 200,
            token: user.generateAuthToken(result.insertId),
            message : "User has been registered successfully."
        })

    } catch(e) {
        res.status(400).send({
            code: e.code,
            error: e.message || "Sql query issue"
        })
    }
})

//Login method
router.post('/users/login',async (req,res) => {
    let params = req.body
    try {
        if(params.email.length <= 0 || params.password.length <= 0) {
            throw "Email/ Password can't be empty!!!"
        }
        
        let result = await database.query('SELECT * from users where email = "'+ params.email +'" LIMIT 1')

        if(result <= 0) throw { message: "User is not available !!!" , code: 501 }

        let isMatch = await bcrypt.compare(params.password,result[0].password)

        if(!isMatch) throw {code: 501,  message : 'Email or Password does not match.'}

        res.status(200).send({
            code: 200,
            token: user.generateAuthToken(result[0].user_id),
            message : 'Login successfully.'
        })

    } catch(e) {
        res.status(400).send({
            code: e.code,
            error: e.message
        })
    }
})
//Logout Method
router.post('/users/logout',auth, async(req,res) => {
    try {
        //console.log(req.token)
        await redisClient.LPUSH('token', req.token);
        return res.status(200).json({
          'status': 200,
          'data': 'You are logged out',
        });
    } catch (error) {
      return res.status(400).json({
        'status': 500,
        'error': error.toString(),
      });
    }
})

//Patch Method
router.patch('/users/:id',auth, (req,res) => {
    let params = Object.keys(req.body)
    let isUpdateAllowed = ['name','age']
    try {
        
        let isValidParams = params.every((key) => isUpdateAllowed.includes(key))

        if(isValidParams) throw "Please mention the correct key !!!"

        res.status(200).send({
            test: 'testign'
        })

    } catch(e) {
        res.status(400).send({
            error: e
        })
    }
})

//delete Method
router.delete('/users/me',auth, (req,res) => {
    try {
        
        let userId = req.user.user_id;

        res.status(200).send({
            test: userId
        })

    } catch(e) {
        res.status(400).send({
            error: e
        })
    }
})

module.exports = router;