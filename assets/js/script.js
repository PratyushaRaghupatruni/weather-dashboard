var cities = [];
apikey = "f4b6deaac15c38f8264e61d13f7b99a1";

// We then created an AJAX call
$("#city-search").on("click", function (event) {
    console.log(cityName);
    var cityName = $("#city-name").val();
    event.preventDefault();
    cities.push(cityName);
    console.log(cityName);

    renderButtons();

});

function renderButtons() {

    $("#buttons-view").empty();

    for (i = 0; i < cities.length; i++) {
        var btn = $("<button>");
        btn.addClass("city-btn");
        btn.attr("id", cities[i]);
        btn.attr("data-name", cities[i]);
        btn.text(cities[i]);
        $("#buttons-view").append(btn);
    }
    displayTempinfo();
}


function displayTempinfo() {
    var test = $('#' + cities[i]).val();
    console.log("Test : " + test);

    var cityName = $("#city-name").val();
    console.log("city:" + cityName);
    $("#current-day").empty();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&apikey=" + apikey;

    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        var header1 = $("<h5>").text("Current Temperatures");
        $("#current-day").append(header1);
        var city = $("#city-name").val();
        $("#current-day").append(city);
        var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        $("#current-day").append(image);
        var date = moment().format(" MMMM Do YYYY");
        console.log(moment().format(" MMMM Do YYYY"));
        var dateT = $("<p>").text("(" + date + ")");
        $("#current-day").append(dateT);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        console.log(tempF);
        var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
        $("#current-day").append(temp);
        var windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
        console.log(windSpeed);
        $("#current-day").append(windSpeed);
        var humidity = $("<p>").text("Humidity: " + response.main.humidity);
        console.log(humidity);
        $("#current-day").append(humidity);


        var lattitude = response.coord.lat;
        console.log("lat:" + lattitude);
        var longitude = response.coord.lon;
        console.log("lon:" + longitude);

        
        var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apikey + "&lat=" + lattitude + "&lon=" + longitude;
        uvIndex(uvqueryURL);
    });


}
function uvIndex(uvqueryURL) {
    console.log("queryURL: " + uvqueryURL);
    $.ajax({
        url: uvqueryURL,
        method: "GET"
    }).then(function (uvresponse) {
        console.log(uvresponse);
        var uvValue = uvresponse.value;
        var uvIndex = $("<p>").text("UV Index: ");
        $("#current-day").append(uvIndex);
        var markid = $("<mark>").text(uvresponse.value);
        markid.attr("id", "uv-index");
        uvIndex.append(markid);
        console.log(uvresponse.value);


        if (uvValue >= 0 && uvValue <= 3) {
            $("#uv-index").addClass("green");
        }
        else if (uvValue > 3 && uvValue <= 6) {
            $("#uv-index").addClass("yellow");
        }
        else if (uvValue > 6 && uvValue <= 8) {
            $("#uv-index").addClass("orange");
        }
        else if (uvValue > 8 && uvValue <= 10) {
            $("#uv-index").addClass("red");
        }
        else if (uvValue > 10) {
            $("#uv-index").addClass("violet");
        }
    });
}
$(document).on("click", ".city-btn", displayTempinfo);
