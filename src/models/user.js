const jwt = require('jsonwebtoken')
var database = require('../models/dbConnect')
const userSchema = {
    
    generateAuthToken(user_id) {
        return jwt.sign({ _id: user_id },'KIAAUTHRETGDHFCSD-IYD$&tgRETGSL',{expiresIn: '7 Days'})
    },

    async isUserExist(user_id) {
        try {
            const userDetails = await database.query('select user_id,email, IF(status = 0, "Disabled", "Enable") status from users where user_id = '+ user_id)
            if(userDetails.length <= 0) throw { message: "User is not available !!!" , code: 501 }
            return userDetails
        } catch (error) {
            return false
        }

    }
}

module.exports = userSchema