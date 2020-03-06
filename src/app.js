const env = require('dotenv').config({path: __dirname + '/.env'})
const hbs = require('hbs')
const path = require('path')
const express = require('express')
const geoCode = require('./utils/geoCode')
const userRouters = require('./routers/user')
var dbConfig = require('../db.json');
var db = require('./utils/dbInstance');
const checkIfTopicExists = require('./utils/checkIfTopicExists');
const topic = new checkIfTopicExists()
const createTopic = require('./utils/createTopic');
//const publishToTopic = require('./publishToTopic');
let database = new db(dbConfig);
const weatherForecast = new geoCode();

const app = express()
const port = process.env.PORT || 3000

const partialPath = path.join(__dirname, '../templates/partials')

//Define paths for Express Config amd setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'../templates/views'))
hbs.registerPartials(partialPath)

/* //Express middleware for API call
app.use((req,res,next) =>{
    next()
}) */

//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))

//Parse incoming request data into json
app.use(express.json())

//app router inside our application / Registered router
app.use(userRouters)


app.get('', async (req,res) =>  {
    /* topic.checkTopicExist('testSNSTopic').then((result) => {
        console.log("Result: ", result)
    }).catch((err) => {
        console.log(err)
    }) */
    //const ifTopicExists = await checkIfTopicExists(AWS, 'ON_POST_CREATED');
    res.render('index',{
        title: 'Weather App Server',
        body: {content1: "This is Dynamic web page.", content2: "This is content 2 paragraph", content3: "This is content 3 paragraph."}
    })
})

app.get('/about' , (req,res) => {
    res.render('about',{
        title: 'About App Server',
        body: "This is Dynamic web page for about."
    })
})

app.get('/weather' , async (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Error: Please specify address string into url.'
        })
    }
    
    //Object destructring
    weatherForecast.getGeoCode(req.query.address, (error,{lat:latitude,lng:longitude,location} = {}) => {
        if(error) {
            return res.send({ error })
        }
        weatherForecast.forecast(latitude,longitude,(forecasterror,data) => {
            if(forecasterror) {
                return res.send({ forecasterror })
            }

            res.send({
                forecast: data.summary,
                location: location
            })
        })
        
    })
})

app.get('/help' , (req,res) => {
    res.render('help',{
        title: 'Help App Server',
        body: "This is Dynamic web page."
    })
})

app.get('/products' , (req,res) => {
    res.render('help',{
        title: 'Help App Server',
        body: "This is Dynamic web page."
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Help App Server',
        body: "This is Dynamic web page."
    })
})

app.get('*',(req,res) => {
    res.render('error',{
        title: 'Page Not Found',
        body: "Page Not Found, 404 !!!"
    })
})

app.listen(port, () => {
    console.log("App is running on Port: 3000")
})