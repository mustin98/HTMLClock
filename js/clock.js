var time12 = true;
var steps = 0;
var r = 0;
var g = 0;
var b = 0;

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

function setColor() {
   r += 15;
   if (r > 255) {
      g += 15;
      r = 0;
   }
   if (g > 255) {
      b += 15;
      g = 0;
   }
   if (b > 255) {
      b = 0;
   }
   red = r.toString(16);
   grn = g.toString(16);
   blu = b.toString(16);
   if (red.length == 1) {
      red = "0" + red;
   } 
   if (grn.length == 1) {
      grn = "0" + grn;
   }
   if (blu.length == 1) {
      blu = "0" + blu;
   }
   color = "#" + red + grn + blu;
   document.body.style.background = color;
}

function swapTimeModes() {
   time12 = !time12;
   document.getElementById("button").innerHTML = (time12 ? "Switch to 24-hour mode" : "Switch to 12-hour mode")
}

function onLoad() {
   getTime();
   document.getElementById("button").setAttribute("onclick", "swapTimeModes()");
}

