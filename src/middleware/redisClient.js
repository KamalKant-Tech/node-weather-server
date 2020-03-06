const child_process = require('child_process')   // to start the redis database in development      
// for ES5 users
const redis = require('redis')
// if in development mode use Redis file attached
// start redis as a child process
//for window implementation 
child_process.execFile('C:/Users/kkant/Desktop/redis/64bit/redis-server.exe',(error,stdout) => {
    if(error){
        throw error
    }
    console.log(stdout)
})

const redisClient = redis.createClient();
// process.env.REDIS_URL is the redis url config variable name on heroku. 
// if local use redis.createClient()
redisClient.on('connect',()=>{
    console.log('Redis client connected')
});

redisClient.on('error', (error)=>{
    console.log('Redis not connected', error)
});

module.exports = redisClient