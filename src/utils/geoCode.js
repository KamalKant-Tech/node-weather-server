const request = require('request')

class weatherForecast {
    
    getGeoCode(address, callback) {
        const geoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=" + process.env.MAPBOXAPIKEY + "&limit=1";
        //Get Address map coordinates
        request({url : geoCodeUrl, json: true},(error, response, body) => {
            if(error) {
              callback("Unable to connect to server!!!", undefined)
            }else if(response.body.features.length === 0) {
              callback("Unable to find geo location, Try another search !",undefined)
            }else{
              callback(undefined,{
                lat : body.features[0].center[0],
                lng : body.features[0].center[1],
                location: body.features[0].place_name
              })
            }
        })
    }

    forecast(lat,lng, callback) {
      const url = 'https://api.darksky.net/forecast/' + process.env.DARKSKYAPIKEY + '/'+ lat +','+ lng +'?units=si';
      request({url: url, json: true}, function (error, response, body) {
        if(error) {
          callback("Unable to get location details!!!", undefined)
        }else if(body.daily.data === 0) {
          callback("Unable to find geo location, Try another search !!!",undefined)
        }else{
          callback(undefined,body.daily.data[0])
        }
      });
    }
}


module.exports = weatherForecast
