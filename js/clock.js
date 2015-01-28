var time12 = true;
var forecastKey = "2adeea29b1b55d8c635071be3f293285";
var googleKey = "AIzaSyBsPZ9QAMkfHVEcqq1bNUGLz317KQcIrAA";
var latitude = "35.300399";
var longitude = "-120.662362";
var errorCoords = " Using Cal Poly Building 14 coordinates."


function setTime12() {
   d = new Date();
   hours = d.getHours();
   mins = d.getMinutes();
   secs = d.getSeconds();
   suffix = "AM";

   if (hours > 12) {
      hours -= 12;
      suffix = "PM";
   }
   if (hours == 0) {
      hours = 12;
   }

   document.getElementById("clock").innerHTML = hours + ":" + 
                                                (mins < 10 ? "0" + mins : mins) + ":" +
                                                (secs < 10 ? "0" + secs : secs) + " " + 
                                                suffix;
}

function setTime24() {
   d = new Date();
   hours = d.getHours();
   mins = d.getMinutes();
   secs = d.getSeconds();

   document.getElementById("clock").innerHTML = (hours < 10 ? "0" + hours : hours) + ":" +
                                               (mins < 10 ? "0" + mins : mins) + ":" +
                                               (secs < 10 ? "0" + secs : secs);
}

function getTime() {
   if (time12) {
      setTime12();
   } else {
      setTime24();
   }
   setTimeout(getTime, 50);
}

function swapTimeModes() {
   time12 = !time12;
   document.getElementById("button").innerHTML = (time12 ? "Switch to 24-hour mode" : "Switch to 12-hour mode")
}

function onLoad() {
   getTime();
   document.getElementById("button").setAttribute("onclick", "swapTimeModes()");
   $("#forecastLabel").prepend("<p id=\"location\"></p><p id=\"summary\"></p>");
   getLocation();
   getTemp();
}

function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCoords, showLocationError);
   } else {
      $("#errorText").html("Geolocation is not supported by this browser." + errorCoords);
   }
}

function setCoords(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
}

function showLocationError(error) {
   switch(error.code) {
      case error.PERMISSION_DENIED:
         $("#errorText").html("User denied the request for Geolocation." + errorCoords);
         break;
      case error.POSITION_UNAVAILABLE:
         $("#errorText").html("Location information is unavailable." + errorCoords);
         break;
      case error.TIMEOUT:
         $("#errorText").html("The request to get user location timed out." + errorCoords);
         break;
      case error.UNKNOWN_ERROR:
         $("#errorText").html("An unknown error occurred." + errorCoords);
         break;
   }
}

function getCity() {
   var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+
      "&result_type=political"+
      "&key="+googleKey;
   $.getJSON(url,
      function(data) {
         $("#forecastLabel #location").html(data.results[0].formatted_address);
      })
}

function getTemp() {
   var url = "https://api.forecast.io/forecast/"+forecastKey+"/"+latitude+","+longitude+"?callback=?"
   getCity();
   $.getJSON(url,
      function(data) {
         $("#forecastLabel #summary").html(data.daily.summary);
         $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");

         var temp;
         $.each(data.daily.data, function(i, v) {
            if (v.temperatureMax != undefined) {
               temp = v.temperatureMax;
            }
         });

         if (temp != undefined) {
            var tempClass;
            if (temp < 60) {
               tempClass = "cold";
            } else if (temp >= 60 && temp < 70) {
               tempClass = "chilly";
            } else if (temp >= 70 && temp < 80) {
               tempClass = "nice";
            } else if (temp>= 80  && temp < 90) {
               tempClass = "warm";
            } else {
               tempClass = "hot";
            }
            $("body").attr("class", tempClass)
         }
      });
   setTimeout(getTemp, 30000);
}

$(document).ready(onLoad);
