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
    for (var i = 0; i < data.list.length; i++) {
        var currentEl = data.list[i];
        
        var futureDays = daysChildrenEl.eq(i).children();
        var dateFutureEl = futureDays.eq(0);
        var iconFutureEl = futureDays.eq(1);
        var tempFutureEl = futureDays.eq(2);
        var windFutureEl = futureDays.eq(3);
        var humidityFutureEl = futureDays.eq(4);

        var imageForFuture =  "http://openweathermap.org/img/wn/" + currentEl.weather[0].icon + "@2x.png";

        dateFutureEl.text(dayjs.unix(currentEl.dt).format("ddd D MMM"));
        iconFutureEl.html("<img src=" + imageForFuture + ">");
        tempFutureEl.text("Temperature: " + currentEl.main.temp + " ℃");
        windFutureEl.text("Wind: " + currentEl.wind.speed + " MPH");
        humidityFutureEl.text("Humidity: " + currentEl.main.humidity + " %")
        
    }
}

// Function to retrieve weather data from the Open Weather Map API
// Within this function, we call on the displayToday and display5Days functions as well
function getApi() {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=43.371&lon=-8.396&units=metric&cnt=6&appid=cccdf7669ae2e9f41bf5e5174cd0a37b';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayToday(data);
            display5Days(data);
        });
}

searchBtnEl.click(getApi);