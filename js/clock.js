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

   document.getElementById('clock').innerHTML = hours + ":" + 
                                                (mins < 10 ? "0" + mins : mins) + ":" +
                                                (secs < 10 ? "0" + secs : secs) + " " + 
                                                suffix;
}

function setTime24() {
   d = new Date();
   hours = d.getHours();
   mins = d.getMinutes();
   secs = d.getSeconds();

   document.getElementById('clock').innerHTML = (hours < 10 ? "0" + hours : hours) + ":" +
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
   document.getElementById('modeButton').innerHTML = (time12 ? "Switch to 24-hour mode" : "Switch to 12-hour mode")
}

function errorText(message) {
   $('#errorText').html(message);
   setTimeout(function() {
      $('#errorText').fadeOut(1000);
   }, 4000);
}

function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCoords, showLocationError);
   } else {
      errorText("Geolocation is not supported by this browser." + errorCoords);
   }
}

function setCoords(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
}

function showLocationError(error) {
   switch(error.code) {
      case error.PERMISSION_DENIED:
         errorText("User denied the request for Geolocation." + errorCoords);
         break;
      case error.POSITION_UNAVAILABLE:
         errorText("Location information is unavailable." + errorCoords);
         break;
      case error.TIMEOUT:
         errorText("The request to get user location timed out." + errorCoords);
         break;
      case error.UNKNOWN_ERROR:
         errorText("An unknown error occurred." + errorCoords);
         break;
   }
}

function getCity() {
   var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+
      "&result_type=political"+
      "&key="+googleKey;
   $.getJSON(url,
      function(data) {
         $('#forecastLabel #location').html(data.results[0].formatted_address);
      })
}

function getTemp() {
   var url = "https://api.forecast.io/forecast/"+forecastKey+"/"+latitude+","+longitude+"?callback=?"
   getCity();
   $.getJSON(url,
      function(data) {
         $('#forecastLabel #summary').html(data.daily.summary);
         $('#forecastIcon').attr("src", "img/" + data.daily.icon + ".png");

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
            $('body').attr("class", tempClass)
         }
      });
   setTimeout(getTemp, 30000);
}

function showAlarmPopup() {
   $('#mask').removeClass("hide");
   $('#popup').removeClass("hide");
}

function hideAlarmPopup() {
   $('#mask').addClass("hide");
   $('#popup').addClass("hide");
}

function insertAlarm(id, time, alarmName) {
   $('#alarms').append(
      $('<div>').attr("id", id).addClass("flexable").append(
         $('<div>').addClass("name").html(alarmName),
         $('<div>').addClass("time").html(time)
      ),
      $('<input type="button" value="Delete" class="deleteAlarm">').on('click', function() {
         var b = $(this);
         var id = b.prev().attr("id");
         var Alarm = Parse.Object.extend("Alarm");
         var query = new Parse.Query(Alarm);
         query.get(id, {
            success: function(alarm) {
               alarm.destroy({
                  success: function() {
                     errorText('Deleted alarm "' + $("#"+id + " .name").html() + '"');
                     b.prev().remove();
                     b.remove();
                  },
                  error: function() {
                     errorText("The alarm... it was too powerful... could. not. delete.");
                  }
               });
            },
            error: function(alarm, error) {
               errorText("Unable to retrieve the alarm for deletion");
            }
         });
      })
   );

   
}

function addAlarm() {
   var time = $('#hours').val() + ":" + $("#mins").val() + " " + $("#ampm").val();
   var alarmName = $('#alarmName').val();

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
      alarmObject.save({"time": time,"alarmName": alarmName}, {
      success: function(object) {
         insertAlarm(alarmObject.id, time, alarmName);
         hideAlarmPopup();
      }
   });
}

function populateAlarmOptions() {
   for (var i = 1; i <= 12; i++) {
      $('<option>').html(i < 10 ? "0" + i : i).appendTo('#hours');
   }
   for (i = 0; i < 60; i++) {
      $('<option>').html(i < 10 ? "0" + i : i).appendTo('#mins');
   }
}

function getAllAlarms() {
   Parse.initialize("6gLkg0OgYP6tap2GlzSkifeVSwHYuGj9EJq5x4vz", "S1qeKZBe7jGACBf9fnhbWggIK2ZzcN1Rm0GZgZgK");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) { 
            insertAlarm(results[i].id, results[i].attributes.time, results[i].attributes.alarmName);
         }
      }
   });
}

function onLoad() {
   getTime();
   getLocation();
   getTemp();
   populateAlarmOptions();
   getAllAlarms();
}

$(document).ready(onLoad);
