var cities = [];
apikey = "f4b6deaac15c38f8264e61d13f7b99a1";

// We then created an AJAX call
$("#city-search").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#city-name").val();
    if (cityName != '') {
        console.log(cities.length);
        for (i = 0; i <= cities.length; i++) {
            if (!cities.includes(cityName)) {
                cities.push(cityName);
                renderButtons(cityName);
            }

        }
    }
    else {
        return false;
    }
    console.log(cities);
    displayTempinfo(cityName);
});

function renderButtons(cityName) {
    var btn = $("<button>");
    btn.addClass("city-btn");
    btn.attr("id", cityName);
    btn.attr("data-name", cityName);
    btn.text(cityName);
    $("#buttons-view").append(btn);
}


function displayTempinfo(cityName) {
    $("#current-day").empty();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&apikey=" + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        var header1 = $("<h5>").text("Current Temperatures");
        $("#current-day").append(header1);
        $("#current-day").append(cityName);
        var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        $("#current-day").append(image);
        var date = moment().format(" MMMM Do YYYY");
        console.log(moment().format(" MMMM Do YYYY"));
        var dateT = $("<p>").text("(" + date + ")");
        $("#current-day").append(dateT);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
       
        var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
        $("#current-day").append(temp);
        var windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
       
        $("#current-day").append(windSpeed);
         var humidity=$("<p>").text("humidity: " +response.main.humidity)
        $("#current-day").append(humidity);


        var lattitude = response.coord.lat;
        var longitude = response.coord.lon;
    


        var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apikey + "&lat=" + lattitude + "&lon=" + longitude;
        uvIndex(uvqueryURL);
    });


}
function uvIndex(uvqueryURL) {
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
$(document).on("click", ".city-btn", function () {
    var cityName = $(this).attr("data-name");
    displayTempinfo(cityName);
});

