var citiesList;
var apikey = "f4b6deaac15c38f8264e61d13f7b99a1";

$(document).ready(function () {
    $("#5DayForecast").hide();
    $("#current").hide();
    getstoredCities();

});


// We then created an AJAX call
$("#city-search").on("click", function (event) {
    event.preventDefault();

    //fetching the city we enter in the search field
    var cityName = $("#city-name").val();
    console.log(cityName);
    //A condition to test if city name is empty
    if (cityName === '') {
        return false;
    }
    cityData(cityName);
    displayTempinfo(cityName);
    $("#city-name").val("");

});

//function to create a button the city value the user enters
function cityData(cityName) {

    $("#buttons-view").show();

    //getting the current cities stored from local storage
   var cities = JSON.parse(localStorage.getItem("cities"));

    if (cities) {
        if (!cities.includes(cityName)) {
            cities.push(cityName);
        }
    }
    else {
        cities = [cityName];
    }
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
    getstoredCities();
}


function getstoredCities() {

    //fetching the list of cities from local storage
      citiesList = JSON.parse(localStorage.getItem("cities"));

    $("#list").empty();
    console.log(citiesList);
    var cityLength = citiesList.length;
    console.log(cityLength);
    //creating the buttons  
    for (i = 0; i < citiesList.length; i++) {
        var liBtn = $("<li class='list-group-item city-btn text-center'>");
        liBtn.attr("id", citiesList[i]);
        liBtn.attr("data-name", citiesList[i]);
        liBtn.text(citiesList[i]);
        $("#list").append(liBtn);
    }
}


//function to display the current Day temperatures
function displayTempinfo(cityName) {

    //API URL for fetching the temperature
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&apikey=" + apikey;
   

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        
        $("#current").show();

        $("#current-day").empty();
        //creating the header dynamically
        var header1 = $("<h3>").text("Current Temperatures");
        $("#current-day").append(header1);

        //getting the date from moment js 
        var date = moment().format(" MMMM Do YYYY");

        //cityname 
        var cityDate = $("<h5>").text(response.name + "(" + date + ")");
        $("#current-day").append(cityDate);

        //Image
        var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/" +
            response.weather[0].icon + ".png").width('100px').height('100px');
        $("#current-day").append(image);

        //calculating the temperature
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var temp = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
        $("#current-day").append(temp);

        //getting the wind speed using open weather API
        var windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
        $("#current-day").append(windSpeed);

        //getting the humidity using open weather API       
        var humidity = $("<p>").text("humidity: " + response.main.humidity)
        $("#current-day").append(humidity);

        //getting the values pf lat and lon for queryurl to get the uv index value       
        var lattitude = response.coord.lat;
        var longitude = response.coord.lon;

        //uv queryURL
        var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apikey + "&lat=" + lattitude + "&lon=" + longitude;
        uvIndex(uvqueryURL);

        //geting the city id to display forecast for 5 days      
        var cityId = response.id;
        var forecastqueryUrl = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&units=imperial&appid=" + apikey;
        forecastDays(forecastqueryUrl);


    }).fail((cityName) => {
        alert("City doesn't Exist!!");
        var error = $("<p>").text("invalid city Name");
        console.log(error);
        $("#current-day").append(error);
        console.log(citiesList);
        var closeLi = response.name;
        console.log(closeLi);
        citiesList.splice(closeLi,1);
        localStorage.setItem("cities", JSON.stringify(citiesList));
        getstoredCities();
    });

}


//function to display uvindex values
function uvIndex(uvqueryURL) {

    $.ajax({
        url: uvqueryURL,
        method: "GET"
    }).then(function (uvresponse) {
        var uvValue = uvresponse.value;

        var uvIndex = $("<p>").text("UV Index: ");
        $("#current-day").append(uvIndex);
        //uv value
        var mark = $("<mark>").text(uvresponse.value);
        mark.attr("id", "uv-index");
        uvIndex.append(mark);

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



//function to display 5 days forecast
function forecastDays(forecastqueryUrl) {

    $("#5DayForecast").show();
    $("#forecast").empty();

    console.log(forecastqueryUrl);
    $.ajax({
        url: forecastqueryUrl,
        method: "GET"
    }).then(function (forecastresponse) {

        $("#forecast").empty();

        var forecast = forecastresponse.list;


        for (i = 0; i < forecast.length; i++) {

            if ((forecastresponse.list[i].dt_txt).substr(11, 8) == "00:00:00") { //because the values are updating every 3hrs

                var card = $("<div class='card  text-white text-center bg-primary mb-10 p-2'>");
                $("#forecast").append(card);

                //date to display
                var date = (forecastresponse.list[i].dt_txt).substr(8, 2);
                var month = (forecastresponse.list[i].dt_txt).substr(5, 2);
                var year = (forecastresponse.list[i].dt_txt).substr(0, 4);
                var tempdate = $("<h5 class='card-title'>").text(date + "/" + month + "/" + year);
                card.append(tempdate);

                //Image Icon
                var image = $("<img>").attr("src", "http://openweathermap.org/img/wn/"
                    + forecastresponse.list[i].weather[0].icon + ".png").width('100px').height('100px');
                card.append(image);

                //temperature 
                var temp = $("<p class='card-text'>").text("Temp:" + forecastresponse.list[i].main.temp);
                card.append(temp);

                //humidity
                var humidity = $("<p class='card-text'>").text("Humidity: " + forecastresponse.list[i].main.humidity);
                card.append(humidity);
            }
        }
    });
}

$(document).on("click", ".city-btn", function () {
    //when the user click the button it will display the corresponding city temperatures
    var cityName = $(this).attr("data-name");
    displayTempinfo(cityName);
});