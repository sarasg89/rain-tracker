var searchInputEl = $("#search-city");
var searchBtnEl = $("#search-button");
var cityEl = $("#city");
var todayDateEl = $("#today-date");
var iconEl = $("#icon");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");



// Function to display the weather data retrieved for today. It will display the city name, temperature, wind and humidity values
function displayToday(data) {
    var date = dayjs.unix(data.list[0].dt).format("dddd D MMMM YYYY");
    var image = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@4x.png";
    cityEl.text(data.city.name + ", " + date) + data.list[0].weather[0];
    iconEl.html("<img src=" + image + ">");
    tempEl.text("Temperature: " + data.list[0].main.temp + " ℃");
    windEl.text("Wind: " + data.list[0].wind.speed + " MPH");
    humidityEl.text("Humidity: " + data.list[0].main.humidity + " %");
}

// Function to display the weather data retrieved for the next 5 days. It will display the city name, temperature, wind and humidity values
function display5Days(data) {
    var daysChildrenEl = $("#days").children();
    for (var i = 0; i < daysChildrenEl.length; i++) {
        // i would start at index 0 which is the current day. Because the current day is already displayed at the top, we want to ignore it and jump ahead to the next day, that is, the next 8th index (40 hour slots dived by 5 days equal 8 slots per day). 
        // + 1 is added to i to ensure the 5-day forecast always shows the next day
        var currentEl = data.list[(i * 8) + 1];
        console.log(data);

        var futureDays = daysChildrenEl.eq(i).children();
        var dateFutureEl = futureDays.eq(0);
        var iconFutureEl = futureDays.eq(1);
        var tempFutureEl = futureDays.eq(2);
        var windFutureEl = futureDays.eq(3);
        var humidityFutureEl = futureDays.eq(4);

        var imageForFuture = "http://openweathermap.org/img/wn/" + currentEl.weather[0].icon + ".png";

        dateFutureEl.text(dayjs.unix(currentEl.dt).format("dddd"));
        iconFutureEl.html("<img src=" + imageForFuture + ">");
        tempFutureEl.text("Temp: " + currentEl.main.temp + " ℃");
        windFutureEl.text("Wind: " + currentEl.wind.speed + " MPH");
        humidityFutureEl.text("Humidity: " + currentEl.main.humidity + " %")

    }
}

function saveCity(value) {
    var citySaved = [];
    var alreadyInStorage = localStorage.getItem("city");
    if (alreadyInStorage !== null) {
        citySaved = JSON.parse(alreadyInStorage);
    }

    citySaved.push(value);
    localStorage.setItem("city", JSON.stringify(citySaved));
}


// Function to retrieve weather data from the Open Weather Map API
// Within this function, we call on the displayToday and display5Days functions as well
function getApi() {
    var geoLocationURL = "http://api.openweathermap.org/geo/1.0/direct?appid=cccdf7669ae2e9f41bf5e5174cd0a37b&q=";
    geoLocationURL = geoLocationURL + searchInputEl.val();

    saveCity(searchInputEl.val());

    fetch(geoLocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=cccdf7669ae2e9f41bf5e5174cd0a37b&';

            weatherUrl = weatherUrl + "lat=" + lat + "&lon=" + lon;

            fetch(weatherUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    displayToday(data);
                    display5Days(data);
                });
        })
}

searchBtnEl.click(getApi);