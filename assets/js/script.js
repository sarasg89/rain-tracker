var searchInputEl = $("#search-city");
var searchBtnEl = $("#search-button");
var historyEl = $("#search-history");
var historyBtnEl = $("#history-button");
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
    tempEl.text("Temperature: " + Math.round(data.list[0].main.temp) + " ℃");
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

        var futureDays = daysChildrenEl.eq(i).children();
        var dateFutureEl = futureDays.eq(0);
        var iconFutureEl = futureDays.eq(1);
        var tempFutureEl = futureDays.eq(2);
        var windFutureEl = futureDays.eq(3);
        var humidityFutureEl = futureDays.eq(4);

        var imageForFuture = "http://openweathermap.org/img/wn/" + currentEl.weather[0].icon + ".png";

        dateFutureEl.text(dayjs.unix(currentEl.dt).format("dddd"));
        iconFutureEl.html("<img src=" + imageForFuture + ">");
        tempFutureEl.text("Temp: " + Math.round(currentEl.main.temp) + " ℃");
        windFutureEl.text("Wind: " + currentEl.wind.speed + " MPH");
        humidityFutureEl.text("Humidity: " + currentEl.main.humidity + " %")

    }
}

// Function to save searched cities to local storage
function saveCity(value) {
    // An empty array is created first
    var citySaved = [];

    // If local storage is NOT empty, the existing data is added to the citySaved array
    var alreadyInStorage = localStorage.getItem("city");
    if (alreadyInStorage !== null) {
        citySaved = JSON.parse(alreadyInStorage);
    }

    // If the input box is blank, the value will not be saved
    if (value.trim() === "") {
        return
    } else {
        // The new city is added to the citySaved array
        citySaved.push(value);
        // citySaved is added to local storage with a key of "city"
        localStorage.setItem("city", JSON.stringify(citySaved));
    }
}


// Function to display cities already searched as a list of buttons
function previousSearches() {
    var alreadySearched = localStorage.getItem("city");
    if (alreadySearched !== null) {
        alreadySearched = JSON.parse(alreadySearched);
    } else {
        return
    }

    for (var i = 0; i < alreadySearched.length; i++) {
        historyEl.append("<li id='btn' class='btn btn-outline-secondary my-1'>" + alreadySearched[i] + "</li>")
    }

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


// The event listener is added to the <ul> element because the <li> elements are added dynamically and don't exist yet in the HTML code when the pages loads
$(document).on("click", "#btn", function getApiSaved(event) {
    var clickedCity = $(event.target).text();
    var geoLocationURL = "http://api.openweathermap.org/geo/1.0/direct?appid=cccdf7669ae2e9f41bf5e5174cd0a37b&q=";
    geoLocationURL = geoLocationURL + clickedCity;

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
});



previousSearches();
searchBtnEl.click(getApi);
