const env = require('dotenv').config({path: __dirname + '/.env'})
const hbs = require('hbs')
const path = require('path')
const express = require('express')
const geoCode = require('./utils/geoCode')

const weatherForecast = new geoCode();

const app = express()

const partialPath = path.join(__dirname, '../templates/partials')

//Define paths for Express Config amd setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname,'../templates/views'))
hbs.registerPartials(partialPath)

//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))

app.get('', (req,res) =>  {
    res.render('index',{
        title: 'Weather App Server',
        body: "This is Dynamic web page."
    })
})

app.get('/about' , (req,res) => {
    res.render('about',{
        title: 'About App Server',
        body: "This is Dynamic web page for about."
    })
})

app.get('/weather' , (req,res) => {
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
    console.log(req.query)
    res.render('help',{
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

app.listen(3000, () => {
    console.log("App is running on Port: 3000")
})