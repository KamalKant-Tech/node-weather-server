document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    var location = document.querySelector('input').value
    if(!location) {
        console.log('Please provide location to Us')
    }else{
        fetch('http://localhost:3000/weather?address='+ location).then((response) => {
            response.json().then((data) => {
                if(data.error) {
                    document.querySelector('#message-2').textContent = 'Forecast: ' + data.error
                    console.log(data.error)
                }else{
                    document.querySelector('#message-1').textContent = 'Forecast: ' + data.forecast
                    console.log(data)
                }
            })
        })
    }
})