$(document).ready(function () {
    var searchInputEl = $("#search-city");
    var searchBtnEl = $("#search-button");
    var historyEl = $("#search-history");
    var cityEl = $("#city");
    var dateEl = $("#date");
    var iconEl = $("#icon");
    var tempEl = $("#temp");
    var windEl = $("#wind");
    var humidityEl = $("#humidity");


    // Function to display the weather data retrieved for today. It will display the city name, temperature, wind and humidity values
    function displayToday(data) {
        var date = dayjs.unix(data.list[0].dt).format("dddd D MMMM YYYY HH:mm");
        var image = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@4x.png";
        cityEl.text(data.city.name + ", " + data.city.country);
        dateEl.text(date);
        iconEl.html("<img src=" + image + ">");
        tempEl.text("Temperature: " + Math.round(data.list[0].main.temp) + " ℃");
        windEl.text("Wind: " + data.list[0].wind.speed + " MPH");
        humidityEl.text("Humidity: " + data.list[0].main.humidity + " %");
    }

    // Function to display the weather data retrieved for the next 5 days. It will display the city name, temperature, wind and humidity values
    function display5Days(data) {
        var daysChildrenEl = $("#days").children();
        $("#5-day-forecast").text("5-day forecast");
        for (var i = 0; i < daysChildrenEl.length; i++) {
            // i would start at index 0 which is the current day. Because the current day is already displayed at the top, we want to ignore it and jump ahead to the next day, that is, the next 8th index (40 hour slots dived by 5 days equal 8 slots per day). 
            // + 1 is added to i to ensure the 5-day forecast always shows the next day
            var currentEl = data.list[i * 8];

            var futureDays = daysChildrenEl.eq(i).children();
            var dateFutureEl = futureDays.eq(0);
            var iconFutureEl = futureDays.eq(1);
            var tempFutureEl = futureDays.eq(2);
            var windFutureEl = futureDays.eq(3);
            var humidityFutureEl = futureDays.eq(4);

            var imageForFuture = "http://openweathermap.org/img/wn/" + currentEl.weather[0].icon + ".png";

            dateFutureEl.text(dayjs.unix(currentEl.dt).format("dddd HH:mm"));
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

        // If the input box is blank, the value will not be saved and an alert box will pop up
        if (value.trim() === "") {
            return
        } else {
            // The new city is added to the citySaved array
            citySaved.push(value);
            // citySaved is added to local storage with a key of "city"
            localStorage.setItem("city", JSON.stringify(citySaved));
        }
    }


    // Function to display cities already searched as a list of buttons.
    // If local storage is NOT blank, a clear history button is also created
    function previousSearches() {
        var alreadySearched = localStorage.getItem("city");
        if (alreadySearched !== null) {
            alreadySearched = JSON.parse(alreadySearched);
            historyEl.append("<li id='clear-btn' class='btn btn-secondary my-1'>Clear history</li>")
        } else {
            return
        }

        for (var i = 0; i < alreadySearched.length; i++) {
            historyEl.append("<li class='city-btn btn btn-outline-secondary my-1'>" + alreadySearched[i] + "</li>")
        }

    }

    // Function to retrieve weather data from the Open Weather Map API
    // Within this function, we call on the displayToday and display5Days functions as well
    function getApi() {
        var geoLocationURL = "http://api.openweathermap.org/geo/1.0/direct?appid=cccdf7669ae2e9f41bf5e5174cd0a37b&q=";
        // The geoLocationUrl is completed by adding the name of the city at the end. The name of the city is retrieved from the input box in the form
        geoLocationURL = geoLocationURL + searchInputEl.val();

        fetch(geoLocationURL)
            .then(function (response) {
                if (response.status === 404) {
                    window.location.replace("/404.html")
                    // If the user doesn't enter a value in the input box, a warning appears on screen
                } else if (response.status === 400) {
                    $("form").append('<div class="alert alert-danger" role="alert">Error! You must enter a city name. Please try again.</div>')
                }
                return response.json()
            })
            .then(function (data) {
                console.log(data);

                // If OpenWeatherMap can't find the city, a warning appears on screen
                if (data.length === 0) {
                    $("form").append("<div class='alert alert-danger' role='alert'>I couldn't find that city. Please check your spelling and try again.</div>");
                } else {
                    // We retrieve the data from the previous API and store the latitude and longitude in variables that are then added as query prompts to the next API
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=cccdf7669ae2e9f41bf5e5174cd0a37b&';
                    weatherUrl = weatherUrl + "lat=" + lat + "&lon=" + lon;

                    // The searched city is saved to local storage
                    saveCity(searchInputEl.val());

                    fetch(weatherUrl)
                        .then(function (response) {
                            if (response.status === 404) {
                                window.location.replace("/404.html")
                            }
                            return response.json();
                        })
                        .then(function (data) {
                            // When the data is fetched, we call on the functions to display the weather for the current city selected
                            displayToday(data);
                            display5Days(data);
                            // The city just searched is inmediatelly added to the bottom of the search history
                            historyEl.append("<li class='city-btn btn btn-outline-secondary my-1'>" + searchInputEl.val() + "</li>")
                        });
                }
            })
    }

    // Event listener for the search history buttons that calls on a function to retrieve the name of the city from local storage, fetch the weather info from the APIs and displays it on screen
    $(document).on("click", ".city-btn", function getApiSaved(event) {
        var clickedCity = $(event.target).text();
        var geoLocationURL = "http://api.openweathermap.org/geo/1.0/direct?appid=cccdf7669ae2e9f41bf5e5174cd0a37b&q=";
        geoLocationURL = geoLocationURL + clickedCity;

        fetch(geoLocationURL)
            .then(function (response) {
                if (response.status === 404) {
                    window.location.replace("/404.html")
                }
                return response.json();
            })
            .then(function (data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=cccdf7669ae2e9f41bf5e5174cd0a37b&';

                weatherUrl = weatherUrl + "lat=" + lat + "&lon=" + lon;

                fetch(weatherUrl)
                    .then(function (response) {
                        if (response.status === 404) {
                            window.location.replace("/404.html")
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        displayToday(data);
                        display5Days(data);
                    });
            })
    });

    // Event listener for the clear history button
    $(document).on("click", "#clear-btn", function clearLocalStorage(event) {
        localStorage.clear();
        window.location.reload();
    })

    previousSearches();
    searchBtnEl.on("click", getApi);
})