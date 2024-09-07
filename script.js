let weather ={
    apiKey: config.apikey,
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city 
            + "&units=metric&appid="
            // for temp to be in celsius units = metric
            + this.apiKey
        )
    .then((response) =>
    {
      if (!response.ok) {
         alert("No weather found.");
         throw new Error("No weather found.");
      } 
      return response.json()
    })
    .then((data) => this.displayWeather(data));
    },
   
    displayWeather: function(data)
    {
    // Extracting required info from the api fetched data
     const {name}=data; //City name
     const {icon,description}= data.weather[0];
     const {temp,humidity}=data.main;
     const {speed}=data.wind;
    //  Displaying the data on the app
     document.querySelector(".city").innerText = "Weather in " + name;
     document.querySelector(".icon").src= "https://openweathermap.org/img/wn/" + icon + ".png";
     document.querySelector(".description").innerText = description;
     document.querySelector(".temp").innerText = temp + "°C"
     document.querySelector(".humidity").innerText = "Humidity:" + humidity + "%";
     document.querySelector(".wind").innerText = "Wind Speed:" + speed + "km/h";
    //  Remove loading class
     document.querySelector(".weather").classList.remove("loading");
     document.body.style.background="url('https://loremflickr.com/1600/900/" + name + "')"
    },

    //  Getting the content of Search Bar and giving it as the parameter to fetchweather
    search: function()
    {
     this.fetchWeather(document.querySelector(".search-bar").value)
    }
};
//  Weather object ends

let geocode = {
  reverseGeocode: function(latitude, longitude){
    var api_key = config.API_KEY;

    // reverse geocoding example (coordinates to address)
    
    var query = latitude + ',' + longitude;
  
    // forward geocoding example (address to coordinate)
    // var query = 'Philipsbornstr. 2, 30165 Hannover, Germany';
    // note: query needs to be URI encoded (see below)
  
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
  
    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(query)
      + '&pretty=1'
      + '&no_annotations=1';
  
    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
  
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
  
    request.onload = function() {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes
  
      if (request.status === 200){
        // Success!
        var data = JSON.parse(request.responseText);
        // print the location
        weather.fetchWeather(data.results[0].components.city)
      } else if (request.status <= 500){
        // We reached our target server, but it returned an error
  
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.status.message);
      } else {
        console.log("server error");
      }
    };
  
    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };
  
    request.send();  // make the request
  
  },
  getLocation: function(){
    function success (data){
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
      weather.fetchWeather("Delhi")
    }
  }
}
 
// Search Button Working
document
  .querySelector(".search button").addEventListener("click",function (){
    weather.search();
});

// When enter key is pressed on the search bar
document.querySelector(".search-bar").addEventListener("keyup",function (event){
  if(event.key == "Enter"){
    weather.search();
  }
});

geocode.getLocation();

// Default location
// weather.fetchWeather("Delhi");
