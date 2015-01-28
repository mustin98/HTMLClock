var time12 = true;
var forecastKey = "2adeea29b1b55d8c635071be3f293285";

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

   document.getElementById("clock").innerHTML = hours + ":" +
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
   getTemp();
}

function getTemp() {
   $.getJSON("https://api.forecast.io/forecast/" + forecastKey + "/35.300399,-120.662362?callback=?", 
      function(data) {
         $("#forecastLabel").html(data.daily.summary);
         $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");
         temp = data.daily.temperatureMax;
         var tempClass
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
      });
}

$(document).ready(onLoad);