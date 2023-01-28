var searchBtnEl = $("#search-button");
var cityEl = $("#city");
var todayDateEl = $("#today-date");
var iconEl = $("#icon");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");



// Function to display the weather data retrieved. It will display the city name, temperature, wind and humidity values
function displayData(data) {
    var date = dayjs.unix(data.list[0].dt).format("dddd D-MMM-YYYY");
    var icon = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
    cityEl.text(data.city.name + " " + date) + data.list[0].weather[0];
    iconEl.html("<img src=" + icon + ">");
    tempEl.text("Temperature: " + data.list[0].main.temp + " ℃");
    windEl.text("Wind: " + data.list[0].wind.speed + " MPH");
    humidityEl.text("Humidity: " + data.list[0].main.humidity + " %");
}

// Function to retrieve weather data from the Open Weather Map API
// Within this function, we call on the displayData function as well
function getApi() {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=43.371&lon=-8.396&units=metric&cnt=6&appid=cccdf7669ae2e9f41bf5e5174cd0a37b';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.list[0].weather[0].icon);
            displayData(data);
        });
}

searchBtnEl.click(getApi);