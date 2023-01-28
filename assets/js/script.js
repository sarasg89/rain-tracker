var searchBtnEl = $("#search-button");

function getApi() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=43.371&lon=-8.396&appid=cccdf7669ae2e9f41bf5e5174cd0a37b&units=metric";

    fetch(requestUrl)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

searchBtnEl.addEventListener("click", getApi);